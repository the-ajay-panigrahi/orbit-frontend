import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowRight, ShieldCheck, Heart } from "lucide-react";
import OrbitLogo from "./OrbitLogo";

export default function Footer() {
  const user = useSelector((store) => store.user);
  const location = useLocation();
  const isLanding = location.pathname === "/";

  // Sleek, minimal footer on app/auth pages so it doesn't crowd workspace
  if (!isLanding) {
    return (
      <footer
        className={`w-full bg-base-100/80 backdrop-blur-md border-t border-base-content/8 px-4 sm:px-8 text-xs text-base-content/50 transition-colors ${
          user ? "pt-3.5 pb-20 md:py-3.5" : "py-3.5"
        }`}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Link to="/" className="flex items-center gap-1.5 font-bold text-base-content/80 hover:text-primary transition-colors">
              <OrbitLogo className="w-4 h-4 text-primary" />
              <span>Orbit</span>
            </Link>
            <span className="opacity-30">•</span>
            <span className="text-[11px] font-mono">&copy; {new Date().getFullYear()} Orbit Network</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <Link to="/terms" className="hover:text-primary transition-colors">
              Terms
            </Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link to="/refund" className="hover:text-primary transition-colors">
              Refunds
            </Link>
            <Link to="/contact" className="hover:text-primary transition-colors">
              Support
            </Link>
            <span className="hidden sm:inline opacity-30">•</span>
            <span className="hidden sm:inline text-base-content/40">
              Find the people who move with you.
            </span>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-base-100 border-t border-base-content/8 rounded-t-3xl sm:rounded-t-[2.5rem] shadow-2xl text-base-content/75 pt-14 pb-24 md:pb-12 px-4 sm:px-8 transition-colors">
      <div className="max-w-6xl mx-auto">
        {/* Meetup-style Top Action Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-12 border-b border-base-content/8">
          <div className="space-y-1 max-w-xl">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-base-content">
              Discover who&apos;s building next to you.
            </h3>
            <p className="text-sm text-base-content/60 leading-relaxed">
              Find partners whose skills, ambitions, and speed align with your own.
            </p>
          </div>
          <Link
            to={user ? "/feed" : "/login?mode=signup"}
            className="btn btn-primary btn-md px-6 rounded-xl font-semibold shadow-md hover:shadow-lg transition-shadow flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>{user ? "Explore Feed" : "Get Started Free"}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>

        {/* 4-Column Organized Directory */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 py-12">
          {/* Column 1: Discover */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-base-content">
              Discover
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/feed"
                  className="text-base-content/70 hover:text-primary transition-colors"
                >
                  Discover Feed
                </Link>
              </li>
              <li>
                <Link
                  to="/connections"
                  className="text-base-content/70 hover:text-primary transition-colors"
                >
                  My Connections
                </Link>
              </li>
              <li>
                <Link
                  to="/requests"
                  className="text-base-content/70 hover:text-primary transition-colors"
                >
                  Connection Requests
                </Link>
              </li>
              <li>
                <Link
                  to="/premium"
                  className="text-base-content/70 hover:text-primary transition-colors"
                >
                  Pro &amp; Premium Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Orbit Network */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-base-content">
              Orbit
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/#how-it-works"
                  className="text-base-content/70 hover:text-primary transition-colors"
                >
                  How Orbit Works
                </a>
              </li>
              <li>
                <a
                  href="/#pricing"
                  className="text-base-content/70 hover:text-primary transition-colors"
                >
                  Pricing &amp; Tiers
                </a>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-base-content/70 hover:text-primary transition-colors"
                >
                  Profile Studio
                </Link>
              </li>
              <li>
                <div className="flex items-center gap-1.5 text-xs text-success font-medium pt-0.5">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span>All Systems Operational</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & Safety */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-base-content">
              Trust &amp; Security
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-1.5 text-base-content/70 text-xs">
                <ShieldCheck className="w-4 h-4 text-primary stroke-[2.3] shrink-0" />
                <span>Double-Opt-In Privacy</span>
              </li>
              <li className="text-xs text-base-content/60 leading-relaxed">
                No cold DMs. Connections unlock only with mutual agreement.
              </li>
              <li className="pt-1">
                <span className="badge badge-sm badge-neutral font-mono text-[10px]">
                  Razorpay 256-Bit SSL
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Policy */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-base-content">
              Legal &amp; Policy
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/terms"
                  className="text-base-content/70 hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-base-content/70 hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/refund"
                  className="text-base-content/70 hover:text-primary transition-colors"
                >
                  Cancellation &amp; Refund
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-base-content/70 hover:text-primary transition-colors"
                >
                  Contact &amp; Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Logo, Copyright, and Polish */}
        <div className="pt-8 border-t border-base-content/8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-base-content/50">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 select-none group">
              <OrbitLogo className="w-5 h-5 text-primary" />
              <span className="font-bold tracking-tight text-base-content text-sm">
                Orbit
              </span>
            </Link>
            <span className="opacity-40">•</span>
            <span>Find the people who move with you.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px]">
              &copy; {new Date().getFullYear()} Orbit Network, Inc.
            </span>
            <span className="opacity-40">•</span>
            <span className="flex items-center gap-1 font-mono text-[11px]">
              Crafted with <Heart className="w-3 h-3 text-error fill-current inline" /> for builders
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
