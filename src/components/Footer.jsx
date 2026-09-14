import { Link } from "react-router-dom";
import OrbitLogo from "./OrbitLogo";

export default function Footer() {
  return (
    <footer className="bg-base-100 border-t border-base-content/10 text-base-content/80 pt-12 pb-24 md:pb-12 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        {/* Brand Column */}
        <div className="space-y-3 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 select-none group">
            <OrbitLogo className="w-6 h-6" />
            <span className="text-lg font-bold tracking-tight text-base-content">
              Orbit
            </span>
          </Link>
          <p className="text-xs text-base-content/65 leading-relaxed">
            Find the people who move with you. Intentional discovery and
            collaboration for founders, builders, and creators.
          </p>
          <p className="text-[11px] font-mono text-base-content/40">
            © {new Date().getFullYear()} Orbit Network. All rights reserved.
          </p>
        </div>

        {/* Platform Links */}
        <div className="space-y-2.5">
          <p className="text-xs font-bold uppercase tracking-wider text-base-content">
            Platform
          </p>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/feed" className="hover:text-primary transition-colors">
                Discover Feed
              </Link>
            </li>
            <li>
              <Link to="/connections" className="hover:text-primary transition-colors">
                My Network
              </Link>
            </li>
            <li>
              <Link to="/requests" className="hover:text-primary transition-colors">
                Connection Requests
              </Link>
            </li>
            <li>
              <Link to="/premium" className="hover:text-primary transition-colors">
                Membership Plans
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal & Compliance (Razorpay Merchant Requirements) */}
        <div className="space-y-2.5">
          <p className="text-xs font-bold uppercase tracking-wider text-base-content">
            Legal & Policy
          </p>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/refund" className="hover:text-primary transition-colors">
                Cancellation & Refund
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-primary transition-colors">
                Contact & Support
              </Link>
            </li>
          </ul>
        </div>

        {/* Payment & Security Assurance */}
        <div className="space-y-2.5">
          <p className="text-xs font-bold uppercase tracking-wider text-base-content">
            Secure Payments
          </p>
          <p className="text-xs text-base-content/65 leading-relaxed">
            All membership upgrades are processed through 256-bit encrypted
            Razorpay gateway supporting UPI, NetBanking, and Cards.
          </p>
          <div className="pt-1 flex items-center gap-2">
            <span className="badge badge-neutral text-[10px] font-mono">
              Razorpay Secured
            </span>
            <span className="badge badge-neutral text-[10px] font-mono">
              SSL Verified
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
