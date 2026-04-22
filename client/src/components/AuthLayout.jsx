import { Link } from "react-router-dom";
import BrandMark from "./BrandMark.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_20%_15%,rgba(79,70,229,.14),transparent_32%),radial-gradient(circle_at_85%_20%,rgba(6,182,212,.12),transparent_30%)]" />
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-6">
        <Link to="/" aria-label="LUMORA home"><BrandMark /></Link>
        <ThemeToggle />
      </header>
      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-92px)] max-w-7xl place-items-center px-5 pb-10">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/30">
          <div className="mb-7">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{subtitle}</p>
          </div>
          {children}
        </div>
      </section>
    </main>
  );
}
