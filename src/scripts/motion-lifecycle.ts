import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { startPaperCutIntro, stopIntro } from './intro';

gsap.registerPlugin(ScrollTrigger);

const INTRO_KEY = 'aqua_intro_played';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let introGuard: ReturnType<typeof setTimeout> | null = null;
let removeReplayListener: (() => void) | null = null;
let heroTimeline: gsap.core.Timeline | null = null;
let revealGuard: ReturnType<typeof setTimeout> | null = null;

let ctx: gsap.Context | null = null;
let lenis: Lenis | null = null;
let rafCallback: ((time: number) => void) | null = null;
let removeMouseListener: (() => void) | null = null;

function hideHeroBeforeIntro() {
  heroTimeline?.kill();
  if (revealGuard !== null) clearTimeout(revealGuard);
  gsap.set('[data-hero-line]', { strokeDashoffset: 100, opacity: 0 });
  gsap.set('[data-hero-orbit]', { opacity: 0, rotate: -22, transformOrigin: '50% 50%' });
  gsap.set('[data-hero-shard]', { opacity: 0, x: -34, y: 22, scale: 0.92 });
  gsap.set('[data-hero-star]', { opacity: 0, scale: 0, rotate: -45, transformOrigin: '50% 50%' });
  gsap.set('[data-hero-text]', { opacity: 0, y: 20, filter: 'blur(6px)' });
  gsap.set('[data-dream-card]', { opacity: 0, y: 28, scale: 0.96 });
}

export function playHeroReveal(baseDelay = 0) {
  if (!document.querySelector('[data-hero-stage]')) return;

  heroTimeline?.kill();
  const tl = gsap.timeline({ paused: true, delay: baseDelay });
  heroTimeline = tl;

  // 第 1 拍：1px 黑色制图线与虚线轨道先行绘出
  tl.to('[data-hero-line]', {
    strokeDashoffset: 0,
    opacity: 1,
    duration: 0.72,
    stagger: 0.05,
    ease: 'expo.out',
  })
    .to(
      '[data-hero-orbit]',
      { opacity: 1, rotate: 0, duration: 0.85, stagger: 0.08, ease: 'power3.out' },
      '-=0.58'
    )
    // 第 2 拍：克莱因蓝几何飞鸟碎片斜向切入
    .to(
      '[data-hero-shard]',
      { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.65, stagger: 0.06, ease: 'power4.out' },
      '-=0.52'
    )
    // 第 3 拍：朱红四角星芒定格 + 右侧 Aqua 简介与梦核卡片依次浮现
    .to(
      '[data-hero-star]',
      { opacity: 1, scale: 1, rotate: 0, duration: 0.5, stagger: 0.08, ease: 'back.out(2.2)' },
      '-=0.38'
    )
    .to(
      '[data-hero-text]',
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.72,
        stagger: 0.11,
        ease: 'power3.out',
      },
      '-=0.45'
    )
    .to(
      '[data-dream-card]',
      { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.09, ease: 'power3.out' },
      '-=0.42'
    );
  gsap.ticker.wake();
  tl.play(0);
  // Restore the readable baseline even if animation frames are suspended.
  revealGuard = setTimeout(() => {
    tl.progress(1);
    revealGuard = null;
  }, 3000);
}

function setupMouseParallaxAndHud() {
  const hud = document.getElementById('coord-hud');
  const layers = Array.from(document.querySelectorAll<HTMLElement | SVGElement>('[data-parallax]'));
  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

  const movers = isCoarsePointer
    ? []
    : layers.map((el) => ({
        depth: Number(el.dataset.parallax || 1),
        xTo: gsap.quickTo(el, 'x', { duration: 0.65, ease: 'power3.out' }),
        yTo: gsap.quickTo(el, 'y', { duration: 0.65, ease: 'power3.out' }),
      }));

  const onMove = (e: MouseEvent) => {
    if (hud) {
      const xStr = e.clientX.toFixed(1).padStart(6, '0');
      const yStr = e.clientY.toFixed(1).padStart(6, '0');
      hud.textContent = `X:${xStr} / Y:${yStr}`;
    }

    if (!movers.length) return;
    const nx = (e.clientX / window.innerWidth - 0.5) * 2;
    const ny = (e.clientY / window.innerHeight - 0.5) * 2;
    for (const m of movers) {
      m.xTo(nx * 14 * m.depth);
      m.yTo(ny * 10 * m.depth);
    }
  };

  window.addEventListener('mousemove', onMove, { passive: true });
  return () => window.removeEventListener('mousemove', onMove);
}


