import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Zap,
  Users,
  ArrowRight,
  Palette,
  Check,
  ShieldCheck,
  Play,
  Pause,
  ArrowLeft,
  Compass,
  Target,
  MessageSquare,
} from "lucide-react";
import OrbitLogo from "./OrbitLogo";
import UserCard from "./UserCard";
import Card3DZoomModal from "./Card3DZoomModal";
import PlanCards from "./PlanCards";

// Curated showcase themes for quick real-time interaction
const FEATURED_THEMES = [
  "bumblebee",
  "dracula",
  "synthwave",
  "nord",
  "cyberpunk",
  "retro",
  "luxury",
  "dim",
];

// Realistic builder profiles using Orbit's exact UserCard schema
const MOCK_FOUNDERS = [
  {
    _id: "demo-founder-1",
    firstName: "Sarah",
    lastName: "Guo",
    age: 34,
    gender: "female",
    about:
      "Founder of Conviction. Early-stage investor backing technical founders building intelligent software.",
    lookingFor: "Early-stage AI Founders",
    skills: ["AI Systems", "Seed Capital", "Go-To-Market", "Scale"],
    profilePictureUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=75&w=600&auto=format&fit=crop&crop=faces",
    defaultAction: "right",
  },
  {
    _id: "demo-founder-2",
    firstName: "Elon",
    lastName: "Musk",
    age: 52,
    gender: "male",
    about:
      "Engineering from first principles. Building reusable orbital rockets, electric vehicles, and neural interfaces.",
    lookingFor: "Hardcore AI & Systems Engineers",
    skills: ["Architecture", "Physics", "Autonomous Systems", "Robotics"],
    profilePictureUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=75&w=600&auto=format&fit=crop&crop=faces",
    defaultAction: "left",
  },
  {
    _id: "demo-founder-3",
    firstName: "Alex",
    lastName: "Morgan",
    age: 28,
    gender: "female",
    about:
      "Product designer crafting modern web interfaces, micro-interactions, and design systems for builder tools.",
    lookingFor: "Full-stack Developers for SaaS MVP",
    skills: ["UI/UX Design", "Figma", "Design Systems", "Tailwind CSS"],
    profilePictureUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=75&w=600&auto=format&fit=crop&crop=faces",
    defaultAction: "right",
  },
];

