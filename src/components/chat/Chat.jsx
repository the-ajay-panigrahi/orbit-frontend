import { useState, useEffect, useRef, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Send, ShieldCheck, CheckCheck, Lock } from "lucide-react";
import { BASE_URL } from "../../utils/constants";
import { addConnections } from "../../utils/connectionSlice";
import ChatUpgradeGate from "./ChatUpgradeGate";
import { createSocketConnection } from "../../utils/socket";

export default function Chat() {
  const { targetUserId } = useParams();
  const dispatch = useDispatch();

  const currentUser = useSelector((store) => store.user);
  const rawConnections = useSelector((store) => store.connections);
  const connections = useMemo(() => rawConnections || [], [rawConnections]);

  // Temporarily set to true for testing - anyone can chat
  // eslint-disable-next-line no-constant-binary-expression
  const canChat = true || currentUser?.membershipType === "pro";

  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const [notConnected, setNotConnected] = useState(false);
  const [isTargetTyping, setIsTargetTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  useEffect(() => {
    if (connections.length === 0) {
      axios
        .get(`${BASE_URL}/user/connections`, { withCredentials: true })
        .then((res) => dispatch(addConnections(res?.data?.data || [])))
        .catch(() => { });
    }
  }, [connections.length, dispatch]);

  useEffect(() => {
    if (!targetUserId || !currentUser?._id) return;

    const fetchChatMessages = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
          withCredentials: true,
        });
        const chatMessages = (res.data?.messages || []).map((msg) => {
          const senderIdStr = msg.senderId?._id?.toString() || msg.senderId?.toString();
          const currentUserIdStr = currentUser._id.toString();
          const isMe = senderIdStr === currentUserIdStr;
          return {
            id: msg._id,
            sender: isMe ? "me" : "them",
            text: msg.text,
            time: new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };
        });
        setMessages(chatMessages);
      } catch (err) {
        if (err.response?.status === 403) {
          setNotConnected(true);
        }
        console.error("Failed to load chat history:", err);
      }
    };

    fetchChatMessages();
  }, [targetUserId, currentUser?._id]);

  useEffect(() => {
    if (!currentUser?._id || !targetUserId) return;
    const socket = createSocketConnection();
    socketRef.current = socket;

    // As soon as the page loaded, the socket connection is made and the joinChat event is emitted
    socket.emit("joinChat", {
      firstName: currentUser.firstName,
      currentUserId: currentUser._id,
      targetUserId,
    });

    // Check peer's online status initially
    socket.emit("checkUserOnline", { targetUserId }, (response) => {
      if (response?.isOnline !== undefined) {
        setIsOnline(response.isOnline);
      }
    });

    // Real-time presence updates
    socket.on("userOnline", ({ userId }) => {
      if (userId === targetUserId) {
        setIsOnline(true);
      }
    });

    socket.on("userOffline", ({ userId }) => {
      if (userId === targetUserId) {
        setIsOnline(false);
      }
    });

    // Listen for incoming messages from the room
    socket.on("messageReceived", ({ firstName, text, senderId }) => {
      setIsTargetTyping(false);
      const isMe =
        (senderId && senderId.toString() === currentUser._id.toString()) ||
        firstName === currentUser.firstName;

      if (!isMe) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: "them",
            text,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
    });

    // Typing indicators from peer
    socket.on("userTyping", () => {
      setIsTargetTyping(true);
    });

    socket.on("userStoppedTyping", () => {
      setIsTargetTyping(false);
    });

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      socket.disconnect();
    };
  }, [currentUser?._id, targetUserId, currentUser?.firstName]);

  const targetUser = connections.find((u) => u._id === targetUserId);
  const targetName = targetUser
    ? `${targetUser.firstName || ""} ${targetUser.lastName || ""}`.trim()
    : "Orbit Connection";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTargetTyping]);

  const handleInputChange = (e) => {
    setInputText(e.target.value);

    if (!socketRef.current) return;

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socketRef.current.emit("typing", { targetUserId });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit("stopTyping", { targetUserId });
      isTypingRef.current = false;
    }, 2000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    if (isTypingRef.current) {
      socketRef.current?.emit("stopTyping", { targetUserId });
      isTypingRef.current = false;
    }

    // Emit the message event to the backend socket server
    socketRef.current?.emit("sendMessage", {
      firstName: currentUser.firstName,
      currentUserId: currentUser._id,
      targetUserId,
      text: inputText.trim(),
    });

    const newMessage = {
      id: Date.now().toString(),
      sender: "me",
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
  };

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
                  className={`chat-bubble text-xs sm:text-sm leading-relaxed shadow-xs ${isMe
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
          {isTargetTyping && (
            <div className="chat chat-start animate-fade-in">
              <div className="chat-bubble bg-base-200 text-base-content/70 border border-base-content/8 py-2 px-3.5 flex items-center gap-1.5 shadow-xs">
                <span className="text-xs mr-1 font-medium">{targetUser?.firstName || "They"} is typing</span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-bounce" />
              </div>
            </div>
          )}
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
