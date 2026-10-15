import { useEffect } from 'react';

/** Presentation remains readable without observers or animation support. */
export function usePresentation(routeKey: string) {
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const root = document.documentElement;
    let frame = 0;
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer?.unobserve(entry.target);
      }
    }, { threshold: 0.07 }) : null;
    document.querySelectorAll('[data-reveal]').forEach(element => observer?.observe(element));
    function paint() {
      const distance = Math.max(1, root.scrollHeight - window.innerHeight);
      root.style.setProperty('--reading-progress', `${Math.min(window.scrollY / distance, 1)}`);
      root.style.setProperty('--hero-shift', media.matches ? '0px' : `${Math.min(window.scrollY * 0.12, 55)}px`);
      root.classList.toggle('page-scrolled', window.scrollY > 90);
      root.classList.toggle('show-back-top', window.scrollY > 650);
      frame = 0;
    }
    function scroll() { if (!frame) frame = requestAnimationFrame(paint); }
    paint();
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('resize', scroll);
    media.addEventListener('change', scroll);
    return () => {
      observer?.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('resize', scroll);
      media.removeEventListener('change', scroll);
    };
  }, [routeKey]);
}
