import { useState, useEffect } from "react";
import { motion } from "motion/react";

/**
 * HandwrittenText - An authentic character-by-character typewriter effect
 * followed by a full-width hand-drawn SVG underline flourish.
 *
 * Performance & A11y:
 * 1. Zero Layout Shift (CLS): Renders characters in place with `opacity-0` / `opacity-100`
 *    so the container dimensions are static from frame 0.
 * 2. True Character Typing: Emits each letter one by one with a rhythmic typewriter cadence.
 * 3. Responsive SVG Underline: Uses `style={{ width: "100%" }}` and `preserveAspectRatio="none"`
 *    with a path spanning the full 0-100% coordinate space so the line stretches
 *    cleanly under "move", "with", and "you." across all screen sizes.
 * 4. A11y: Screen readers announce the entire phrase cleanly via `aria-label`.
 */
export default function HandwrittenText({
  text = "move with you.",
  className = "",
  underlineClassName = "",
  startDelay = 350,
  charSpeed = 70,
}) {
  const characters = Array.from(text);
  const [visibleCount, setVisibleCount] = useState(0);
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    let intervalId;
    const startTimeout = setTimeout(() => {
      let count = 0;
      intervalId = setInterval(() => {
        count += 1;
        setVisibleCount(count);
        if (count >= characters.length) {
          clearInterval(intervalId);
          setIsTypingDone(true);
          // Fade out the typing cursor after a brief pause
          setTimeout(() => setCursorVisible(false), 500);
        }
      }, charSpeed);
    }, startDelay);

    return () => {
      clearTimeout(startTimeout);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, startDelay, charSpeed, characters.length]);

  return (
    <span
      className={`relative inline-block font-handwriting select-none whitespace-nowrap ${className}`}
      aria-label={text}
    >
      <span className="inline-flex items-baseline" aria-hidden="true">
        {characters.map((char, index) => {
          const isTyped = index < visibleCount;
          const isCurrent = index === visibleCount - 1;

          return (
            <span
              key={`${char}-${index}`}
              className={`inline-block transition-opacity duration-75 ${
                isTyped ? "opacity-100" : "opacity-0"
              }`}
              style={{
                // Preserve whitespace naturally without collapsing
                whiteSpace: char === " " ? "pre" : "normal",
                transform: isTyped && isCurrent ? "scale(1.08)" : "scale(1)",
                transition: "transform 80ms ease-out, opacity 50ms ease-in",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          );
        })}

        {/* Realistic typewriter blinking cursor */}
        {cursorVisible && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 0.55, ease: "easeInOut" }}
            className="inline-block text-primary/70 font-sans font-light -ml-0.5 select-none"
            style={{ fontSize: "0.85em", verticalAlign: "baseline" }}
          >
            |
          </motion.span>
        )}
      </span>

      {/* Hand-drawn underline swoosh spanning the FULL phrase ("move with you.") */}
      <svg
        className={`absolute -bottom-2.5 left-0 h-4 text-primary/65 overflow-visible pointer-events-none ${underlineClassName}`}
        style={{ width: "100%" }}
        viewBox="0 0 300 14"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <motion.path
          d="M 2 10 C 50 3, 110 13, 170 7 C 220 3, 265 11, 298 6"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            isTypingDone
              ? { pathLength: 1, opacity: 1 }
              : { pathLength: 0, opacity: 0 }
          }
          transition={{
            pathLength: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
            opacity: { duration: 0.12 },
          }}
        />
      </svg>
    </span>
  );
}
