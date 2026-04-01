"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

// Konfigurasi Game (biar gampang diedit)
const GAME_AREA_WIDTH = 550; // Lebar area game (px)
const GAME_AREA_HEIGHT = 280; // Tinggi area game (px)
const PLAYER_SIZE = 30;       // Ukuran player (px)
const GOAL_SIZE = 40;         // Ukuran target tisu (px)
const DAMAGE_ZONE_INCREMENT = 10; // Berapa px damage zone meluas tiap interval

export default function PoopSurvivorsPage() {
  // --- GAME STATE ---
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [level, setLevel] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameRunning, setIsGameRunning] = useState(false);

  // Posisi Player & Tisu
  const [playerPosition, setPlayerPosition] = useState({ x: 20, y: 20 });
  const [goalPosition, setGoalPosition] = useState({ x: 400, y: 150 });

  // Damage Zone (Area Orens Tua)
  const [damageZoneSize, setDamageZoneSize] = useState(0); 

  const gameAreaRef = useRef<HTMLDivElement>(null);

  // --- LOGIKA UTAMA ---

  // 1. Fungsi Gerakkan Target Tisu (setiap poin bertambah)
  const moveGoal = () => {
    // Hitung posisi acak di dalam area game (dikurangi ukuran target)
    const newX = Math.random() * (GAME_AREA_WIDTH - GOAL_SIZE);
    const newY = Math.random() * (GAME_AREA_HEIGHT - GOAL_SIZE);
    setGoalPosition({ x: newX, y: newY });
  };

  // 2. Efek untuk Mendeteksi Input Key (WASD)
  useEffect(() => {
    if (!isGameRunning || isGameOver) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      let nextX = playerPosition.x;
      let nextY = playerPosition.y;

      if (e.key === "w" || e.key === "W" || e.key === "ArrowUp") nextY -= PLAYER_SIZE;
      if (e.key === "s" || e.key === "S" || e.key === "ArrowDown") nextY += PLAYER_SIZE;
      if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft") nextX -= PLAYER_SIZE;
      if (e.key === "d" || e.key === "D" || e.key === "ArrowRight") nextX += PLAYER_SIZE;

      // Cek Batasan Area (tidak boleh keluar)
      nextX = Math.max(0, Math.min(nextX, GAME_AREA_WIDTH - PLAYER_SIZE));
      nextY = Math.max(0, Math.min(nextY, GAME_AREA_HEIGHT - PLAYER_SIZE));

      // Cek Tabrakan dengan Target Tisu
      const playerCenterX = nextX + PLAYER_SIZE / 2;
      const playerCenterY = nextY + PLAYER_SIZE / 2;
      const goalCenterX = goalPosition.x + GOAL_SIZE / 2;
      const goalCenterY = goalPosition.y + GOAL_SIZE / 2;

      // Jarak Euclidean (sederhana)
      const distance = Math.sqrt(
        Math.pow(playerCenterX - goalCenterX, 2) + Math.pow(playerCenterY - goalCenterY, 2)
      );

      // Jika menyentuh target
      if (distance < (PLAYER_SIZE + GOAL_SIZE) / 2) {
        setScore((s) => s + 10);
        moveGoal(); // Pindahkan tisu
        setDamageZoneSize(0); // Reset area damage zone
      } else {
        setPlayerPosition({ x: nextX, y: nextY });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.addEventListener("keydown", handleKeyDown);
  }, [playerPosition, goalPosition, isGameRunning, isGameOver]);

  // 3. Efek untuk Mekanisme Damage Zone & Kenaikan Level (per detik)
  useEffect(() => {
    if (!isGameRunning || isGameOver) return;

    // Interval Damage Zone (meluas terus)
    const damageZoneInterval = setInterval(() => {
      setDamageZoneSize((s) => s + DAMAGE_ZONE_INCREMENT);
    }, 200); // Meluas tiap 0.2 detik

    // Interval Cek Health (per detik)
    const gameTickInterval = setInterval(() => {
      // Cek Level Up (misal tiap 10 detik/100 poin)
      if (score > 0 && score % 100 === 0 && damageZoneSize === 0) {
          setLevel(l => l + 1);
          // Tambah health dikit
          setHealth(h => Math.min(100, h + 10));
      }

      // Cek Kena Damage (jika di dalam zone orens tua)
      // Zona berbahaya dihitung dari radius/size
      const playerCenterX = playerPosition.x + PLAYER_SIZE / 2;
      const playerCenterY = playerPosition.y + PLAYER_SIZE / 2;
      const zoneCenterX = GAME_AREA_WIDTH / 2;
      const zoneCenterY = GAME_AREA_HEIGHT / 2;

      const distanceToCenter = Math.sqrt(
          Math.pow(playerCenterX - zoneCenterX, 2) + Math.pow(playerCenterY - zoneCenterY, 2)
      );

      // Sederhananya, jika damageZoneSize meluas mencapai player
      if (damageZoneSize > 0 && damageZoneSize * 2 > Math.min(GAME_AREA_WIDTH, GAME_AREA_HEIGHT) - distanceToCenter) {
          setHealth(h => {
              const newHealth = h - (level * 2); // Damage naik per level
              if (newHealth <= 0) {
                  setIsGameOver(true);
                  return 0;
              }
              return newHealth;
          });
      }

    }, 1000);

    return () => {
      clearInterval(damageZoneInterval);
      clearInterval(gameTickInterval);
    };
  }, [isGameRunning, isGameOver, playerPosition, level, score, damageZoneSize]);

  // --- FUNGSI START & RESET GAME ---
  const startGame = () => {
    setScore(0);
    setHealth(100);
    setLevel(1);
    setIsGameOver(false);
    setPlayerPosition({ x: 20, y: 20 });
    moveGoal();
    setDamageZoneSize(0);
    setIsGameRunning(true);
  };

  return (
    // Background Gelap Utama
    <main className="min-h-screen w-full bg-[#0a0e17] text-white p-4 md:p-10 flex flex-col items-center font-sans">
      
      {/* --- KARTU GAME UTAMA (Oranye-Kuning) --- */}
      <div className="bg-[#f07c00] w-full max-w-[650px] rounded-[40px] p-8 md:p-12 shadow-[0_25px_80px_-20px_rgba(240,124,0,0.4)] flex flex-col items-center border-4 border-[#ff9500]/70">
        
        {/* Header Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#ffee00] mb-3 tracking-tighter drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
          Poop Survivors <span className="text-4xl">🧻</span>
        </h1>
        
        {/* Subtitle / Instruksi */}
        <p className="text-white text-base md:text-lg italic font-medium mb-10 drop-shadow-sm text-center">
          Jangkau tisu 🧻 secepat mungkin. Hindari "Tumpukan Eek" 💩 yang terus meluas!
        </p>

        {/* Pemisah Line */}
        <div className="w-full h-px bg-white/30 mb-10 shadow-lg"></div>

        {/* --- AREA HUD: HEALTH & SCORE (Box Kuning Kuning) --- */}
        <div className="bg-[#ff9500] w-full rounded-3xl p-6 mb-10 shadow-[inner_0_10px_20px_rgba(0,0,0,0.1)] border-2 border-[#ffb300]">
          
          <div className="flex justify-between items-center px-4">
              <div className="text-center">
                <span className="text-white text-xl font-bold uppercase tracking-wide">Health</span>
                <div className={`text-4xl md:text-5xl font-black drop-shadow-[0_2px_0px_rgba(0,0,0,0.2)] 
                  ${health > 50 ? 'text-[#ffee00]' : health > 20 ? 'text-white' : 'text-red-600 animate-pulse'}`}>
                  {health}
                </div>
              </div>

              <div className="text-center">
                 <span className="text-white text-xl font-bold uppercase tracking-wide">Level</span>
                 <div className="text-4xl md:text-5xl text-[#ffee00] font-black drop-shadow-[0_2px_0px_rgba(0,0,0,0.2)]">{level}</div>
              </div>

              <div className="text-center">
                <span className="text-white text-xl font-bold uppercase tracking-wide">Skor</span>
                <div className="text-4xl md:text-5xl text-[#ffee00] font-black drop-shadow-[0_2px_0px_rgba(0,0,0,0.2)]">
                  {score}
                </div>
              </div>
          </div>
        </div>

        {/* --- AREA GAME UTAMA (SURVIVOR) --- */}
        <div ref={gameAreaRef} className="relative bg-[#11141e] rounded-3xl mb-12 shadow-inner border-2 border-orange-900/50" 
             style={{ width: `${GAME_AREA_WIDTH}px`, height: `${GAME_AREA_HEIGHT}px` }}>
            
            {/* Overlay Game Over / Start */}
            {!isGameRunning && (
                <div className="absolute inset-0 bg-[#0a0e17]/90 rounded-3xl flex flex-col items-center justify-center backdrop-blur-sm z-30">
                    <button onClick={startGame} className="bg-[#ff9500] text-white px-12 py-4 rounded-xl font-bold text-2xl border-4 border-[#ffee00] shadow-lg hover:scale-[1.03] active:scale-[0.98] transition-all">
                        {isGameOver ? 'Main Lagi' : 'Start Survival'}
                    </button>
                    <p className="text-slate-500 text-sm mt-4 font-mono">Gunakan WASD untuk bergerak</p>
                </div>
            )}
            
            {isGameOver && (
                <div className="absolute inset-0 bg-red-950/80 rounded-3xl flex flex-col items-center justify-center backdrop-blur-sm z-20">
                    <h3 className="text-5xl font-black text-red-500 mb-6 tracking-tighter">GAME OVER</h3>
                    <p className="text-xl text-white/80 mb-8">Poin Tisu yang kamu kumpul: <span className="text-2xl font-bold text-[#ffee00]">{score}</span></p>
                </div>
            )}

            {/* Damage Zone (Area Orens Tua - meluas dari tengah) */}
            <div 
              style={{
                  width: `${damageZoneSize * 2}px`, 
                  height: `${damageZoneSize * 2}px`,
                  left: `${GAME_AREA_WIDTH / 2 - damageZoneSize}px`,
                  top: `${GAME_AREA_HEIGHT / 2 - damageZoneSize}px`,
                  borderRadius: '50%'
              }}
              className="absolute bg-[#e65c00] border-4 border-[#ff9500] shadow-[0_0_20px_#f07c00] opacity-80"
            ></div>

            {/* Player (Orens Terang - WASD) */}
            <div 
              style={{ 
                  left: `${playerPosition.x}px`, 
                  top: `${playerPosition.y}px`, 
                  width: `${PLAYER_SIZE}px`, 
                  height: `${PLAYER_SIZE}px`,
                  borderRadius: '50%'
              }}
              className="absolute bg-[#ff9500] border-2 border-white/50 shadow-xl flex items-center justify-center text-xl z-10 transition-all duration-100 ease-linear"
            >
              💩
            </div>
            
            {/* Target Tisu (Kuning) */}
            <div 
              style={{ 
                  left: `${goalPosition.x}px`, 
                  top: `${goalPosition.y}px`, 
                  width: `${GOAL_SIZE}px`, 
                  height: `${GOAL_SIZE}px`,
                  borderRadius: '10%'
              }}
              className="absolute bg-[#ffee00] border-4 border-orange-900 shadow-xl flex items-center justify-center text-2xl z-10"
            >
              🧻
            </div>

            <p className="absolute bottom-4 right-4 text-slate-600 text-[10px] italic">
              Gerak terus! Jauhi area oranye tua di tengah.
            </p>
        </div>

        {/* --- TOMBOL BACK TO MENU --- */}
        <Link href="/home" className="bg-[#334155] text-white px-10 py-3 rounded-xl font-semibold text-lg hover:bg-[#1e293b] transition-colors shadow-md active:scale-95 border-2 border-white/10">
          Back to Game Selection
        </Link>

      </div>
    </main>
  );
}