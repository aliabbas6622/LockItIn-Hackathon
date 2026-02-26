import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

export default function Invite() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activities, setActivities] = useState<any[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);

  const inviteLink = `${window.location.origin}/decision/${id}/respond`;

  useEffect(() => {
    const socket = io();
    socket.emit('join_decision', id);

    socket.on('user_joined', (data) => {
      setActivities((prev) => [{ type: 'join', ...data }, ...prev]);
    });

    socket.on('user_typing', (data) => {
      setActivities((prev) => [{ type: 'typing', ...data }, ...prev]);
    });

    socket.on('new_response', (data) => {
      setActivities((prev) => [{ type: 'response', ...data }, ...prev]);
      setParticipants((prev) => [...prev, data.participant]);
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    alert('Link copied!');
  };

  const handleSeeResults = () => {
    navigate(`/decision/${id}/report`);
  };

  return (
    <div className="bg-[#f7f8f6] dark:bg-[#192210] font-serif min-h-screen flex flex-col">
      <header className="w-full border-b border-[#e4efda] dark:border-[#49613a] bg-[#f7f8f6]/95 dark:bg-[#192210]/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-6 md:px-12 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3 text-[#3d5032] dark:text-[#f2f7ec]">
            <div className="size-8 text-[#73d411] flex items-center justify-center bg-[#73d411]/10 rounded-lg p-1">
              <span className="material-symbols-outlined text-2xl">lock</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight font-sans">LockItIn</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center justify-center gap-2 h-10 px-4 rounded-xl text-[#5a7a45] dark:text-[#d0e2bf] hover:bg-[#f2f7ec] dark:hover:bg-[#49613a] transition-colors text-sm font-semibold font-sans">
              <span className="material-symbols-outlined text-xl">account_circle</span>
              <span className="hidden sm:inline">Profile</span>
            </button>
            <button className="flex items-center justify-center gap-2 h-10 px-4 rounded-xl text-[#5a7a45] dark:text-[#d0e2bf] hover:bg-[#f2f7ec] dark:hover:bg-[#49613a] transition-colors text-sm font-semibold font-sans">
              <span className="material-symbols-outlined text-xl">help</span>
              <span className="hidden sm:inline">Help</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow px-6 md:px-12 py-8 md:py-12 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-[#3d5032] dark:text-[#f2f7ec] font-sans">
              <span className="text-sm font-semibold uppercase tracking-wider text-[#91b776] dark:text-[#b3d09e]">Step 3 of 4</span>
              <span className="text-sm font-medium text-[#73d411]">75% Complete</span>
            </div>
            <div className="h-2 w-full bg-[#e4efda] dark:bg-[#49613a] rounded-full overflow-hidden">
              <div className="h-full bg-[#73d411] w-3/4 rounded-full"></div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-4xl md:text-5xl font-medium text-[#3d5032] dark:text-[#fbfdf9] tracking-tight leading-tight">
              Invite others to weigh in
            </h2>
            <p className="text-lg text-[#719757] dark:text-[#b3d09e] font-sans max-w-2xl">
              Share the link below or send email invitations to gather responses from your team.
            </p>
          </div>

          <div className="p-8 rounded-xl bg-white dark:bg-[#3d5032] border border-[#e4efda] dark:border-[#49613a] shadow-sm flex flex-col gap-6 relative overflow-hidden group font-sans">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#73d411]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            
            <div className="flex flex-col gap-2 relative z-10">
              <label className="text-sm font-bold text-[#91b776] dark:text-[#b3d09e] uppercase tracking-wide">Your Unique Invite Link</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-grow bg-[#fbfdf9] dark:bg-[#49613a] border border-[#e4efda] dark:border-[#5a7a45] rounded-lg px-4 py-3 flex items-center text-[#5a7a45] dark:text-[#e4efda] font-mono text-base truncate select-all">
                  {inviteLink}
                </div>
                <button onClick={handleCopy} className="flex-shrink-0 bg-[#73d411] hover:bg-[#73d411]/90 text-[#3d5032] font-bold px-6 py-3 rounded-lg transition-all flex items-center justify-center gap-2 group/btn">
                  <span className="material-symbols-outlined group-hover/btn:scale-110 transition-transform">content_copy</span>
                  Copy Link
                </button>
              </div>
            </div>

            <div className="border-t border-[#f2f7ec] dark:border-[#49613a]"></div>

            <div className="flex flex-col gap-4 relative z-10">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-[#91b776] dark:text-[#b3d09e] uppercase tracking-wide">Email Invitations</label>
                <button className="text-[#73d411] text-sm font-bold hover:underline flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">add</span>
                  Add from contacts
                </button>
              </div>
              <div className="bg-[#fbfdf9] dark:bg-[#49613a] border border-[#e4efda] dark:border-[#5a7a45] rounded-xl p-2 min-h-[140px] focus-within:ring-2 focus-within:ring-[#73d411]/50 focus-within:border-[#73d411] transition-shadow">
                <div className="flex flex-wrap gap-2 p-2">
                  <input className="flex-grow min-w-[120px] bg-transparent border-none outline-none text-[#3d5032] dark:text-[#f2f7ec] placeholder:text-[#91b776] focus:ring-0 font-sans p-1" placeholder="Type email and press Enter..." type="text" />
                </div>
              </div>
              <div className="flex justify-end">
                <button className="bg-[#3d5032] dark:bg-[#f2f7ec] text-white dark:text-[#3d5032] font-bold px-6 py-2.5 rounded-lg text-sm hover:opacity-90 transition-opacity">
                  Send Invites
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-start pt-4 font-sans">
            <button onClick={handleSeeResults} className="w-full md:w-auto bg-[#73d411] hover:bg-[#73d411]/90 text-[#3d5032] text-lg font-bold px-8 py-4 rounded-xl shadow-lg shadow-[#73d411]/20 transition-all transform active:scale-[0.99] flex items-center justify-center gap-3">
              <span>See results as they arrive</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6 font-sans">
          <div className="bg-white dark:bg-[#3d5032] border border-[#e4efda] dark:border-[#49613a] rounded-xl p-6 h-full min-h-[400px] flex flex-col shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#3d5032] dark:text-[#f2f7ec] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#73d411] animate-pulse">sensors</span>
                Live Activity
              </h3>
              <span className="text-xs font-bold bg-[#f2f7ec] dark:bg-[#49613a] text-[#719757] dark:text-[#b3d09e] px-2 py-1 rounded-md uppercase tracking-wider">Real-time</span>
            </div>
            
            <div className="flex-grow flex flex-col gap-4 overflow-y-auto pr-2">
              {activities.length === 0 ? (
                <div className="mt-auto pt-8 flex flex-col items-center justify-center text-center gap-2 opacity-50">
                  <div className="w-12 h-12 bg-[#f2f7ec] dark:bg-[#49613a] rounded-full flex items-center justify-center text-[#91b776]">
                    <span className="material-symbols-outlined text-2xl">hourglass_empty</span>
                  </div>
                  <p className="text-sm text-[#91b776] font-sans">Waiting for more participants...</p>
                </div>
              ) : (
                activities.map((act, i) => (
                  <div key={i} className="flex items-start gap-3 animate-fade-in-up">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 font-sans">
                      {act.participant?.name?.[0] || 'U'}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm text-[#3d5032] dark:text-[#f2f7ec] font-medium">
                        <span className="font-bold">{act.participant?.name || 'Someone'}</span> {act.type === 'join' ? 'joined the session' : act.type === 'response' ? 'submitted a response' : 'is typing...'}
                      </p>
                      <span className="text-xs text-[#91b776]">Just now</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full py-6 mt-auto border-t border-[#e4efda] dark:border-[#49613a]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center text-[#91b776] text-sm font-sans">
          <p>© 2024 LockItIn Inc.</p>
          <div className="flex gap-4">
            <a className="hover:text-[#73d411] transition-colors" href="#">Privacy</a>
            <a className="hover:text-[#73d411] transition-colors" href="#">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
