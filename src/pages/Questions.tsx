import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function Questions() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`/api/decisions/${id}/generate-questions`, { method: 'POST' });
        const data = await res.json();
        setQuestions(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [id]);

  const handleNext = () => {
    navigate(`/decision/${id}/invite`);
  };

  return (
    <div className="bg-[#fbfbf8] dark:bg-[#192210] font-sans text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#739a4c]/10 px-6 md:px-20 py-4 max-w-[1200px] mx-auto w-full">
        <div className="flex items-center gap-3 text-[#739a4c]">
          <div className="size-6">
            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fillRule="evenodd"></path>
              <path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fillRule="evenodd"></path>
            </svg>
          </div>
          <h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold leading-tight tracking-tight">LockItIn</h2>
        </div>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-8">
            <a className="text-slate-900 dark:text-gray-200 text-sm font-medium hover:text-[#739a4c] transition-colors" href="#">Home</a>
            <a className="text-slate-500 dark:text-gray-400 text-sm font-medium hover:text-[#739a4c] transition-colors" href="#">About</a>
            <a className="text-slate-500 dark:text-gray-400 text-sm font-medium hover:text-[#739a4c] transition-colors" href="#">History</a>
          </nav>
          <button className="flex items-center justify-center rounded-full h-10 w-10 bg-[#739a4c]/10 text-[#739a4c] hover:bg-[#739a4c]/20 transition-colors">
            <span className="material-symbols-outlined">dark_mode</span>
          </button>
          <button className="bg-[#73d411] hover:bg-[#65bd0f] text-[#141b0d] text-sm font-bold py-2.5 px-6 rounded-full transition-colors shadow-sm active:scale-95">
            Log In
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 py-12 md:py-20 max-w-[800px] mx-auto w-full">
        <div className="w-full max-w-3xl bg-white dark:bg-[#232e1a] rounded-2xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] p-8 md:p-12 lg:p-16 border border-white dark:border-white/5">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="inline-flex items-center justify-center size-12 rounded-full bg-[#739a4c]/10 text-[#739a4c] mb-6">
              <span className="material-symbols-outlined">list</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
              Here’s what I need to ask
            </h1>
            <p className="text-slate-500 dark:text-gray-400 text-lg md:text-xl max-w-lg">
              Based on your goal, I've prepared these questions to gather the right insights. Review and refine them before we proceed.
            </p>
          </div>

          <div className="w-full max-w-xl mx-auto space-y-4">
            {loading ? (
              <div className="text-center py-8 text-slate-500">Generating questions...</div>
            ) : (
              questions.map((q, idx) => (
                <div key={idx} className="p-6 rounded-xl bg-[#fbfbf8] dark:bg-[#192210]/50 border border-[#edf3e7] dark:border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#739a4c] bg-[#739a4c]/10 px-2 py-1 rounded">Suggested by AI</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">category</span>
                      {q.category}
                    </span>
                  </div>
                  <p className="text-lg font-medium text-slate-900 dark:text-white">{q.text}</p>
                </div>
              ))
            )}

            {!loading && (
              <button className="w-full py-4 border-2 border-dashed border-[#edf3e7] dark:border-white/10 rounded-xl text-slate-500 hover:text-[#739a4c] hover:border-[#739a4c]/50 hover:bg-[#739a4c]/5 transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">add_circle</span>
                Add another question
              </button>
            )}

            <div className="pt-8">
              <button
                onClick={handleNext}
                disabled={loading}
                className="w-full bg-[#73d411] hover:bg-[#65bd0f] disabled:opacity-50 text-[#141b0d] text-lg font-bold py-4 px-8 rounded-xl shadow-lg shadow-[#73d411]/20 hover:shadow-[#73d411]/30 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-3"
              >
                <span>Collect responses</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <button className="w-full mt-4 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-sm font-medium transition-colors">
                Back to previous step
              </button>
            </div>
          </div>
        </div>
        <p className="text-center text-slate-500/60 dark:text-gray-500 text-sm mt-8">
          Powered by advanced reasoning models to help you make better choices.
        </p>
      </main>
    </div>
  );
}
