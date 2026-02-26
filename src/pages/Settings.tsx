import React from 'react';
import Header from '../components/Header';

export default function Settings() {
  return (
    <div className="bg-[#f7f8f6] dark:bg-[#192210] font-sans min-h-screen flex flex-col antialiased">
      <Header />
      <main className="flex-grow p-6 lg:p-12 max-w-4xl mx-auto w-full">
        <div className="bg-white dark:bg-[#232e1a] rounded-2xl shadow-sm p-8 md:p-12 border border-white dark:border-white/5 animate-fade-in">
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-[#141b0d] dark:text-white mb-2">Settings</h1>
            <p className="text-[#5c6b4f] dark:text-gray-400">Customize your experience and manage application preferences.</p>
          </div>

          <div className="space-y-12">
            <section className="space-y-6">
              <h2 className="text-xl font-bold text-[#141b0d] dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#73d411]">notifications</span>
                Notifications
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#f7f8f6] dark:bg-[#192210]/50">
                  <div>
                    <p className="font-semibold text-[#141b0d] dark:text-white">Email Notifications</p>
                    <p className="text-sm text-[#5c6b4f] dark:text-gray-400">Receive updates about your decisions via email.</p>
                  </div>
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out transform translate-x-6 bg-[#73d411]"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#f7f8f6] dark:bg-[#192210]/50">
                  <div>
                    <p className="font-semibold text-[#141b0d] dark:text-white">Real-time Alerts</p>
                    <p className="text-sm text-[#5c6b4f] dark:text-gray-400">Get notified immediately when someone responds.</p>
                  </div>
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out transform translate-x-6 bg-[#73d411]"></div>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-xl font-bold text-[#141b0d] dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#73d411]">dark_mode</span>
                Appearance
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 rounded-xl border-2 border-[#73d411] bg-white dark:bg-[#232e1a] text-center">
                  <span className="material-symbols-outlined block mb-2">light_mode</span>
                  <span className="text-sm font-bold">Light</span>
                </button>
                <button className="p-4 rounded-xl border-2 border-transparent bg-[#f7f8f6] dark:bg-[#192210]/50 text-center hover:border-[#73d411]/30 transition-all">
                  <span className="material-symbols-outlined block mb-2">dark_mode</span>
                  <span className="text-sm font-bold">Dark</span>
                </button>
                <button className="p-4 rounded-xl border-2 border-transparent bg-[#f7f8f6] dark:bg-[#192210]/50 text-center hover:border-[#73d411]/30 transition-all">
                  <span className="material-symbols-outlined block mb-2">settings_brightness</span>
                  <span className="text-sm font-bold">System</span>
                </button>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-xl font-bold text-red-500 flex items-center gap-2">
                <span className="material-symbols-outlined">danger</span>
                Danger Zone
              </h2>
              <div className="p-6 rounded-xl border border-red-500/20 bg-red-500/5 space-y-4">
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">Once you delete your account, there is no going back. Please be certain.</p>
                <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 px-6 rounded-lg text-sm transition-colors">
                  Delete Account
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
