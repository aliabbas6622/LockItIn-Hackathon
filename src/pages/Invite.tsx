import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Header from '../components/Header';

export default function Invite() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activities, setActivities] = useState<any[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);

  const inviteLink = `${window.location.origin}/decision/${id}/respond`;

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const res = await fetch(`/api/decisions/${id}/participants`);
        if (res.ok) {
          const data = await res.json();
          setParticipants(data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchParticipants();

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
    <div className="bg-[#f5f7f2] dark:bg-[#192210] font-sans min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow px-6 md:px-12 py-12 w-full max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 lg:gap-20">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-[#5c6b7b] dark:text-gray-400">
              <span className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#8a99a8]">Step 3 of 4</span>
              <span className="text-[14px] font-medium text-[#73d411]">75% Complete</span>
            </div>
            <div className="h-2.5 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-[#73d411] w-3/4 rounded-full"></div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="font-serif text-5xl md:text-[56px] font-bold text-[#0a1128] dark:text-white tracking-tight leading-[1.1]">
              Invite others to weigh in
            </h2>
            <p className="text-[17px] text-[#5c6b7b] dark:text-gray-400 leading-relaxed max-w-[500px]">
              Share the link below or send email invitations to gather responses from your team.
            </p>
          </div>

          <div className="p-8 md:p-10 rounded-[32px] bg-white dark:bg-[#232e1a] border border-black/[0.04] dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col gap-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#73d411]/[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            
            <div className="flex flex-col gap-3 relative z-10">
              <label className="text-[13px] font-bold text-[#8a99a8] dark:text-gray-400 uppercase tracking-[0.08em]">Your Unique Invite Link</label>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-grow bg-[#fcfcfc] dark:bg-[#192210]/50 border border-black/[0.06] dark:border-white/10 rounded-2xl px-5 py-4 flex items-center text-[#0a1128] dark:text-white font-mono text-[15px] truncate select-all">
                  {inviteLink}
                </div>
                <button onClick={handleCopy} className="flex-shrink-0 bg-[#73d411] hover:bg-[#65bd0f] text-white font-bold px-8 py-4 rounded-2xl transition-all flex items-center justify-center gap-2 group/btn shadow-[0_4px_14px_rgba(115,212,17,0.2)] hover:shadow-[0_6px_20px_rgba(115,212,17,0.3)] hover:-translate-y-0.5 active:translate-y-0">
                  <span className="material-symbols-outlined text-[20px] group-hover/btn:scale-110 transition-transform">content_copy</span>
                  Copy Link
                </button>
              </div>
            </div>

            <div className="border-t border-black/[0.04] dark:border-white/5"></div>

            <div className="flex flex-col gap-4 relative z-10">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-bold text-[#8a99a8] dark:text-gray-400 uppercase tracking-[0.08em]">Email Invitations</label>
                <button className="text-[#73d411] text-[14px] font-bold hover:text-[#65bd0f] transition-colors flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Add from contacts
                </button>
              </div>
              <div className="bg-[#fcfcfc] dark:bg-[#192210]/50 border border-black/[0.06] dark:border-white/10 rounded-2xl p-3 min-h-[160px] focus-within:ring-2 focus-within:ring-[#73d411]/20 focus-within:border-[#73d411] transition-all">
                <div className="flex flex-wrap gap-2 p-1">
                  <div className="bg-[#f2f7ec] dark:bg-[#73d411]/10 text-[#5a7a45] dark:text-[#73d411] px-3 py-1.5 rounded-lg text-[14px] font-medium flex items-center gap-1.5">
                    sarah@example.com
                    <span className="material-symbols-outlined text-[16px] cursor-pointer hover:text-[#3d5032] opacity-70">close</span>
                  </div>
                  <div className="bg-[#f2f7ec] dark:bg-[#73d411]/10 text-[#5a7a45] dark:text-[#73d411] px-3 py-1.5 rounded-lg text-[14px] font-medium flex items-center gap-1.5">
                    mark.d@agency.net
                    <span className="material-symbols-outlined text-[16px] cursor-pointer hover:text-[#3d5032] opacity-70">close</span>
                  </div>
                  <input className="flex-grow min-w-[200px] bg-transparent border-none outline-none text-[#0a1128] dark:text-white placeholder:text-[#8a99a8] focus:ring-0 text-[15px] p-1.5" placeholder="Type email and press Enter..." type="text" />
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <button className="bg-[#3d5032] hover:bg-[#2c3a24] dark:bg-[#f2f7ec] dark:hover:bg-white text-white dark:text-[#3d5032] font-bold px-8 py-3.5 rounded-2xl text-[15px] transition-colors shadow-sm">
                  Send Invites
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-start pt-2">
            <button onClick={handleSeeResults} className="w-full md:w-auto bg-[#73d411] hover:bg-[#65bd0f] text-white text-[17px] font-bold px-10 py-4.5 rounded-2xl shadow-[0_8px_20px_rgba(115,212,17,0.2)] hover:shadow-[0_8px_25px_rgba(115,212,17,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3">
              <span>See results as they arrive</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-[#232e1a] border border-black/[0.04] dark:border-white/5 rounded-[32px] p-8 h-full min-h-[500px] flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[22px] font-bold text-[#0a1128] dark:text-white flex items-center gap-3">
                <span className="material-symbols-outlined text-[#73d411] animate-pulse">sensors</span>
                Live Activity
              </h3>
              <span className="text-[11px] font-bold bg-[#f2f7ec] dark:bg-[#73d411]/10 text-[#5a7a45] dark:text-[#73d411] px-2.5 py-1 rounded uppercase tracking-[0.08em]">Real-time</span>
            </div>
            
            <div className="flex-grow flex flex-col gap-6 overflow-y-auto pr-2">
              {activities.length === 0 ? (
                <div className="mt-auto pt-12 flex flex-col items-center justify-center text-center gap-4 opacity-40">
                  <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center text-[#8a99a8]">
                    <span className="material-symbols-outlined text-[32px]">hourglass_empty</span>
                  </div>
                  <p className="text-[15px] text-[#8a99a8]">Waiting for more participants...</p>
                </div>
              ) : (
                activities.map((act, i) => (
                  <div key={i} className="flex items-start gap-4 animate-fade-in-up">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[14px] shrink-0
                      ${i % 3 === 0 ? 'bg-blue-100 text-blue-600' : 
                        i % 3 === 1 ? 'bg-purple-100 text-purple-600' : 
                        'bg-orange-100 text-orange-600'}`}>
                      {act.participant?.name?.substring(0, 2).toUpperCase() || 'U'}
                    </div>
                    <div className="flex flex-col gap-1 pt-0.5">
                      <p className="text-[15px] text-[#5c6b7b] dark:text-gray-300">
                        <span className="font-bold text-[#0a1128] dark:text-white">{act.participant?.name || 'Someone'}</span> {act.type === 'join' ? 'joined the session' : act.type === 'response' ? 'submitted a response' : 'is typing...'}
                      </p>
                      <span className="text-[13px] text-[#8a99a8]">Just now</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full py-8 mt-auto border-t border-black/[0.04] dark:border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center text-[#8a99a8] text-[14px]">
          <p>© 2024 LockItIn Inc.</p>
          <div className="flex gap-6">
            <a className="hover:text-[#73d411] transition-colors" href="#">Privacy</a>
            <a className="hover:text-[#73d411] transition-colors" href="#">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
