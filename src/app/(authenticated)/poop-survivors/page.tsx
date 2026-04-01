"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ToiletPaper, ArrowLeft, Heart } from "lucide-react";

export default function PoopSurvivorsPage() {
  const [secondsSurvived, setSecondsSurvived] = useState(0);
  const [health, setHealth] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [dangerZone, setDangerZone] = useState({ top: '30%', left: '70%', active: false });

  // Inti Logika Game
  useEffect(() => {
    if (gameOver) return;

    // Timer Bertahan Hidup
    const survivalTimer = setInterval(() => {
      setSecondsSurvived(s => s + 1);
    }, 1000);

    // Bahaya muncul acak (Sederhana)
    const dangerTimer = setInterval(() => {
      setDangerZone({
        top: Math.random() * 80 + "%",
        left: Math.random() * 80 + "%",
        active: true
      });
      
      // Matikan bahaya setelah 2 detik
      setTimeout(() => setDangerZone(d => ({ ...d, active: false })), 2000);
      
      // Jika player 'berdiri' di zona bahaya saat aktif (sederhana: acak kena damage)
      if (Math.random() < 0.2) { // 20% peluang kena damage saat bahaya muncul
          setHealth(h => {
              if (h - 1 <= 0) {
                  setGameOver(true);
                  return 0;
              }
              return h - 1;
          });
      }

    }, 3500); // Bahaya muncul setiap 3.5 detik

    return () => {
      clearInterval(survivalTimer);
      clearInterval(dangerTimer);
    };
  }, [gameOver]);

  return (
    <main className="min-h-screen w-full bg-[#0a0c10] text-emerald-100 p-6 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-8 pb-4 border-b border-emerald-900/20">
        <Link href="/home" className="flex items-center gap-2 bg-emerald-950/20 hover:bg-emerald-950/40 text-emerald-300 px-4 py-2 rounded-lg transition border border-emerald-900/30">
          <ArrowLeft size={18} /> Menu Utama
        </Link>
        <div className="flex items-center gap-4 bg-[#11141e] px-6 py-2 rounded-full shadow-inner border border-emerald-900/10">
          <ToiletPaper className="text-emerald-500"/>
          <h1 className="text-xl font-bold tracking-tight">Poop Survivors</h1>
        </div>
      </div>

      {/* Game Content */}
      <div className="relative w-full max-w-5xl aspect-[16/9] bg-[#0d0f14] rounded-3xl overflow-hidden border-2 border-emerald-950 shadow-[0_0_60px_-15px_rgba(16,185,129,0.1)] p-6">
        
        {/* HUD (Health & Time) */}
        <div className="absolute top-6 left-6 flex items-center gap-10 bg-black/30 p-4 rounded-xl backdrop-blur-sm">
          <div className="text-center">
            <span className="text-xs text-emerald-500 uppercase font-medium">Time Survived</span>
            <div className="text-4xl font-black">{secondsSurvived}s</div>
          </div>
          <div className="w-px h-12 bg-emerald-900/40"></div>
          <div className="text-center">
             <span className="text-xs text-emerald-500 uppercase font-medium">Integrity</span>
             <div className="flex gap-2 mt-1">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Heart key={i} size={28} className={i < health ? "text-emerald-500 fill-emerald-500" : "text-slate-600"} />
                ))}
             </div>
          </div>
        </div>

        {/* Game State Overlay */}
        {gameOver && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-lg z-20">
                <h3 className="text-5xl font-black text-red-500 mb-6 tracking-tighter">GAME OVER</h3>
                <p className="text-emerald-200 text-2xl mb-10">You survived for {secondsSurvived} seconds.</p>
                <button onClick={() => window.location.reload()} className="bg-emerald-600 text-white px-8 py-3 rounded-lg text-lg font-bold shadow-lg hover:bg-emerald-700 transition">
                    Coba Lagi
                </button>
            </div>
        )}

        {/* Bahaya (Zona Merah) */}
        {dangerZone.active && !gameOver && (
            <div 
              style={{ top: dangerZone.top, left: dangerZone.left }}
              className="absolute w-24 h-24 bg-red-600/30 rounded-full border-2 border-red-500 shadow-2xl animate-pulse"
            ></div>
        )}
        
        <p className="absolute bottom-6 right-6 text-emerald-800 text-xs italic">
          Protokol survival: Hindari zona bahaya yang muncul acak!
        </p>

      </div>
    </main>
  );
}