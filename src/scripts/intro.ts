
  let rafId: number | null = null;
  let slashTimer: number | null = null;

  const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
  const easeInOutQuart = (t: number) =>
    t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  export function stopIntro() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    if (slashTimer !== null) {
      window.clearTimeout(slashTimer);
      slashTimer = null;
    }
  }

  export function startPaperCutIntro() {
    stopIntro();

    const overlay = document.getElementById('intro-overlay');
    const blueDot = document.getElementById('intro-blue-dot');
    const svgEl = document.getElementById('intro-slash-svg');
    const cutFill = document.getElementById('cutFill');
    const cutClipPath = document.getElementById('cutClipPath');
    const shadowTop = document.getElementById('shadowTop');
    const shadowBot = document.getElementById('shadowBot');
    const bevelTop = document.getElementById('bevelTop');
    const bevelBot = document.getElementById('bevelBot');

    if (
      !overlay || !blueDot || !svgEl || !cutFill || !cutClipPath ||
      !shadowTop || !shadowBot || !bevelTop || !bevelBot
    ) {
      return;
    }

    const paths = [cutFill, cutClipPath, shadowTop, shadowBot, bevelTop, bevelBot];
    paths.forEach((p) => p.setAttribute('d', ''));

    overlay.classList.remove('is-skipped', 'opacity-0', 'invisible', 'pointer-events-none');
    blueDot.classList.remove('is-expanding');
    void blueDot.offsetWidth;
    blueDot.classList.add('is-expanding');

    const renderSlash = (
      W: number,
      H: number,
      tipRatio: number,
      halfWidthRatio: number,
      pinch: number,
      shadowWidth: number
    ) => {
      const L = Math.hypot(W, H);
      const ux = -W / L;
      const uy = H / L;
      const nx = -H / L;
      const ny = -W / L;

      const toXY = (s: number, t: number): [string, string] => [
        (W + s * ux + t * nx).toFixed(1),
        (0 + s * uy + t * ny).toFixed(1),
      ];

      const baseS = -0.18 * L;
      const tipS = tipRatio * L;
      const w = halfWidthRatio * L;
      const ctrlS = baseS + (tipS - baseS) * 0.44;
      const ctrlT = w * pinch;

      const [b1x, b1y] = toXY(baseS, w);
      const [c1x, c1y] = toXY(ctrlS, ctrlT);
      const [tx, ty] = toXY(tipS, 0);
      const [c2x, c2y] = toXY(ctrlS, -ctrlT);
      const [b2x, b2y] = toXY(baseS, -w);

      const fullPath = `M ${b1x} ${b1y} Q ${c1x} ${c1y} ${tx} ${ty} Q ${c2x} ${c2y} ${b2x} ${b2y} Z`;
      const topEdge = `M ${b1x} ${b1y} Q ${c1x} ${c1y} ${tx} ${ty}`;
      const botEdge = `M ${b2x} ${b2y} Q ${c2x} ${c2y} ${tx} ${ty}`;

      cutFill.setAttribute('d', fullPath);
      cutClipPath.setAttribute('d', fullPath);
      shadowTop.setAttribute('d', topEdge);
      shadowBot.setAttribute('d', botEdge);
      bevelTop.setAttribute('d', topEdge);
      bevelBot.setAttribute('d', botEdge);

      shadowTop.setAttribute('stroke-width', shadowWidth.toFixed(1));
      shadowBot.setAttribute('stroke-width', (shadowWidth * 0.85).toFixed(1));
    };

    slashTimer = window.setTimeout(() => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      svgEl.setAttribute('viewBox', `0 0 ${W} ${H}`);

      const SLASH_MS = 400;
      const HOLD_MS = 130;
      const OPEN_MS = 540;
      const TOTAL_MS = SLASH_MS + HOLD_MS + OPEN_MS;
      const start = performance.now();

      const tick = (now: number) => {
        const elapsed = now - start;
        if (elapsed <= SLASH_MS) {
          const p = easeOutExpo(elapsed / SLASH_MS);
          renderSlash(W, H, lerp(0.02, 0.86, p), lerp(0.002, 0.056, p), 0.14, lerp(6, 13, p));
        } else if (elapsed <= SLASH_MS + HOLD_MS) {
          const p = (elapsed - SLASH_MS) / HOLD_MS;
          renderSlash(W, H, lerp(0.86, 0.9, p), lerp(0.056, 0.068, p), lerp(0.14, 0.17, p), lerp(13, 15, p));
        } else if (elapsed <= TOTAL_MS) {
          const p = easeInOutQuart((elapsed - SLASH_MS - HOLD_MS) / OPEN_MS);
          renderSlash(W, H, lerp(0.9, 1.85, p), lerp(0.068, 1.65, p), lerp(0.17, 1.15, p), lerp(15, 30, p));
        } else {
          overlay.classList.add('opacity-0', 'invisible', 'pointer-events-none');
          window.dispatchEvent(new CustomEvent('aqua:intro-done'));
          rafId = null;
          return;
        }
        rafId = requestAnimationFrame(tick);
      };

      rafId = requestAnimationFrame(tick);
    }, 830);
  }

