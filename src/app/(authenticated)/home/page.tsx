"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Poop, ToiletPaper } from "lucide-react"; // Install if missing

export default function HomePage() {
  const router = useRouter();

  const handleLogout = () => {
    // 1. Logika Hapus Cache/Cookie Login
    // Ini harus disesuaikan dengan cara kamu menyimpan session.
    // Contoh untuk NextAuth, kamu panggil signOut().
    // Contoh hapus cookie manual:
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // (Atau pakai js-cookie library)

    // 2. Redirect ke Google
    // Menggunakan window.location.href agar benar-benar keluar dari app dan ke URL luar
    window.location.href = "https://www.google.com";
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center bg-gradient-to-br from-blue-400 to-blue-600 p-4">
      {/* Header Area */}
      <div className="text-center mt-12 mb-8 flex flex-col items-center gap-4">
        <h1 className="text-3xl font-extrabold text-white">Selamat Datang!</h1>
        
        {/* Tombol Merah (Keluar) */}
        <button 
          onClick={handleLogout}
          title="Keluar ke Google (Hapus Login Cache)"
          className="bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 active:scale-95 transition-all"
        >
          <LogOut size={24} />
        </button>
      </div>

      {/* Main Game Menu Card */}
      <div className="bg-[#10141d] w-[90%] max-w-[500px] h-[70vh] rounded-2xl flex flex-col items-center justify-center p-8 shadow-2xl border border-white/5">
        
        <h2 className="text-3xl font-bold text-white mb-10 tracking-tight">
          Choose Your Game
        </h2>

        {/* Game Buttons Container */}
        <div className="flex flex-wrap gap-4 mb-12 w-full justify-center">
          
          {/* Tombol Game 1 (Oranye) */}
          <Link href="/game-eek" className="flex items-center gap-2 bg-orange-600 text-white px-6 py-2.5 rounded-lg shadow-md hover:bg-orange-700 transition-colors font-medium">
            Game EEK <Poop size={20} className="text-orange-200"/>
          </Link>
          
          {/* Tombol Game 2 (Hijau) */}
          <Link href="/poop-survivors" className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-lg shadow-md hover:bg-emerald-700 transition-colors font-medium">
            Poop Survivors <ToiletPaper size={20} className="text-emerald-200"/>
          </Link>

        </div>

        {/* Footer Text */}
        <p className="text-slate-400 text-sm italic font-light">
          Pick one to start playing and reduce lag!
        </p>
      </div>
    </main>
  );
}