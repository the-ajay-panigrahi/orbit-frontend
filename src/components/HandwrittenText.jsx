import { motion } from "motion/react";

/**
 * HandwrittenText - An accessible, GPU-accelerated handwritten text component.
 *
 * Simulates a realistic ink pen writing effect letter-by-letter with spring physics,
 * followed by a hand-drawn SVG underline flourish.
 *
 * Accessibility:
 * Uses `aria-label` on the wrapper with `aria-hidden` on individual character spans
 * so screen readers pronounce the word naturally rather than spelling it out.
 */
export default function HandwrittenText({
  text = "move with you.",
  className = "",
  underlineClassName = "",
  startDelay = 0.25,
  staggerSpeed = 0.045,
}) {
  const characters = Array.from(text);
  const totalTypingTime = startDelay + characters.length * staggerSpeed;

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: startDelay,
        staggerChildren: staggerSpeed,
      },
    },
  };

  const charVariants = {
    hidden: {
      opacity: 0,
      y: 4,
      scale: 0.85,
      filter: "blur(1px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 350,
        damping: 18,
      },
    },
  };

  const underlineVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0,
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: {
          delay: totalTypingTime + 0.08,
          duration: 0.5,
          ease: [0.25, 1, 0.5, 1], // Natural pen flick deceleration
        },
        opacity: {
          delay: totalTypingTime + 0.08,
          duration: 0.15,
        },
      },
    },
  };

  return (
    <span
      className={`relative inline-block font-handwriting select-none ${className}`}
      aria-label={text}
    >
      <motion.span
        className="inline-flex flex-nowrap"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        aria-hidden="true"
      >
        {characters.map((char, index) => (
          <motion.span
            key={`${char}-${index}`}
            variants={charVariants}
            className="inline-block"
            style={{
              // Preserve whitespace width naturally
              whiteSpace: char === " " ? "pre" : "normal",
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.span>

      {/* Hand-drawn underline swoosh */}
      <svg
        className={`absolute -bottom-2.5 left-0 w-full h-3.5 text-primary/60 overflow-visible pointer-events-none ${underlineClassName}`}
        viewBox="0 0 200 12"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <motion.path
          d="M 3 9 C 55 2, 130 11, 197 5"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          variants={underlineVariants}
          initial="hidden"
          animate="visible"
        />
      </svg>
    </span>
  );
}
