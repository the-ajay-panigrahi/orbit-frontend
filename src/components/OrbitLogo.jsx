export default function OrbitLogo({ className = "w-6 h-6", glow = false }) {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      {glow && (
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-md pointer-events-none" />
      )}
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-primary"
      >
        {/* Outer Orbital Ellipse */}
        <ellipse
          cx="16"
          cy="16"
          rx="13.5"
          ry="6.5"
          transform="rotate(-28 16 16)"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          className="opacity-90"
        />

        {/* Secondary Cross Orbital Ring */}
        <ellipse
          cx="16"
          cy="16"
          rx="13.5"
          ry="5.5"
          transform="rotate(38 16 16)"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeDasharray="3 3"
          className="opacity-40"
        />

        {/* Radiant Celestial Nucleus */}
        <circle cx="16" cy="16" r="4" fill="currentColor" />

        {/* Orbiting Satellite Node */}
        <circle
          cx="27"
          cy="11"
          r="2.2"
          fill="currentColor"
          className="animate-pulse"
        />
      </svg>
    </div>
  );
}
