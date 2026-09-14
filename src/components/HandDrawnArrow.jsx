export default function HandDrawnArrow({
  label,
  variant = "top-to-bottom",
  className = "",
}) {
  return (
    <div
      className={`hidden md:flex flex-col items-center justify-center relative select-none pointer-events-none px-2 py-1 ${className}`}
    >
      {label && (
        <span className="font-handwriting text-primary text-base lg:text-lg font-bold tracking-wide -rotate-3 mb-1 drop-shadow-xs whitespace-nowrap">
          {label}
        </span>
      )}
      {variant === "top-to-bottom" ? (
        <svg
          width="136"
          height="68"
          viewBox="-4 -4 140 72"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary/80 overflow-visible drop-shadow-xs"
        >
          {/* Thick organic bezier curve swooping from top to bottom */}
          <path
            d="M 10 12 C 45 4, 75 8, 85 26 C 92 40, 78 52, 65 48 C 50 44, 55 24, 75 22 C 95 20, 115 38, 124 44"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          {/* Bold hand-drawn arrowhead */}
          <path
            d="M 112 36 L 124 44 L 115 54"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg
          width="136"
          height="68"
          viewBox="-4 -4 140 72"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary/80 overflow-visible drop-shadow-xs"
        >
          {/* Second connector with organic looping curve */}
          <path
            d="M 8 20 C 40 45, 65 52, 85 40 C 105 28, 95 10, 80 14 C 65 18, 75 38, 95 38 C 110 38, 118 28, 124 22"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          {/* Bold hand-drawn arrowhead */}
          <path
            d="M 114 16 L 124 22 L 118 32"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}