export default function LandingPage() {
  const user = useSelector((store) => store.user);
  const { theme, setTheme } = useOutletContext() || {};
  const [deck, setDeck] = useState(MOCK_FOUNDERS);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [matchCelebration, setMatchCelebration] = useState(null);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Gesture and fly-out states (exact same architecture as Feed.jsx)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [flyDirection, setFlyDirection] = useState(null);
  const [isActionPending, setIsActionPending] = useState(false);

  const dragStartRef = useRef({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const currentUser = deck[0];
  const nextUser = deck.length > 1 ? deck[1] : null;

  // Exact swipe trigger from Feed.jsx with celebratory match teaser
  const triggerSwipeAction = useCallback(
    (direction, targetUser) => {
      if (!targetUser || isActionPending) return;

      setIsActionPending(true);
      setFlyDirection(direction);

      if (direction === "right") {
        setMatchCelebration(targetUser);
      }

      setTimeout(() => {
        // Rotate deck: move top card to end of deck so demo loops smoothly
        setDeck((prev) => {
          if (prev.length <= 1) return prev;
          const [first, ...rest] = prev;
          return [...rest, first];
        });
        setFlyDirection(null);
        setDragOffset({ x: 0, y: 0 });
        setIsActionPending(false);
      }, 260);
    },
    [isActionPending],
  );

  // Auto-dismiss match celebration after 4.5s
  useEffect(() => {
    if (!matchCelebration) return;
    const timer = setTimeout(() => {
      setMatchCelebration(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [matchCelebration]);

  // Keyboard navigation for card deck (ArrowLeft: Pass, ArrowRight: Connect, Space: Play/Pause)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        ["INPUT", "TEXTAREA", "SELECT"].includes(e.target?.tagName) ||
        e.target?.isContentEditable
      ) {
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        triggerSwipeAction("left", currentUser);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        triggerSwipeAction("right", currentUser);
      } else if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        setIsAutoplay((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentUser, triggerSwipeAction]);

  // Autoplay Swiping Timer (starts after 7.5s initial delay to prevent CLS, then every 5s)
  const hasMountedRef = useRef(false);
  useEffect(() => {
    if (
      !isAutoplay ||
      isHovered ||
      isDragging ||
      isActionPending ||
      isZoomOpen ||
      !currentUser
    ) {
      return;
    }

    const initialDelay = hasMountedRef.current ? 5000 : 7500;
    hasMountedRef.current = true;

    const timer = setTimeout(() => {
      const direction = currentUser.defaultAction || "right";
      triggerSwipeAction(direction, currentUser);
    }, initialDelay);

    return () => clearTimeout(timer);
  }, [
    isAutoplay,
    isHovered,
    isDragging,
    isActionPending,
    isZoomOpen,
    currentUser,
    triggerSwipeAction,
  ]);

  // Pointer event handlers (exact same as Feed.jsx / useFeed.js)
  const handlePointerDown = (e) => {
    if (isActionPending || !currentUser) return;
    if (e.target.closest("button")) return;

    dragStartRef.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = (e.clientY - dragStartRef.current.y) * 0.4;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore if pointer capture already released
    }

    const threshold = 110;
    const deltaX = Math.abs(dragOffset.x);
    const deltaY = Math.abs(dragOffset.y);

    // Tap detection: if movement was minimal, open enlarged 3D zoom modal
    if (deltaX < 8 && deltaY < 8) {
      setIsZoomOpen(true);
      setDragOffset({ x: 0, y: 0 });
      return;
    }

    if (dragOffset.x > threshold) {
      triggerSwipeAction("right", currentUser);
    } else if (dragOffset.x < -threshold) {
      triggerSwipeAction("left", currentUser);
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const handlePointerCancel = () => {
    if (isDragging) {
      setIsDragging(false);
      setDragOffset({ x: 0, y: 0 });
    }
  };

  // Exact card styling and stamp opacity math from Feed.jsx
  const rotationDeg = isDragging
    ? dragOffset.x * 0.08
    : flyDirection === "right"
      ? 28
      : flyDirection === "left"
        ? -28
        : 0;

  const translateX =
    flyDirection === "right"
      ? 650
      : flyDirection === "left"
        ? -650
        : dragOffset.x;

  const translateY = flyDirection ? 40 : dragOffset.y;

  const cardStyle = {
    transform: `translate3d(${translateX}px, ${translateY}px, 0) rotate(${rotationDeg}deg)`,
    transition: isDragging
      ? "none"
      : "transform 0.28s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.25s ease",
    opacity: flyDirection ? 0 : 1,
    cursor: isDragging ? "grabbing" : "grab",
  };

  const connectStampOpacity = isDragging
    ? Math.min(Math.max(dragOffset.x - 20, 0) / 90, 1)
    : flyDirection === "right"
      ? 1
      : 0;

  const passStampOpacity = isDragging
    ? Math.min(Math.max(-dragOffset.x - 20, 0) / 90, 1)
    : flyDirection === "left"
      ? 1
      : 0;

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* ─── Hero Section ────────────────────────────────────────── */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-10 pb-20 sm:pt-14 sm:pb-28 max-w-7xl mx-auto w-full">
        {/* Subtle decorative background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Positioning, CTAs */}
          <motion.div
            className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-base-100 border border-base-content/10 shadow-xs text-xs font-semibold text-base-content/80">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Intentional Professional Discovery</span>
            </div>

            {/* Main Headline & Tagline */}
            <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-base-content leading-[1.12] break-words">
              Find the people who{" "}
              <span className="text-primary underline decoration-primary/30 decoration-wavy underline-offset-8">
                move with you.
              </span>
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-sm lg:text-base text-base-content/75 max-w-xl leading-relaxed">
              Orbit is the professional networking and collaboration network
              for founders, developers, designers, marketers, and startup operators
              to discover the right partners to build, connect, and grow with.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-center lg:justify-start gap-3 pt-1 w-full xs:w-auto">
              <Link
                to={user ? "/feed" : "/login?mode=signup"}
                className="btn btn-sm sm:btn-md btn-primary px-5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer w-full xs:w-auto"
              >
                <span>{user ? "Open Feed" : "Get Started Free"}</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.2] transition-transform group-hover:translate-x-0.5" />
              </Link>

              <a
                href="#how-it-works"
                className="btn btn-sm sm:btn-md btn-outline border-base-content/20 hover:bg-base-200 text-base-content px-5 rounded-xl font-semibold transition-all cursor-pointer w-full xs:w-auto text-center flex items-center justify-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5 stroke-[2]" />
                <span>How It Works</span>
              </a>
            </div>

            {/* Value Props Bar */}
            <div className="pt-5 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-base-content/65 border-t border-base-content/10 w-full max-w-lg">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-primary stroke-[2] shrink-0" />
                <span>Double-Opt-In Matches</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-warning stroke-[2] shrink-0" />
                <span>Zero Cold DM Spam</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-primary stroke-[2] shrink-0" />
                <span>Startup Ecosystem</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Exact Feed Card Stack with UserCard & Swipe Gestures */}
          <motion.div
            className="lg:col-span-5 flex flex-col items-center justify-center select-none"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Deck Controls & Status Header */}
            <div className="w-full max-w-sm flex items-center justify-between px-2 mb-3 text-xs font-mono text-base-content/60">
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  {isAutoplay && !isHovered ? (
                    <>
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                    </>
                  ) : (
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-base-content/30" />
                  )}
                </span>
                <span>
                  {isHovered
                    ? "Paused on hover"
                    : isAutoplay
                      ? "Auto-play demo"
                      : "Demo paused"}
                </span>
              </span>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-base-200/90 text-base-content border border-base-content/20 text-xs font-semibold tracking-wide shadow-2xs select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span>Demo Profile</span>
                </span>
                <span>•</span>
                <button
                  onClick={() => setIsAutoplay((prev) => !prev)}
                  className="hover:text-base-content flex items-center gap-1 text-[11px] cursor-pointer"
                  title={isAutoplay ? "Pause auto demo" : "Resume auto demo"}
                >
                  {isAutoplay ? (
                    <Pause className="w-3 h-3" />
                  ) : (
                    <Play className="w-3 h-3" />
                  )}
                  <span>{isAutoplay ? "Pause" : "Play"}</span>
                </button>
              </div>
            </div>

            {/* Exact Feed Card Stack */}
            <div className="relative w-full max-w-sm min-h-[440px] sm:min-h-[480px] flex items-center justify-center">
              {/* Peek Card (identical to Feed.jsx nextUser) */}
              {nextUser && (
                <div
                  key={nextUser._id}
                  className="absolute inset-0 pointer-events-none flex justify-center"
                  style={{
                    transform: isDragging
                      ? `scale(${Math.min(0.95 + Math.abs(dragOffset.x) * 0.0004, 1)}) translateY(${Math.max(12 - Math.abs(dragOffset.x) * 0.08, 0)}px)`
                      : "scale(0.95) translateY(12px)",
                    opacity: isDragging
                      ? Math.min(0.6 + Math.abs(dragOffset.x) * 0.003, 1)
                      : 0.65,
                    zIndex: 10,
                  }}
                >
                  <UserCard user={nextUser} showActions={false} />
                </div>
              )}

              {/* Foreground Interactive Card (identical to Feed.jsx currentUser) */}
              {currentUser && (
                <div
                  key={currentUser._id}
                  ref={cardRef}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerCancel}
                  style={cardStyle}
                  className="relative w-full z-20 touch-none flex justify-center"
                >
                  {/* Exact CONNECT Stamp from Feed.jsx */}
                  {connectStampOpacity > 0 && (
                    <div
                      style={{ opacity: connectStampOpacity }}
                      className="absolute top-7 left-7 z-30 pointer-events-none transform -rotate-12 border-4 border-success text-success bg-base-100/90 font-black text-xl tracking-widest px-4 py-1.5 rounded-2xl shadow-2xl uppercase"
                    >
                      CONNECT
                    </div>
                  )}

                  {/* Exact PASS Stamp from Feed.jsx */}
                  {passStampOpacity > 0 && (
                    <div
                      style={{ opacity: passStampOpacity }}
                      className="absolute top-7 right-7 z-30 pointer-events-none transform rotate-12 border-4 border-error text-error bg-base-100/90 font-black text-xl tracking-widest px-4 py-1.5 rounded-2xl shadow-2xl uppercase"
                    >
                      PASS
                    </div>
                  )}

                  {/* Reusable UserCard directly rendered */}
                  <UserCard
                    user={currentUser}
                    showActions={true}
                    onPass={() => triggerSwipeAction("left", currentUser)}
                    onConnect={() => triggerSwipeAction("right", currentUser)}
                  />
                </div>
              )}
            </div>

            {/* Micro hint below cards with keyboard shortcuts & 3D zoom hint */}
            <div className="hidden sm:flex items-center gap-3 mt-4 text-[11px] font-mono text-base-content/50">
              <span className="flex items-center gap-1">
                <kbd className="kbd kbd-xs bg-base-200">
                  <ArrowLeft className="w-3 h-3" />
                </kbd>
                <span>Pass</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <kbd className="kbd kbd-xs bg-base-200">
                  <ArrowRight className="w-3 h-3" />
                </kbd>
                <span>Connect</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <kbd className="kbd kbd-xs bg-base-200">Space</kbd>
                <span>{isAutoplay ? "Pause" : "Play"}</span>
              </span>
              <span>•</span>
              <span className="text-primary font-sans font-medium text-[11px]">
                Tap card to zoom
              </span>
            </div>

            {/* Celebratory "It's a Match!" Teaser Toast (reserved container prevents CLS) */}
            <div className="min-h-14 mt-2 w-full max-w-sm flex items-center justify-center">
              <AnimatePresence>
                {matchCelebration && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="w-full"
                  >
                    <div className="p-2.5 px-3.5 rounded-2xl border border-primary/20 bg-base-100/90 backdrop-blur-md shadow-lg flex items-center justify-between gap-3 text-base-content">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
                          <Sparkles className="w-3.5 h-3.5 stroke-[2.2]" />
                        </div>
                        <div className="truncate">
                          <p className="font-bold text-xs truncate">
                            Mutual Match with {matchCelebration.firstName}!
                          </p>
                          <p className="text-[11px] text-base-content/70 truncate">
                            Looking for{" "}
                            {matchCelebration.lookingFor || "collaborators"}
                          </p>
                        </div>
                      </div>
                      <Link
                        to="/login?mode=signup"
                        className="btn btn-xs btn-primary shrink-0 rounded-lg font-semibold gap-1 cursor-pointer shadow-xs"
                      >
                        <span>Join</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* 3D Elevated Zoom Inspection Modal for Landing Page */}
        <Card3DZoomModal
          isOpen={isZoomOpen}
          onClose={() => setIsZoomOpen(false)}
          user={currentUser}
          onPass={() => triggerSwipeAction("left", currentUser)}
          onConnect={() => triggerSwipeAction("right", currentUser)}
          showActions={true}
        />
      </section>

      {/* ─── Live In-Page Theme Switcher Showcase ───────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-base-100/50 border-y border-base-content/10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-base-200 border border-base-content/10 text-xs font-semibold text-base-content/70">
              <Palette className="w-3.5 h-3.5 text-primary" />
              <span>Instant Personalization</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-base-content">
              Your vibe, your palette. Choose a theme in real time.
            </h2>
            <p className="text-xs sm:text-sm text-base-content/60 max-w-lg mx-auto">
              Orbit adapts to your workflow. Click any theme below to instantly
              transform the entire interface.
            </p>
          </div>

          {/* Real-time Theme Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 max-w-3xl mx-auto">
            {FEATURED_THEMES.map((themeName) => {
              const isCurrent = theme === themeName;
              return (
                <button
                  key={themeName}
                  onClick={() => setTheme && setTheme(themeName)}
                  aria-label={`Select ${themeName} theme`}
                  className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    isCurrent
                      ? "bg-primary text-primary-content border-primary shadow-md scale-105"
                      : "bg-base-100 hover:bg-base-200/80 border-base-content/15 text-base-content/80 hover:text-base-content"
                  }`}
                >
                  <span className="capitalize">{themeName}</span>
                  {/* DaisyUI theme color palette dots */}
                  <span
                    data-theme={themeName}
                    className="flex gap-1 p-0.5 rounded-md bg-base-100/90 border border-base-content/10 shadow-2xs"
                  >
                    <span className="w-1.5 h-3 rounded-2xs bg-primary" />
                    <span className="w-1.5 h-3 rounded-2xs bg-secondary" />
                    <span className="w-1.5 h-3 rounded-2xs bg-accent" />
                  </span>
                  {isCurrent && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                </button>
              );
            })}
          </div>

          {/* Live Interactive Mini Preview Card in Selected Theme */}
          <div
            data-theme={theme || "caramellatte"}
            className="mt-6 max-w-sm mx-auto p-4 rounded-2xl bg-base-100 border border-base-content/15 shadow-xl text-left transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                SG
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-xs text-base-content truncate">
                    Sarah Guo
                  </h4>
                  <span className="badge badge-xs badge-primary font-mono font-bold">
                    PRO
                  </span>
                </div>
                <p className="text-[11px] text-base-content/60 truncate">
                  Early-stage AI Investor &amp; Builder
                </p>
              </div>
            </div>
            <div className="flex gap-1.5 mb-3 flex-wrap">
              <span className="badge badge-xs bg-base-200 text-base-content/80 font-mono">
                AI Systems
              </span>
              <span className="badge badge-xs bg-base-200 text-base-content/80 font-mono">
                Scale
              </span>
              <span className="badge badge-xs bg-base-200 text-base-content/80 font-mono">
                Founders
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-base-content/10">
              <span className="text-[10px] text-base-content/50 font-mono uppercase">
                Active Theme: {theme || "caramellatte"}
              </span>
              <span className="btn btn-xs btn-primary rounded-lg font-semibold shadow-xs pointer-events-none">
                Live Contrast
              </span>
            </div>
          </div>

          <div className="text-[11px] text-base-content/50 font-mono pt-2">
            Currently active theme:{" "}
            <span className="font-bold text-primary capitalize">
              {theme || "caramellatte"}
            </span>{" "}
            • 30+ more themes in top navigation
          </div>
        </div>
      </section>

      {/* ─── 3-Step Visual Story Flow ("How Orbit Works") ───────── */}
      <section
        id="how-it-works"
        className="px-4 sm:px-6 lg:px-8 py-20 sm:py-28 max-w-7xl mx-auto w-full"
      >
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-base-200 border border-base-content/15 text-xs font-semibold text-base-content">
            <Target className="w-3.5 h-3.5 text-primary stroke-[2]" />
            <span>The Orbit Journey</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-base-content">
            Discover • Connect • Match • Chat • Collaborate
          </h2>
          <p className="text-xs sm:text-sm text-base-content/70 max-w-2xl mx-auto leading-relaxed">
            Orbit is not about collecting passive followers. It is designed to take
            you from discovering someone relevant to communicating and building in the real world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {/* Step 1 */}
          <div className="spotlight-card group relative overflow-hidden h-full flex flex-col justify-start border border-base-content/15 rounded-3xl p-6 sm:p-8 space-y-4 hover:border-primary/40 hover:shadow-xl transition-all duration-300">
            <div className="relative z-10 w-12 h-12 rounded-2xl bg-base-200 border border-base-content/15 text-primary flex items-center justify-center font-bold text-lg shadow-2xs group-hover:scale-105 group-hover:border-primary/40 transition-transform duration-300">
              <Compass className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="relative z-10 space-y-1.5">
              <span className="badge badge-sm badge-neutral font-mono text-[10px] font-bold uppercase tracking-wider">
                Stage 01
              </span>
              <h3 className="text-lg font-bold text-base-content">
                Intent-Driven Discovery
              </h3>
            </div>
            <p className="relative z-10 text-xs sm:text-sm text-base-content/75 leading-relaxed">
              Discover founders, developers, designers, and startup operators filtered
              by concrete skills, active projects, and what you are both looking to build.
            </p>
          </div>

          {/* Step 2 */}
          <div className="spotlight-card group relative overflow-hidden h-full flex flex-col justify-start border border-base-content/15 rounded-3xl p-6 sm:p-8 space-y-4 hover:border-primary/40 hover:shadow-xl transition-all duration-300">
            <div className="relative z-10 w-12 h-12 rounded-2xl bg-base-200 border border-base-content/15 text-primary flex items-center justify-center font-bold text-lg shadow-2xs group-hover:scale-105 group-hover:border-primary/40 transition-transform duration-300">
              <Users className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="relative z-10 space-y-1.5">
              <span className="badge badge-sm badge-neutral font-mono text-[10px] font-bold uppercase tracking-wider">
                Stage 02
              </span>
              <h3 className="text-lg font-bold text-base-content">
                Double-Opt-In Matching
              </h3>
            </div>
            <p className="relative z-10 text-xs sm:text-sm text-base-content/75 leading-relaxed">
              Zero cold DM spam or unwanted sales pitches. Mutual connections only open
              when both individuals review each other&apos;s goals and agree to connect.
            </p>
          </div>

          {/* Step 3 */}
          <div className="spotlight-card group relative overflow-hidden h-full flex flex-col justify-start border border-base-content/15 rounded-3xl p-6 sm:p-8 space-y-4 hover:border-primary/40 hover:shadow-xl transition-all duration-300">
            <div className="relative z-10 w-12 h-12 rounded-2xl bg-base-200 border border-base-content/15 text-primary flex items-center justify-center font-bold text-lg shadow-2xs group-hover:scale-105 group-hover:border-primary/40 transition-transform duration-300">
              <MessageSquare className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="relative z-10 space-y-1.5">
              <span className="badge badge-sm badge-neutral font-mono text-[10px] font-bold uppercase tracking-wider">
                Stage 03
              </span>
              <h3 className="text-lg font-bold text-base-content">
                Direct Chat to Action
              </h3>
            </div>
            <p className="relative z-10 text-xs sm:text-sm text-base-content/75 leading-relaxed">
              Chat serves as the bridge from connection to real-world collaboration.
              Schedule calls, exchange project ideas, and start shipping together.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Membership Tiers Section ───────────────────────────── */}
      <section id="pricing" className="px-4 sm:px-6 lg:px-8 py-20 bg-base-100/60 border-t border-base-content/10">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Transparent Membership</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-base-content">
              Choose your networking pace
            </h2>
            <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">
              Start free with basic daily discovery, or unlock 1-on-1 chat and unlimited swipes with Pro or Premium.
            </p>
          </div>

          <PlanCards isLanding={true} />
        </div>
      </section>

      {/* ─── Final CTA Banner ───────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20 sm:pb-28 max-w-5xl mx-auto w-full">
        <div className="relative rounded-3xl bg-gradient-to-br from-base-100 via-base-100 to-base-200 border border-base-content/10 p-8 sm:p-14 text-center overflow-hidden shadow-2xl">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative space-y-6 max-w-xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-primary text-primary-content flex items-center justify-center mx-auto shadow-lg">
              <OrbitLogo className="w-8 h-8 text-primary-content" glow />
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-base-content">
              Ready to find your next co-builder?
            </h2>

            <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">
              Join founders, engineers, and product designers discovering
              partnerships on Orbit.
            </p>

            <div className="pt-2">
              <Link
                to={user ? "/feed" : "/login?mode=signup"}
                className="btn btn-primary btn-md px-8 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2 group cursor-pointer"
              >
                <span>{user ? "Go to Feed" : "Get Started Now"}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
