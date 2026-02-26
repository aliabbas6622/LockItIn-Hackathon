import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { generateQuestions } from '../services/geminiService';
import Header from '../components/Header';

export default function Questions() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndGenerate = async () => {
      try {
        // 1. Get decision details
        const decisionRes = await fetch(`/api/decisions/${id}`);
        if (!decisionRes.ok) throw new Error('Failed to fetch decision');
        const decision = await decisionRes.json();
        
        // 2. Generate questions via Gemini
        const generated = await generateQuestions(decision.description);
        
        // 3. Save to backend
        const saveRes = await fetch(`/api/decisions/${id}/questions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questions: generated }),
        });
        if (!saveRes.ok) throw new Error('Failed to save questions');
        const savedQuestions = await saveRes.json();
        setQuestions(savedQuestions);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAndGenerate();
  }, [id]);

  const handleNext = () => {
    navigate(`/decision/${id}/invite`);
  };

  return (
    <div className="bg-[#f5f7f2] dark:bg-[#192210] font-sans text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center px-4 py-8 md:py-12 w-full">
        <div className="w-full max-w-[800px] bg-white dark:bg-[#232e1a] rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-16 border border-black/[0.04] dark:border-white/5">
          <div className="flex flex-col items-center text-center mb-12">
            <div className="inline-flex items-center justify-center size-12 rounded-full bg-[#f2f7ec] text-[#73d411] mb-6">
              <span className="material-symbols-outlined text-[24px]">list</span>
            </div>
            <h1 className="font-serif text-4xl md:text-[56px] font-bold text-[#0a1128] dark:text-white mb-6 leading-[1.1] tracking-tight">
              Here’s what I need to ask
            </h1>
            <p className="text-[#5c6b7b] dark:text-gray-400 text-[17px] leading-relaxed max-w-[500px]">
              Based on your goal, I've prepared these questions to gather the right insights. Review and refine them before we proceed.
            </p>
          </div>

          <div className="w-full max-w-[640px] mx-auto space-y-4">
            {loading ? (
              <div className="text-center py-12 text-slate-500 flex flex-col items-center gap-4">
                <span className="material-symbols-outlined animate-spin text-3xl text-[#73d411]">autorenew</span>
                Generating questions...
              </div>
            ) : questions.length > 0 ? (
              questions.map((q, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-[#fcfcfc] dark:bg-[#192210]/50 border border-black/[0.06] dark:border-white/10 hover:border-[#73d411]/30 transition-colors group">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#73d411] bg-[#73d411]/10 px-2.5 py-1 rounded-md">Suggested by AI</span>
                    <span className="text-[13px] text-slate-400 flex items-center gap-1.5 font-medium">
                      <span className="material-symbols-outlined text-[14px]">
                        {q.category.toLowerCase().includes('time') ? 'schedule' : 
                         q.category.toLowerCase().includes('budget') ? 'attach_money' : 
                         q.category.toLowerCase().includes('scale') ? 'tune' : 
                         q.category.toLowerCase().includes('group') ? 'group' : 
                         q.category.toLowerCase().includes('risk') ? 'bolt' : 'category'}
                      </span>
                      {q.category}
                    </span>
                  </div>
                  <p className="text-[17px] font-medium text-[#0a1128] dark:text-white leading-snug">{q.text}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-red-500">Failed to load questions. Please try again.</div>
            )}

            {!loading && (
              <div className="pt-2">
                <button className="w-full py-4 border-2 border-dashed border-black/[0.08] dark:border-white/10 rounded-2xl text-[#5c6b7b] font-medium hover:text-[#73d411] hover:border-[#73d411]/40 hover:bg-[#73d411]/5 transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">add_circle</span>
                  Add another question
                </button>
              </div>
            )}

            <div className="pt-8 flex flex-col items-center gap-4">
              <button
                onClick={handleNext}
                disabled={loading}
                className="w-full bg-[#73d411] hover:bg-[#65bd0f] disabled:opacity-50 text-white text-[17px] font-bold py-4 px-8 rounded-2xl shadow-[0_8px_20px_rgba(115,212,17,0.2)] hover:shadow-[0_8px_25px_rgba(115,212,17,0.3)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>Collect responses</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
              <button className="text-[#5c6b7b] hover:text-[#0a1128] dark:hover:text-white text-[15px] font-medium transition-colors">
                Back to previous step
              </button>
            </div>
          </div>
        </div>
        <p className="text-center text-[#8a99a8] dark:text-gray-500 text-[13px] mt-10">
          Powered by advanced reasoning models to help you make better choices.
        </p>
      </main>
    </div>
  );
}
