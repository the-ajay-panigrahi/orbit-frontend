import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "motion/react";
import {
  Orbit,
  Sparkles,
  Zap,
  Users,
  UserCheck,
  ArrowRight,
  Palette,
  Check,
  Heart,
  X,
  Code2,
  Rocket,
  ShieldCheck,
  Layers,
} from "lucide-react";

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

// Realistic builder profiles for the interactive mock card deck preview
const MOCK_FOUNDERS = [
  {
    id: "f1",
    name: "Sophia Chen",
    role: "AI Systems Engineer",
    location: "San Francisco, CA",
    about: "Building agentic dev tools and multi-modal models. Looking for a product-minded co-founder to build with.",
    skills: ["TypeScript", "PyTorch", "Python", "React", "LLMs"],
    lookingFor: "Full-Stack Co-Founder",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: "f2",
    name: "Marcus Vance",
    role: "Full-Stack Architect",
    location: "Austin, TX",
    about: "Ex-Stripe engineer building real-time collaboration engines. Obsessed with low-latency systems.",
    skills: ["Go", "Next.js", "PostgreSQL", "Docker", "Redis"],
    lookingFor: "Design & Growth Partner",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: "f3",
    name: "Elena Rostova",
    role: "Product Designer & Frontend Dev",
    location: "Berlin, Germany",
    about: "Crafting fluid design systems and micro-interactions. Turning complex developer tools into intuitive canvases.",
    skills: ["Figma", "Tailwind CSS", "React", "Design Systems"],
    lookingFor: "Backend Engineer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80",
  },
];

