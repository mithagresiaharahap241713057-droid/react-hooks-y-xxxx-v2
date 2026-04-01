"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleLogout = () => {
    // 1. Logika Hapus Cookie Login (Sesuai Middleware)
    
    // 2. Redirect ke Google
    window.location.href = "/auth/login";
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center bg-gradient-to-br from-blue-400 to-blue-600 p-4 font-sans">
      
      {/* Header Area */}
      <div className="text-center mt-12 mb-8 flex flex-col items-center gap-4">
        <h1 className="text-3xl font-extrabold text-white drop-shadow-md">
          Selamat Datang!
        </h1>
        
        {/* Tombol Merah (Keluar) - Pakai Emoji Power */}
        <button 
          onClick={handleLogout}
          title="Keluar ke Google"
          className="bg-red-600 text-white w-14 h-14 rounded-full shadow-lg hover:bg-red-700 active:scale-95 transition-all flex items-center justify-center text-2xl border-4 border-red-500/50"
        >
          ⏻
        </button>
      </div>

      {/* Main Game Menu Card */}
      <div className="bg-[#10141d] w-[90%] max-w-[500px] h-[60vh] rounded-3xl flex flex-col items-center justify-center p-8 shadow-2xl border border-white/10">
        
        <h2 className="text-3xl font-bold text-white mb-10 tracking-tight text-center">
          Choose Your Game
        </h2>

        {/* Game Buttons Container */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12 w-full justify-center items-center">
          
          {/* Tombol Game 1 (Oranye) */}
          <Link 
            href="/game-eek" 
            className="flex items-center gap-3 bg-orange-600 text-white px-8 py-3 rounded-xl shadow-md hover:bg-orange-700 transition-all font-bold active:scale-95"
          >
            Game EEK <span className="text-xl">💩</span>
          </Link>
          
          {/* Tombol Game 2 (Hijau) */}
          <Link 
            href="/poop-survivors" 
            className="flex items-center gap-3 bg-emerald-600 text-white px-8 py-3 rounded-xl shadow-md hover:bg-emerald-700 transition-all font-bold active:scale-95"
          >
            Poop Survivors <span className="text-xl">🧻</span>
          </Link>

        </div>

        {/* Footer Text */}
        <p className="text-slate-500 text-sm italic font-light text-center">
          Pick one to start playing and reduce lag!
        </p>
      </div>
    </main>
  );
}