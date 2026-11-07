import React, { useRef, useEffect } from 'react';

/**
 * HeroAntigravityCanvas - Interaktívna neurónová a konštelačná sieť.
 * Využíva deterministický výpočet cieľovej odchýlky (Target Offset + Smooth Lerp)
 * a viacvrstvovú hĺbkovú paralaxu:
 * - Pri pohybe myšou sa celá sieť jemne posúva v priestore podľa hĺbky uzla (depth)
 * - Uzly v okruhu 220px od kurzora sa plynulo a viditeľne rozostupujú (až o 55px)
 * - Vďaka lineárnej interpolácii (lerp 0.065) je pohyb vždy maslovo hladký a nikdy nemôže uletieť.
 */
export function HeroAntigravityCanvas({ mousePosRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof canvas.getContext !== 'function') return;

    let ctx;
    try {
      ctx = canvas.getContext('2d');
    } catch (e) {
      return;
    }
    if (!ctx) return;

    let animationFrameId;
    let isVisible = true;

    const dpr = window.devicePixelRatio || 1;
    let logicalWidth = canvas.parentElement ? canvas.parentElement.offsetWidth : window.innerWidth;
    let logicalHeight = canvas.parentElement ? canvas.parentElement.offsetHeight : 600;
    let width = (canvas.width = logicalWidth * dpr);
    let height = (canvas.height = logicalHeight * dpr);
    canvas.style.width = `${logicalWidth}px`;
    canvas.style.height = `${logicalHeight}px`;

    const internalMouse = { x: -9999, y: -9999, active: false };

    const handleWindowMouseMove = (e) => {
      if (!canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;

      if (relX >= -40 && relX <= rect.width + 40 && relY >= -40 && relY <= rect.height + 40) {
        internalMouse.x = relX;
        internalMouse.y = relY;
        internalMouse.active = true;
      } else {
        internalMouse.active = false;
      }
    };

    const handleWindowMouseLeave = () => {
      internalMouse.active = false;
    };

    window.addEventListener('mousemove', handleWindowMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleWindowMouseLeave, { passive: true });

    const handleResize = () => {
      if (!canvas.parentElement) return;
      logicalWidth = canvas.parentElement.offsetWidth;
      logicalHeight = canvas.parentElement.offsetHeight;
      width = canvas.width = logicalWidth * dpr;
      height = canvas.height = logicalHeight * dpr;
      canvas.style.width = `${logicalWidth}px`;
      canvas.style.height = `${logicalHeight}px`;
      initNodes();
    };

    window.addEventListener('resize', handleResize);

    const nodeCount = 155;
    let nodes = [];
    let pulses = [];

    function initNodes() {
      nodes = [];
      pulses = [];

      for (let i = 0; i < nodeCount; i++) {
        const originX = Math.random() * logicalWidth;
        const originY = Math.random() * logicalHeight;
        const isHub = i % 8 === 0;
        const isCross = !isHub && i % 6 === 0;
        const isDiamond = !isHub && !isCross && i % 7 === 0;
        const depth = 0.4 + Math.random() * 0.9; // Hĺbková vrstva pre 3D paralaxu

        nodes.push({
          x: originX,
          y: originY,
          originX,
          originY,
          depth,
          isHub,
          isCross,
          isDiamond,
          radius: isHub ? 3.5 : isCross ? 4.5 : isDiamond ? 4 : 2.2,
          pulsePhase: Math.random() * Math.PI * 2,
          floatSpeedX: 0.25 + Math.random() * 0.3,
          floatSpeedY: 0.2 + Math.random() * 0.25,
          floatOffsetX: Math.random() * Math.PI * 2,
          floatOffsetY: Math.random() * Math.PI * 2,
        });
      }

      for (let p = 0; p < 10; p++) {
        pulses.push({
          sourceIdx: Math.floor(Math.random() * nodeCount),
          targetIdx: Math.floor(Math.random() * nodeCount),
          progress: Math.random(),
          speed: 0.006 + Math.random() * 0.006,
        });
      }
    }

    initNodes();

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    let time = 0;

    function render() {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      time += 0.008;
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.scale(dpr, dpr);

      const propMouse = mousePosRef?.current;
      const isMouseActive = internalMouse.active || (propMouse && propMouse.active);
      const cursorX = internalMouse.active
        ? internalMouse.x
        : propMouse && propMouse.active
        ? propMouse.x
        : -9999;
      const cursorY = internalMouse.active
        ? internalMouse.y
        : propMouse && propMouse.active
        ? propMouse.y
        : -9999;

      const repulsionRadius = 220;
      const maxPushDistance = 58;
      const connectionDistance = 115;

      // 1. Aktualizácia pozícií uzlov (Deterministický Target + Smooth Lerp)
      nodes.forEach((node) => {
        // Prirodzené plávanie
        const naturalX = node.originX + Math.sin(time * node.floatSpeedX + node.floatOffsetX) * 14;
        const naturalY = node.originY + Math.cos(time * node.floatSpeedY + node.floatOffsetY) * 12;

        // Globálna paralaxa celej siete podľa pohybu myši
        let parallaxX = 0;
        let parallaxY = 0;
        if (isMouseActive && logicalWidth > 0 && logicalHeight > 0) {
          const normX = (cursorX / logicalWidth) - 0.5;
          const normY = (cursorY / logicalHeight) - 0.5;
          parallaxX = normX * -28 * node.depth;
          parallaxY = normY * -22 * node.depth;
        }

        // Lokálne rozostúpenie uzlov v okruhu 220px od kurzora
        let pushX = 0;
        let pushY = 0;
        const dx = naturalX + parallaxX - cursorX;
        const dy = naturalY + parallaxY - cursorY;
        const dist = Math.hypot(dx, dy);

        if (isMouseActive && dist < repulsionRadius && dist > 0.1) {
          const strength = Math.pow(1 - dist / repulsionRadius, 1.5);
          const angle = Math.atan2(dy, dx);
          pushX = Math.cos(angle) * strength * maxPushDistance * node.depth;
          pushY = Math.sin(angle) * strength * maxPushDistance * node.depth;
        }

        const targetX = naturalX + parallaxX + pushX;
        const targetY = naturalY + parallaxY + pushY;

        // Maslovo hladká interpolácia (6.5% za snímku = plynulý dojazd bez kmitania a bez uletenia)
        node.x += (targetX - node.x) * 0.065;
        node.y += (targetY - node.y) * 0.065;
      });

      // 2. Spojovacie synaptické lúče
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);

          if (dist < connectionDistance) {
            const factor = 1 - dist / connectionDistance;
            let alpha = factor * factor * (a.isHub || b.isHub ? 0.34 : 0.22);

            // Zvýraznenie spojov v blízkosti kurzora
            if (isMouseActive) {
              const midX = (a.x + b.x) * 0.5;
              const midY = (a.y + b.y) * 0.5;
              const mDist = Math.hypot(midX - cursorX, midY - cursorY);
              if (mDist < repulsionRadius) {
                alpha += (1 - mDist / repulsionRadius) * 0.28;
              }
            }

            ctx.lineWidth = a.isHub || b.isHub ? 0.85 : 0.6;
            ctx.strokeStyle = `rgba(184, 74, 39, ${Math.min(0.65, alpha)})`;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // 3. Synaptické pulzy putujúce po sieti
      pulses.forEach((pulse) => {
        pulse.progress += pulse.speed;
        if (pulse.progress >= 1) {
          pulse.progress = 0;
          pulse.sourceIdx = Math.floor(Math.random() * nodes.length);
          const src = nodes[pulse.sourceIdx];
          let bestIdx = (pulse.sourceIdx + 1) % nodes.length;
          let bestDist = 9999;
          for (let k = 0; k < nodes.length; k++) {
            if (k === pulse.sourceIdx) continue;
            const d = Math.hypot(src.x - nodes[k].x, src.y - nodes[k].y);
            if (d < connectionDistance && d < bestDist) {
              bestDist = d;
              bestIdx = k;
            }
          }
          pulse.targetIdx = bestIdx;
        }

        const n1 = nodes[pulse.sourceIdx];
        const n2 = nodes[pulse.targetIdx];
        if (n1 && n2) {
          const px = n1.x + (n2.x - n1.x) * pulse.progress;
          const py = n1.y + (n2.y - n1.y) * pulse.progress;

          ctx.beginPath();
          ctx.arc(px, py, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(215, 90, 50, 0.75)';
          ctx.fill();
        }
      });

      // 4. Vykreslenie uzlov
      nodes.forEach((node) => {
        const pulse = 0.85 + Math.sin(time * 2.5 + node.pulsePhase) * 0.15;

        ctx.save();
        ctx.translate(node.x, node.y);

        if (node.isHub) {
          ctx.beginPath();
          ctx.arc(0, 0, node.radius * pulse * 2.1, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(184, 74, 39, 0.14)';
          ctx.fill();

          ctx.beginPath();
          ctx.arc(0, 0, node.radius * pulse, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(184, 74, 39, 0.68)';
          ctx.fill();
        } else if (node.isCross) {
          ctx.strokeStyle = 'rgba(184, 74, 39, 0.48)';
          ctx.lineWidth = 1.15;
          ctx.beginPath();
          ctx.moveTo(-node.radius, 0);
          ctx.lineTo(node.radius, 0);
          ctx.moveTo(0, -node.radius);
          ctx.lineTo(0, node.radius);
          ctx.stroke();
        } else if (node.isDiamond) {
          ctx.strokeStyle = 'rgba(120, 120, 125, 0.48)';
          ctx.lineWidth = 1.05;
          ctx.beginPath();
          ctx.moveTo(0, -node.radius);
          ctx.lineTo(node.radius, 0);
          ctx.lineTo(0, node.radius);
          ctx.lineTo(-node.radius, 0);
          ctx.closePath();
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, node.radius * pulse, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(184, 74, 39, 0.44)';
          ctx.fill();
        }

        ctx.restore();
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseleave', handleWindowMouseLeave);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, [mousePosRef]);

  return <canvas ref={canvasRef} className="hero-antigravity-canvas" aria-hidden="true" />;
}
