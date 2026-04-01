"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function GameEekPage() {
  const [score, setScore] = useState(0);
  const [targetPosition, setTargetPosition] = useState({ top: '50%', left: '50%' });
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const moveTarget = () => {
    if (!gameAreaRef.current) return;
    const { offsetWidth, offsetHeight } = gameAreaRef.current;
    const newTop = Math.random() * (offsetHeight - 60) + "px";
    const newLeft = Math.random() * (offsetWidth - 60) + "px";
    setTargetPosition({ top: newTop, left: newLeft });
  };

  const handleTargetClick = () => {
    setScore(s => s + 10);
    moveTarget();
  };

  useEffect(() => {
    const timer = setInterval(moveTarget, 1500);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen w-full bg-[#1a1f2e] text-white p-6 flex flex-col items-center font-sans">
      <div className="w-full max-w-5xl flex items-center justify-between mb-8 pb-4 border-b border-white/10">
        <Link href="/home" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg transition border border-white/10">
          <span>←</span> Menu Utama
        </Link>
        <div className="flex items-center gap-4 bg-[#252a3a] px-6 py-2 rounded-full shadow-inner border border-white/5">
          <span className="text-xl">💩</span>
          <h1 className="text-xl font-bold uppercase tracking-wider">Game EEK</h1>
          <span className="text-2xl font-black text-orange-400">{score}</span>
        </div>
      </div>

      <div ref={gameAreaRef} className="relative w-full max-w-5xl aspect-[16/9] bg-[#11141e] rounded-3xl overflow-hidden border-2 border-orange-900/50 shadow-2xl">
        <button
          onClick={handleTargetClick}
          style={{ top: targetPosition.top, left: targetPosition.left }}
          className="absolute w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center text-3xl shadow-lg hover:scale-110 active:scale-95 transition-transform duration-150"
        >
          💩
        </button>
      </div>
    </main>
  );
}