export default function LandingPage() {
  const user = useSelector((store) => store.user);
  const { theme, setTheme } = useOutletContext() || {};
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [mockActionFeedback, setMockActionFeedback] = useState(null);

  const currentFounder = MOCK_FOUNDERS[activeCardIndex];

  const handleMockSwipe = (direction) => {
    setMockActionFeedback(direction);
    setTimeout(() => {
      setActiveCardIndex((prev) => (prev + 1) % MOCK_FOUNDERS.length);
      setMockActionFeedback(null);
    }, 300);
  };

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* ─── Hero Section ────────────────────────────────────────── */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-12 pb-20 sm:pt-16 sm:pb-28 max-w-7xl mx-auto w-full">
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-base-100 border border-base-content/10 shadow-xs text-xs font-semibold text-base-content/80">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Networking for the builder generation</span>
            </div>

            {/* Main Headline & Tagline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-base-content leading-[1.12]">
              Find the people who{" "}
              <span className="text-primary underline decoration-primary/30 decoration-wavy underline-offset-8">
                move with you.
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-base-content/70 max-w-xl leading-relaxed">
              Orbit is a dedicated collaboration platform where founders and builders discover,
              connect, and collaborate with the right partners to build the next big thing.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to={user ? "/feed" : "/login"}
                className="btn btn-primary btn-md px-7 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2 group"
              >
                <span>{user ? "Open Your Feed" : "Join Orbit"}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href="#how-it-works"
                className="btn btn-ghost btn-md px-6 rounded-xl font-medium border border-base-content/15 text-base-content/80 hover:text-base-content transition-all"
              >
                Explore How It Works
              </a>
            </div>

            {/* Social Proof Mini Bar */}
            <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-base-content/60 border-t border-base-content/10 w-full max-w-lg">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-success shrink-0" />
                <span>Verified Builder Profiles</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-warning shrink-0" />
                <span>Zero Cold DM Spam</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-error shrink-0" />
                <span>Mutual-Opt-In Matches</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Mock Card Deck */}
          <motion.div
            className="lg:col-span-5 flex flex-col items-center justify-center"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          >
            <div className="relative w-full max-w-sm sm:max-w-md">
              {/* Background Stack Card (Peek Card 2) */}
              <div className="absolute inset-0 translate-y-6 scale-90 bg-base-100 rounded-3xl border border-base-content/10 opacity-30 shadow-md pointer-events-none" />

              {/* Middle Stack Card (Peek Card 1) */}
              <div className="absolute inset-0 translate-y-3 scale-95 bg-base-100 rounded-3xl border border-base-content/10 opacity-60 shadow-lg pointer-events-none" />

              {/* Foreground Interactive Card */}
              <motion.div
                key={currentFounder.id}
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  x: mockActionFeedback === "right" ? 120 : mockActionFeedback === "left" ? -120 : 0,
                  rotate: mockActionFeedback === "right" ? 8 : mockActionFeedback === "left" ? -8 : 0,
                }}
                transition={{ duration: 0.35 }}
                className="relative bg-base-100 rounded-3xl border border-base-content/10 shadow-2xl overflow-hidden z-10"
              >
                {/* Visual Image Banner */}
                <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-base-300">
                  <img
                    src={currentFounder.avatar}
                    alt={currentFounder.name}
                    className="w-full h-full object-cover select-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-base-100 via-transparent to-black/20" />

                  {/* Looking For Tag */}
                  <div className="absolute top-4 left-4">
                    <span className="badge badge-neutral badge-sm backdrop-blur-md bg-neutral/80 text-neutral-content font-medium px-3 py-2 border-0">
                      Seeking: {currentFounder.lookingFor}
                    </span>
                  </div>

                  {/* Interactive Hint */}
                  <div className="absolute top-4 right-4">
                    <span className="badge badge-primary badge-sm shadow-xs font-semibold">
                      Live Preview
                    </span>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-base-content tracking-tight">
                      {currentFounder.name}
                    </h3>
                    <p className="text-xs font-medium text-primary mt-0.5">
                      {currentFounder.role} • {currentFounder.location}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-base-content/75 line-clamp-2 leading-relaxed">
                    &ldquo;{currentFounder.about}&rdquo;
                  </p>

                  {/* Skills Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {currentFounder.skills.map((skill) => (
                      <span
                        key={skill}
                        className="badge badge-sm bg-base-200 text-base-content/80 border-base-content/10 font-medium text-[11px]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Card Deck Action Controls */}
                  <div className="pt-2 border-t border-base-content/10 flex items-center justify-between">
                    <button
                      onClick={() => handleMockSwipe("left")}
                      className="btn btn-circle btn-outline btn-sm sm:btn-md border-base-content/20 hover:border-error hover:bg-error hover:text-error-content transition-all"
                      title="Pass card"
                      aria-label="Pass card"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <span className="text-[11px] font-mono text-base-content/50">
                      Profile {activeCardIndex + 1} of {MOCK_FOUNDERS.length}
                    </span>

                    <button
                      onClick={() => handleMockSwipe("right")}
                      className="btn btn-circle btn-primary btn-sm sm:btn-md shadow-md hover:scale-105 transition-transform"
                      title="Connect card"
                      aria-label="Connect card"
                    >
                      <Heart className="w-5 h-5 fill-current" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
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
              Orbit adapts to your workflow. Click any theme below to instantly transform the entire
              interface.
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
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
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

          <div className="text-[11px] text-base-content/50 font-mono">
            Currently active theme: <span className="font-bold text-primary capitalize">{theme || "bumblebee"}</span> • 30+ more themes in top navigation
          </div>
        </div>
      </section>

      {/* ─── 3-Step Visual Story Flow ("How Orbit Works") ───────── */}
      <section id="how-it-works" className="px-4 sm:px-6 lg:px-8 py-20 sm:py-28 max-w-7xl mx-auto w-full">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-base-100 border border-base-content/10 text-xs font-semibold text-base-content/70">
            <Layers className="w-3.5 h-3.5 text-primary" />
            <span>The Orbit Experience</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-base-content">
            Built for how modern creators collaborate
          </h2>
          <p className="text-sm sm:text-base text-base-content/60 max-w-2xl mx-auto">
            Traditional professional networks are cluttered with recruiters and sales pitches.
            Orbit keeps the signal pure and focused on building.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <motion.div
            className="card bg-base-100 border border-base-content/10 rounded-2xl p-6 sm:p-8 space-y-4 hover:border-primary/40 hover:shadow-xl transition-all"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
              <Code2 className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-primary font-semibold uppercase tracking-wider">
                Step 01
              </span>
              <h3 className="text-lg font-bold text-base-content">Signal Over Noise</h3>
            </div>
            <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">
              Every profile highlights concrete technical skills, active repositories, and what the
              builder is currently creating. No inflated resumes.
            </p>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            className="card bg-base-100 border border-base-content/10 rounded-2xl p-6 sm:p-8 space-y-4 hover:border-primary/40 hover:shadow-xl transition-all"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center font-bold text-lg">
              <Users className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-secondary font-semibold uppercase tracking-wider">
                Step 02
              </span>
              <h3 className="text-lg font-bold text-base-content">Mutual-Match Intent</h3>
            </div>
            <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">
              Swipe cards right to express interest, or pass to see the next builder. Connections
              only happen when both builders mutually agree to connect.
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            className="card bg-base-100 border border-base-content/10 rounded-2xl p-6 sm:p-8 space-y-4 hover:border-primary/40 hover:shadow-xl transition-all"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold text-lg">
              <Rocket className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-accent font-semibold uppercase tracking-wider">
                Step 03
              </span>
              <h3 className="text-lg font-bold text-base-content">Collaborate & Ship</h3>
            </div>
            <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">
              Once connected, coordinate projects, exchange repos, and build side projects or
              venture-backed startups together.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Final CTA Banner ───────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20 sm:pb-28 max-w-5xl mx-auto w-full">
        <div className="relative rounded-3xl bg-gradient-to-br from-base-100 via-base-100 to-base-200 border border-base-content/10 p-8 sm:p-14 text-center overflow-hidden shadow-2xl">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative space-y-6 max-w-xl mx-auto">
            <Orbit className="w-10 h-10 text-primary mx-auto stroke-[2.2]" />

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-base-content">
              Ready to find your next co-builder?
            </h2>

            <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">
              Join founders, engineers, and product designers discovering partnerships on Orbit.
            </p>

            <div className="pt-2">
              <Link
                to={user ? "/feed" : "/login"}
                className="btn btn-primary btn-md px-8 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2 group"
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
