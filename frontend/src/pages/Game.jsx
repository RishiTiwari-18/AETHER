import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const GROUND_Y = 74;
const JUMP_VELOCITY = 14.5;
const GRAVITY = 0.82;
const BASE_SPEED = 4.1;

const randomObstacle = () => ({
  id: Math.random().toString(36).slice(2),
  x: 110,
  width: 14 + Math.random() * 12,
  height: 18 + Math.random() * 20,
});

export const Game = () => {
  const navigate = useNavigate();
  const gameAreaRef = useRef(null);
  const rafRef = useRef(null);
  const playerRef = useRef({ y: 0, velocity: 0, jumping: false });
  const obstaclesRef = useRef([]);
  const scoreRef = useRef(0);
  const bestRef = useRef(0);
  const spawnGraceUntilRef = useRef(0);
  const gameWidthRef = useRef(0);

  const [playerY, setPlayerY] = useState(0);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [isStarted, setIsStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [obstacles, setObstacles] = useState([]);
  const [flash, setFlash] = useState(false);

  const resetGame = useCallback(() => {
    playerRef.current = { y: 0, velocity: 0, jumping: false };
    obstaclesRef.current = [];
    scoreRef.current = 0;
    spawnGraceUntilRef.current = performance.now() + 1600;
    setPlayerY(0);
    setScore(0);
    setIsGameOver(false);
    setIsRunning(true);
    setObstacles([]);
    setFlash(false);
  }, []);

  const startGame = useCallback(() => {
    resetGame();
    spawnGraceUntilRef.current = performance.now() + 1800;
    setIsStarted(true);
  }, [resetGame]);

  useEffect(() => {
    const savedBest = Number(window.localStorage.getItem('aether-offline-best') || 0);
    bestRef.current = savedBest;
    setBest(savedBest);
  }, []);

  useEffect(() => {
    const updateWidth = () => {
      gameWidthRef.current = gameAreaRef.current?.getBoundingClientRect().width || 0;
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);

    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isStarted && (event.code === 'Space' || event.code === 'ArrowUp' || event.key.toLowerCase() === 'r')) {
        event.preventDefault();
        startGame();
        return;
      }

      if (event.code === 'Space' || event.code === 'ArrowUp') {
        event.preventDefault();
        if (isGameOver) {
          resetGame();
          return;
        }
        if (!playerRef.current.jumping) {
          playerRef.current.velocity = JUMP_VELOCITY;
          playerRef.current.jumping = true;
        }
      }

      if (event.key.toLowerCase() === 'r' && isGameOver) {
        resetGame();
      }

      if (event.key === 'Escape') {
        navigate('/login');
      }
    };

    const handlePointerDown = () => {
      if (!isStarted) {
        startGame();
        return;
      }

      if (isGameOver) {
        resetGame();
        return;
      }
      if (!playerRef.current.jumping) {
        playerRef.current.velocity = JUMP_VELOCITY;
        playerRef.current.jumping = true;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('pointerdown', handlePointerDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isGameOver, isStarted, navigate, resetGame, startGame]);

  useEffect(() => {
    let obstacleTimer = 0;
    let lastFrame = performance.now();
    let lastScoreTick = performance.now();

    const tick = (time) => {
      const delta = Math.min(2, (time - lastFrame) / 16.67);
      lastFrame = time;

      if (!isStarted) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      if (!isGameOver) {
        const player = playerRef.current;
        if (player.jumping || player.y > 0 || player.velocity > 0) {
          player.y += player.velocity * delta;
          player.velocity -= GRAVITY * delta;

          if (player.y <= 0) {
            player.y = 0;
            player.velocity = 0;
            player.jumping = false;
          }
        }
        setPlayerY(player.y);

        obstacleTimer += delta;
        if (obstacleTimer > 40 + Math.random() * 15) {
          obstacleTimer = 0;
          const spawnX = Math.max(160, gameWidthRef.current - 32);
          obstaclesRef.current = [...obstaclesRef.current, { ...randomObstacle(), x: spawnX }];
        }

        const nextObstacles = obstaclesRef.current
            .map((obstacle) => ({ ...obstacle, x: obstacle.x - BASE_SPEED * delta }))
            .filter((obstacle) => obstacle.x > -30)
        ;
        obstaclesRef.current = nextObstacles;
        setObstacles(nextObstacles);

        const playerX = 16;
        const playerY = GROUND_Y - 14 - player.y;
        const shouldCheckCollision = time > spawnGraceUntilRef.current;
        const collided = shouldCheckCollision && nextObstacles.some((obstacle) => {
          const obstacleLeft = obstacle.x;
          const obstacleRight = obstacle.x + obstacle.width;
          const obstacleTop = GROUND_Y - obstacle.height;
          const obstacleBottom = GROUND_Y;

          const playerLeft = playerX;
          const playerRight = playerX + 14;
          const playerTop = playerY;
          const playerBottom = playerY + 14;

          return !(
            playerRight < obstacleLeft ||
            playerLeft > obstacleRight ||
            playerBottom < obstacleTop ||
            playerTop > obstacleBottom
          );
        });

        if (collided) {
          setIsGameOver(true);
          setIsRunning(false);
          setFlash(true);
          gsap.to('.game-flash', { opacity: 1, duration: 0.08, yoyo: true, repeat: 1 });
          setTimeout(() => setFlash(false), 180);
          const nextBest = Math.max(bestRef.current, scoreRef.current);
          bestRef.current = nextBest;
          setBest(nextBest);
          window.localStorage.setItem('aether-offline-best', String(nextBest));
          obstaclesRef.current = [];
          setObstacles([]);
        }

        if (time - lastScoreTick > 120) {
          lastScoreTick = time;
          scoreRef.current += 1;
          setScore(scoreRef.current);
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafRef.current);
  }, [isGameOver, isStarted]);

  useEffect(() => {
    gsap.fromTo('.game-shell', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' });
  }, []);

  return (
    <div className="min-h-screen bg-aether-void flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="game-flash absolute inset-0 bg-white opacity-0 pointer-events-none" />
      <div className="game-shell w-full max-w-5xl border border-aether-border bg-white/2 backdrop-blur-3xl p-6 md:p-10 relative overflow-hidden">
        <div className="flex items-start justify-between gap-6 mb-8">
          <div>
            <p className="font-geist text-[9px] tracking-[0.35em] uppercase text-aether-secondary/60 mb-3">Offline Escape</p>
            <h1 className="font-playfair text-4xl md:text-6xl text-white leading-none">Sorry for the inconvenience</h1>
          </div>
          <div className="text-right">
            <p className="font-geist text-[9px] tracking-[0.3em] uppercase text-aether-secondary/50 mb-2">Score</p>
            <p className="font-playfair text-3xl text-white">{score}</p>
            <p className="font-geist text-[9px] tracking-[0.3em] uppercase text-aether-secondary/40 mt-3">Best {best}</p>
          </div>
        </div>

        <div
          ref={gameAreaRef}
          className="relative w-full h-85 md:h-105 border border-aether-border/60 bg-black/40 overflow-hidden"
          onClick={() => {
            if (!isStarted) {
              startGame();
              return;
            }
            if (isGameOver) {
              resetGame();
            } else if (!playerRef.current.jumping) {
              playerRef.current.velocity = JUMP_VELOCITY;
              playerRef.current.jumping = true;
            }
          }}
        >
          {!isStarted && !isGameOver && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/55 backdrop-blur-sm">
              <div className="text-center px-6">
                <p className="font-geist text-[9px] tracking-[0.35em] uppercase text-aether-secondary/60 mb-3">Offline runner</p>
                <h2 className="font-playfair text-4xl text-white mb-4">Ready to play?</h2>
                <p className="font-inter text-sm text-aether-secondary/70 mb-8 max-w-sm mx-auto">
                  Tap start to begin. Obstacles will move at a calmer pace so the game stays playable.
                </p>
                <button
                  onClick={startGame}
                  className="font-inter text-xs tracking-widest uppercase bg-white text-black px-6 py-3 hover:bg-aether-secondary transition-colors duration-700"
                >
                  Start Game
                </button>
              </div>
            </div>
          )}

          <div className="absolute inset-x-0 bottom-18.5 h-px bg-white/15" />
          <div className="absolute left-6 bottom-15 text-[9px] tracking-[0.35em] uppercase font-geist text-aether-secondary/40">
            press space or tap to jump
          </div>

          <div
            className="absolute left-4 w-3.5 h-3.5 bg-white shadow-[0_0_16px_rgba(255,255,255,0.25)]"
            style={{ bottom: `${GROUND_Y - 14 + playerY}px` }}
          />

          <div className="absolute left-0 right-0 bottom-0 h-18.5 bg-linear-to-t from-white/5 to-transparent" />

          {obstacles.map((obstacle) => (
            <div
              key={obstacle.id}
              className="absolute bottom-18.5 bg-white/85 shadow-[0_0_16px_rgba(255,255,255,0.2)]"
              style={{ left: `${obstacle.x}px`, width: `${obstacle.width}px`, height: `${obstacle.height}px` }}
            />
          ))}

          {isGameOver && isStarted && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/45 backdrop-blur-sm">
              <div className="text-center px-6">
                <p className="font-geist text-[9px] tracking-[0.35em] uppercase text-aether-secondary/60 mb-3">Game paused</p>
                <h2 className="font-playfair text-4xl text-white mb-4">We will be right back</h2>
                <p className="font-inter text-sm text-aether-secondary/70 mb-8 max-w-sm mx-auto">
                  You can keep playing our game until the website is fixed. Press R, Space, or tap to try again.
                </p>
                <button
                  onClick={startGame}
                  className="font-inter text-xs tracking-widest uppercase bg-white text-black px-6 py-3 hover:bg-aether-secondary transition-colors duration-700"
                >
                  Start Again
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-6">
          <p className="font-inter text-sm text-aether-secondary/70 max-w-xl">
            A small offline runner. Avoid the obstacles, survive the outage, and keep playing until the site is fixed.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="font-inter text-xs tracking-widest uppercase border border-aether-border px-6 py-3 text-aether-secondary hover:text-white hover:border-white transition-colors duration-700"
          >
            Return to Login
          </button>
        </div>
      </div>
    </div>
  );
};
