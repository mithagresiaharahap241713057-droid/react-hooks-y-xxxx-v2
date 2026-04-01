"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

// Konfigurasi Game (biar gampang diedit)
const POINTS_PER_LEVEL = 100; // Berapa poin biar naik level

export default function GameEekPage() {
  // --- GAME STATE ---
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [pointsPerClick, setPointsPerClick] = useState(1); // Default 1 klik = 1 poin
  const [autoClickSpeed, setAutoClickSpeed] = useState(0); // Poin per detik (default 0)

  // --- HARGA UPGRADE ---
  const [costUpgradeKlik, setCostUpgradeKlik] = useState(10);
  const [costAutoKlik, setCostAutoKlik] = useState(20);

  // --- LOGIKA UTAMA ---

  // 1. Fungsi Klik Manual (Si EEK Besar)
  const handleMainClick = () => {
    setScore((s) => s + pointsPerClick);
  };

  // 2. Efek untuk Cek Kenaikan Level (setiap skor berubah)
  useEffect(() => {
    // Level = (Poin total / Poin per level) + 1, dibulatkan ke bawah
    const calculatedLevel = Math.floor(score / POINTS_PER_LEVEL) + 1;
    if (calculatedLevel > level) {
      setLevel(calculatedLevel);
      // Opsional: Kasih bonus poin setiap naik level
      // setScore(s => s + (calculatedLevel * 10)); 
    }
  }, [score, level]);

  // 3. Efek untuk Auto Klik (setiap autoClickSpeed berubah)
  useEffect(() => {
    if (autoClickSpeed > 0) {
      // Jalankan interval setiap 1 detik
      const interval = setInterval(() => {
        setScore((s) => s + autoClickSpeed);
      }, 1000);

      // Bersihkan interval kalau komponen di-unmount atau speed berubah
      return () => clearInterval(interval);
    }
  }, [autoClickSpeed]);

  // --- FUNGSI BELI UPGRADE ---

  // Beli "+1 Upgrade Klik"
  const buyUpgradeKlik = () => {
    if (score >= costUpgradeKlik) {
      setScore((s) => s - costUpgradeKlik); // Bayar
      setPointsPerClick((p) => p + 1); // Efek
      setCostUpgradeKlik((c) => Math.ceil(c * 1.5)); // Harga naik 50%
    } else {
      alert("Skor kamu belum cukup!");
    }
  };

  // Beli "+1 Auto Klik" (per detik)
  const buyAutoKlik = () => {
    if (score >= costAutoKlik) {
      setScore((s) => s - costAutoKlik); // Bayar
      setAutoClickSpeed((a) => a + 1); // Efek
      setCostAutoKlik((c) => Math.ceil(c * 2)); // Harga naik 100%
    } else {
      alert("Skor kamu belum cukup!");
    }
  };

  // --- HITUNG PROGRESS BAR ---
  // Berapa poin yang sudah dikumpul DI LEVEL INI
  const pointsInCurrentLevel = score % POINTS_PER_LEVEL;
  // Persentase progress (0 - 100)
  const progressPercentage = (pointsInCurrentLevel / POINTS_PER_LEVEL) * 100;

  return (
    // Background Gelap Utama
    <main className="min-h-screen w-full bg-[#0a0e17] text-white p-4 md:p-10 flex flex-col items-center font-sans">
      
      {/* --- KARTU GAME UTAMA (Oranye) --- */}
      <div className="bg-[#f07c00] w-full max-w-[600px] rounded-[40px] p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(240,124,0,0.3)] flex flex-col items-center border-4 border-[#ff9500]/50">
        
        {/* Header Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#ffee00] mb-3 tracking-tight drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
          Game EEK <span className="text-4xl">💩</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-white text-base md:text-lg italic font-medium mb-10 drop-shadow-sm text-center">
          Sentuh untuk Eek <span className="text-sm">💩</span> sebanyak mungkin!
        </p>

        {/* Pemisah Line */}
        <div className="w-full h-px bg-white/30 mb-10"></div>

        {/* --- AREA SKOR & LEVEL (Box Kuning Kuning) --- */}
        <div className="bg-[#ff9500] w-full rounded-3xl p-6 mb-10 shadow-inner border-2 border-[#ffb300]">
          
          {/* Teks Skor & Level */}
          <div className="flex justify-center items-baseline gap-2 mb-4">
            <span className="text-white text-2xl font-bold">Skor:</span>
            <span className="text-[#ffee00] text-4xl font-black drop-shadow-[0_2px_0px_rgba(0,0,0,0.2)]">
              {score}
            </span>
            <span className="text-white text-2xl font-bold ml-3">Level:</span>
            <span className="text-[#ffee00] text-4xl font-black drop-shadow-[0_2px_0px_rgba(0,0,0,0.2)]">
              {level}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-6 bg-[#1a2233] rounded-full overflow-hidden shadow-md border border-black/20 relative">
            {/* Bagian Kuning yang Mengisi */}
            <div 
              style={{ width: `${progressPercentage}%` }}
              className="absolute inset-0 bg-[#ffee00] rounded-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(255,238,0,0.5)]"
            ></div>
          </div>
        </div>

        {/* --- TOMBOL KLIK UTAMA (Si Eek Besar) --- */}
        <button 
          onClick={handleMainClick}
          className="w-full aspect-[21/9] bg-[#ff9500] rounded-full mb-12 flex items-center justify-center border-4 border-[#ffee00] shadow-xl hover:scale-[1.03] active:scale-[0.98] active:bg-[#ffb300] transition-all duration-150 group"
        >
          <span className="text-8xl md:text-9xl transition-transform group-hover:rotate-12 group-active:-rotate-12">
            💩
          </span>
        </button>

        {/* --- AREA TOMBOL UPGRADE --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full mb-10">
          
          {/* Upgrade Klik (+1) */}
          <button 
            onClick={buyUpgradeKlik}
            disabled={score < costUpgradeKlik}
            className={`flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg shadow-md transition-all border-2 
              ${score >= costUpgradeKlik 
                ? 'bg-[#ffee00] text-[#805000] border-[#ccb300] hover:bg-white active:scale-95' 
                : 'bg-white/30 text-white/60 border-white/10 cursor-not-allowed'
              }`}
          >
            <span className="text-2xl">⊕</span> Upgrade Klik ( 💩 {costUpgradeKlik} )
          </button>
          
          {/* Auto Klik (+1/s) */}
          <button 
            onClick={buyAutoKlik}
            disabled={score < costAutoKlik}
            className={`flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg shadow-md transition-all border-2
              ${score >= costAutoKlik 
                ? 'bg-[#ffee00] text-[#805000] border-[#ccb300] hover:bg-white active:scale-95' 
                : 'bg-white/30 text-white/60 border-white/10 cursor-not-allowed'
              }`}
          >
            <span className="text-2xl">🆙</span> Auto Klik ( 💩 {costAutoKlik} )
          </button>

          {/* Tombol Dummy (mati sesuai gambar kamu) */}
          <button disabled className="bg-white/30 text-white/60 py-4 rounded-xl font-bold border-2 border-white/10 cursor-not-allowed opacity-70">
            ⊕ Double Poin ( 💩 50 )
          </button>
          <button disabled className="bg-white/30 text-white/60 py-4 rounded-xl font-bold border-2 border-white/10 cursor-not-allowed opacity-70">
            ⊕ x5 Poin ( 💩 100 )
          </button>

        </div>

        {/* --- TOMBOL BACK TO MENU --- */}
        <Link href="/home" className="bg-[#334155] text-white px-10 py-3 rounded-xl font-semibold text-lg hover:bg-[#1e293b] transition-colors shadow-md active:scale-95">
          Back to Game Selection
        </Link>

      </div>
    </main>
  );
}