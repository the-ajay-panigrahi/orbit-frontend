import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
  Orbit,
  Palette,
  ChevronDown,
  Check,
  User,
  Search,
  LogOut,
  Compass,
  Users,
  UserCheck,
} from "lucide-react";
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
    <header className="navbar bg-base-100/80 backdrop-blur-md sticky top-0 z-40 border-b border-base-content/10 px-4 sm:px-8 transition-colors duration-200">
      <div className="flex-1 flex items-center">
        <Link
          to={user ? "/feed" : "/"}
          className="flex items-center gap-2 select-none"
        >
          <Orbit className="w-6 h-6 text-primary stroke-[2.2] shrink-0" />
          <span className="text-lg sm:text-xl font-bold tracking-tight text-base-content whitespace-nowrap">
            Orbit
          </span>
        </Link>

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
              <Compass className="w-4 h-4" />
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
              <User className="w-4 h-4" />
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
              <Users className="w-4 h-4" />
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
              <UserCheck className="w-4 h-4" />
              <span>Requests</span>
            </Link>
          </nav>
        )}
      </div>

      <div className="flex-none flex items-center gap-2 sm:gap-3">
        <div className="dropdown dropdown-end">
          <button
            tabIndex={0}
            className="btn btn-sm btn-ghost gap-2 border border-base-content/15 rounded-full hover:bg-base-content/5 transition-colors"
            aria-label="Theme selector"
          >
            <Palette className="w-4 h-4 text-base-content/70 shrink-0" />
            <span className="text-xs font-semibold capitalize text-base-content max-w-20 sm:max-w-none truncate">
              {theme}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-base-content/50 shrink-0" />
          </button>

          <div
            tabIndex={0}
            className="dropdown-content z-50 p-3 shadow-2xl bg-base-100 rounded-2xl w-[calc(100vw-2rem)] max-w-sm sm:max-w-md md:max-w-lg border border-base-content/10 mt-2"
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
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-base-content/40" />
                <input
                  type="text"
                  placeholder="Filter themes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input input-xs w-full pl-8 pr-2 py-1 bg-base-200 border-0 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-base-content"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-88 sm:max-h-104 overflow-y-auto pr-1">
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
                    className={`flex items-center justify-between p-2 rounded-xl border text-xs text-left transition-all ${
                      isActive
                        ? "bg-base-content/10 border-primary shadow-sm font-bold text-base-content"
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
                      className="flex gap-1 p-1 bg-base-100 rounded-md border border-base-content/10 shadow-sm shrink-0"
                    >
                      <span className="w-1.5 h-3.5 rounded-sm bg-primary" />
                      <span className="w-1.5 h-3.5 rounded-sm bg-secondary" />
                      <span className="w-1.5 h-3.5 rounded-sm bg-accent" />
                      <span className="w-1.5 h-3.5 rounded-sm bg-neutral" />
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

        {!user ? (
          <div className="flex items-center gap-2 ml-1">
            <Link
              to="/login?mode=signin"
              className="btn btn-sm btn-ghost text-xs font-semibold rounded-lg text-base-content/80 hover:text-base-content"
            >
              Sign In
            </Link>
            <Link
              to="/login?mode=signup"
              className="btn btn-sm btn-primary text-xs font-semibold rounded-lg shadow-sm"
            >
              Get Started
            </Link>
          </div>
        ) : (
          <div className="dropdown dropdown-end">
            <button
              tabIndex={0}
              className="avatar shrink-0 hover:opacity-80 transition-opacity focus:outline-none flex items-center cursor-pointer"
              title={`${user.firstName} ${user.lastName || ""}`.trim()}
              aria-label="User menu"
            >
              <div className="w-8 h-8 rounded-full bg-base-300 text-base-content/70 border border-base-content/10 flex items-center justify-center overflow-hidden">
                {user?.profilePictureUrl ? (
                  <img
                    src={user.profilePictureUrl}
                    alt={user.firstName || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 m-auto" />
                )}
              </div>
            </button>

            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow-2xl bg-base-100 rounded-2xl w-52 border border-base-content/10 mt-2 z-50 text-xs gap-1"
            >
              <li className="px-3 py-2 border-b border-base-content/10 pointer-events-none">
                <span className="font-semibold text-xs text-base-content block truncate">
                  {user.firstName} {user.lastName || ""}
                </span>
                <span className="text-[11px] text-base-content/60 block truncate">
                  {user.email}
                </span>
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
                  <span>Profile</span>
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
    </header>
  );
}
