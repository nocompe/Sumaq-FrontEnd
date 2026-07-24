// Reveal on-scroll reutilizable para páginas del landing (usa motion/react)
export const rise = (delay = 0, from: 'up' | 'zoom' | 'left' | 'right' = 'up') => {
  const hidden =
    from === 'zoom' ? { opacity: 0, scale: 0.92 } :
    from === 'left' ? { opacity: 0, x: -40 } :
    from === 'right' ? { opacity: 0, x: 40 } :
    { opacity: 0, y: 28 };
  return {
    initial: hidden,
    whileInView: { opacity: 1, x: 0, y: 0, scale: 1 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
  };
};
