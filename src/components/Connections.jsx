import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Users,
  Search,
  MessageSquare,
  Sparkle,
  RotateCcw,
  Compass,
  Sparkles,
} from "lucide-react";
import { BASE_URL } from "../utils/constants";
import { addConnections } from "../utils/connectionSlice";

export default function Connections() {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const handleRefresh = () => {
    setError("");
    setIsLoading(true);
    axios
      .get(`${BASE_URL}/user/connections`, { withCredentials: true })
      .then((res) => {
        dispatch(addConnections(res?.data?.data || []));
      })
      .catch((err) => {
        setError(
          err?.response?.data?.error ||
            "Failed to load connections. Please try again.",
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Always fetch fresh connections on mount
  useEffect(() => {
    const controller = new AbortController();

    axios
      .get(`${BASE_URL}/user/connections`, {
        withCredentials: true,
        signal: controller.signal,
      })
      .then((res) => {
        dispatch(addConnections(res?.data?.data || []));
      })
      .catch((err) => {
        if (!axios.isCancel(err)) {
          setError(
            err?.response?.data?.error ||
              "Failed to load connections. Please try again.",
          );
        }
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [dispatch]);

  const handleMessageClick = (connectionName) => {
    setToastMessage(
      `Direct messaging with ${connectionName} will be available in Orbit Chat!`,
    );
    setTimeout(() => setToastMessage(""), 2800);
  };

  // Filter connections by name or skill
  const filteredConnections = (connections || []).filter((user) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
    const hasMatchingSkill = Array.isArray(user.skills)
      ? user.skills.some((skill) => skill.toLowerCase().includes(query))
      : false;
    const hasMatchingLookingFor = (user.lookingFor || "")
      .toLowerCase()
      .includes(query);

    return (
      fullName.includes(query) || hasMatchingSkill || hasMatchingLookingFor
    );
  });

  // Loading skeleton
  if (isLoading && !connections) {
    return (
      <div className="flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6 flex flex-col gap-4">
        <div className="skeleton h-8 w-48 rounded-lg mb-2"></div>
        <div className="skeleton h-10 w-full rounded-xl mb-3"></div>
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="p-5 rounded-2xl bg-base-100 border border-base-content/10 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="skeleton w-14 h-14 rounded-2xl shrink-0"></div>
              <div className="flex flex-col gap-2">
                <div className="skeleton h-5 w-36"></div>
                <div className="skeleton h-3.5 w-24"></div>
              </div>
            </div>
            <div className="skeleton h-9 w-24 rounded-xl"></div>
          </div>
        ))}
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 text-center">
        <div className="card w-full max-w-sm bg-base-100 shadow-xl border border-base-content/10 p-8 flex flex-col items-center gap-4">
          <p className="text-sm text-error font-medium">{error}</p>
          <button onClick={handleRefresh} className="btn btn-sm btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6 flex flex-col">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-neutral py-2 px-4 shadow-xl border border-base-content/10 text-xs font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-base-content/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-base-content flex items-center gap-2">
              My Orbit Network
              {connections && (
                <span className="badge badge-sm badge-primary font-mono text-[11px]">
                  {connections.length}
                </span>
              )}
            </h1>
            <p className="text-xs text-base-content/60">
              Founders, engineers, and creators you are connected with
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={handleRefresh}
            className="btn btn-ghost btn-circle btn-sm text-base-content/60 hover:text-base-content"
            title="Refresh network"
            aria-label="Refresh network"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Filter Bar */}
      {connections.length > 0 && (
        <div className="relative mb-6">
          <Search className="w-4 h-4 text-base-content/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search connections by name, skill, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-sm sm:input-md w-full pl-10 rounded-xl bg-base-100 border-base-content/15 text-xs sm:text-sm focus:border-primary focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-base-content/40 hover:text-base-content font-mono px-1.5 py-0.5"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Empty State */}
      {connections.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center my-auto">
          <div className="w-16 h-16 rounded-2xl bg-base-200 border border-base-content/10 flex items-center justify-center text-base-content/40 mb-4">
            <Users className="w-8 h-8 stroke-[1.4]" />
          </div>
          <h2 className="text-lg font-bold text-base-content mb-1">
            No Connections Yet
          </h2>
          <p className="text-xs text-base-content/60 max-w-sm mb-6 leading-relaxed">
            Your Orbit is waiting to expand! Connect with founders, CTOs, and
            creators in your feed to start building your network.
          </p>
          <Link to="/feed" className="btn btn-sm btn-primary gap-2 font-medium">
            <Compass className="w-4 h-4" />
            Discover Builders in Feed
          </Link>
        </div>
      ) : filteredConnections.length === 0 ? (
        <div className="p-8 text-center bg-base-100 rounded-2xl border border-base-content/10">
          <p className="text-sm font-semibold text-base-content">
            No connections found matching &quot;{searchQuery}&quot;
          </p>
          <p className="text-xs text-base-content/60 mt-1">
            Try searching for a different name, role, or tech stack.
          </p>
        </div>
      ) : (
        /* Connections Directory List */
        <div className="flex flex-col gap-3">
          {filteredConnections.map((user) => {
            const fullName =
              `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
              "Anonymous Builder";
            const profilePictureUrl =
              user.profilePictureUrl || "/default-avatar.svg";
            const skills = Array.isArray(user.skills) ? user.skills : [];

            return (
              <div
                key={user._id}
                className="group p-4 sm:p-5 rounded-2xl bg-base-100 border border-base-content/10 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Left Profile Details */}
                <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                  <div className="avatar shrink-0 relative">
                    <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl border border-base-content/10 overflow-hidden bg-base-200">
                      <img
                        src={profilePictureUrl}
                        alt={fullName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/default-avatar.svg";
                        }}
                      />
                    </div>
                    <span
                      className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-base-100"
                      title="Connected"
                    />
                  </div>

                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base font-bold text-base-content truncate">
                        {fullName}
                      </h3>
                      {(user.age || user.gender) && (
                        <span className="text-[11px] font-semibold text-base-content/60 bg-base-200 px-2 py-0.5 rounded-md shrink-0 capitalize">
                          {[user.age, user.gender].filter(Boolean).join(" • ")}
                        </span>
                      )}
                    </div>

                    {user.lookingFor && (
                      <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
                        <Sparkle className="w-3 h-3 shrink-0" />
                        <span className="truncate">
                          Looking for: {user.lookingFor}
                        </span>
                      </div>
                    )}

                    {user.about && (
                      <p className="text-xs text-base-content/70 line-clamp-1 break-words">
                        {user.about}
                      </p>
                    )}

                    {skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {skills.slice(0, 5).map((skill, idx) => (
                          <span
                            key={idx}
                            className="badge badge-xs bg-base-200 text-base-content/75 font-mono border-0"
                          >
                            {skill}
                          </span>
                        ))}
                        {skills.length > 5 && (
                          <span className="text-[10px] text-base-content/50 self-center font-mono">
                            +{skills.length - 5} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Action Dock */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-base-content/10 shrink-0">
                  <button
                    onClick={() => handleMessageClick(user.firstName)}
                    className="btn btn-sm btn-outline border-base-content/20 hover:border-primary hover:bg-primary hover:text-primary-content gap-2 transition-all cursor-pointer"
                    title="Send Message"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Message</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
