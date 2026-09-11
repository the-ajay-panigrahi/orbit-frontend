import { Orbit, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer sm:footer-horizontal bg-base-100/60 text-base-content border-t border-base-content/10 px-4 sm:px-8 pt-6 pb-20 md:pb-6 items-center justify-between">
      <div className="flex items-center gap-2">
        <Orbit className="w-5 h-5 text-primary stroke-[2.2]" />
        <p className="text-xs text-base-content/70">
          Orbit © {new Date().getFullYear()}
        </p>
      </div>

      <nav className="flex items-center gap-4 text-xs text-base-content/70">
        <Link to="/feed" className="hover:text-base-content transition-colors">
          Feed
        </Link>
        <Link to="/login" className="hover:text-base-content transition-colors">
          Login
        </Link>
        <span className="flex items-center gap-1">
          Made with <Heart className="w-3.5 h-3.5 text-error fill-current" /> on
          Orbit
        </span>
      </nav>
    </footer>
  );
}
