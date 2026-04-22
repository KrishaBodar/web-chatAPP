import { useEffect, useMemo, useRef, useState } from "react";
import { LogOut, Menu, MoreHorizontal, Paperclip, Plus, Search, Send, Smile, Users, X, CheckCheck } from "lucide-react";
import { motion } from "framer-motion";
import BrandMark from "../components/BrandMark.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../lib/api.js";
import { useSocket } from "../hooks/useSocket.js";

function initials(name = "U") {
  return name.split(" ").filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function displayTime(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function Avatar({ user, size = "md" }) {
  const classes = size === "lg" ? "h-16 w-16 text-xl" : "h-11 w-11 text-sm";
  return (
    <div className={`relative grid ${classes} shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 font-bold text-white shadow-soft`}>
      {initials(user?.name || user?.username)}
      {user?.status === "online" && <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400 dark:border-slate-950" />}
    </div>
  );
}

function ChatRow({ chat, active, userId, onClick }) {
  const other = chat.type === "direct" ? chat.participants?.find((member) => member._id !== userId) : null;
  const title = chat.type === "direct" ? other?.name || chat.name || "Direct chat" : chat.name || "Group chat";

  return (
    <button onClick={onClick} className={`w-full rounded-2xl p-3 text-left transition ${active ? "bg-indigo-600 text-white shadow-soft" : "hover:bg-slate-100 dark:hover:bg-slate-900"}`}>
      <div className="flex items-center gap-3">
        <Avatar user={other || { name: title, status: chat.participants?.some((member) => member.status === "online") ? "online" : "offline" }} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="truncate text-sm font-bold">{title}</p>
            <span className={`text-[11px] ${active ? "text-indigo-100" : "text-slate-400"}`}>{displayTime(chat.lastMessage?.createdAt || chat.updatedAt)}</span>
          </div>
          <p className={`mt-1 truncate text-xs ${active ? "text-indigo-100" : "text-slate-500 dark:text-slate-400"}`}>{chat.lastMessage?.body || "No messages yet"}</p>
        </div>
      </div>
    </button>
  );
}

function ChatSidebar({ chats, activeChat, setActiveChat, user, onCreateChat, loading }) {
  const [query, setQuery] = useState("");
  const [username, setUsername] = useState("");
  const filtered = chats.filter((chat) => {
    const names = [chat.name, ...(chat.participants || []).map((member) => member.name || member.username)].join(" ").toLowerCase();
    return names.includes(query.toLowerCase());
  });

  async function create(event) {
    event.preventDefault();
    if (!username.trim()) return;
    await onCreateChat(username.trim());
    setUsername("");
  }

  return (
    <aside className="flex h-full flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="border-b border-slate-200 p-4 dark:border-slate-800">
        <div className="mb-5 flex items-center justify-between">
          <BrandMark />
          <ThemeToggle />
        </div>
        <label className="flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 text-slate-500 dark:border-slate-800 dark:bg-slate-900">
          <Search size={17} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search chats" className="w-full bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400 dark:text-white" />
        </label>
        <form onSubmit={create} className="mt-3 flex gap-2">
          <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Start by username" className="h-10 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950" />
          <button className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 text-white"><Plus size={18} /></button>
        </form>
      </div>
      <div className="scroll-slim flex-1 space-y-1 overflow-y-auto p-3">
        {loading && <p className="p-3 text-sm text-slate-500">Loading chats...</p>}
        {!loading && filtered.length === 0 && <p className="p-3 text-sm leading-6 text-slate-500">No chats yet. Search a username to start a real conversation.</p>}
        {filtered.map((chat) => (
          <ChatRow key={chat._id} chat={chat} userId={user._id} active={activeChat?._id === chat._id} onClick={() => setActiveChat(chat)} />
        ))}
      </div>
    </aside>
  );
}

function MessageBubble({ message, mine }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[78%] rounded-3xl px-4 py-3 shadow-sm ${mine ? "rounded-br-lg bg-indigo-600 text-white" : "rounded-bl-lg bg-white text-slate-950 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-white dark:ring-slate-800"}`}>
        {!mine && <p className="mb-1 text-xs font-bold text-indigo-500">{message.sender?.name || "Member"}</p>}
        {message.replyTo?.body && <p className="mb-2 rounded-2xl bg-black/5 px-3 py-2 text-xs opacity-75 dark:bg-white/10">{message.replyTo.body}</p>}
        <p className="whitespace-pre-wrap text-sm leading-6">{message.deletedAt ? "Message deleted" : message.body}</p>
        <div className={`mt-2 flex items-center justify-end gap-2 text-[11px] ${mine ? "text-indigo-100" : "text-slate-400"}`}>
          {message.editedAt && <span>edited</span>}
          <span>{displayTime(message.createdAt)}</span>
          {mine && <CheckCheck size={14} />}
        </div>
      </div>
    </motion.div>
  );
}

function Conversation({ chat, messages, user, socket, onSend, loading }) {
  const [draft, setDraft] = useState("");
  const [typingUser, setTypingUser] = useState(null);
  const endRef = useRef(null);
  const title = chat?.type === "direct" ? chat.participants?.find((member) => member._id !== user._id)?.name || "Direct chat" : chat?.name;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!socket || !chat?._id) return undefined;
    socket.emit("chat:join", chat._id);
    socket.emit("message:deliver", { chatId: chat._id });
    socket.on("typing:start", ({ user: member }) => setTypingUser(member));
    socket.on("typing:stop", () => setTypingUser(null));
    return () => {
      socket.emit("chat:leave", chat._id);
      socket.off("typing:start");
      socket.off("typing:stop");
    };
  }, [socket, chat?._id]);

  function submit(event) {
    event.preventDefault();
    if (!draft.trim() || !chat) return;
    onSend(draft.trim());
    setDraft("");
    socket?.emit("typing:stop", { chatId: chat._id });
  }

  if (!chat) {
    return (
      <section className="grid h-full place-items-center bg-slate-50 p-8 text-center dark:bg-slate-950">
        <div>
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-indigo-600 text-white shadow-soft"><Users /></div>
          <h2 className="text-2xl font-bold">Select or start a conversation</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">Your real chats from MongoDB will appear in the sidebar after login.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex h-full min-w-0 flex-col bg-slate-50 dark:bg-slate-950">
      <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar user={{ name: title, status: chat.participants?.some((member) => member.status === "online") ? "online" : "offline" }} />
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold">{title}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{typingUser ? `${typingUser.name} is typing...` : `${chat.participants?.length || 0} members`}</p>
          </div>
        </div>
        <button className="grid h-10 w-10 place-items-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900"><MoreHorizontal size={20} /></button>
      </header>
      <div className="scroll-slim flex-1 space-y-4 overflow-y-auto px-5 py-6">
        {loading && <p className="text-center text-sm text-slate-500">Loading messages...</p>}
        {!loading && messages.length === 0 && <p className="mx-auto mt-16 max-w-sm text-center text-sm leading-6 text-slate-500">No messages yet. Send the first one and Socket.io will deliver it live.</p>}
        {messages.map((message) => <MessageBubble key={message._id} message={message} mine={message.sender?._id === user._id} />)}
        <div ref={endRef} />
      </div>
      <form onSubmit={submit} className="border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex min-h-16 items-end gap-2 rounded-3xl border border-slate-200 bg-slate-50 p-2 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-900">
          <button type="button" className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-slate-500 hover:bg-white dark:hover:bg-slate-800" aria-label="Emoji"><Smile size={20} /></button>
          <button type="button" className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-slate-500 hover:bg-white dark:hover:bg-slate-800" aria-label="Attach file"><Paperclip size={20} /></button>
          <textarea
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value);
              socket?.emit("typing:start", { chatId: chat._id });
            }}
            onBlur={() => socket?.emit("typing:stop", { chatId: chat._id })}
            rows={1}
            placeholder="Write a message..."
            className="max-h-36 min-h-11 flex-1 resize-none bg-transparent py-3 text-sm leading-5 outline-none placeholder:text-slate-400"
          />
          <button className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-indigo-600 text-white shadow-soft transition hover:bg-indigo-500" aria-label="Send"><Send size={19} /></button>
        </div>
      </form>
    </section>
  );
}

function DetailsPanel({ chat, user }) {
  const other = chat?.type === "direct" ? chat.participants?.find((member) => member._id !== user._id) : null;
  const title = chat ? (other?.name || chat.name || "Conversation") : "Details";

  return (
    <aside className="hidden h-full border-l border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950 xl:block">
      {chat ? (
        <div>
          <div className="text-center">
            <div className="flex justify-center"><Avatar user={other || { name: title }} size="lg" /></div>
            <h2 className="mt-4 text-xl font-bold">{title}</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{other?.status || chat.type} conversation</p>
          </div>
          <div className="mt-8 space-y-3">
            <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Members</p>
              <p className="mt-2 text-sm font-semibold">{chat.participants?.length || 0} active profiles</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Security</p>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">JWT protected session, hashed passwords, and private room authorization.</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-500">Select a chat to view profile details.</p>
      )}
    </aside>
  );
}

export default function ChatDashboard() {
  const { user, token, logout } = useAuth();
  const socket = useSocket(token);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);

  async function loadChats() {
    setLoadingChats(true);
    const { data } = await api.get("/chats");
    setChats(data.chats);
    setActiveChat((current) => current || data.chats[0] || null);
    setLoadingChats(false);
  }

  useEffect(() => {
    loadChats().catch(() => setLoadingChats(false));
  }, []);

  useEffect(() => {
    if (!activeChat?._id) {
      setMessages([]);
      return;
    }
    setLoadingMessages(true);
    api.get(`/chats/${activeChat._id}/messages`)
      .then(({ data }) => setMessages(data.messages))
      .finally(() => setLoadingMessages(false));
    api.post(`/chats/${activeChat._id}/seen`).catch(() => {});
  }, [activeChat?._id]);

  useEffect(() => {
    if (!socket) return undefined;
    socket.on("message:new", (message) => {
      if (message.chat === activeChat?._id) setMessages((current) => [...current, message]);
      setChats((current) => current.map((chat) => chat._id === message.chat ? { ...chat, lastMessage: message, updatedAt: message.createdAt } : chat));
    });
    socket.on("message:update", (message) => setMessages((current) => current.map((item) => item._id === message._id ? message : item)));
    socket.on("message:delete", ({ messageId }) => setMessages((current) => current.filter((message) => message._id !== messageId)));
    socket.on("presence:update", ({ userId, status, lastSeenAt }) => {
      setChats((current) => current.map((chat) => ({
        ...chat,
        participants: chat.participants?.map((member) => member._id === userId ? { ...member, status, lastSeenAt } : member)
      })));
    });
    return () => {
      socket.off("message:new");
      socket.off("message:update");
      socket.off("message:delete");
      socket.off("presence:update");
    };
  }, [socket, activeChat?._id]);

  async function createChat(username) {
    const found = await api.get(`/users/search?q=${encodeURIComponent(username)}`);
    const target = found.data.users.find((member) => member.username === username) || found.data.users[0];
    if (!target) return;
    const { data } = await api.post("/chats", { participantIds: [target._id], type: "direct" });
    setChats((current) => [data.chat, ...current.filter((chat) => chat._id !== data.chat._id)]);
    setActiveChat(data.chat);
    setMobileSidebar(false);
  }

  async function sendMessage(body) {
    if (!activeChat) return;
    const { data } = await api.post(`/chats/${activeChat._id}/messages`, { body });
    setMessages((current) => current.some((message) => message._id === data.message._id) ? current : [...current, { ...data.message, sender: user }]);
  }

  const activeChatFresh = useMemo(() => chats.find((chat) => chat._id === activeChat?._id) || activeChat, [chats, activeChat]);

  return (
    <main className="h-screen overflow-hidden bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="flex h-full">
        <div className={`${mobileSidebar ? "fixed inset-0 z-40 block" : "hidden"} w-[min(88vw,380px)] lg:relative lg:block lg:w-[360px]`}>
          <ChatSidebar chats={chats} activeChat={activeChatFresh} setActiveChat={(chat) => { setActiveChat(chat); setMobileSidebar(false); }} user={user} onCreateChat={createChat} loading={loadingChats} />
        </div>
        {mobileSidebar && <button className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setMobileSidebar(false)} aria-label="Close sidebar" />}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-950 lg:hidden">
            <button onClick={() => setMobileSidebar(true)} className="grid h-10 w-10 place-items-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900"><Menu /></button>
            <BrandMark compact />
            <button onClick={logout} className="grid h-10 w-10 place-items-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900"><X /></button>
          </div>
          <Conversation chat={activeChatFresh} messages={messages} user={user} socket={socket} onSend={sendMessage} loading={loadingMessages} />
        </div>
        <div className="hidden w-[320px] xl:block">
          <div className="flex h-16 items-center justify-between border-b border-l border-slate-200 bg-white px-5 dark:border-slate-800 dark:bg-slate-950">
            <p className="text-sm font-bold">Profile</p>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button onClick={logout} className="inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900"><LogOut size={17} /> Logout</button>
            </div>
          </div>
          <DetailsPanel chat={activeChatFresh} user={user} />
        </div>
      </div>
    </main>
  );
}
