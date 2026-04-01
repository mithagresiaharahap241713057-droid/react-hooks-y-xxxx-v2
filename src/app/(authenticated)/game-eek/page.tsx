"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ToastContainer, toast } from 'react-toastify'; // Wajib Install: npm install react-toastify
import 'react-toastify/dist/ReactToastify.css';

// --- CONFIG GAME ---
const TARGETS_PER_LEVEL = [100, 300, 700, 1500, 3000, 6000, 12000, 25000, 50000, 100000]; // Target Poin Tiap Level

export default function GameEekEnhancedPage() {
  // --- STATE CORE GAME ---
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [power, setPower] = useState(1); // Default Klik: +1 Poin
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);

  // --- HARGA & STATUS UPGRADE ---
  const [costPower, setCostPower] = useState(10); // Harga Klik
  const [costAuto, setCostAuto] = useState(20);  // Harga Auto Klik
  const [costDouble, setCostDouble] = useState(50); // Harga Double Poin
  const [costX5, setCostX5] = useState(100);    // Harga x5 Poin

  const [activeAuto, setActiveAuto] = useState(0); // Poin per detik

  // --- LOGIKA PROGRESS BAR & TARGET ---
  const currentTarget = TARGETS_PER_LEVEL[level - 1] || 1000000; // Target level saat ini
  const progressPercentage = (score / currentTarget) * 100;

  // --- 1. Fungsi Klik Manual ---
  const handleMainClick = () => {
    if (isGameOver || isGameWon) return; // Mati kalau game selesai
    setScore((s) => s + power);
    // Notifikasi Poin Terapung (Opsional, tapi bikin seru)
    toast.info(`+${power} 💩`, { position: "top-right", autoClose: 500 });
  };

  // --- 2. Cek Logika Menang/Naik Level (Setiap Skor Berubah) ---
  useEffect(() => {
    if (score >= currentTarget && !isGameWon) {
      if (level < TARGETS_PER_LEVEL.length) {
        // Naik Level
        setLevel((l) => l + 1);
        toast.success(`LEVEL UP! 🎉 Target Level ${level + 1}: ${TARGETS_PER_LEVEL[level]} Poin`);
        setScore(0); // Reset Skor ke 0 untuk Level Baru (Biar menantang)
      } else {
        // MENANG GAME TOTAL
        setIsGameWon(true);
        toast.success("MENANG BESAR! 🏆 Kamu Penguasa EEK Sejati!", { autoClose: 10000 });
      }
    }
  }, [score, level, currentTarget, isGameWon]);

  // --- 3. Logika Auto Klik (Setiap Detik) ---
  useEffect(() => {
    if (activeAuto > 0 && !isGameOver && !isGameWon) {
      const interval = setInterval(() => {
        setScore((s) => s + activeAuto);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [activeAuto, isGameOver, isGameWon]);

  // --- FUNGSI BELI UPGRADE ---

  // Beli Upgrade Klik (+1 Power)
  const buyUpgradePower = () => {
    if (score >= costPower) {
      setScore((s) => s - costPower);
      setPower((p) => p + 1);
      setCostPower((c) => Math.ceil(c * 1.5)); // Harga Naik
      toast.info(`Klik Diupgrade! Power sekarang ${power + 1}`);
    } else {
      toast.error("Poin tidak cukup!", { position: "top-center" });
    }
  };

  // Beli Auto Klik (+1 Poin/s)
  const buyUpgradeAuto = () => {
    if (score >= costAuto) {
      setScore((s) => s - costAuto);
      setActiveAuto((a) => a + 1);
      setCostAuto((c) => Math.ceil(c * 2)); // Harga Naik
      toast.info(`Auto Klik Aktif! +${activeAuto + 1}/s`);
    } else {
      toast.error("Poin tidak cukup!", { position: "top-center" });
    }
  };

  // Beli Double Poin (Hanya sekali beli, jadi +2 Power sekaligus)
  const buyUpgradeDouble = () => {
    if (score >= costDouble) {
      setScore((s) => s - costDouble);
      setPower((p) => p * 2);
      setCostDouble((c) => Math.ceil(c * 5)); // Harga Naik Gila-gilaan
      toast.success("DOUBLE POIN! Klik kamu 2x lebih kuat!");
    } else {
      toast.error("Poin tidak cukup!", { position: "top-center" });
    }
  };

  // Beli x5 Poin (Hanya sekali beli)
  const buyUpgradex5 = () => {
    if (score >= costX5) {
      setScore((s) => s - costX5);
      setPower((p) => p * 5);
      setCostX5((c) => Math.ceil(c * 10)); // Harga Naik Sangat Gila
      toast.success("X5 POIN! Klik kamu 5x lebih kuat!");
    } else {
      toast.error("Poin tidak cukup!", { position: "top-center" });
    }
  };

  // Fungsi Reset Game (Untuk Menang/Kalah)
  const resetGame = () => {
    setScore(0);
    setLevel(1);
    setPower(1);
    setIsGameOver(false);
    setIsGameWon(false);
    setCostPower(10);
    setCostAuto(20);
    setActiveAuto(0);
  };

  return (
    // Background Gelap Utama
    <main className="min-h-screen w-full bg-[#0a0e17] text-white p-4 md:p-10 flex flex-col items-center font-sans">
      
      {/* Container Toast untuk Notifikasi */}
      <ToastContainer position="top-right" autoClose={1500} theme="dark" />

      {/* --- KARTU GAME UTAMA (Oranye) --- */}
      <div className="bg-[#f07c00] w-full max-w-[650px] rounded-[40px] p-8 md:p-12 shadow-[0_25px_80px_-20px_rgba(240,124,0,0.4)] flex flex-col items-center border-4 border-[#ff9500]/70">
        
        {/* Header Title */}
        <h1 className="text-4xl md:text-6xl font-black text-[#ffee00] mb-3 tracking-tighter drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)]">
          Game EEK <span className="text-5xl">💩</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-white text-base md:text-xl italic font-semibold mb-10 drop-shadow-sm text-center">
          Sentuh untuk Eek <span className="text-sm">💩</span> sebanyak mungkin & Capai Target!
        </p>

        {/* Pemisah Line */}
        <div className="w-full h-px bg-white/40 mb-10 shadow-lg"></div>

        {/* --- AREA SKOR & LEVEL (Box Kuning-Kuning Sesuai Gambar) --- */}
        <div className="bg-[#ff9500] w-full rounded-3xl p-6 mb-12 shadow-[inner_0_10px_20px_rgba(0,0,0,0.1)] border-4 border-[#ffee00]/50 relative">
          
          {/* Teks Skor & Level */}
          <div className="flex justify-center items-baseline gap-2 mb-4">
            <span className="text-white text-3xl font-extrabold tracking-tight">Skor:</span>
            <span className="text-[#ffee00] text-6xl font-black drop-shadow-[0_4px_0px_rgba(0,0,0,0.3)]">
              {score}
            </span>
            <span className="text-white text-2xl font-bold ml-4">Level:</span>
            <span className="text-[#ffee00] text-5xl font-black drop-shadow-[0_4px_0px_rgba(0,0,0,0.3)]">
              {level}
            </span>
          </div>
          
          {/* Label Target Poin */}
          <div className="text-center text-[#ffffee] text-sm font-bold mb-2">
            Target Level {level}: <span className="text-[#ffee00] font-black">{currentTarget}</span> Poin
          </div>

          {/* Progress Bar Kuning di dalam kotak kuning */}
          <div className="w-full h-8 bg-[#1a2233] rounded-full overflow-hidden shadow-inner border-2 border-black/20 relative">
            {/* Bagian Kuning yang Mengisi */}
            <div 
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              className="absolute inset-0 bg-[#ffee00] rounded-full transition-all duration-300 ease-out shadow-[0_0_15px_rgba(255,238,0,0.7)]"
            ></div>
          </div>
        </div>

        {/* --- HALAMAN AKHIR (Menang/Kalah) --- */}
        {isGameWon && (
            <div className="w-full bg-[#1e293b]/90 rounded-3xl p-10 flex flex-col items-center mb-10 backdrop-blur-sm border-2 border-emerald-500 animate-pulse-slow">
                <h3 className="text-5xl font-black text-emerald-400 mb-2">MENANG BESAR! 🏆</h3>
                <p className="text-xl text-emerald-100 mb-8">Kamu telah mengumpulkan semua Eek!</p>
                <button onClick={resetGame} className="bg-emerald-600 text-white px-10 py-3 rounded-xl font-bold hover:bg-emerald-500 transition-all shadow-lg active:scale-95">Main Lagi</button>
            </div>
        )}
        
        {!isGameWon && isGameOver && (
             <div className="w-full bg-[#1e293b]/90 rounded-3xl p-10 flex flex-col items-center mb-10 backdrop-blur-sm border-2 border-red-500">
                <h3 className="text-5xl font-black text-red-400 mb-2">WAKTU HABIS! ⌛</h3>
                <p className="text-xl text-red-100 mb-8">Poin kamu belum cukup untuk level ini.</p>
                <button onClick={resetGame} className="bg-red-600 text-white px-10 py-3 rounded-xl font-bold hover:bg-red-500 transition-all shadow-lg active:scale-95">Coba Lagi</button>
            </div>
        )}

        {/* --- TOMBOL KLIK UTAMA (Si Eek Besar) - Mati kalau game selesai --- */}
        <button 
          onClick={handleMainClick}
          disabled={isGameOver || isGameWon}
          className={`w-full aspect-[21/9] rounded-full mb-12 flex items-center justify-center border-8 border-[#ffee00] shadow-[0_15px_60px_-10px_rgba(255,238,0,0.3)] group 
            ${isGameOver || isGameWon 
              ? 'bg-[#ccb300] border-gray-400/50 cursor-not-allowed' 
              : 'bg-[#ff9500] hover:scale-[1.04] active:scale-[0.98] active:bg-[#ffb300] transition-all duration-150'
            }`}
        >
          <span className={`text-9xl md:text-[140px] transition-transform group-hover:rotate-12 group-active:-rotate-12 ${isGameOver || isGameWon ? 'opacity-30' : ''}`}>
            💩
          </span>
        </button>

        {/* --- AREA TOMBOL UPGRADE Sesuai Gambar 1 --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full mb-10">
          
          {/* Upgrade Klik (+1) - Sesuai Gambar 1 */}
          <button 
            onClick={buyUpgradePower}
            disabled={isGameOver || isGameWon || score < costPower}
            className={`flex items-center justify-center gap-3 py-4 md:py-5 rounded-xl font-extrabold text-xl shadow-md transition-all border-4 
              ${score >= costPower && !isGameOver && !isGameWon
                ? 'bg-[#ffee00] text-[#805000] border-[#ccb300] hover:bg-white active:scale-95' 
                : 'bg-white/30 text-white/50 border-white/10 cursor-not-allowed'
              }`}
          >
            <span className="text-3xl">⊕</span> Upgrade Klik ( 💩 {costPower} )
          </button>
          
          {/* Auto Klik (+1/s) - Sesuai Gambar 1 */}
          <button 
            onClick={buyUpgradeAuto}
            disabled={isGameOver || isGameWon || score < costAuto}
            className={`flex items-center justify-center gap-3 py-4 md:py-5 rounded-xl font-extrabold text-xl shadow-md transition-all border-4
              ${score >= costAuto && !isGameOver && !isGameWon
                ? 'bg-[#ffee00] text-[#805000] border-[#ccb300] hover:bg-white active:scale-95' 
                : 'bg-white/30 text-white/50 border-white/10 cursor-not-allowed'
              }`}
          >
            <span className="text-3xl">🆙</span> Auto Klik ( 💩 {costAuto} )
          </button>

          {/* Double Poin (Hanya sekali beli, jadi +2 Power sekaligus) - Sesuai Gambar 1 */}
          <button 
            onClick={buyUpgradeDouble}
            disabled={isGameOver || isGameWon || score < costDouble}
            className={`flex items-center justify-center gap-3 py-4 md:py-5 rounded-xl font-extrabold text-xl shadow-md transition-all border-4 
              ${score >= costDouble && !isGameOver && !isGameWon
                ? 'bg-[#ffee00] text-[#805000] border-[#ccb300] hover:bg-white active:scale-95' 
                : 'bg-white/30 text-white/50 border-white/10 cursor-not-allowed'
              }`}
          >
            <span className="text-3xl">⊗</span> Double Poin ( 💩 {costDouble} )
          </button>
          
          {/* x5 Poin (Hanya sekali beli) - Sesuai Gambar 1 */}
          <button 
            onClick={buyUpgradex5}
            disabled={isGameOver || isGameWon || score < costX5}
            className={`flex items-center justify-center gap-3 py-4 md:py-5 rounded-xl font-extrabold text-xl shadow-md transition-all border-4 
              ${score >= costX5 && !isGameOver && !isGameWon
                ? 'bg-[#ffee00] text-[#805000] border-[#ccb300] hover:bg-white active:scale-95' 
                : 'bg-white/30 text-white/50 border-white/10 cursor-not-allowed'
              }`}
          >
            <span className="text-3xl">✖</span> x5 Poin ( 💩 {costX5} )
          </button>

        </div>

        {/* --- TOMBOL BACK TO MENU (Sesuai Gambar 1) --- */}
        <Link href="/home" className="bg-[#334155] text-white px-12 py-4 rounded-xl font-bold text-xl hover:bg-[#1e293b] transition-all shadow-lg active:scale-95 border-2 border-white/10">
          Back to Game Selection
        </Link>

      </div>
    </main>
  );
}