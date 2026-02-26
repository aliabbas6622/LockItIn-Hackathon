import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Report() {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await fetch(\`/api/decisions/\${id}/analyze\`, { method: 'POST' });
        const data = await res.json();
        setAnalysis(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-[#fbfbf8] dark:bg-[#192210] min-h-screen flex items-center justify-center">
        <div className="text-[#739a4c] font-bold animate-pulse">Analyzing responses...</div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="bg-[#fbfbf8] dark:bg-[#192210] font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
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
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#739a4c]/60">Step 4 of 4</span>
              <button className="flex items-center justify-center rounded-full h-10 w-10 bg-[#739a4c]/10 text-[#739a4c] hover:bg-[#739a4c]/20 transition-colors">
                <span className="material-symbols-outlined">share</span>
              </button>
            </div>
          </header>

          <main className="flex-1 flex flex-col items-center px-6 py-12 md:py-20 max-w-[800px] mx-auto w-full">
            <div className="w-full max-w-md mb-16">
              <div className="flex justify-between items-end mb-2">
                <span className="text-[#739a4c] text-xs font-bold uppercase tracking-widest">Analysis Complete</span>
                <span className="text-slate-400 text-xs font-medium">100%</span>
              </div>
              <div className="h-1.5 w-full bg-[#739a4c]/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#739a4c] w-full rounded-full"></div>
              </div>
            </div>

            <div className="text-center mb-16">
              <h3 className="text-[#739a4c] text-sm font-bold uppercase tracking-[0.2em] mb-4">The Verdict</h3>
              <h1 className="font-serif text-5xl md:text-7xl text-slate-900 dark:text-slate-100 leading-tight italic">
                {analysis.verdict_title}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-6 text-lg max-w-lg mx-auto leading-relaxed">
                {analysis.verdict_description}
              </p>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 p-8 rounded-2xl bg-white dark:bg-slate-800/30 border border-[#739a4c]/10 shadow-sm">
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-tighter">
                  <span>Budget</span>
                  <span className="text-[#739a4c]">{analysis.budget_score}%</span>
                </div>
                <div className="h-1 bg-[#739a4c]/10 rounded-full">
                  <div className="h-full bg-[#739a4c] rounded-full" style={{ width: \`\${analysis.budget_score}%\` }}></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-tighter">
                  <span>Time Efficiency</span>
                  <span className="text-[#739a4c]">{analysis.time_score}%</span>
                </div>
                <div className="h-1 bg-[#739a4c]/10 rounded-full">
                  <div className="h-full bg-[#739a4c] rounded-full" style={{ width: \`\${analysis.time_score}%\` }}></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-tighter">
                  <span>Group Size Fit</span>
                  <span className="text-[#739a4c]">{analysis.group_size_score}%</span>
                </div>
                <div className="h-1 bg-[#739a4c]/10 rounded-full">
                  <div className="h-full bg-[#739a4c] rounded-full" style={{ width: \`\${analysis.group_size_score}%\` }}></div>
                </div>
              </div>
            </div>

            <div className="w-full max-w-2xl mb-16">
              <h4 className="text-slate-900 dark:text-slate-100 text-xl font-bold mb-8 border-l-4 border-[#739a4c] pl-4">Why this works</h4>
              <div className="grid gap-6">
                {analysis.insights?.map((insight: any, idx: number) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 size-6 flex items-center justify-center rounded-full bg-[#739a4c]/10 text-[#739a4c] mt-1">
                      <span className="material-symbols-outlined text-sm">check</span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{insight.title}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{insight.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full flex flex-col items-center gap-4">
              <button className="w-full max-w-md bg-[#739a4c] hover:bg-[#739a4c]/90 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-[#739a4c]/20 flex items-center justify-center gap-2 group">
                <span>Confirm & Share Results</span>
                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
              <button className="text-slate-400 hover:text-[#739a4c] text-sm font-medium transition-colors">
                Wait, let's adjust the parameters
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
