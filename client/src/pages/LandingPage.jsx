import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Lock, MessageSquareText, Sparkles, UsersRound, Zap } from "lucide-react";
import { motion } from "framer-motion";
import BrandMark from "../components/BrandMark.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";

const features = [
  ["Realtime messaging", MessageSquareText],
  ["JWT protected accounts", Lock],
  ["Groups and presence", UsersRound],
  ["Premium responsive UI", Sparkles]
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_20%_10%,rgba(79,70,229,.18),transparent_35%),radial-gradient(circle_at_82%_18%,rgba(6,182,212,.14),transparent_30%)]" />
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-6">
        <BrandMark />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link to="/login" className="hidden rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white dark:text-slate-200 dark:hover:bg-slate-900 sm:inline-flex">Login</Link>
          <Link to="/register" className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950">Get started</Link>
        </div>
      </header>
      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-5 py-12 lg:grid-cols-[1fr_520px] lg:py-20">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-3 py-2 text-sm font-medium text-indigo-700 shadow-sm dark:border-indigo-900/70 dark:bg-slate-900 dark:text-indigo-300">
            <Zap size={15} /> Built for real teams and fast conversations
          </div>
          <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">Modern chat that feels calm, fast, and premium.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400">LUMORA combines Telegram-speed messaging, Discord-grade presence, and a professional SaaS interface with a real Express, MongoDB, and Socket.io backend.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to="/register" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 text-sm font-bold text-white shadow-soft transition hover:bg-indigo-500">
              Create account <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-sm font-bold text-slate-800 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">Sign in</Link>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {features.map(([label, Icon]) => (
              <div key={label} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <Icon className="text-indigo-500" size={20} />
                <span className="text-sm font-semibold">{label}</span>
              </div>
            ))}
          </div>
        </div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white p-3 shadow-2xl shadow-indigo-500/10 dark:border-slate-800 dark:bg-slate-900">
          <div className="rounded-[1.5rem] bg-slate-950 p-4 text-white">
            <div className="mb-4 flex items-center justify-between">
              <BrandMark compact />
              <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">Live</span>
            </div>
            <div className="grid gap-3">
              {["Design team", "Launch room", "Customer success"].map((item, index) => (
                <div key={item} className="rounded-2xl bg-white/8 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{item}</p>
                    <CheckCircle2 size={16} className="text-cyan-300" />
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{index === 0 ? "Maya is typing..." : "Messages synced across members."}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
