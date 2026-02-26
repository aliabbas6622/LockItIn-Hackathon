import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Header from '../components/Header';

export default function Respond() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [socket, setSocket] = useState<any>(null);
  const lastTypingTimeRef = useRef<number>(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`/api/decisions/${id}/questions`);
        if (!res.ok) throw new Error('Failed to fetch questions');
        const data = await res.json();
        if (Array.isArray(data)) {
          setQuestions(data);
        } else {
          console.error('Expected array of questions, got:', data);
          setQuestions([]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();

    const s = io();
    s.emit('join_decision', id);
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [id]);

  const handleTyping = () => {
    if (socket) {
      const now = Date.now();
      if (now - lastTypingTimeRef.current > 2000) {
        socket.emit('typing', id);
        lastTypingTimeRef.current = now;
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Please enter your name');
    setSubmitting(true);
    try {
      await fetch(`/api/decisions/${id}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, answers }),
      });
      alert('Thank you for your response!');
      navigate('/');
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="bg-[#f7f8f6] dark:bg-[#192210] font-sans min-h-screen flex flex-col antialiased">
      <Header />
      <main className="flex-grow flex flex-col items-center p-6 lg:p-12">
        <div className="w-full max-w-2xl bg-white dark:bg-[#232e1a] rounded-2xl shadow-sm p-8 border border-[#edf3e7] dark:border-white/5 animate-fade-in">
          <h1 className="text-3xl font-serif font-bold mb-6 text-[#141b0d] dark:text-white italic">Weigh In</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-[#141b0d] dark:text-white">Your Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-lg border border-[#edf3e7] dark:border-white/10 bg-[#f7f8f6] dark:bg-[#192210]/50 text-[#141b0d] dark:text-white"
            />
          </div>

          {questions.length > 0 ? (
            questions.map((q) => (
              <div key={q.id}>
                <label className="block text-sm font-semibold mb-2 text-[#141b0d] dark:text-white">{q.text}</label>
                <textarea
                  required
                  value={answers[q.id] || ''}
                  onChange={(e) => {
                    setAnswers({ ...answers, [q.id]: e.target.value });
                    handleTyping();
                  }}
                  className="w-full p-3 rounded-lg border border-[#edf3e7] dark:border-white/10 bg-[#f7f8f6] dark:bg-[#192210]/50 text-[#141b0d] dark:text-white min-h-[100px]"
                />
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-slate-500">No questions found for this decision.</div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#73d411] hover:bg-[#65bd0f] text-[#141b0d] font-bold py-3 px-6 rounded-xl transition-colors"
          >
            {submitting ? 'Submitting...' : 'Submit Responses'}
          </button>
        </form>
      </div>
      </main>
    </div>
  );
}
