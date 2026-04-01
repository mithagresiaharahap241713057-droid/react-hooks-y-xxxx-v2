"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Poop, ArrowLeft } from "lucide-react";

export default function GameEekPage() {
  const [score, setScore] = useState(0);
  const [targetPosition, setTargetPosition] = useState({ top: '50%', left: '50%' });
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const moveTarget = () => {
    if (!gameAreaRef.current) return;
    const { offsetWidth, offsetHeight } = gameAreaRef.current;
    
    // Hitung posisi acak di dalam area game (dikurangi ukuran target)
    const newTop = Math.random() * (offsetHeight - 60) + "px";
    const newLeft = Math.random() * (offsetWidth - 60) + "px";
    setTargetPosition({ top: newTop, left: newLeft });
  };

  const handleTargetClick = () => {
    setScore(s => s + 10);
    moveTarget();
  };

  // Pindahkan target setiap 1.5 detik jika tidak diklik
  useEffect(() => {
    const timer = setInterval(moveTarget, 1500);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen w-full bg-[#1a1f2e] text-white p-6 flex flex-col items-center">
      {/* Header & Score */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-8 pb-4 border-b border-white/10">
        <Link href="/home" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg transition">
          <ArrowLeft size={18} /> Menu Utama
        </Link>
        <div className="flex items-center gap-4 bg-[#252a3a] px-6 py-2 rounded-full shadow-inner border border-white/5">
          <Poop className="text-orange-500"/>
          <h1 className="text-xl font-bold">Game EEK: Klik Target</h1>
          <span className="text-2xl font-black text-orange-400">{score}</span>
        </div>
      </div>

      {/* Game Area */}
      <div ref={gameAreaRef} className="relative w-full max-w-5xl aspect-[16/9] bg-[#11141e] rounded-3xl overflow-hidden border-2 border-orange-900/50 shadow-2xl p-4">
        <p className="absolute top-4 right-4 text-slate-600 text-xs italic">
          Kekacauan yang mulia... Klik yang oranye!
        </p>
        
        {/* Target yang Bisa Diklik */}
        <button
          onClick={handleTargetClick}
          style={targetPosition}
          className="absolute w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center text-white text-3xl shadow-lg hover:scale-110 active:scale-95 transition-transform duration-150 ease-out"
        >
          💩
        </button>
      </div>

      <div className="mt-8 text-center text-slate-400">
        Instruksi: Klik pada 💩 secepat mungkin. Posisi berubah setiap klik atau setiap 1.5 detik.
      </div>
    </main>
  );
}