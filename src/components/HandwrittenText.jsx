import { motion } from "motion/react";

/**
 * HandwrittenText — Organic ink-pen writing effect with full-width underline.
 *
 * Each character springs into view from below with rotation and blur,
 * simulating a pen nib pressing ink onto paper. Once the final character
 * settles, a thick hand-drawn underline swooshes across the entire phrase.
 *
 * The SVG underline uses `left-0 right-0` to match the exact width of
 * its `inline-block` parent at any viewport size — no calc() hacks.
 */
export default function HandwrittenText({
  text = "move with you.",
  className = "",
  underlineClassName = "",
  startDelay = 0.4,
  charStagger = 0.055,
}) {
  const characters = Array.from(text);
  const underlineDelay = startDelay + characters.length * charStagger + 0.28;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: charStagger,
        delayChildren: startDelay,
      },
    },
  };

  const charVariants = {
    hidden: {
      opacity: 0,
      y: 10,
      scale: 0.55,
      rotateZ: -8,
      filter: "blur(3px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateZ: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 14,
        mass: 0.5,
      },
    },
  };

  return (
    <span
      className={`relative inline-block font-handwriting select-none whitespace-nowrap ${className}`}
      aria-label={text}
    >
      <motion.span
        className="inline-flex items-baseline"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        aria-hidden="true"
      >
        {characters.map((char, index) => (
          <motion.span
            key={`${char}-${index}`}
            variants={charVariants}
            className="inline-block origin-bottom-left"
            style={{ whiteSpace: char === " " ? "pre" : "normal" }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.span>

      {/* Thick, dark, edge-to-edge underline swoosh */}
      <svg
        className={`absolute -bottom-1.5 left-0 w-full h-5 overflow-visible pointer-events-none text-base-content/75 ${underlineClassName}`}
        viewBox="0 0 100 12"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <motion.path
          d="M 1 9 C 30 3, 70 12, 99 5"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: {
              delay: underlineDelay,
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            },
            opacity: {
              delay: underlineDelay,
              duration: 0.08,
            },
          }}
        />
      </svg>
    </span>
  );
}
