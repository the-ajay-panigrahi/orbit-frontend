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
  Compass,
  Target,
  MessageSquare,
  Maximize2,
  Heart,
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  Rocket,
} from "lucide-react";
import OrbitLogo from "./OrbitLogo";
import UserCard from "./UserCard";
import Card3DZoomModal from "./Card3DZoomModal";
import PlanCards from "./PlanCards";
import HandDrawnArrow from "./HandDrawnArrow";
import HandwrittenText from "./HandwrittenText";

const FEATURED_THEMES = [
  "night",
  "retro",
  "dark",
  "dracula",
  "black",
  "lofi",
  "aqua",
  "luxury",
  "coffee",
  "nord",
  "winter",
];

const MOCK_FOUNDERS = [
  {
    _id: "demo-founder-1",
    firstName: "Sarah",
    lastName: "Guo",
    age: 34,
    gender: "female",
    about:
      "Founder of Conviction. Early-stage investor backing technical founders building intelligent software and AI infrastructure.",
    lookingFor: "Early-stage AI Founders",
    skills: ["AI Systems", "Seed Capital", "Go-To-Market", "Scale"],
    profilePictureUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=75&w=600&auto=format&fit=crop&crop=faces",
    membershipType: "premium",
    defaultAction: "right",
  },
  {
    _id: "demo-founder-2",
    firstName: "Jensen",
    lastName: "Huang",
    age: 61,
    gender: "male",
    about:
      "Accelerating computing for the era of generative AI and physical simulations. The more you buy, the more you save.",
    lookingFor: "CUDA & Parallel Compute Wizards",
    skills: ["GPU Computing", "CUDA", "Hardware Architecture", "Distributed Training"],
    profilePictureUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&crop=faces&w=800&q=80",
    membershipType: "premium",
    defaultAction: "right",
  },
  {
    _id: "demo-founder-3",
    firstName: "Nandan",
    lastName: "Nilekani",
    age: 69,
    gender: "male",
    about:
      "Architect of Aadhaar and India Stack. Co-founder of Infosys. Passionate about digital public infrastructure for a billion people.",
    lookingFor: "Public Infrastructure & Open Protocols",
    skills: ["Digital Public Goods", "Identity Systems", "Distributed Architecture", "National Scale Tech"],
    profilePictureUrl:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&crop=faces&w=800&q=80",
    membershipType: "premium",
    defaultAction: "right",
  },
];

const JOURNEY_STEPS = [
  {
    icon: Compass,
    stage: "01",
    title: "Intent-Driven Discovery",
    desc: "Swipe through cards featuring founders, developers, designers, and operators to discover builders aligned with what you want to create.",
  },
  {
    icon: Users,
    stage: "02",
    title: "Double-Opt-In Matching",
    desc: "Zero spam, zero awkward cold outreach. Mutual connections only form when both builders swipe right and agree to connect.",
  },
  {
    icon: MessageSquare,
    stage: "03",
    title: "Direct Chat to Action",
    desc: "Match and unlock real-time 1-on-1 messaging instantly. Exchange project ideas, align on goals, and start building together.",
  },
];

