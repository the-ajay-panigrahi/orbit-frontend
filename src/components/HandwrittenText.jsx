import { useState, useEffect } from "react";
import { motion } from "motion/react";

/**
 * HandwrittenText - An authentic character-by-character typewriter effect
 * followed by a full-width hand-drawn SVG underline flourish.
 *
 * Sequence:
 * 1. Mounts with full text pre-measured in layout (Zero CLS layout shift).
 * 2. Types every character one by one ('m', 'o', 'v', 'e', ' ', 'w', 'i', 't', 'h', ' ', 'y', 'o', 'u', '.').
 * 3. Once the final full stop '.' is rendered, pauses for a natural beat (200ms).
 * 4. THEN triggers the hand-drawn SVG underline, which sweeps across the entire
 *    bottom baseline from under 'm' all the way under and past the full stop '.'.
 */
export default function HandwrittenText({
  text = "move with you.",
  className = "",
  underlineClassName = "",
  startDelay = 400,
  charSpeed = 80,
}) {
  const characters = Array.from(text);
  const [visibleCount, setVisibleCount] = useState(0);
  const [isTypingDone, setIsTypingDone] = useState(false);

  useEffect(() => {
    let intervalId;
    const startTimeout = setTimeout(() => {
      let count = 0;
      intervalId = setInterval(() => {
        count += 1;
        setVisibleCount(count);

        // When all characters including the full stop are typed
        if (count >= characters.length) {
          clearInterval(intervalId);
          // Wait a natural human beat after the full stop, THEN trigger the underline
          setTimeout(() => {
            setIsTypingDone(true);
          }, 220);
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
              className={`inline-block ${
                isTyped ? "opacity-100" : "opacity-0"
              }`}
              style={{
                // Preserve whitespace naturally without collapsing
                whiteSpace: char === " " ? "pre" : "normal",
                transform: isTyped && isCurrent ? "scale(1.06)" : "scale(1)",
                transition: "transform 75ms ease-out, opacity 40ms ease-in",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          );
        })}
      </span>

      {/* Hand-drawn underline swoosh spanning the FULL phrase from 'm' to past the full stop '.' */}
      <svg
        className={`absolute -bottom-2 -left-1 h-4 text-primary/70 overflow-visible pointer-events-none ${underlineClassName}`}
        style={{ width: "calc(100% + 8px)" }}
        viewBox="0 0 320 16"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <motion.path
          d="M 3 11 C 60 3, 130 14, 195 7 C 245 2, 290 11, 318 6"
          stroke="currentColor"
          strokeWidth="3.4"
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
            pathLength: { duration: 0.58, ease: [0.22, 1, 0.36, 1] },
            opacity: { duration: 0.1 },
          }}
        />
      </svg>
    </span>
  );
}
