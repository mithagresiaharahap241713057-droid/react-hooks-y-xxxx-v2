"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

// --- KONFIGURASI GAME AREA ---
const GRID_SIZE = 20; 
const WIDTH = 30;     
const HEIGHT = 18;    
const INITIAL_SPEED = 180; 

// Tipe data untuk posisi (koordinat x,y)
interface Position {
  x: number;
  y: number;
}

// Helper untuk posisi acak koin
const getRandomPosition = (): Position => ({
  x: Math.floor(Math.random() * WIDTH),
  y: Math.floor(Math.random() * HEIGHT),
});

export default function PoopSurvivorsSnakePage() {
  // --- STATE CORE GAME ---
  const [snake, setSnake] = useState<Position[]>([{ x: 15, y: 9 }]); 
  const [coin, setCoin] = useState<Position>(getRandomPosition()); 
  const [direction, setDirection] = useState<Position>({ x: 0, y: 0 }); 
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const gameAreaRef = useRef<HTMLDivElement>(null);

  // --- LOGIKA UTAMA (SNAKE) ---
  // 1. Fungsi Reset Game
  const resetGame = useCallback(() => {
    if (score > highScore) setHighScore(score);
    setSnake([{ x: 15, y: 9 }]);
    setCoin(getRandomPosition());
    setDirection({ x: 0, y: 0 }); // Diam dulu
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setIsGameOver(false);
    setIsGameRunning(false);
  }, [score, highScore]);

  // 2. Efek untuk Input Keyboard (Arah)
  useEffect(() => {
    if (isGameOver) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isGameRunning && (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "ArrowLeft" || e.key === "ArrowRight")) {
          setIsGameRunning(true); 
      }

      let newDirection: Position = direction;

      switch (e.key) {
        case "ArrowUp":
          if (direction.y === 0) newDirection = { x: 0, y: -1 }; 
          break;
        case "ArrowDown":
          if (direction.y === 0) newDirection = { x: 0, y: 1 };
          break;
        case "ArrowLeft":
          if (direction.x === 0) newDirection = { x: -1, y: 0 };
          break;
        case "ArrowRight":
          if (direction.x === 0) newDirection = { x: 1, y: 0 };
          break;
      }
      setDirection(newDirection);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction, isGameOver, isGameRunning]);

  // 3. Efek Logika Pergerakan & Tabrakan (Game Loop)
  useEffect(() => {
    if (!isGameRunning || isGameOver || (direction.x === 0 && direction.y === 0)) return;

    const gameLoop = setInterval(() => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = { ...newSnake[0] }; 

        // Hitung posisi kepala baru
        head.x += direction.x;
        head.y += direction.y;

        // --- CEK TABRAKAN ---
        // A. Cek Tabrakan Dinding
        if (head.x < 0 || head.x >= WIDTH || head.y < 0 || head.y >= HEIGHT) {
          setIsGameOver(true);
          return prevSnake; 
        }

        // B. Cek Tabrakan Badan Sendiri
        for (let i = 1; i < newSnake.length; i++) {
          if (newSnake[i].x === head.x && newSnake[i].y === head.y) {
            setIsGameOver(true);
            return prevSnake;
          }
        }

        // --- CEK MAKAN KOIN ---
        if (head.x === coin.x && head.y === coin.y) {
          // Makan Koin!
          setScore((s) => s + 10);
          setCoin(getRandomPosition()); 
          setSpeed(s => Math.max(50, s - 2)); 
        } else {
          newSnake.pop(); 
        }
        // Tambahkan kepala baru di depan
        newSnake.unshift(head);
        return newSnake;
      });
    }, speed);

    return () => clearInterval(gameLoop);
  }, [direction, isGameRunning, isGameOver, coin, speed]);

  return (
    // Background Gelap Utama
    <main className="min-h-screen w-full bg-[#0a0e17] text-white p-4 md:p-10 flex flex-col items-center font-sans">
      
      {/* --- KARTU GAME UTAMA (Cyberpunk Hijau) --- */}
      <div className="bg-[#11141e] w-full max-w-[700px] rounded-[32px] p-8 md:p-10 shadow-[0_20px_80px_-15px_rgba(16,185,129,0.3)] flex flex-col items-center border-4 border-emerald-950/70">
        
        {/* Header Title (Ganti Nama) */}
        <h1 className="text-4xl md:text-5xl font-black text-emerald-400 mb-2 tracking-tighter drop-shadow-[0_2px_4px_rgba(0,255,128,0.2)]">
          Mitha's Snake Coin <span className="text-3xl">🐍</span>
        </h1>
        
        {/* Subtitle / Instruksi */}
        <p className="text-emerald-100 text-base md:text-lg italic font-medium mb-10 text-center opacity-80">
          Arahkan Cacing <span className="text-xl">🐍</span> dengan Panah Keyboard (↑ ↓ ← →) untuk mengumpul Koin <span className="text-xl">💰</span>!
        </p>

        {/* Pemisah Line */}
        <div className="w-full h-px bg-emerald-900/40 mb-10 shadow-lg"></div>

        {/* --- AREA HUD: SKOR (Box Hijau Neon) --- */}
        <div className="bg-emerald-950 w-full rounded-3xl p-6 mb-12 shadow-[inner_0_10px_20px_rgba(0,0,0,0.3)] border-2 border-emerald-800">
          
          <div className="flex justify-around items-center px-4">
              <div className="text-center">
                <span className="text-emerald-300 text-xl font-bold uppercase tracking-widest">Skor</span>
                <div className="text-5xl md:text-6xl text-emerald-100 font-black drop-shadow-[0_4px_0px_rgba(16,185,129,0.2)]">
                  {score}
                </div>
              </div>

              <div className="text-center">
                <span className="text-emerald-500 text-lg font-bold uppercase tracking-wider">High Score</span>
                <div className="text-3xl md:text-4xl text-emerald-300 font-black drop-shadow-[0_2px_0px_rgba(16,185,129,0.1)]">
                  {highScore}
                </div>
              </div>
          </div>
        </div>

        {/* --- AREA GAME UTAMA (SNAKE GRID) --- */}
        <div ref={gameAreaRef} className="relative bg-[#0d0f14] rounded-2xl mb-12 shadow-inner border-4 border-emerald-950 overflow-hidden" 
             style={{ width: `${WIDTH * GRID_SIZE}px`, height: `${HEIGHT * GRID_SIZE}px` }}>
            
            {/* Overlay Game Over / Start */}
            {!isGameRunning && !isGameOver && (
                <div className="absolute inset-0 bg-[#0a0e17]/95 rounded-2xl flex flex-col items-center justify-center backdrop-blur-sm z-30">
                    <h2 className="text-4xl font-bold text-emerald-300 mb-6 drop-shadow-[0_0_10px_emerald]">Siap Main?</h2>
                    <p className="text-emerald-100/70 text-lg mb-6 font-mono">Tekan Panah Apa Saja ↑ ↓ ← → Keyboard untuk Mulai</p>
                    <div className="text-6xl animate-pulse">🐍</div>
                </div>
            )}
            
            {isGameOver && (
                <div className="absolute inset-0 bg-red-950/90 rounded-2xl flex flex-col items-center justify-center backdrop-blur-sm z-20 p-10 border-4 border-red-500">
                    <h3 className="text-6xl font-black text-red-500 mb-3 tracking-tighter drop-shadow-[0_0_15px_#ef4444]">GAME OVER</h3>
                    <p className="text-xl text-white/80 mb-8 text-center">Cacing menabrak!Poin yang kamu kumpul: <span className="text-3xl font-bold text-emerald-300">{score}</span></p>
                    <button onClick={resetGame} className="bg-red-600 text-white px-12 py-3 rounded-xl font-bold text-xl hover:bg-red-500 transition-all shadow-lg active:scale-95 border-2 border-red-400">
                        Coba Lagi
                    </button>
                </div>
            )}

            {/* --- RENDERING GRID ELEMENTS --- */}
            {/* A. Koin (💰) */}
            <div 
              style={{ 
                  left: `${coin.x * GRID_SIZE}px`, 
                  top: `${coin.y * GRID_SIZE}px`, 
                  width: `${GRID_SIZE}px`, 
                  height: `${GRID_SIZE}px`,
              }}
              className="absolute bg-[#ffee00] rounded-full border-4 border-emerald-900 shadow-[0_0_15px_#ffee00] flex items-center justify-center text-sm z-10 animate-pulse"
            >
              💰
            </div>

            {/* B. Cacing (🐍 - Segmen) */}
            {snake.map((segment, index) => (
                <div 
                  key={index}
                  style={{ 
                      left: `${segment.x * GRID_SIZE}px`, 
                      top: `${segment.y * GRID_SIZE}px`, 
                      width: `${GRID_SIZE}px`, 
                      height: `${GRID_SIZE}px`,
                      borderRadius: index === 0 ? '5px' : '2px', 
                      zIndex: index === 0 ? 11 : 10 
                  }}
                  className={`absolute ${index === 0 ? 'bg-emerald-300 shadow-[0_0_10px_emerald]' : 'bg-emerald-600'} border border-emerald-950`}
                >
                  {index === 0 && <div className="text-[10px] text-center">👀</div>}
                </div>
            ))}
            
            {/* Grid Lines */}
            <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `linear-gradient(#1a2233 1px, transparent 1px), linear-gradient(90deg, #1a2233 1px, transparent 1px)`,
                backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`
            }}></div>

        </div>

        {/* --- TOMBOL BACK TO MENU */}
        <Link href="/home" className="bg-[#334155] text-white px-10 py-3 rounded-xl font-semibold text-lg hover:bg-[#1e293b] transition-colors shadow-md active:scale-95 border-2 border-white/10">
          Back to Game Selection
        </Link>

      </div>
    </main>
  );
}