const FAQS = [
  {
    q: "How do the daily swipe limits work?",
    a: "Limits reset automatically every 24 hours from your first interaction. Basic members get 10 requests/day, Pro gets 50, and Premium has no limits.",
  },
  {
    q: "When can I start chatting with my connections?",
    a: "Chatting unlocks as soon as you have a mutual match and are on either the Pro or Premium plan.",
  },
  {
    q: "How does payment through Razorpay work?",
    a: "All transactions are processed securely via Razorpay with support for UPI, Credit/Debit cards, NetBanking, and Wallets. Upgrades apply instantly.",
  },
  {
    q: "Can I upgrade or cancel my plan at any time?",
    a: "Yes. You can upgrade from Basic to Pro or Premium whenever you need higher quotas. Changes take effect immediately.",
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
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleScrollTo = (e, targetId) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [flyDirection, setFlyDirection] = useState(null);
  const [isActionPending, setIsActionPending] = useState(false);

  const dragStartRef = useRef({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const currentUser = deck[0];
  const nextUser = deck.length > 1 ? deck[1] : null;

  const triggerSwipeAction = useCallback(
    (direction, targetUser) => {
      if (!targetUser || isActionPending) return;
      setIsActionPending(true);
      setFlyDirection(direction);
      if (direction === "right") setMatchCelebration(targetUser);

      setTimeout(() => {
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

  useEffect(() => {
    if (!matchCelebration) return;
    const timer = setTimeout(() => setMatchCelebration(null), 4500);
    return () => clearTimeout(timer);
  }, [matchCelebration]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        ["INPUT", "TEXTAREA", "SELECT"].includes(e.target?.tagName) ||
        e.target?.isContentEditable
      )
        return;

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

  const hasMountedRef = useRef(false);
  useEffect(() => {
    if (
      !isAutoplay ||
      isHovered ||
      isDragging ||
      isActionPending ||
      isZoomOpen ||
      !currentUser
    )
      return;

    const initialDelay = hasMountedRef.current ? 5000 : 7500;
    hasMountedRef.current = true;

    const timer = setTimeout(() => {
      triggerSwipeAction(currentUser.defaultAction || "right", currentUser);
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

  const handlePointerDown = (e) => {
    if (isActionPending || !currentUser) return;
    if (e.target.closest("button")) return;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    setDragOffset({
      x: e.clientX - dragStartRef.current.x,
      y: (e.clientY - dragStartRef.current.y) * 0.4,
    });
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId))
        e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Pointer capture may already be released
    }

    const threshold = 110;
    const deltaX = Math.abs(dragOffset.x);
    const deltaY = Math.abs(dragOffset.y);

    if (deltaX < 8 && deltaY < 8) {
      setIsZoomOpen(true);
      setDragOffset({ x: 0, y: 0 });
      return;
    }

    if (dragOffset.x > threshold) triggerSwipeAction("right", currentUser);
    else if (dragOffset.x < -threshold)
      triggerSwipeAction("left", currentUser);
    else setDragOffset({ x: 0, y: 0 });
  };

  const handlePointerCancel = () => {
    if (isDragging) {
      setIsDragging(false);
      setDragOffset({ x: 0, y: 0 });
    }
  };

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
    <div className="flex flex-col w-full overflow-hidden relative">
      {/* Floating Match Celebration Toast */}
      <AnimatePresence>
        {matchCelebration && (
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 400, damping: 26 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-35 w-full max-w-sm px-4 pointer-events-auto"
          >
            <div className="relative overflow-hidden p-3 px-3.5 rounded-2xl border border-primary/40 bg-base-100/95 backdrop-blur-xl shadow-2xl shadow-primary/20 flex items-center justify-between gap-3 text-base-content">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/15 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative flex items-center shrink-0">
                  <div className="w-9 h-9 rounded-full ring-2 ring-base-100 overflow-hidden bg-base-300">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=75&w=120&auto=format&fit=crop"
                      alt="You"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-9 h-9 rounded-full ring-2 ring-primary overflow-hidden bg-base-300 -ml-3">
                    <img
                      src={matchCelebration.profilePictureUrl || "/default-avatar.svg"}
                      alt={matchCelebration.firstName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 left-3.5 w-4.5 h-4.5 rounded-full bg-primary text-primary-content flex items-center justify-center shadow-xs">
                    <Heart className="w-2.5 h-2.5 fill-current stroke-0" />
                  </div>
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="font-handwriting text-primary text-lg font-bold leading-none">
                      It&apos;s a Match!
                    </span>
                  </div>
                  <p className="text-xs text-base-content/75 truncate mt-0.5">
                    You &amp; {matchCelebration.firstName} want to collaborate
                  </p>
                </div>
              </div>
              <Link
                to="/login?mode=signup"
                className="btn btn-xs sm:btn-sm btn-primary shrink-0 rounded-xl font-semibold gap-1 cursor-pointer shadow-xs"
              >
                <span>Say Hi</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Hero Section ────────────────────────────────────────── */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-10 pb-8 sm:pt-14 sm:pb-12 max-w-6xl mx-auto w-full">
        <div className="absolute inset-0 bg-grid-subtle opacity-40 pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-[500px] h-80 sm:h-[500px] bg-primary/8 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline + CTAs */}
          <motion.div
            className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-base-100 border border-base-content/10 shadow-xs text-xs font-semibold text-base-content/80">
              <Sparkles className="w-4 h-4 text-primary stroke-[2.3]" />
              <span>Intentional Professional Discovery</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-base-content leading-[1.15]">
              Find the people who{" "}
              <HandwrittenText
                text="move with you."
                className="text-primary text-5xl sm:text-6xl lg:text-7xl font-bold not-italic tracking-wide px-1 rotate-[-1deg]"
                startDelay={0.35}
                staggerSpeed={0.045}
              />
            </h1>

            <p className="text-sm sm:text-base text-base-content/70 max-w-lg leading-relaxed">
              Orbit is the professional networking and collaboration platform for
              founders, developers, designers, marketers, and startup operators
              to discover the right partners to build, connect, and grow with.
            </p>

            <div className="flex flex-row flex-wrap items-center justify-center lg:justify-start gap-3 pt-1 w-full sm:w-auto">
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 26 }}
              >
                <Link
                  to={user ? "/feed" : "/login?mode=signup"}
                  className="btn btn-primary btn-md px-6 rounded-xl font-semibold shadow-md hover:shadow-lg transition-shadow flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>{user ? "Open Feed" : "Get Started Free"}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5] transition-transform group-hover:translate-x-0.5" />
                </Link>
              </motion.div>

              <a
                href="#how-it-works"
                onClick={(e) => handleScrollTo(e, "how-it-works")}
                className="btn btn-outline btn-md border-base-content/20 hover:bg-base-200 text-base-content px-6 rounded-xl font-semibold transition-all cursor-pointer text-center flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4 stroke-[2.3]" />
                <span>How It Works</span>
              </a>
            </div>

            <div className="pt-5 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-xs text-base-content/60 border-t border-base-content/10 w-full max-w-lg">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary stroke-[2.3] shrink-0" />
                <span>Double-Opt-In Matches</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary stroke-[2.3] shrink-0" />
                <span>Zero Cold DM Spam</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary stroke-[2.3] shrink-0" />
                <span>Startup Ecosystem</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Card Deck */}
          <motion.div
            className="lg:col-span-5 flex flex-col items-center justify-center select-none w-full max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="w-full max-w-sm flex items-center justify-between px-2 mb-3 text-xs font-mono text-base-content/50">
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
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-base-200/80 text-base-content border border-base-content/15 text-xs font-semibold tracking-wide shadow-2xs select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span>Demo</span>
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

            <div className="relative w-full max-w-sm min-h-[440px] sm:min-h-[480px] flex items-center justify-center">
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
                  {connectStampOpacity > 0 && (
                    <div
                      style={{ opacity: connectStampOpacity }}
                      className="absolute top-7 left-7 z-30 pointer-events-none transform -rotate-12 border-4 border-success text-success bg-base-100/90 font-black text-xl tracking-widest px-4 py-1.5 rounded-2xl shadow-2xl uppercase"
                    >
                      CONNECT
                    </div>
                  )}
                  {passStampOpacity > 0 && (
                    <div
                      style={{ opacity: passStampOpacity }}
                      className="absolute top-7 right-7 z-30 pointer-events-none transform rotate-12 border-4 border-error text-error bg-base-100/90 font-black text-xl tracking-widest px-4 py-1.5 rounded-2xl shadow-2xl uppercase"
                    >
                      PASS
                    </div>
                  )}
                  <UserCard
                    user={currentUser}
                    showActions={true}
                    onPass={() => triggerSwipeAction("left", currentUser)}
                    onConnect={() => triggerSwipeAction("right", currentUser)}
                  />
                </div>
              )}
            </div>

            {/* Floating Glass Controls Dock */}
            <div className="hidden sm:flex items-center gap-1.5 mt-3 p-1 px-3.5 rounded-full bg-base-100/90 backdrop-blur-md border border-base-content/10 shadow-xs text-xs font-mono text-base-content/65">
              <div className="flex items-center gap-1 px-1">
                <kbd className="kbd kbd-xs bg-base-200 text-base-content font-bold">←</kbd>
                <span>Pass</span>
              </div>
              <span className="opacity-25">•</span>
              <div className="flex items-center gap-1 px-1">
                <kbd className="kbd kbd-xs bg-base-200 text-base-content font-bold">→</kbd>
                <span>Connect</span>
              </div>
              <span className="opacity-25">•</span>
              <div className="flex items-center gap-1 px-1">
                <kbd className="kbd kbd-xs bg-base-200 text-base-content font-bold">Space</kbd>
                <span>{isAutoplay ? "Pause" : "Play"}</span>
              </div>
              <span className="opacity-25">•</span>
              <button
                onClick={() => setIsZoomOpen(true)}
                className="flex items-center gap-1 px-1 text-primary hover:text-primary/80 font-sans font-semibold cursor-pointer transition-colors"
                title="Inspect in 3D Modal"
              >
                <Maximize2 className="w-3 h-3 stroke-[2.5]" />
                <span>3D Zoom</span>
              </button>
            </div>
          </motion.div>
        </div>

        <Card3DZoomModal
          isOpen={isZoomOpen}
          onClose={() => setIsZoomOpen(false)}
          user={currentUser}
          onPass={() => triggerSwipeAction("left", currentUser)}
          onConnect={() => triggerSwipeAction("right", currentUser)}
          showActions={true}
        />
      </section>

      {/* ─── 3-Step Journey with Hand-Drawn Arrows ─────────────── */}
      <section
        id="how-it-works"
        className="relative px-4 sm:px-6 lg:px-8 pt-6 pb-16 sm:pt-10 sm:pb-20 max-w-6xl mx-auto w-full"
      >
        <div className="absolute inset-0 bg-grid-subtle opacity-25 pointer-events-none -z-10" />

        <div className="text-center space-y-3 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-base-200 border border-base-content/12 text-xs font-semibold text-base-content shadow-xs">
            <Target className="w-3.5 h-3.5 text-primary stroke-[2]" />
            <span>The Orbit Journey</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-base-content">
            Discover · Connect · Collaborate
          </h2>
          <p className="text-sm text-base-content/65 max-w-xl mx-auto leading-relaxed">
            Orbit takes you from discovering someone relevant to communicating
            and building in the real world. No vanity followers, no noise.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-stretch justify-center gap-0 md:gap-0">
          {JOURNEY_STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.stage} className="flex flex-col md:flex-row items-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: idx * 0.12 }}
                  className="spotlight-card group relative overflow-hidden flex flex-col justify-start border border-base-content/12 rounded-3xl p-6 sm:p-8 space-y-4 w-full md:w-72 lg:w-80 shrink-0"
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shadow-2xs group-hover:scale-105 group-hover:border-primary/40 transition-transform duration-300">
                    <Icon className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div className="space-y-1.5">
                    <span className="badge badge-sm badge-neutral font-mono text-[11px] font-bold uppercase tracking-wider">
                      Stage {step.stage}
                    </span>
                    <h3 className="text-lg font-bold text-base-content">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-sm text-base-content/70 leading-relaxed">
                    {step.desc}
                  </p>
                </motion.div>

                {idx < JOURNEY_STEPS.length - 1 && (
                  <>
                    <div className="hidden md:flex items-center justify-center px-2 z-10 shrink-0 self-center">
                      <HandDrawnArrow
                        variant={idx === 0 ? "top-to-bottom" : "bottom-to-top"}
                        label={idx === 0 ? "Mutual match!" : "Start building!"}
                        icon={idx === 0 ? Zap : Rocket}
                        iconClassName={
                          idx === 0
                            ? "text-amber-500 fill-amber-500/20"
                            : "text-primary"
                        }
                      />
                    </div>
                    <div className="md:hidden flex flex-col items-center justify-center py-3 gap-1.5">
                      <span className="font-handwriting text-primary text-sm font-bold flex items-center gap-1.5">
                        <span>{idx === 0 ? "Mutual match!" : "Start building!"}</span>
                        {idx === 0 ? (
                          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20 stroke-[2.3] shrink-0" />
                        ) : (
                          <Rocket className="w-3.5 h-3.5 text-primary stroke-[2.3] shrink-0" />
                        )}
                      </span>
                      <svg
                        width="24"
                        height="36"
                        viewBox="0 0 24 36"
                        fill="none"
                        className="text-primary/80 overflow-visible"
                      >
                        <path
                          d="M 12 2 C 18 12, 6 22, 12 30"
                          stroke="currentColor"
                          strokeWidth="3.2"
                          strokeLinecap="round"
                        />
                        <polyline
                          points="6,24 12,32 18,24"
                          stroke="currentColor"
                          strokeWidth="3.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Membership Tiers & Rich Pricing ──────────────────────── */}
      <section
        id="pricing"
        className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 bg-base-200/30 border-t border-base-content/8"
      >
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-4 h-4 stroke-[2.3]" />
              <span>Transparent Membership</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-base-content">
              Choose your networking pace
            </h2>
            <p className="text-sm text-base-content/65 leading-relaxed">
              Start free with basic daily discovery, or unlock 1-on-1 chat and
              unlimited swipes with Pro or Premium.
            </p>
          </div>

          <PlanCards isLanding={true} />

          {/* Trust Badges */}
          <div className="pt-8 border-t border-base-content/10 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs sm:text-sm text-base-content/75 font-medium">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-primary stroke-[2.2]" />
              <span>256-Bit SSL Encrypted Checkout</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-primary stroke-[2.2]" />
              <span>Instant Membership Activation</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-primary stroke-[2.2]" />
              <span>Official Razorpay Gateway</span>
            </div>
          </div>

          {/* FAQs Accordion */}
          <div className="pt-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
              <HelpCircle className="w-5 h-5 text-primary stroke-[2]" />
              <h3 className="text-lg sm:text-xl font-bold text-base-content tracking-tight">
                Frequently Asked Questions
              </h3>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={faq.q}
                    className="rounded-2xl border border-base-content/15 bg-base-100 overflow-hidden transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between p-4 sm:p-4.5 text-left text-xs sm:text-sm font-semibold text-base-content hover:bg-base-200/50 transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-base-content/50 transition-transform duration-200 shrink-0 ${
                          isOpen ? "rotate-180 text-primary" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                          <p className="px-4 sm:px-4.5 pb-4 pt-1 text-xs sm:text-sm text-base-content/75 leading-relaxed border-t border-base-content/10">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Live Theme Studio ───────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 bg-base-200/30 border-y border-base-content/8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-base-100 border border-base-content/10 text-xs font-semibold text-base-content/70 shadow-xs">
              <Palette className="w-3.5 h-3.5 text-primary" />
              <span>Instant Personalization</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-base-content">
              Your vibe, your palette
            </h2>
            <p className="text-sm text-base-content/60 max-w-md mx-auto">
              Orbit adapts to your workflow. Click any theme below to instantly
              transform the entire interface.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
            {FEATURED_THEMES.map((themeName) => {
              const isCurrent = theme === themeName;
              return (
                <motion.button
                  key={themeName}
                  onClick={() => setTheme && setTheme(themeName)}
                  aria-label={`Select ${themeName} theme`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 26 }}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    isCurrent
                      ? "bg-primary text-primary-content border-primary shadow-md"
                      : "bg-base-100 hover:bg-base-200/80 border-base-content/12 text-base-content/80 hover:text-base-content hover:border-base-content/25"
                  }`}
                >
                  <span className="capitalize">{themeName}</span>
                  <span
                    data-theme={themeName}
                    className="flex gap-0.5 p-0.5 rounded-md bg-base-100/90 border border-base-content/10"
                  >
                    <span className="w-1.5 h-3 rounded-sm bg-primary" />
                    <span className="w-1.5 h-3 rounded-sm bg-secondary" />
                    <span className="w-1.5 h-3 rounded-sm bg-accent" />
                  </span>
                  {isCurrent && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                </motion.button>
              );
            })}
          </div>

          <p className="text-xs text-base-content/45 font-mono">
            Active:{" "}
            <span className="font-bold text-primary capitalize">
              {theme || "caramellatte"}
            </span>{" "}
            • 30+ more themes in navigation
          </p>
        </div>
      </section>

      {/* ─── Final CTA ───────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-14 sm:py-20 max-w-4xl mx-auto w-full">
        <div className="relative rounded-3xl bg-gradient-to-br from-base-100 via-base-100 to-base-200 border border-base-content/10 p-8 sm:p-14 text-center overflow-hidden shadow-2xl">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/12 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-secondary/12 rounded-full blur-3xl pointer-events-none" />

          <div className="relative space-y-6 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-base-100 text-primary border border-base-content/12 shadow-xl flex items-center justify-center mx-auto">
              <OrbitLogo className="w-9 h-9" glow />
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-base-content">
              Ready to find your next{" "}
              <span className="whitespace-nowrap">co-builder?</span>
            </h2>

            <p className="text-sm text-base-content/65 leading-relaxed">
              Join founders, engineers, and product designers discovering
              partnerships on Orbit.
            </p>

            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 26 }}
              className="pt-2 inline-block"
            >
              <Link
                to={user ? "/feed" : "/login?mode=signup"}
                className="btn btn-primary btn-md px-8 rounded-xl font-semibold shadow-md hover:shadow-lg transition-shadow inline-flex items-center gap-2 group cursor-pointer"
              >
                <span>{user ? "Go to Feed" : "Get Started Now"}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5] transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