function hasPlayedIntro() {
  try { return sessionStorage.getItem(INTRO_KEY) === '1'; }
  catch { return false; }
}

function finishIntro() {
  if (introGuard !== null) { clearTimeout(introGuard); introGuard = null; }
  stopIntro();
  document.getElementById('intro-overlay')?.classList.add('is-skipped');
  lenis?.start();
  try { sessionStorage.setItem(INTRO_KEY, '1'); } catch { /* Storage can be disabled. */ }
  ctx?.reveal();
}

function beginIntro() {
  stopIntro();
  if (introGuard !== null) clearTimeout(introGuard);
  // Schedule recovery before hiding content so an interrupted intro cannot block reading.
  introGuard = setTimeout(finishIntro, 4000);
  lenis?.scrollTo(0, { immediate: true });
  lenis?.stop();
  ctx?.hide();
  startPaperCutIntro();
}

function initMotion() {
  cleanupMotion();
  if (reducedMotion.matches) {
    document.getElementById('intro-overlay')?.classList.add('is-skipped');
    return;
  }
  const hasHero = Boolean(document.querySelector('[data-hero-stage]'));
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  if (!coarsePointer) {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true, anchors: true });
    lenis.on('scroll', ScrollTrigger.update);
    rafCallback = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(rafCallback);
  }

  ctx = gsap.context((self) => {
    self.add('hide', hideHeroBeforeIntro);
    self.add('reveal', () => {
      if (hasHero) playHeroReveal(0.02);
    });
    removeMouseListener = setupMouseParallaxAndHud();
    const divider = document.querySelector('[data-construct-divider]');
    if (divider) {
      for (const [selector, x] of [['[data-divider-left]', 36], ['[data-divider-right]', -36]] as const) {
        gsap.fromTo(selector, { x, opacity: 0.25 }, {
          x: 0, opacity: 1, ease: 'none',
          scrollTrigger: { trigger: divider, start: 'top 88%', end: 'top 35%', scrub: 0.8 },
        });
      }
      gsap.to('[data-divider-ring]', {
        rotate: 90, transformOrigin: '50% 50%', ease: 'none',
        scrollTrigger: { trigger: divider, start: 'top 95%', end: 'bottom 10%', scrub: 0.8 },
      });
    }
  });

  if (hasHero) {
    if (!hasPlayedIntro()) beginIntro();
    else { ctx.hide(); ctx.reveal(); }
    const replayBtn = document.getElementById('replay-intro-btn');
    replayBtn?.addEventListener('click', beginIntro);
    removeReplayListener = () => replayBtn?.removeEventListener('click', beginIntro);
  }
  ScrollTrigger.refresh();
}

function cleanupMotion() {
  if (revealGuard !== null) { clearTimeout(revealGuard); revealGuard = null; }
  heroTimeline?.kill(); heroTimeline = null;
  if (introGuard !== null) { clearTimeout(introGuard); introGuard = null; }
  stopIntro();
  removeReplayListener?.(); removeReplayListener = null;
  removeMouseListener?.(); removeMouseListener = null;
  ctx?.revert(); ctx = null;
  if (rafCallback) { gsap.ticker.remove(rafCallback); rafCallback = null; }
  lenis?.destroy(); lenis = null;
}

window.addEventListener('aqua:intro-done', finishIntro);
document.addEventListener('astro:page-load', initMotion);
document.addEventListener('astro:before-swap', cleanupMotion);
reducedMotion.addEventListener('change', initMotion);
