import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { motion } from "motion/react";
import {
  Users,
  Search,
  MessageSquare,
  Sparkle,
  RotateCcw,
  Compass,
  Sparkles,
  Lock,
} from "lucide-react";
import { BASE_URL } from "../utils/constants";
import { addConnections } from "../utils/connectionSlice";
import RowMorphDetailModal from "./RowMorphDetailModal";

const springTap = { type: "spring", stiffness: 400, damping: 22 };

export default function Connections() {
  const connections = useSelector((store) => store.connections);
  const currentUser = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const canChat =
    currentUser?.membershipType === "pro" ||
    currentUser?.membershipType === "premium";

  const [selectedUser, setSelectedUser] = useState(null);
  const [originRect, setOriginRect] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const handleRefresh = () => {
    setError("");
    setIsLoading(true);
    axios
      .get(`${BASE_URL}/user/connections`, { withCredentials: true })
      .then((res) => dispatch(addConnections(res?.data?.data || [])))
      .catch((err) =>
        setError(
          err?.response?.data?.error ||
            "Failed to load connections. Please try again.",
        ),
      )
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get(`${BASE_URL}/user/connections`, {
        withCredentials: true,
        signal: controller.signal,
      })
      .then((res) => dispatch(addConnections(res?.data?.data || [])))
      .catch((err) => {
        if (!axios.isCancel(err))
          setError(
            err?.response?.data?.error ||
              "Failed to load connections. Please try again.",
          );
      })
      .finally(() => setIsLoading(false));
    return () => controller.abort();
  }, [dispatch]);

  const handleMessageClick = (targetUser) => {
    if (!canChat) {
      setToastMessage({
        type: "upgrade",
        text: "1-on-1 direct chat is unlocked on Pro & Premium plans.",
      });
      setTimeout(() => setToastMessage(null), 4000);
      return;
    }
    navigate(`/chat/${targetUser._id}`);
  };

  const filteredConnections = (connections || []).filter((user) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const fullName =
      `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
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

  if (isLoading && !connections) {
    return (
      <div className="flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6 flex flex-col gap-4">
        <div className="skeleton h-8 w-48 rounded-lg mb-2"></div>
        <div className="skeleton h-10 w-full rounded-xl mb-3"></div>
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="p-3 sm:p-3.5 rounded-2xl bg-base-100 border border-base-content/10 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3.5 flex-1 min-w-0">
              <div className="skeleton w-12 h-12 sm:w-14 sm:h-14 rounded-2xl shrink-0"></div>
              <div className="flex flex-col gap-2 flex-1">
                <div className="skeleton h-4 w-36 rounded"></div>
                <div className="skeleton h-3 w-48 rounded"></div>
              </div>
            </div>
            <div className="skeleton h-8 w-22 rounded-xl shrink-0"></div>
          </div>
        ))}
      </div>
    );
  }

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
    <div className="flex-1 w-full max-w-4xl mx-auto p-3 sm:p-6 pb-20 md:pb-6 flex flex-col">
      {toastMessage && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-neutral py-2.5 px-4 shadow-xl border border-primary/20 text-xs font-medium flex items-center gap-2.5">
            {typeof toastMessage === "object" &&
            toastMessage?.type === "upgrade" ? (
              <>
                <Lock className="w-4 h-4 text-primary shrink-0" />
                <span>{toastMessage.text}</span>
                <Link
                  to="/premium"
                  className="btn btn-xs btn-primary rounded-lg font-semibold ml-1 shadow-xs"
                >
                  Upgrade
                </Link>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-primary shrink-0" />
                <span>
                  {typeof toastMessage === "object"
                    ? toastMessage.text
                    : toastMessage}
                </span>
              </>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-base-content/8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-base-content flex items-center gap-2">
              My Orbit Network
              {connections && (
                <span className="badge badge-sm badge-primary font-mono text-xs">
                  {connections.length}
                </span>
              )}
            </h1>
            <p className="text-xs text-base-content/55">
              Founders, engineers, and creators you are connected with
            </p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          className="btn btn-ghost btn-circle btn-sm text-base-content/50 hover:text-base-content self-end sm:self-center"
          title="Refresh network"
          aria-label="Refresh network"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {connections.length > 0 && (
        <div className="space-y-3 mb-6">
          <div className="relative">
            <Search className="w-4 h-4 text-base-content/35 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2.3]" />
            <input
              type="text"
              placeholder="Search by name, skill, or role..."
              aria-label="Search connections by name, skill, or role"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-sm sm:input-md w-full pl-10 rounded-xl bg-base-100 border-base-content/12 text-sm focus:border-primary focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                aria-label="Clear search query"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-base-content/40 hover:text-base-content font-mono px-1.5 py-0.5 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {connections.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center my-auto">
          <div className="relative w-16 h-16 rounded-2xl bg-base-200 border border-base-content/10 flex items-center justify-center text-base-content/40 mb-4">
            <Users className="w-8 h-8 stroke-[1.4]" />
          </div>
          <h2 className="text-xl font-bold text-base-content mb-1">
            No Connections Yet
          </h2>
          <p className="text-sm text-base-content/55 max-w-sm mb-6 leading-relaxed">
            Your Orbit is waiting to expand! Connect with founders, CTOs, and
            creators in your feed to start building your network.
          </p>
          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={springTap}
          >
            <Link
              to="/feed"
              className="btn btn-sm btn-primary gap-2 font-medium cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              Discover Builders in Feed
            </Link>
          </motion.div>
        </div>
      ) : filteredConnections.length === 0 ? (
        <div className="p-8 text-center bg-base-100 rounded-2xl border border-base-content/10">
          <p className="text-sm font-semibold text-base-content">
            No connections found matching &quot;{searchQuery}&quot;
          </p>
          <p className="text-xs text-base-content/55 mt-1">
            Try searching for a different name, role, or tech stack.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {filteredConnections.map((user) => {
            const fullName =
              `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
              "Anonymous Builder";
            const profilePictureUrl =
              user.profilePictureUrl || "/default-avatar.svg";
            const skills = Array.isArray(user.skills) ? user.skills : [];

            return (
              <motion.div
                key={user._id}
                whileHover={{ y: -1 }}
                transition={{ duration: 0.15 }}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setOriginRect(rect);
                  setSelectedUser(user);
                }}
                className="group p-2.5 sm:p-3 rounded-2xl bg-base-100/90 backdrop-blur-sm border border-base-content/12 shadow-xs hover:shadow-md hover:border-primary/30 transition-all duration-200 flex items-center justify-between gap-3 sm:gap-4 cursor-pointer"
              >
                <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
                  <div className="avatar shrink-0 relative">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border border-base-content/12 overflow-hidden bg-base-200 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                      <img
                        src={profilePictureUrl}
                        alt={fullName}
                        width="56"
                        height="56"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          e.target.src = "/default-avatar.svg";
                        }}
                      />
                    </div>
                    <span
                      className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-base-100 shadow-2xs"
                      title="Connected"
                    />
                  </div>

                  <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base font-bold text-base-content tracking-tight truncate group-hover:text-primary transition-colors">
                        {fullName}
                      </h3>
                      {(user.age || user.gender) && (
                        <span className="text-[11px] font-semibold text-base-content/65 bg-base-200/80 border border-base-content/8 px-2 py-0.5 rounded-md shrink-0 capitalize">
                          {[user.age, user.gender].filter(Boolean).join(" • ")}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-base-content/55 truncate">
                      {user.lookingFor ? (
                        <span className="inline-flex items-center gap-1 text-primary font-medium truncate">
                          <Sparkle className="w-3 h-3 shrink-0" />
                          <span className="truncate">
                            Looking for: {user.lookingFor}
                          </span>
                        </span>
                      ) : user.about ? (
                        <span className="truncate">{user.about}</span>
                      ) : skills.length > 0 ? (
                        <span className="font-mono text-xs text-base-content/65 truncate">
                          {skills.slice(0, 3).join(" • ")}
                        </span>
                      ) : (
                        <span>Orbit Builder</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMessageClick(user);
                    }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.95 }}
                    transition={springTap}
                    className={`btn btn-sm rounded-xl gap-1.5 font-semibold shadow-xs cursor-pointer ${
                      canChat
                        ? "btn-primary"
                        : "btn-outline border-base-content/15 hover:bg-base-200 text-base-content"
                    }`}
                    title={
                      canChat
                        ? `Chat with ${user.firstName}`
                        : "Unlock 1-on-1 Chat with Pro or Premium"
                    }
                  >
                    {canChat ? (
                      <MessageSquare className="w-3.5 h-3.5 stroke-[2.3]" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-primary stroke-[2.3]" />
                    )}
                    <span className="hidden xs:inline sm:inline">
                      {canChat ? "Chat" : "Chat (Pro)"}
                    </span>
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <RowMorphDetailModal
        isOpen={Boolean(selectedUser)}
        onClose={() => {
          setSelectedUser(null);
          setOriginRect(null);
        }}
        user={selectedUser}
        originRect={originRect}
        actions={
          selectedUser && (
            <button
              onClick={() => {
                handleMessageClick(selectedUser);
                setSelectedUser(null);
                setOriginRect(null);
              }}
              className={`btn btn-sm w-full rounded-xl gap-2 font-semibold shadow-md cursor-pointer ${
                canChat
                  ? "btn-primary"
                  : "btn-outline border-base-content/20 text-base-content"
              }`}
            >
              {canChat ? (
                <MessageSquare className="w-4 h-4" />
              ) : (
                <Lock className="w-4 h-4 text-primary" />
              )}
              <span>
                {canChat
                  ? `Chat with ${selectedUser.firstName}`
                  : `Unlock Chat with ${selectedUser.firstName} (Pro)`}
              </span>
            </button>
          )
        }
      />
    </div>
  );
}
