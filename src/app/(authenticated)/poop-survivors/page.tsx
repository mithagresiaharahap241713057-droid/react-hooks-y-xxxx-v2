"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function PoopSurvivorsPage() {
  const [secondsSurvived, setSecondsSurvived] = useState(0);
  const [health, setHealth] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [dangerZone, setDangerZone] = useState({ top: '30%', left: '70%', active: false });

  useEffect(() => {
    if (gameOver) return;
    const survivalTimer = setInterval(() => setSecondsSurvived(s => s + 1), 1000);
    const dangerTimer = setInterval(() => {
      setDangerZone({ top: Math.random() * 80 + "%", left: Math.random() * 80 + "%", active: true });
      setTimeout(() => setDangerZone(d => ({ ...d, active: false })), 2000);
      if (Math.random() < 0.2) {
          setHealth(h => {
              if (h - 1 <= 0) { setGameOver(true); return 0; }
              return h - 1;
          });
      }
    }, 3500);
    return () => { clearInterval(survivalTimer); clearInterval(dangerTimer); };
  }, [gameOver]);

  return (
    <main className="min-h-screen w-full bg-[#0a0c10] text-emerald-100 p-6 flex flex-col items-center font-sans">
      <div className="w-full max-w-5xl flex items-center justify-between mb-8 pb-4 border-b border-emerald-900/20">
        <Link href="/home" className="flex items-center gap-2 bg-emerald-950/20 hover:bg-emerald-950/40 text-emerald-300 px-4 py-2 rounded-lg transition border border-emerald-900/30">
          <span>←</span> Menu Utama
        </Link>
        <div className="flex items-center gap-4 bg-[#11141e] px-6 py-2 rounded-full border border-emerald-900/20">
          <span>🧻</span>
          <h1 className="text-xl font-bold tracking-tight">Poop Survivors</h1>
        </div>
      </div>

      <div className="relative w-full max-w-5xl aspect-[16/9] bg-[#0d0f14] rounded-3xl overflow-hidden border-2 border-emerald-950 shadow-2xl p-6">
        <div className="absolute top-6 left-6 flex items-center gap-10 bg-black/40 p-4 rounded-xl backdrop-blur-md border border-white/5">
          <div className="text-center">
            <span className="text-[10px] text-emerald-500 uppercase font-bold tracking-widest">Time</span>
            <div className="text-3xl font-black">{secondsSurvived}s</div>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className={`text-2xl ${i < health ? "opacity-100" : "opacity-20 grayscale"}`}>❤️</span>
            ))}
          </div>
        </div>

        {gameOver && (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
                <h3 className="text-6xl font-black text-red-600 mb-2">GAME OVER</h3>
                <p className="text-xl mb-8">Survived: {secondsSurvived}s</p>
                <button onClick={() => window.location.reload()} className="bg-emerald-600 text-white px-10 py-3 rounded-full font-bold hover:bg-emerald-500 transition-all shadow-lg">Retry</button>
            </div>
        )}

        {dangerZone.active && !gameOver && (
            <div style={{ top: dangerZone.top, left: dangerZone.left }} className="absolute w-32 h-32 bg-red-600/20 rounded-full border-4 border-red-600/50 animate-ping"></div>
        )}
      </div>
    </main>
  );
}