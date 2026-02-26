import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { analyzeResponses } from '../services/geminiService';
import Header from '../components/Header';

export default function Report() {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndAnalyze = async () => {
      try {
        // 1. Check if analysis already exists
        const existingRes = await fetch(`/api/decisions/${id}/analysis`);
        if (existingRes.ok) {
          const existing = await existingRes.json();
          if (existing && !existing.error) {
            setAnalysis(existing);
            setLoading(false);
            return;
          }
        }

        // 2. Gather data for analysis
        const [decisionRes, questionsRes, participantsRes] = await Promise.all([
          fetch(`/api/decisions/${id}`),
          fetch(`/api/decisions/${id}/questions`),
          fetch(`/api/decisions/${id}/participants`)
        ]);

        if (!decisionRes.ok || !questionsRes.ok || !participantsRes.ok) {
          throw new Error('Failed to fetch data for analysis');
        }

        const decision = await decisionRes.json();
        const questions = await questionsRes.json();
        const participants = await participantsRes.json();

        // Construct context
        const context = `
          Decision: ${decision.description}
          Questions: ${JSON.stringify(questions)}
          Participants: ${JSON.stringify(participants)}
        `;

        // 3. Generate analysis via Gemini
        const analysisData = await analyzeResponses(context);

        // 4. Save to backend
        await fetch(`/api/decisions/${id}/analysis`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(analysisData),
        });

        setAnalysis(analysisData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAndAnalyze();
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
    <div className="bg-[#fcfcfc] dark:bg-[#192210] font-sans text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <Header />

          <main className="flex-1 flex flex-col items-center px-4 py-12 md:py-20 max-w-[800px] mx-auto w-full">
            <div className="w-full max-w-[500px] mb-16">
              <div className="flex justify-between items-end mb-3">
                <span className="text-[#73d411] text-[12px] font-bold uppercase tracking-[0.1em]">Analysis Complete</span>
                <span className="text-[#8a99a8] text-[13px] font-medium">100%</span>
              </div>
              <div className="h-1.5 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-[#73d411] w-full rounded-full"></div>
              </div>
            </div>

            <div className="text-center mb-16">
              <h3 className="text-[#73d411] text-[13px] font-bold uppercase tracking-[0.2em] mb-6">The Verdict</h3>
              <h1 className="font-serif text-5xl md:text-[72px] text-[#0a1128] dark:text-white leading-[1.1] italic font-bold tracking-tight">
                {analysis.verdict_title}
              </h1>
              <p className="text-[#5c6b7b] dark:text-gray-400 mt-8 text-[17px] max-w-[500px] mx-auto leading-relaxed">
                {analysis.verdict_description}
              </p>
            </div>

            <div className="w-full max-w-[700px] grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 p-8 rounded-[24px] bg-white dark:bg-[#232e1a] border border-black/[0.06] dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="space-y-3">
                <div className="flex justify-between text-[11px] font-bold text-[#5c6b7b] dark:text-gray-400 uppercase tracking-[0.05em]">
                  <span>Budget</span>
                  <span className="text-[#73d411]">{analysis.budget_score}%</span>
                </div>
                <div className="h-1.5 bg-black/5 dark:bg-white/5 rounded-full">
                  <div className="h-full bg-[#73d411] rounded-full" style={{ width: `${analysis.budget_score}%` }}></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-[11px] font-bold text-[#5c6b7b] dark:text-gray-400 uppercase tracking-[0.05em]">
                  <span>Time Efficiency</span>
                  <span className="text-[#73d411]">{analysis.time_score}%</span>
                </div>
                <div className="h-1.5 bg-black/5 dark:bg-white/5 rounded-full">
                  <div className="h-full bg-[#73d411] rounded-full" style={{ width: `${analysis.time_score}%` }}></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-[11px] font-bold text-[#5c6b7b] dark:text-gray-400 uppercase tracking-[0.05em]">
                  <span>Group Size Fit</span>
                  <span className="text-[#73d411]">{analysis.group_size_score}%</span>
                </div>
                <div className="h-1.5 bg-black/5 dark:bg-white/5 rounded-full">
                  <div className="h-full bg-[#73d411] rounded-full" style={{ width: `${analysis.group_size_score}%` }}></div>
                </div>
              </div>
            </div>

            <div className="w-full max-w-[600px] mb-16">
              <h4 className="text-[#0a1128] dark:text-white text-[22px] font-bold mb-8 border-l-4 border-[#73d411] pl-5 leading-none">Why this works</h4>
              <div className="grid gap-8">
                {analysis.insights?.map((insight: any, idx: number) => (
                  <div key={idx} className="flex gap-5">
                    <div className="flex-shrink-0 size-6 flex items-center justify-center rounded-full bg-[#f2f7ec] dark:bg-[#73d411]/10 text-[#73d411] mt-0.5">
                      <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <p className="font-bold text-[#0a1128] dark:text-white text-[16px]">{insight.title}</p>
                      <p className="text-[#5c6b7b] dark:text-gray-400 text-[15px] leading-relaxed">{insight.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full flex flex-col items-center gap-6">
              <button className="w-full max-w-[400px] bg-[#6a994e] hover:bg-[#5a8342] text-white font-bold py-4.5 px-8 rounded-[16px] transition-all shadow-[0_8px_20px_rgba(106,153,78,0.2)] hover:shadow-[0_8px_25px_rgba(106,153,78,0.3)] hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group text-[16px]">
                <span>Confirm & Share Results</span>
                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
              <button className="text-[#8a99a8] hover:text-[#5c6b7b] dark:hover:text-gray-300 text-[14px] font-medium transition-colors">
                Wait, let's adjust the parameters
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
