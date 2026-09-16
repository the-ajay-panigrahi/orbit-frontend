import { useState, useEffect, useRef, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Send, ShieldCheck, CheckCheck } from "lucide-react";
import { BASE_URL } from "../../utils/constants";
import { addConnections } from "../../utils/connectionSlice";
import ChatUpgradeGate from "./ChatUpgradeGate";

export default function Chat() {
  const { targetUserId } = useParams();
  const dispatch = useDispatch();

  const currentUser = useSelector((store) => store.user);
  const rawConnections = useSelector((store) => store.connections);
  const connections = useMemo(() => rawConnections || [], [rawConnections]);

  const canChat =
    currentUser?.membershipType === "pro" ||
    currentUser?.membershipType === "premium";

  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (connections.length === 0) {
      axios
        .get(`${BASE_URL}/user/connections`, { withCredentials: true })
        .then((res) => dispatch(addConnections(res?.data?.data || [])))
        .catch(() => {});
    }
  }, [connections.length, dispatch]);

  const targetUser = connections.find((u) => u._id === targetUserId);
  const targetName = targetUser
    ? `${targetUser.firstName || ""} ${targetUser.lastName || ""}`.trim()
    : "Orbit Connection";

  const [messages, setMessages] = useState([
    {
      id: "1",
      sender: "them",
      text: `Hey ${currentUser?.firstName || "there"}! Great connecting with you on Orbit.`,
      time: "10:30 AM",
    },
    {
      id: "2",
      sender: "me",
      text: "Hey! Glad to connect as well. What projects are you building right now?",
      time: "10:32 AM",
    },
    {
      id: "3",
      sender: "them",
      text: "Currently hacking on a modern full-stack web application. Let's sync up soon!",
      time: "10:33 AM",
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      sender: "me",
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
  };

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
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-base-100" />
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-base-content truncate">
                {targetName}
              </h3>
              <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
            </div>
            <span className="text-[11px] text-emerald-500 font-medium">
              Online
            </span>
          </div>
        </div>

        <span className="text-[10px] font-mono uppercase tracking-wider text-base-content/40 bg-base-200 px-2 py-0.5 rounded-md">
          1-on-1
        </span>
      </header>

      {/* Message Feed (Scrollbar comes within this container) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 min-h-0">
        <div className="max-w-4xl mx-auto space-y-3">
          {messages.map((msg) => {
            const isMe = msg.sender === "me";
            return (
              <div
                key={msg.id}
                className={`chat ${isMe ? "chat-end" : "chat-start"}`}
              >
                <div
                  className={`chat-bubble text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isMe
                      ? "chat-bubble-primary font-medium"
                      : "bg-base-200 text-base-content border border-base-content/8"
                  }`}
                >
                  {msg.text}
                </div>
                <div className="chat-footer opacity-45 text-[10px] font-mono mt-1 flex items-center gap-1">
                  <span>{msg.time}</span>
                  {isMe && <CheckCheck className="w-3 h-3 text-primary" />}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
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
            onChange={(e) => setInputText(e.target.value)}
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
