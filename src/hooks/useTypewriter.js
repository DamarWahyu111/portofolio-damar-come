import { useEffect, useRef, useState } from "react";

export default function useTypewriter(
  text,
  { speed = 85, startDelay = 300, loop = false } = {}
) {
  const [out, setOut] = useState("");
  const timers = useRef([]);

  useEffect(() => {
    let i = 0;
    let cancelled = false;

    const start = setTimeout(function tick() {
      if (cancelled) return;
      setOut(text.slice(0, i));
      i++;
      if (i <= text.length) {
        const t = setTimeout(tick, speed);
        timers.current.push(t);
      } else if (loop) {
        const t = setTimeout(() => {
          i = 0;
          tick();
        }, 800);
        timers.current.push(t);
      }
    }, startDelay);

    timers.current.push(start);
    return () => {
      cancelled = true;
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [text, speed, startDelay, loop]);

  return out;
}
