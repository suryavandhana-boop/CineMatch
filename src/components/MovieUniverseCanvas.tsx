import React, { useEffect, useRef } from 'react';
import { MovieUniverseTheme } from '../utils/movieUniverseThemes.ts';

interface MovieUniverseCanvasProps {
  theme: MovieUniverseTheme;
  interactive?: boolean;
}

export const MovieUniverseCanvas: React.FC<MovieUniverseCanvasProps> = ({
  theme,
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePos = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Initial mouse center
    mousePos.current.x = width / 2;
    mousePos.current.y = height / 2;
    mousePos.current.targetX = width / 2;
    mousePos.current.targetY = height / 2;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      mousePos.current.targetX = e.clientX;
      mousePos.current.targetY = e.clientY;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // Particle pool setup based on theme's primaryTone
    interface Particle {
      x: number;
      y: number;
      z: number; // For 3D depth
      vx: number;
      vy: number;
      vz: number;
      size: number;
      alpha: number;
      color: string;
      rotation: number;
      vRot: number;
      extra?: any;
    }

    const particles: Particle[] = [];
    const count = Math.min(theme.particleCount, 60);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 800 + 100, // 3D distance
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        vz: Math.random() * 2 + 0.5,
        size: Math.random() * 3 + 1,
        alpha: Math.random() * 0.7 + 0.3,
        color: theme.accentColor,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.04,
        extra: {
          phase: Math.random() * Math.PI * 2,
          radius: Math.random() * 30 + 10,
          type: Math.random() > 0.5 ? 1 : 0,
        },
      });
    }

    let time = 0;

    const render = () => {
      time += 0.016;

      // Smooth mouse lerp
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.05;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.05;

      const mouseNormX = (mousePos.current.x / width - 0.5) * 2; // -1 to 1
      const mouseNormY = (mousePos.current.y / height - 0.5) * 2; // -1 to 1

      ctx.clearRect(0, 0, width, height);

      // 1. Draw thematic background base layers
      const tone = theme.primaryTone;

      // 1A. 3D Perspective Grid for Interstellar, Inception, Blade Runner, etc.
      if (tone === 'cosmic' || tone === 'dream' || tone === 'cyberpunk') {
        ctx.save();
        ctx.strokeStyle = tone === 'cyberpunk' ? 'rgba(251, 146, 60, 0.15)' : 'rgba(56, 189, 248, 0.12)';
        ctx.lineWidth = 1;

        const horizonY = height * 0.65 + mouseNormY * 30;
        const vanishX = width * 0.5 + mouseNormX * 40;

        // Radial vanishing grid lines
        const numLines = 16;
        for (let i = 0; i <= numLines; i++) {
          const spreadX = (width * i) / numLines;
          ctx.beginPath();
          ctx.moveTo(vanishX, horizonY);
          ctx.lineTo(spreadX, height);
          ctx.stroke();
        }

        // Horizontal transverse lines with exponential perspective spacing
        const gridSpeed = (time * 40) % 60;
        for (let y = 0; y < 7; y++) {
          const depth = Math.pow(y / 6, 2.5);
          const py = horizonY + depth * (height - horizonY) + (gridSpeed * depth * 0.3);
          if (py <= height) {
            ctx.beginPath();
            ctx.moveTo(0, py);
            ctx.lineTo(width, py);
            ctx.stroke();
          }
        }
        ctx.restore();
      }

      // 1B. Rotating/Folding 3D Wireframe Plane for Inception
      if (tone === 'dream') {
        ctx.save();
        ctx.translate(width * 0.5 + mouseNormX * 30, height * 0.35 + mouseNormY * 20);
        ctx.rotate(time * 0.1);
        ctx.strokeStyle = 'rgba(249, 115, 22, 0.2)';
        ctx.lineWidth = 1.5;

        // Draw folding isometric architectural cubes
        for (let r = 1; r <= 3; r++) {
          const sz = r * 70;
          ctx.beginPath();
          ctx.strokeRect(-sz / 2, -sz / 2, sz, sz);
          ctx.beginPath();
          ctx.arc(0, 0, sz * 0.7, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }

      // 1C. Expanding Fission Shockwave Rings for Oppenheimer
      if (tone === 'fission') {
        ctx.save();
        const cx = width * 0.5 + mouseNormX * 20;
        const cy = height * 0.4 + mouseNormY * 20;

        for (let r = 0; r < 4; r++) {
          const ringRadius = ((time * 70 + r * 110) % 450);
          const ringAlpha = Math.max(0, 1 - ringRadius / 450) * 0.35;
          ctx.beginPath();
          ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(249, 115, 22, ${ringAlpha})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Central fiery atomic core glow
        const glowGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 140);
        glowGrad.addColorStop(0, 'rgba(251, 146, 60, 0.45)');
        glowGrad.addColorStop(0.5, 'rgba(234, 88, 12, 0.2)');
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 140, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 1D. Victorian Clockwork Mechanical Gears for The Prestige
      if (tone === 'theatre') {
        ctx.save();
        const gx = width * 0.8;
        const gy = height * 0.25;
        ctx.translate(gx, gy);
        ctx.rotate(time * 0.15);
        ctx.strokeStyle = 'rgba(234, 179, 8, 0.2)';
        ctx.lineWidth = 2;

        // Gear 1
        ctx.beginPath();
        ctx.arc(0, 0, 80, 0, Math.PI * 2);
        ctx.stroke();
        for (let a = 0; a < 12; a++) {
          const ang = (a * Math.PI * 2) / 12;
          ctx.strokeRect(Math.cos(ang) * 80 - 4, Math.sin(ang) * 80 - 4, 8, 8);
        }
        ctx.restore();

        // Subtle spotlight cone from above
        ctx.save();
        const spotGrad = ctx.createLinearGradient(width * 0.5, 0, width * 0.5, height);
        spotGrad.addColorStop(0, 'rgba(234, 179, 8, 0.12)');
        spotGrad.addColorStop(0.8, 'rgba(234, 179, 8, 0.0)');
        ctx.fillStyle = spotGrad;
        ctx.beginPath();
        ctx.moveTo(width * 0.4, 0);
        ctx.lineTo(width * 0.6, 0);
        ctx.lineTo(width * 0.85, height);
        ctx.lineTo(width * 0.15, height);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // 1E. Gotham City Skyline & Searchlight for The Dark Knight
      if (tone === 'noir') {
        ctx.save();
        // Sweeping searchlight
        const beamAngle = Math.sin(time * 0.6) * 0.4 - 0.2;
        ctx.translate(width * 0.2, height);
        ctx.rotate(beamAngle);
        const beamGrad = ctx.createLinearGradient(0, 0, 0, -height);
        beamGrad.addColorStop(0, 'rgba(96, 165, 250, 0.3)');
        beamGrad.addColorStop(0.8, 'rgba(96, 165, 250, 0.0)');
        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(-15, 0);
        ctx.lineTo(15, 0);
        ctx.lineTo(120, -height);
        ctx.lineTo(-80, -height);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // City skyline silhouette at bottom
        ctx.save();
        ctx.fillStyle = 'rgba(2, 4, 10, 0.7)';
        const bWidth = 40;
        const bCount = Math.ceil(width / bWidth);
        for (let b = 0; b < bCount; b++) {
          const bh = 50 + ((b * 37) % 110);
          ctx.fillRect(b * bWidth, height - bh, bWidth - 2, bh);
        }
        ctx.restore();
      }

      // 1F. Sweeping Lighthouse Beam for Shutter Island
      if (tone === 'tempest') {
        ctx.save();
        const beamRot = time * 0.4;
        ctx.translate(width * 0.1, height * 0.4);
        ctx.rotate(beamRot);
        const lGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, width);
        lGrad.addColorStop(0, 'rgba(203, 213, 225, 0.4)');
        lGrad.addColorStop(0.7, 'rgba(203, 213, 225, 0.0)');
        ctx.fillStyle = lGrad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, width * 0.8, -0.2, 0.2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // 1G. High-Tension Jazz Spotlight for Whiplash
      if (tone === 'jazz') {
        ctx.save();
        const jSpot = ctx.createRadialGradient(width * 0.5, height * 0.3, 20, width * 0.5, height * 0.3, 320);
        jSpot.addColorStop(0, 'rgba(245, 158, 11, 0.35)');
        jSpot.addColorStop(0.6, 'rgba(245, 158, 11, 0.08)');
        jSpot.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = jSpot;
        ctx.beginPath();
        ctx.arc(width * 0.5, height * 0.3, 320, 0, Math.PI * 2);
        ctx.fill();

        // Concentric acoustic soundwaves
        for (let sw = 0; sw < 3; sw++) {
          const swR = ((time * 80 + sw * 90) % 270);
          const swAlpha = (1 - swR / 270) * 0.25;
          ctx.strokeStyle = `rgba(245, 158, 11, ${swAlpha})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(width * 0.5, height * 0.3, swR, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }

      // 1H. Bioluminescent Waves for Kumbalangi Nights
      if (tone === 'bioluminescent') {
        ctx.save();
        ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
        for (let w = 0; w < 3; w++) {
          ctx.beginPath();
          ctx.moveTo(0, height);
          for (let x = 0; x <= width; x += 25) {
            const yOffset = Math.sin(x * 0.008 + time * 1.5 + w) * 20;
            ctx.lineTo(x, height - 70 - w * 25 + yOffset);
          }
          ctx.lineTo(width, height);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      // 1I. Heptapod Logogram Ink Ring for Arrival
      if (tone === 'alien') {
        ctx.save();
        const ax = width * 0.5;
        const ay = height * 0.35;
        ctx.translate(ax, ay);
        ctx.rotate(time * 0.05);
        ctx.strokeStyle = 'rgba(45, 212, 191, 0.3)';
        ctx.lineWidth = 14;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(0, 0, 110, 0.4, Math.PI * 1.8);
        ctx.stroke();

        // Splattered ink droplets around the logogram
        for (let d = 0; d < 8; d++) {
          const da = (d * Math.PI * 2) / 8 + Math.sin(d);
          const dr = 110 + (Math.sin(d * 3) * 20);
          ctx.fillStyle = 'rgba(45, 212, 191, 0.35)';
          ctx.beginPath();
          ctx.arc(Math.cos(da) * dr, Math.sin(da) * dr, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // 1J. Dual Split Screen Tone for Lucia
      if (tone === 'lucid') {
        ctx.save();
        // Left half is monochrome shadow, right half is vivid neon magenta/cyan
        const splitGrad = ctx.createLinearGradient(0, 0, width, 0);
        splitGrad.addColorStop(0, 'rgba(15, 15, 20, 0.4)');
        splitGrad.addColorStop(0.48, 'rgba(15, 15, 20, 0.2)');
        splitGrad.addColorStop(0.52, 'rgba(56, 189, 248, 0.25)');
        splitGrad.addColorStop(1, 'rgba(192, 132, 252, 0.35)');
        ctx.fillStyle = splitGrad;
        ctx.fillRect(0, 0, width, height);

        // Center split neon beam line
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(width * 0.5, 0);
        ctx.lineTo(width * 0.5, height);
        ctx.stroke();
        ctx.restore();
      }

      // 2. Render and Update 3D-style Particles
      particles.forEach((p, idx) => {
        // Parallax depth offset
        const parallaxFactor = (1000 - p.z) / 1000;
        const pX = p.x + mouseNormX * 25 * parallaxFactor;
        const pY = p.y + mouseNormY * 25 * parallaxFactor;

        ctx.save();

        if (tone === 'cosmic') {
          // 3D Starfield streaming with depth
          p.z -= p.vz * 4;
          if (p.z <= 20) {
            p.z = 800;
            p.x = Math.random() * width;
            p.y = Math.random() * height;
          }

          const k = 400 / p.z;
          const sx = (p.x - width / 2) * k + width / 2 + mouseNormX * 30;
          const sy = (p.y - height / 2) * k + height / 2 + mouseNormY * 30;
          const sz = Math.max(0.8, (1 - p.z / 800) * 3.5);
          const alpha = (1 - p.z / 800) * 0.9;

          if (sx >= 0 && sx <= width && sy >= 0 && sy <= height) {
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.arc(sx, sy, sz, 0, Math.PI * 2);
            ctx.fill();

            // Star twinkle aura for nearest stars
            if (p.z < 200) {
              ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 0.4})`;
              ctx.lineWidth = 0.75;
              ctx.beginPath();
              ctx.moveTo(sx - sz * 3, sy);
              ctx.lineTo(sx + sz * 3, sy);
              ctx.moveTo(sx, sy - sz * 3);
              ctx.lineTo(sx, sy + sz * 3);
              ctx.stroke();
            }
          }
        } else if (tone === 'noir' || tone === 'tempest' || tone === 'mythic') {
          // Torrential rain streaks (The Dark Knight, Shutter Island, Tumbbad)
          p.y += p.vy * 5 + 12;
          p.x += (Math.sin(time + p.extra.phase) - 0.3) * 2;
          if (p.y > height) {
            p.y = -20;
            p.x = Math.random() * width;
          }

          const rainColor = tone === 'mythic' ? 'rgba(234, 88, 12, 0.4)' : 'rgba(148, 163, 184, 0.5)';
          ctx.strokeStyle = rainColor;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(pX, pY);
          ctx.lineTo(pX - 4, pY + 18);
          ctx.stroke();

          // Subtle splashes at bottom
          if (p.y > height - 60) {
            ctx.fillStyle = rainColor;
            ctx.beginPath();
            ctx.arc(pX, pY + 18, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (tone === 'monsoon') {
          // Premam: Fluttering organic butterflies & golden blossom petals
          p.y -= Math.cos(time + p.extra.phase) * 1.5;
          p.x += Math.sin(time + p.extra.phase) * 1.8 + p.vx;
          if (p.x > width + 20) p.x = -20;
          if (p.x < -20) p.x = width + 20;
          if (p.y > height + 20) p.y = -20;
          if (p.y < -20) p.y = height + 20;

          const isButterfly = idx % 2 === 0;
          if (isButterfly) {
            // Draw fluttering butterfly with wing motion
            const wingFlap = Math.abs(Math.sin(time * 6 + p.extra.phase));
            ctx.fillStyle = idx % 4 === 0 ? 'rgba(16, 185, 129, 0.75)' : 'rgba(234, 179, 8, 0.75)';
            ctx.beginPath();
            // Left wing
            ctx.ellipse(pX - 4 * wingFlap, pY, 7 * wingFlap, 5, -0.3, 0, Math.PI * 2);
            // Right wing
            ctx.ellipse(pX + 4 * wingFlap, pY, 7 * wingFlap, 5, 0.3, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Soft floating yellow flower petal
            ctx.fillStyle = 'rgba(250, 204, 21, 0.65)';
            ctx.beginPath();
            ctx.ellipse(pX, pY, 5, 3, p.rotation + time, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (tone === 'firewater') {
          // RRR: Clash of Fire (Left/Top) & Water (Right/Bottom)
          const isFire = idx % 2 === 0;
          if (isFire) {
            // Rising fiery embers
            p.y -= Math.abs(p.vy) * 2 + 1.5;
            p.x += Math.sin(time * 2 + p.extra.phase) * 1.5;
            if (p.y < -20) {
              p.y = height + 10;
              p.x = Math.random() * (width * 0.6); // Left side fire
            }
            ctx.fillStyle = 'rgba(249, 115, 22, 0.8)';
            ctx.shadowColor = '#f97316';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(pX, pY, p.size * 1.2, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Swirling azure water droplets
            p.y += Math.abs(p.vy) * 2 + 1;
            p.x += Math.cos(time * 2 + p.extra.phase) * 2;
            if (p.y > height + 20) {
              p.y = -10;
              p.x = width * 0.4 + Math.random() * (width * 0.6); // Right side water
            }
            ctx.fillStyle = 'rgba(56, 189, 248, 0.75)';
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.arc(pX, pY, p.size * 1.3, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (tone === 'industrial') {
          // Vikram: Industrial smoke puffs and glowing crimson shrapnel
          const isSpark = idx % 3 === 0;
          if (isSpark) {
            p.y += Math.abs(p.vy) * 3 + 2;
            p.x += (Math.random() - 0.5) * 2;
            if (p.y > height) {
              p.y = 0;
              p.x = Math.random() * width;
            }
            ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
            ctx.shadowColor = '#ef4444';
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.arc(pX, pY, 2, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Swirling smoke cloud
            p.y -= 0.5;
            p.x += Math.sin(time + p.extra.phase) * 0.5;
            if (p.y < -50) p.y = height + 30;
            ctx.fillStyle = 'rgba(100, 10, 10, 0.08)';
            ctx.beginPath();
            ctx.arc(pX, pY, p.extra.radius * 2, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (tone === 'nostalgia') {
          // 96: Floating Polaroid photo frames with nostalgic drift
          p.y -= 0.6;
          p.x += Math.sin(time * 0.8 + p.extra.phase) * 0.8;
          p.rotation += p.vRot * 0.5;
          if (p.y < -50) {
            p.y = height + 40;
            p.x = Math.random() * width;
          }

          ctx.translate(pX, pY);
          ctx.rotate(p.rotation);
          // Polaroid white frame
          ctx.fillStyle = 'rgba(255, 245, 235, 0.18)';
          ctx.strokeStyle = 'rgba(232, 121, 249, 0.3)';
          ctx.lineWidth = 1;
          const pw = 24;
          const ph = 30;
          ctx.fillRect(-pw / 2, -ph / 2, pw, ph);
          ctx.strokeRect(-pw / 2, -ph / 2, pw, ph);
          // Inner photo area
          ctx.fillStyle = 'rgba(232, 121, 249, 0.2)';
          ctx.fillRect(-pw / 2 + 2, -ph / 2 + 2, pw - 4, ph - 10);
        } else if (tone === 'collegiate') {
          // 3 Idiots: Origami paper airplanes gliding
          p.x += 1.8;
          p.y += Math.sin(p.x * 0.01 + p.extra.phase) * 1.2;
          if (p.x > width + 40) {
            p.x = -40;
            p.y = Math.random() * height * 0.6;
          }

          ctx.translate(pX, pY);
          ctx.rotate(0.3 + Math.sin(time + p.extra.phase) * 0.1);
          ctx.strokeStyle = 'rgba(250, 204, 21, 0.6)';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(14, 0);
          ctx.lineTo(-10, -7);
          ctx.lineTo(-4, 0);
          ctx.lineTo(-10, 7);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        } else if (tone === 'piano') {
          // Andhadhun: Floating piano keys and musical notes
          p.y -= 0.8;
          p.rotation += p.vRot;
          if (p.y < -40) {
            p.y = height + 30;
            p.x = Math.random() * width;
          }

          ctx.translate(pX, pY);
          ctx.rotate(p.rotation);
          // Piano key
          const isBlackKey = idx % 3 === 0;
          ctx.fillStyle = isBlackKey ? 'rgba(10, 10, 15, 0.75)' : 'rgba(240, 240, 255, 0.4)';
          ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)';
          ctx.lineWidth = 1;
          ctx.fillRect(-6, -14, 12, 28);
          ctx.strokeRect(-6, -14, 12, 28);
        } else if (tone === 'forest') {
          // Kantara: Sacred torch embers & canopy mist
          p.y -= Math.abs(p.vy) * 2 + 1;
          p.x += Math.sin(time * 1.5 + p.extra.phase) * 1.4;
          if (p.y < -30) {
            p.y = height + 20;
            p.x = Math.random() * width;
          }

          // Glowing sacred ember
          ctx.fillStyle = 'rgba(245, 158, 11, 0.85)';
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(pX, pY, p.size * 1.1, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Universal graceful ambient glowing particles (themed color)
          p.x += p.vx;
          p.y += p.vy;
          if (p.x > width) p.x = 0;
          if (p.x < 0) p.x = width;
          if (p.y > height) p.y = 0;
          if (p.y < 0) p.y = height;

          ctx.fillStyle = theme.glowColor;
          ctx.shadowColor = theme.accentColor;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(pX, pY, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [theme, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
    />
  );
};
