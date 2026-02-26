import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!description.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/decisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });
      const data = await res.json();
      navigate(`/decision/${data.id}/questions`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f7f8f6] dark:bg-[#192210] font-sans min-h-screen flex flex-col antialiased selection:bg-[#73d411]/30">
      <header className="w-full flex items-center justify-between border-b border-[#edf3e7] dark:border-white/10 px-6 py-4 lg:px-12 bg-white/50 dark:bg-[#232e1a]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3 text-[#141b0d] dark:text-white">
          <div className="size-8 text-[#73d411] flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">psychology_alt</span>
          </div>
          <h2 className="text-lg font-bold tracking-tight">Decision Assistant</h2>
        </div>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-8">
            <a className="text-[#141b0d] dark:text-gray-200 text-sm font-medium hover:text-[#73d411] transition-colors" href="#">Home</a>
            <a className="text-[#5c6b4f] dark:text-gray-400 text-sm font-medium hover:text-[#73d411] transition-colors" href="#">About</a>
            <a className="text-[#5c6b4f] dark:text-gray-400 text-sm font-medium hover:text-[#73d411] transition-colors" href="#">History</a>
          </nav>
          <button className="bg-[#73d411] hover:bg-[#65bd0f] text-[#141b0d] text-sm font-bold py-2.5 px-6 rounded-full transition-colors shadow-sm active:scale-95">
            Log In
          </button>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-3xl animate-fade-in-up">
          <div className="bg-white dark:bg-[#232e1a] rounded-2xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] p-8 md:p-12 lg:p-16 border border-white dark:border-white/5">
            <div className="flex flex-col items-center text-center mb-10">
              <div className="inline-flex items-center justify-center size-12 rounded-full bg-[#73d411]/10 text-[#73d411] mb-6">
                <span className="material-symbols-outlined">lightbulb</span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#141b0d] dark:text-white mb-4 leading-tight">
                Let’s figure this out together.
              </h1>
              <p className="text-[#5c6b4f] dark:text-gray-400 text-lg md:text-xl max-w-lg">
                Navigate life's complexities with clarity.
              </p>
            </div>

            <div className="w-full max-w-xl mx-auto space-y-8">
              <div className="space-y-4">
                <label className="block text-lg font-semibold text-[#141b0d] dark:text-white" htmlFor="decision-input">
                  What are you trying to decide?
                </label>
                <div className="relative group">
                  <textarea
                    id="decision-input"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full min-h-[160px] p-5 rounded-xl bg-[#f7f8f6] dark:bg-[#192210]/50 border-2 border-transparent focus:border-[#73d411] focus:ring-0 text-[#141b0d] dark:text-white placeholder:text-[#5c6b4f]/60 dark:placeholder:text-gray-500 text-base resize-none transition-all duration-200 ease-in-out shadow-inner"
                    placeholder="E.g., Should I move to a new city for a job offer, or stay close to family?"
                  ></textarea>
                  <div className="absolute bottom-4 right-4 text-[#5c6b4f]/40 text-xs">{description.length}/500</div>
                </div>
              </div>

              <div className="space-y-4">
                <button className="flex items-center gap-2 text-[#5c6b4f] dark:text-gray-400 text-sm font-medium hover:text-[#73d411] transition-colors group">
                  <span className="bg-[#f7f8f6] dark:bg-white/10 p-1 rounded-full group-hover:bg-[#73d411]/20 transition-colors">
                    <span className="material-symbols-outlined text-lg">add</span>
                  </span>
                  Add more details (optional)
                </button>
                <div className="flex flex-wrap gap-3 pt-2">
                  <button className="px-4 py-2 rounded-full border border-[#edf3e7] dark:border-white/10 bg-[#f7f8f6] dark:bg-[#192210]/30 text-[#5c6b4f] dark:text-gray-300 text-sm hover:border-[#73d411]/50 hover:bg-[#73d411]/5 transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">attach_money</span>
                    Budget
                  </button>
                  <button className="px-4 py-2 rounded-full border border-[#edf3e7] dark:border-white/10 bg-[#f7f8f6] dark:bg-[#192210]/30 text-[#5c6b4f] dark:text-gray-300 text-sm hover:border-[#73d411]/50 hover:bg-[#73d411]/5 transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">schedule</span>
                    Timeframe
                  </button>
                  <button className="px-4 py-2 rounded-full border border-[#edf3e7] dark:border-white/10 bg-[#f7f8f6] dark:bg-[#192210]/30 text-[#5c6b4f] dark:text-gray-300 text-sm hover:border-[#73d411]/50 hover:bg-[#73d411]/5 transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">group</span>
                    Group Size
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={loading || !description.trim()}
                  className="w-full bg-[#73d411] hover:bg-[#65bd0f] disabled:opacity-50 text-[#141b0d] text-lg font-bold py-4 px-8 rounded-xl shadow-lg shadow-[#73d411]/20 hover:shadow-[#73d411]/30 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-3"
                >
                  <span>{loading ? 'Thinking...' : 'Help me decide'}</span>
                  {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
                </button>
              </div>
            </div>
          </div>
          <p className="text-center text-[#5c6b4f]/60 dark:text-gray-500 text-sm mt-8">
            Powered by advanced reasoning models to help you make better choices.
          </p>
        </div>
      </main>
    </div>
  );
}
