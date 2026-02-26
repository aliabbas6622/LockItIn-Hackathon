import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import db from './src/db';
import dotenv from 'dotenv';

dotenv.config();

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

  app.post('/api/decisions/:id/questions', (req, res) => {
    const { id } = req.params;
    const { questions } = req.body;
    
    const insertStmt = db.prepare('INSERT INTO questions (id, decision_id, text, category) VALUES (?, ?, ?, ?)');
    const generatedQuestions = [];
    for (const q of questions) {
      const qId = uuidv4();
      insertStmt.run(qId, id, q.text, q.category);
      generatedQuestions.push({ id: qId, ...q });
    }

    db.prepare('UPDATE decisions SET status = ? WHERE id = ?').run('COLLECTING', id);
    res.json(generatedQuestions);
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

  app.post('/api/decisions/:id/analysis', (req, res) => {
    const { id } = req.params;
    const analysisData = req.body;
    const analysisId = uuidv4();
    
    db.prepare(`
      INSERT INTO analysis (id, decision_id, verdict_title, verdict_description, budget_score, time_score, group_size_score, insights)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      analysisId, id, analysisData.verdict_title, analysisData.verdict_description, 
      analysisData.budget_score, analysisData.time_score, analysisData.group_size_score, 
      JSON.stringify(analysisData.insights)
    );

    db.prepare('UPDATE decisions SET status = ? WHERE id = ?').run('COMPLETED', id);
    res.json({ id: analysisId });
  });

  app.get('/api/decisions/:id/analysis', (req, res) => {
    const { id } = req.params;
    const analysis = db.prepare('SELECT * FROM analysis WHERE decision_id = ?').get(id) as any;
    if (analysis) {
      analysis.insights = JSON.parse(analysis.insights);
      res.json(analysis);
    } else {
      res.status(404).json({ error: 'Analysis not found' });
    }
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
