export default function HandDrawnArrow({
  label,
  icon: Icon,
  iconClassName = "",
  variant = "top-to-bottom",
  className = "",
}) {
  return (
    <div
      className={`hidden md:flex flex-col items-center justify-center relative select-none pointer-events-none px-2 py-1 ${className}`}
    >
      {label && (
        <div className="font-handwriting text-primary text-base lg:text-lg font-bold tracking-wide -rotate-2 mb-1.5 drop-shadow-xs flex items-center gap-1.5 whitespace-nowrap">
          <span>{label}</span>
          {Icon && (
            <Icon className={`w-4 h-4 stroke-[2.3] shrink-0 ${iconClassName}`} />
          )}
        </div>
      )}
      {variant === "top-to-bottom" ? (
        <svg
          width="132"
          height="52"
          viewBox="0 0 132 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary/85 overflow-visible drop-shadow-xs"
        >
          {/* Smooth organic curve flowing left-to-right with arch */}
          <path
            d="M 8 36 C 36 12, 74 12, 112 26"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          {/* Crisp, unmistakable forward-pointing arrowhead with 20px right margin */}
          <path
            d="M 98 18 L 114 26 L 99 34"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg
          width="132"
          height="52"
          viewBox="0 0 132 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary/85 overflow-visible drop-shadow-xs"
        >
          {/* Second connector with organic dip flowing left-to-right */}
          <path
            d="M 8 18 C 38 40, 76 40, 112 25"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          {/* Crisp, unmistakable forward-pointing arrowhead with 20px right margin */}
          <path
            d="M 98 17 L 114 25 L 99 33"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}
