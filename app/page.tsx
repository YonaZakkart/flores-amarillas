'use client';

import { useState, useEffect } from 'react';
import Flower from './components/Flower';
import Butterfly from './components/Butterfly';

interface FlowerData {
  id: number;
  x: number;
  y: number;
  scale: number;
  swayDelay: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  duration: number;
}

// 1. Sonido individual para plantado simple (1 nota brillante)
const playBloomSound = () => {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const audioCtx = new AudioContextClass();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    const notes = [523.25, 659.25, 783.99, 987.77, 1046.5];
    const note = notes[Math.floor(Math.random() * notes.length)];

    osc.type = 'sine';
    osc.frequency.setValueAtTime(note, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
  } catch {
    // Si la interacción previa no se ha registrado
  }
};

// 2. Sonido mágico multitono en arpegio ascendente para Llenar y Dedicatoria
const playMagicChimeSound = () => {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const audioCtx = new AudioContextClass();

    // Arpegio mágico (Mi mayor brillante: E5, G#5, B5, E6, G#6, B6)
    const notes = [659.25, 830.61, 987.77, 1318.51, 1661.22, 1975.53];

    notes.forEach((freq, index) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      // Desfase de tiempo entre notas (80ms entre cada una)
      const startTime = audioCtx.currentTime + index * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.12, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  } catch {
    // En caso de que el navegador restrinja audio
  }
};

export default function Home() {
  const [flowers, setFlowers] = useState<FlowerData[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const initialParticles: Particle[] = Array.from({ length: 25 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        duration: Math.random() * 4 + 4,
      }));
      setParticles(initialParticles);

      setFlowers([
        {
          id: 1,
          x: window.innerWidth / 2,
          y: window.innerHeight / 2 + 50,
          scale: 1.0,
          swayDelay: 0,
        },
      ]);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  // Función genérica para plantar una cantidad determinada de flores
  const spawnRandomFlowers = (count: number) => {
    const newFlowers: FlowerData[] = [];
    const now = Date.now();

    for (let i = 0; i < count; i++) {
      newFlowers.push({
        id: now + i + Math.random(),
        x: Math.random() * (window.innerWidth - 100) + 50,
        y: Math.random() * (window.innerHeight - 250) + 120,
        scale: Number((Math.random() * 0.4 + 0.75).toFixed(2)),
        swayDelay: Number((Math.random() * 3).toFixed(2)),
      });
    }

    setFlowers((prev) => [...prev, ...newFlowers]);
  };

  const handleGardenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.clientY < 90 || e.clientY > window.innerHeight - 80) return;

    playBloomSound();

    const newFlower: FlowerData = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY,
      scale: Number((Math.random() * 0.4 + 0.8).toFixed(2)),
      swayDelay: Number((Math.random() * 3).toFixed(2)),
    };

    setFlowers((prev) => [...prev, newFlower]);
  };

  const fillGarden = (e: React.MouseEvent) => {
    e.stopPropagation();
    playMagicChimeSound();
    spawnRandomFlowers(10);
  };

  // Al abrir dedicatoria: Sonido mágico + Llenar x3 (30 flores)
  const openDedicatoria = (e: React.MouseEvent) => {
    e.stopPropagation();
    playMagicChimeSound();
    spawnRandomFlowers(30);
    setIsModalOpen(true);
  };

  const clearGarden = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFlowers([]);
  };

  return (
    <main className="garden-container" onClick={handleGardenClick}>
      <h1 className="header-title">🌻 Jardín Mágico de Flores 🌻</h1>
      <p className="header-subtitle">
        Haz clic en cualquier lugar para hacer brotar flores 💛
      </p>

      {/* Partículas de polen y luciérnagas */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="firefly"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            '--duration': `${p.duration}s`,
          } as React.CSSProperties}
        />
      ))}

      {/* Mariposas */}
      <Butterfly x={150} y={200} flyDuration={14} />
      <Butterfly
        x={typeof window !== 'undefined' ? window.innerWidth - 250 : 600}
        y={350}
        flyDuration={18}
      />

      {/* Flores */}
      {flowers.map((flower) => (
        <Flower
          key={flower.id}
          x={flower.x}
          y={flower.y}
          scale={flower.scale}
          swayDelay={flower.swayDelay}
        />
      ))}

      {/* Barra de Herramientas */}
      <div className="toolbar">
        <button className="tool-btn" onClick={fillGarden}>
          ✨ Llenar
        </button>
        <button className="tool-btn" onClick={openDedicatoria}>
          💌 Dedicatoria
        </button>
        <button className="tool-btn" onClick={clearGarden}>
          🧹 Limpiar
        </button>
      </div>

      {/* Modal de Dedicatoria */}
      {isModalOpen && (
        <div
          className="modal-backdrop"
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(false);
          }}
        >
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2>🌻 Un regalo para ti 🌻</h2>
            <p>
              Que este jardín de flores amarillas ilumine tu día con la misma
              calidez, alegría y luz con la que el sol abraza a los girasoles. 💛✨
            </p>
            <button
              className="close-btn"
              onClick={() => setIsModalOpen(false)}
            >
              Cerrar Carta
            </button>
          </div>
        </div>
      )}

      {/* shhhh */}
      <a
        href="https://github.com/YonaZakkart"
        target="_blank"
        rel="noopener noreferrer"
        className="author-credit"
        onClick={(e) => e.stopPropagation()}
      >
        by YonaZakkart
      </a>
    </main>
  );
}