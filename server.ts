import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import db from './src/db';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const PORT = 3000;
  const httpServer = createServer(app);
  const io = new Server(httpServer);

  app.use(express.json());

  // API Routes
  app.post('/api/decisions', (req, res) => {
    const { description } = req.body;
    const id = uuidv4();
    const stmt = db.prepare('INSERT INTO decisions (id, description, status) VALUES (?, ?, ?)');
    stmt.run(id, description, 'DRAFT');
    res.json({ id });
  });

  app.get('/api/decisions/:id', (req, res) => {
    const { id } = req.params;
    const decision = db.prepare('SELECT * FROM decisions WHERE id = ?').get(id);
    if (!decision) return res.status(404).json({ error: 'Not found' });
    res.json(decision);
  });

  app.post('/api/decisions/:id/generate-questions', async (req, res) => {
    const { id } = req.params;
    const decision = db.prepare('SELECT * FROM decisions WHERE id = ?').get(id) as any;
    if (!decision) return res.status(404).json({ error: 'Not found' });

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: \`Generate 6-8 contextual questions to help a group make this decision: "\${decision.description}". The questions should be categorized (e.g., Budget, Timeframe, Preference Scale, Group Dynamic, Risk Tolerance). Return the questions as a JSON array of objects with 'text' and 'category' properties.\`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING, description: 'The question text' },
                category: { type: Type.STRING, description: 'The category of the question' },
              },
              required: ['text', 'category'],
            },
          },
        },
      });

      const questions = JSON.parse(response.text || '[]');
      const insertStmt = db.prepare('INSERT INTO questions (id, decision_id, text, category) VALUES (?, ?, ?, ?)');
      
      const generatedQuestions = [];
      for (const q of questions) {
        const qId = uuidv4();
        insertStmt.run(qId, id, q.text, q.category);
        generatedQuestions.push({ id: qId, ...q });
      }

      db.prepare('UPDATE decisions SET status = ? WHERE id = ?').run('COLLECTING', id);
      res.json(generatedQuestions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to generate questions' });
    }
  });

  app.get('/api/decisions/:id/questions', (req, res) => {
    const { id } = req.params;
    const questions = db.prepare('SELECT * FROM questions WHERE decision_id = ?').all(id);
    res.json(questions);
  });

  app.post('/api/decisions/:id/respond', (req, res) => {
    const { id } = req.params;
    const { name, answers } = req.body; // answers: { question_id: answer_text }
    
    const participantId = uuidv4();
    db.prepare('INSERT INTO participants (id, decision_id, name) VALUES (?, ?, ?)').run(participantId, id, name);
    
    const insertResponse = db.prepare('INSERT INTO responses (id, participant_id, question_id, answer) VALUES (?, ?, ?, ?)');
    for (const [qId, answer] of Object.entries(answers)) {
      insertResponse.run(uuidv4(), participantId, qId, answer as string);
    }

    io.to(id).emit('new_response', { participant: { id: participantId, name }, timestamp: new Date() });
    res.json({ success: true });
  });

  app.get('/api/decisions/:id/participants', (req, res) => {
    const { id } = req.params;
    const participants = db.prepare('SELECT * FROM participants WHERE decision_id = ?').all(id);
    res.json(participants);
  });

  app.post('/api/decisions/:id/analyze', async (req, res) => {
    const { id } = req.params;
    const decision = db.prepare('SELECT * FROM decisions WHERE id = ?').get(id) as any;
    const questions = db.prepare('SELECT * FROM questions WHERE decision_id = ?').all(id) as any[];
    const participants = db.prepare('SELECT * FROM participants WHERE decision_id = ?').all(id) as any[];
    const responses = db.prepare(\`
      SELECT r.question_id, r.answer, p.name 
      FROM responses r 
      JOIN participants p ON r.participant_id = p.id 
      WHERE p.decision_id = ?
    \`).all(id) as any[];

    const context = \`
      Decision: \${decision.description}
      Questions: \${JSON.stringify(questions)}
      Participants: \${JSON.stringify(participants)}
      Responses: \${JSON.stringify(responses)}
    \`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: \`Analyze the group's responses and provide a final recommendation for the decision.
        Context: \${context}
        Return a JSON object with:
        - verdict_title: A short, catchy title for the recommendation
        - verdict_description: A 1-2 sentence description of why this is the best choice
        - budget_score: 0-100 score for budget alignment (if applicable, else 100)
        - time_score: 0-100 score for time efficiency (if applicable, else 100)
        - group_size_score: 0-100 score for group size fit (if applicable, else 100)
        - insights: An array of 3 objects, each with 'title' and 'description' explaining why this works.
        \`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              verdict_title: { type: Type.STRING },
              verdict_description: { type: Type.STRING },
              budget_score: { type: Type.INTEGER },
              time_score: { type: Type.INTEGER },
              group_size_score: { type: Type.INTEGER },
              insights: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                  },
                  required: ['title', 'description'],
                },
              },
            },
            required: ['verdict_title', 'verdict_description', 'budget_score', 'time_score', 'group_size_score', 'insights'],
          },
        },
      });

      const analysisData = JSON.parse(response.text || '{}');
      const analysisId = uuidv4();
      
      db.prepare(\`
        INSERT INTO analysis (id, decision_id, verdict_title, verdict_description, budget_score, time_score, group_size_score, insights)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      \`).run(
        analysisId, id, analysisData.verdict_title, analysisData.verdict_description, 
        analysisData.budget_score, analysisData.time_score, analysisData.group_size_score, 
        JSON.stringify(analysisData.insights)
      );

      db.prepare('UPDATE decisions SET status = ? WHERE id = ?').run('COMPLETED', id);
      res.json(analysisData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to analyze responses' });
    }
  });

  app.get('/api/decisions/:id/analysis', (req, res) => {
    const { id } = req.params;
    const analysis = db.prepare('SELECT * FROM analysis WHERE decision_id = ?').get(id) as any;
    if (analysis) {
      analysis.insights = JSON.parse(analysis.insights);
    }
    res.json(analysis);
  });

  // Socket.io for live activity
  io.on('connection', (socket) => {
    socket.on('join_decision', (decisionId) => {
      socket.join(decisionId);
      socket.to(decisionId).emit('user_joined', { timestamp: new Date() });
    });
    socket.on('typing', (decisionId) => {
      socket.to(decisionId).emit('user_typing', { timestamp: new Date() });
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(\`Server running on http://localhost:\${PORT}\`);
  });
}

startServer();
