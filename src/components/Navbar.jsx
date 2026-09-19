import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { motion, AnimatePresence } from "motion/react";
import {
  Palette,
  ChevronDown,
  Check,
  User,
  Search,
  LogOut,
  Compass,
  Users,
  UserCheck,
  Menu,
  X,
  LogIn,
  UserPlus,
  Sparkles,
  Crown,
  Zap,
} from "lucide-react";
import OrbitLogo from "./OrbitLogo";
import { removeUser } from "../utils/userSlice";
import { removeFeed } from "../utils/feedSlice";
import { removeConnections } from "../utils/connectionSlice";
import { clearRequests } from "../utils/requestSlice";
import { BASE_URL } from "../utils/constants";

export default function Navbar({ theme, onSelectTheme, themes }) {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on Escape or browser popstate navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };
    const handlePopState = () => setMobileMenuOpen(false);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const isLoginPage = location.pathname === "/login";

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      dispatch(removeUser());
      dispatch(removeFeed());
      dispatch(removeConnections());
      dispatch(clearRequests());
      navigate("/");
    }
  };

  const filteredThemes = themes.filter((t) =>
    t.toLowerCase().includes(search.toLowerCase().trim()),
  );

  return (
    <>
      <header className="navbar bg-base-100/80 backdrop-blur-md sticky top-0 z-40 border-b border-base-content/8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <div className="flex-1 flex items-center">
          <Link
            to={user ? "/feed" : "/"}
            className="flex items-center gap-2 select-none"
            aria-label="Orbit Home"
          >
            <OrbitLogo className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-base sm:text-xl font-bold tracking-tight text-base-content whitespace-nowrap">
              Orbit
            </span>
          </Link>

          {/* Logged-in Desktop Navigation Links */}
          {user && (
            <nav className="hidden md:flex items-center gap-1.5 ml-6">
              <Link
                to="/feed"
                className={`btn btn-sm gap-2 text-xs rounded-lg transition-all cursor-pointer ${
                  location.pathname === "/feed"
                    ? "btn-primary text-primary-content font-bold shadow-xs"
                    : "btn-ghost text-base-content/75 hover:text-base-content hover:bg-base-content/10"
                }`}
              >
                <Compass className="w-4 h-4 stroke-[2.3]" />
                <span>Feed</span>
              </Link>

              <Link
                to="/profile"
                className={`btn btn-sm gap-2 text-xs rounded-lg transition-all cursor-pointer ${
                  location.pathname === "/profile"
                    ? "btn-primary text-primary-content font-bold shadow-xs"
                    : "btn-ghost text-base-content/75 hover:text-base-content hover:bg-base-content/10"
                }`}
              >
                <User className="w-4 h-4 stroke-[2.3]" />
                <span>Profile</span>
              </Link>

              <Link
                to="/connections"
                className={`btn btn-sm gap-2 text-xs rounded-lg transition-all cursor-pointer ${
                  location.pathname === "/connections"
                    ? "btn-primary text-primary-content font-bold shadow-xs"
                    : "btn-ghost text-base-content/75 hover:text-base-content hover:bg-base-content/10"
                }`}
              >
                <Users className="w-4 h-4 stroke-[2.3]" />
                <span>Connections</span>
              </Link>

              <Link
                to="/requests"
                className={`btn btn-sm gap-2 text-xs rounded-lg transition-all cursor-pointer ${
                  location.pathname === "/requests"
                    ? "btn-primary text-primary-content font-bold shadow-xs"
                    : "btn-ghost text-base-content/75 hover:text-base-content hover:bg-base-content/10"
                }`}
              >
                <UserCheck className="w-4 h-4 stroke-[2.3]" />
                <span>Requests</span>
              </Link>

              <Link
                to="/premium"
                className={`btn btn-sm gap-2 text-xs rounded-lg transition-all cursor-pointer ${
                  location.pathname === "/premium"
                    ? "btn-primary text-primary-content font-bold shadow-xs"
                    : "btn-ghost text-base-content/75 hover:text-base-content hover:bg-base-content/10"
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500/20 stroke-[2.3]" />
                <span>Plans</span>
              </Link>
            </nav>
          )}
        </div>

        <div className="flex-none flex items-center gap-1.5 sm:gap-3">
          {/* Theme Selector Dropdown */}
          <div className={`dropdown dropdown-end ${user ? "hidden sm:inline-block" : "inline-block"}`}>
            <button
              tabIndex={0}
              className="btn btn-xs sm:btn-sm btn-ghost gap-1.5 sm:gap-2 border border-base-content/15 rounded-full hover:bg-base-content/5 transition-colors"
              aria-label={`Theme selector (current theme: ${theme})`}
            >
              <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-base-content/70 shrink-0 stroke-[2.3]" />
              <span className="ml-0.5 text-[11px] sm:text-xs font-semibold capitalize text-base-content max-w-20 sm:max-w-none truncate">
                {theme}
              </span>
              <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-base-content/50 shrink-0 stroke-[2.3]" />
            </button>

            <div
              tabIndex={0}
              className="dropdown-content z-60 p-3 shadow-2xl bg-base-100 rounded-2xl border border-base-content/15 mt-2 fixed inset-x-3 top-16 max-w-sm mx-auto sm:absolute sm:inset-x-auto sm:right-0 sm:top-auto sm:w-96 sm:max-w-md sm:mx-0"
            >
              <div className="flex items-center justify-between gap-2 pb-2.5 mb-2 border-b border-base-content/10">
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-xs font-bold text-base-content uppercase tracking-wider">
                    Themes
                  </span>
                  <span className="badge badge-sm badge-neutral text-[10px] font-mono">
                    {filteredThemes.length} / {themes.length}
                  </span>
                </div>

                <div className="relative w-36 sm:w-48">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Filter themes..."
                    aria-label="Filter themes"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input input-xs w-full pl-8 pr-2 py-1 bg-base-200 border-0 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-base-content"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-88 sm:max-h-104 overflow-y-auto pr-2.5 custom-scrollbar">
                {filteredThemes.map((t) => {
                  const isActive = theme === t;
                  return (
                    <button
                      key={t}
                      onClick={() => {
                        onSelectTheme(t);
                        if (document.activeElement) {
                          document.activeElement.blur();
                        }
                      }}
                      aria-label={`Switch theme to ${t}`}
                      className={`flex items-center justify-between p-2 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                        isActive
                          ? "bg-base-content/10 border-primary shadow-xs font-bold text-base-content"
                          : "bg-base-100 hover:bg-base-200/70 border-base-content/10 text-base-content/80"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        {isActive ? (
                          <Check className="w-3.5 h-3.5 text-primary shrink-0 stroke-[2.5]" />
                        ) : (
                          <span className="w-3.5 h-3.5 shrink-0" />
                        )}
                        <span className="capitalize truncate">{t}</span>
                      </div>

                      <span
                        data-theme={t}
                        className="flex gap-1 p-1 bg-base-100 rounded-md border border-base-content/10 shadow-2xs shrink-0"
                      >
                        <span className="w-1.5 h-3.5 rounded-2xs bg-primary" />
                        <span className="w-1.5 h-3.5 rounded-2xs bg-secondary" />
                        <span className="w-1.5 h-3.5 rounded-2xs bg-accent" />
                        <span className="w-1.5 h-3.5 rounded-2xs bg-neutral" />
                      </span>
                    </button>
                  );
                })}

                {filteredThemes.length === 0 && (
                  <div className="col-span-full py-8 text-center text-xs text-base-content/50">
                    No themes found matching &ldquo;{search}&rdquo;
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Logged Out Navigation */}
          {!user ? (
            <>
              {/* Desktop Direct Links */}
              <div className="hidden sm:flex items-center gap-2 ml-1">
                {isLoginPage ? (
                  <Link
                    to="/"
                    className="btn btn-sm btn-ghost text-xs font-semibold rounded-lg text-base-content/80 hover:text-base-content"
                  >
                    Back to Home
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login?mode=signin"
                      className="btn btn-sm btn-ghost text-xs font-semibold rounded-lg text-base-content/80 hover:text-base-content"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/login?mode=signup"
                      className="btn btn-sm btn-primary text-xs font-semibold rounded-lg shadow-xs"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Hamburger Toggle Button (sm:hidden) */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="sm:hidden btn btn-xs sm:btn-sm btn-ghost btn-circle border border-base-content/15 text-base-content hover:bg-base-200 transition-colors"
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Menu className="w-4 h-4" />
                )}
              </button>
            </>
          ) : (
            /* Logged In User Profile Menu */
            <div className="dropdown dropdown-end">
              <button
                tabIndex={0}
                className="avatar shrink-0 hover:opacity-85 transition-opacity focus:outline-none flex items-center cursor-pointer p-0.5"
                title={`${user.firstName} ${user.lastName || ""}`.trim()}
                aria-label="User menu"
              >
                <div className="w-8 h-8 rounded-full bg-base-300 text-base-content/70 border border-base-content/15 flex items-center justify-center overflow-hidden shadow-2xs">
                  {user?.profilePictureUrl ? (
                    <img
                      src={user.profilePictureUrl}
                      alt={user.firstName || "User"}
                      width="32"
                      height="32"
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        e.target.src = "/default-avatar.svg";
                      }}
                    />
                  ) : (
                    <User className="w-4 h-4 m-auto" />
                  )}
                </div>
              </button>

              <ul
                tabIndex={0}
                className="dropdown-content menu p-2.5 shadow-2xl bg-base-100 rounded-2xl w-72 sm:w-64 border border-base-content/10 mt-2 z-50 text-xs gap-1"
              >
                {/* Profile Header with Avatar DP beside Name & Email */}
                <li className="px-2 py-2 border-b border-base-content/10 pointer-events-none select-none">
                  <div className="flex items-center gap-2.5 p-0 bg-transparent hover:bg-transparent">
                    <div className="avatar shrink-0">
                      <div className="w-10 h-10 rounded-full border border-base-content/15 overflow-hidden bg-base-200 shadow-2xs">
                        {user?.profilePictureUrl ? (
                          <img
                            src={user.profilePictureUrl}
                            alt={user.firstName || "User"}
                            width="40"
                            height="40"
                            className="w-full h-full object-cover object-top"
                            onError={(e) => {
                              e.target.src = "/default-avatar.svg";
                            }}
                          />
                        ) : (
                          <User className="w-5 h-5 m-auto text-base-content/60" />
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="font-bold text-xs text-base-content truncate">
                          {user.firstName} {user.lastName || ""}
                        </span>
                        {user?.membershipType === "premium" && (
                          <Crown className="w-3 h-3 text-amber-500 fill-amber-500/20 stroke-[2.5] shrink-0" />
                        )}
                        {user?.membershipType === "pro" && (
                          <Zap className="w-3 h-3 text-primary stroke-[2.5] shrink-0" />
                        )}
                      </div>
                      <span className="text-[11px] text-base-content/60 truncate">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </li>

                <li>
                  <Link
                    to="/profile"
                    onClick={() => {
                      if (document.activeElement) {
                        document.activeElement.blur();
                      }
                    }}
                    className="flex items-center gap-2 py-2 hover:bg-base-200 rounded-lg transition-colors cursor-pointer text-base-content"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Profile Settings</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/connections"
                    onClick={() => {
                      if (document.activeElement) {
                        document.activeElement.blur();
                      }
                    }}
                    className="flex items-center gap-2 py-2 hover:bg-base-200 rounded-lg transition-colors cursor-pointer text-base-content"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Connections</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/requests"
                    onClick={() => {
                      if (document.activeElement) {
                        document.activeElement.blur();
                      }
                    }}
                    className="flex items-center gap-2 py-2 hover:bg-base-200 rounded-lg transition-colors cursor-pointer text-base-content"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Requests</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/premium"
                    onClick={() => {
                      if (document.activeElement) {
                        document.activeElement.blur();
                      }
                    }}
                    className="flex items-center justify-between py-2 hover:bg-base-200 rounded-lg transition-colors cursor-pointer text-base-content"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                      <span>Membership Plans</span>
                    </div>
                    {user?.membershipType === "premium" ? (
                      <span className="badge badge-xs bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold uppercase font-mono text-[9px] gap-0.5 px-1.5 py-1">
                        <Crown className="w-2.5 h-2.5 stroke-[2.5]" /> VIP
                      </span>
                    ) : user?.membershipType === "pro" ? (
                      <span className="badge badge-xs badge-primary font-bold uppercase font-mono text-[9px] gap-0.5 px-1.5 py-1">
                        <Zap className="w-2.5 h-2.5 stroke-[2.5]" /> PRO
                      </span>
                    ) : (
                      <span className="badge badge-xs badge-ghost text-base-content/60 font-medium uppercase font-mono text-[9px] px-1.5 py-1">
                        Basic
                      </span>
                    )}
                  </Link>
                </li>

                {/* Mobile Theme Selector inside Profile Dropdown */}
                <li className="sm:hidden border-t border-base-content/10 pt-1.5">
                  <div className="flex flex-col gap-1.5 p-1 w-full bg-transparent hover:bg-transparent cursor-default">
                    <div className="flex items-center justify-between gap-2 w-full text-[11px] font-semibold text-base-content/75 px-1 py-0.5">
                      <span className="flex items-center gap-1.5 shrink-0">
                        <Palette className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>Theme</span>
                      </span>
                      <span className="ml-auto text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-base-200 border border-base-content/15 font-bold text-base-content tracking-wide shadow-2xs">
                        {theme}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-2.5 pl-0.5 py-1 custom-scrollbar">
                      {themes.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => {
                            onSelectTheme(t);
                            if (document.activeElement) {
                              document.activeElement.blur();
                            }
                          }}
                          aria-label={`Select ${t} theme`}
                          className={`flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] capitalize border transition-all text-left cursor-pointer min-w-0 ${
                            theme === t
                              ? "bg-primary text-primary-content font-bold border-primary shadow-2xs"
                              : "bg-base-100 hover:bg-base-200 border-base-content/10 text-base-content/80"
                          }`}
                        >
                          <span className="truncate flex-1 min-w-0 font-medium">{t}</span>
                          <span
                            data-theme={t}
                            className="flex gap-0.5 p-0.5 bg-base-100 rounded border border-base-content/10 shrink-0 ml-1"
                          >
                            <span className="w-1 h-2.5 rounded-2xs bg-primary" />
                            <span className="w-1 h-2.5 rounded-2xs bg-secondary" />
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </li>

                <li className="border-t border-base-content/10 pt-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 py-2 text-error hover:bg-error/10 hover:text-error rounded-lg transition-colors w-full text-left cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>

      {/* Mobile Hamburger Dropdown Menu for Logged Out / Landing / Login */}
      <AnimatePresence>
        {!user && mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="sm:hidden sticky top-14 z-35 bg-base-100/95 backdrop-blur-xl border-b border-base-content/10 shadow-xl overflow-hidden px-4 py-3"
          >
            <div className="flex flex-col gap-2 max-w-sm mx-auto">
              {isLoginPage ? (
                <>
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn btn-sm btn-ghost justify-start text-xs font-semibold text-base-content/85 gap-2 w-full"
                  >
                    <OrbitLogo className="w-4 h-4" />
                    <span>Back to Home</span>
                  </Link>
                  <div className="border-t border-base-content/10 my-0.5" />
                  <Link
                    to="/login?mode=signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`btn btn-sm justify-start text-xs font-semibold gap-2 w-full ${
                      location.search.includes("mode=signin") ||
                      !location.search.includes("mode=signup")
                        ? "btn-primary shadow-xs"
                        : "btn-ghost text-base-content/80"
                    }`}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    to="/login?mode=signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`btn btn-sm justify-start text-xs font-semibold gap-2 w-full ${
                      location.search.includes("mode=signup")
                        ? "btn-primary shadow-xs"
                        : "btn-ghost text-base-content/80"
                    }`}
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Create Account</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login?mode=signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn btn-sm btn-ghost justify-center text-xs font-semibold text-base-content/85 hover:text-base-content w-full border border-base-content/15"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/login?mode=signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn btn-sm btn-primary justify-center text-xs font-semibold w-full shadow-xs"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation Bar (active on mobile <md) */}
      {user && (
        <nav
          aria-label="Mobile bottom navigation"
          className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-base-100/90 backdrop-blur-lg border-t border-base-content/10 px-2 py-1.5 flex items-center justify-around shadow-2xl safe-area-bottom"
        >
          <Link
            to="/feed"
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
              location.pathname === "/feed"
                ? "text-primary font-bold"
                : "text-base-content/65 hover:text-base-content"
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px]">Feed</span>
          </Link>

          <Link
            to="/connections"
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
              location.pathname === "/connections"
                ? "text-primary font-bold"
                : "text-base-content/65 hover:text-base-content"
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px]">Network</span>
          </Link>

          <Link
            to="/requests"
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
              location.pathname === "/requests"
                ? "text-primary font-bold"
                : "text-base-content/65 hover:text-base-content"
            }`}
          >
            <UserCheck className="w-5 h-5" />
            <span className="text-[10px]">Requests</span>
          </Link>

          <Link
            to="/profile"
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
              location.pathname === "/profile"
                ? "text-primary font-bold"
                : "text-base-content/65 hover:text-base-content"
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px]">Profile</span>
          </Link>

          <Link
            to="/premium"
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
              location.pathname === "/premium"
                ? "text-primary font-bold"
                : "text-base-content/65 hover:text-base-content"
            }`}
          >
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span className="text-[10px]">Plans</span>
          </Link>
        </nav>
      )}
    </>
  );
}
