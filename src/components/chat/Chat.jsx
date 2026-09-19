import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Send, ShieldCheck, Lock } from "lucide-react";
import { Virtuoso } from "react-virtuoso";
import { BASE_URL } from "../../utils/constants";
import { addConnections } from "../../utils/connectionSlice";
import { useChat } from "../../hooks/useChat";
import ChatUpgradeGate from "./ChatUpgradeGate";

export default function Chat() {
  const { targetUserId } = useParams();
  const dispatch = useDispatch();

  const currentUser = useSelector((store) => store.user);
  const rawConnections = useSelector((store) => store.connections);
  const connections = useMemo(() => rawConnections || [], [rawConnections]);

  const targetUser = useMemo(
    () => connections.find((u) => u._id === targetUserId),
    [connections, targetUserId]
  );
  const targetName = targetUser
    ? `${targetUser.firstName || ""} ${targetUser.lastName || ""}`.trim()
    : "Orbit Connection";

  // Temporarily set to true for testing - anyone can chat
  // eslint-disable-next-line no-constant-binary-expression
  const canChat = true || currentUser?.membershipType === "pro";

  const {
    inputText,
    messages,
    notConnected,
    isTargetTyping,
    isOnline,
    hasMore,
    isLoadingMore,
    firstItemIndex,
    virtuosoRef,
    handleInputChange,
    handleSendMessage,
    loadOlderMessages,
  } = useChat({ targetUserId, currentUser, targetUser });

  if (notConnected) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-base-100">
        <div className="max-w-md w-full bg-base-200/60 backdrop-blur-md rounded-2xl border border-base-content/10 p-8 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-warning/10 text-warning flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-base-content">Connection Required</h2>
          <p className="text-xs text-base-content/70 leading-relaxed">
            You can only message members you have an accepted connection with. Connect with them first to start chatting!
          </p>
          <Link to="/connections" className="btn btn-primary btn-sm rounded-xl">
            View My Connections
          </Link>
        </div>
      </div>
    );
  }

  if (!canChat) {
    return <ChatUpgradeGate />;
  }

  return (
    <div className="flex-1 w-full h-full flex flex-col bg-base-100 min-h-0 overflow-hidden">
      {/* Chat Header */}
      <header className="px-4 sm:px-8 py-3.5 border-b border-base-content/10 bg-base-100/95 backdrop-blur-sm flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/connections"
            className="btn btn-ghost btn-circle btn-sm text-base-content/70 hover:text-base-content -ml-1"
            title="Back to Connections"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="relative shrink-0">
            <img
              src={targetUser?.profilePictureUrl || "/default-avatar.svg"}
              alt={targetName}
              className="w-10 h-10 rounded-xl object-cover border border-base-content/10 bg-base-200"
              onError={(e) => {
                e.target.src = "/default-avatar.svg";
              }}
            />
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-base-100 transition-colors duration-300 ${
                isOnline ? "bg-emerald-500" : "bg-base-content/25"
              }`}
            />
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-base-content truncate">
                {targetName}
              </h3>
              <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
            </div>
            <span
              className={`text-[11px] font-medium transition-colors duration-300 ${
                isOnline ? "text-emerald-500" : "text-base-content/40"
              }`}
            >
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>

        <span className="text-[10px] font-mono uppercase tracking-wider text-base-content/40 bg-base-200 px-2 py-0.5 rounded-md">
          1-on-1
        </span>
      </header>

      {/* Virtualized Message Feed with Scroll-Up Pagination */}
      <div className="flex-1 min-h-0 w-full">
        <Virtuoso
          ref={virtuosoRef}
          firstItemIndex={firstItemIndex}
          initialTopMostItemIndex={Math.max(0, messages.length - 1)}
          data={messages}
          startReached={loadOlderMessages}
          followOutput="auto"
          className="custom-scrollbar h-full"
          components={{
            Header: () => (
              <div className="py-2 text-center text-xs text-base-content/40">
                {isLoadingMore ? (
                  <div className="flex items-center justify-center gap-1.5 py-1">
                    <span className="loading loading-spinner loading-xs text-primary"></span>
                    <span>Loading older messages...</span>
                  </div>
                ) : hasMore ? (
                  <span className="opacity-50">Scroll up for older messages</span>
                ) : messages.length > 0 ? (
                  <span className="opacity-40 font-mono text-[10px] uppercase tracking-wider">Beginning of conversation</span>
                ) : null}
              </div>
            ),
          }}
          itemContent={(_index, msg) => {
            const isMe = msg.sender === "me";
            return (
              <div className="px-4 sm:px-6 py-1.5 max-w-4xl mx-auto">
                <div className={`chat ${isMe ? "chat-end" : "chat-start"}`}>
                  <div className="chat-image avatar">
                    <div className="w-8 h-8 rounded-xl border border-base-content/10 overflow-hidden bg-base-200 shrink-0">
                      <img
                        src={msg.senderAvatar || "/default-avatar.svg"}
                        alt={msg.senderName}
                        onError={(e) => {
                          e.target.src = "/default-avatar.svg";
                        }}
                      />
                    </div>
                  </div>
                  <div className="chat-header text-[11px] opacity-60 mb-0.5 px-0.5">
                    {msg.senderName}
                  </div>
                  <div
                    className={`chat-bubble text-xs sm:text-sm leading-relaxed shadow-xs ${
                      isMe
                        ? "chat-bubble-primary font-medium"
                        : "bg-base-200 text-base-content border border-base-content/8"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className="chat-footer opacity-40 text-[10px] font-mono mt-0.5 px-0.5">
                    {msg.time}
                  </div>
                </div>
              </div>
            );
          }}
        />
      </div>

      {/* Typing Indicator Bar - Pinned right above input footer */}
      <div className="h-6 px-4 sm:px-6 max-w-4xl mx-auto w-full flex items-center shrink-0">
        {isTargetTyping && (
          <div className="flex items-center gap-2 text-xs text-primary font-medium animate-fade-in">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
            </span>
            <span>{targetUser?.firstName || "They"} is typing...</span>
          </div>
        )}
      </div>

      {/* Bottom-aligned Input (Always visible, pinned at bottom) */}
      <footer className="p-3 sm:p-4 border-t border-base-content/10 bg-base-100 shrink-0 pb-20 md:pb-4">
        <form
          onSubmit={handleSendMessage}
          className="max-w-4xl mx-auto w-full flex items-center gap-2"
        >
          <input
            type="text"
            placeholder={`Message ${targetUser?.firstName || targetName}...`}
            value={inputText}
            onChange={handleInputChange}
            className="input input-sm sm:input-md flex-1 rounded-xl bg-base-200/80 border-none text-xs sm:text-sm focus:ring-1 focus:ring-primary focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="btn btn-primary btn-sm sm:btn-md btn-circle shrink-0 shadow-sm disabled:opacity-40"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </footer>
    </div>
  );
}
