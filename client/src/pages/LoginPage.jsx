import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthLayout from "../components/AuthLayout.jsx";
import FormField from "../components/FormField.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(form);
      navigate("/app");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your email and password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue your secure LUMORA workspace.">
      <form onSubmit={submit} className="space-y-4">
        <FormField label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        <FormField label="Password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        <div className="flex items-center justify-between text-sm">
          <Link className="font-semibold text-indigo-600 dark:text-indigo-400" to="/forgot-password">Forgot password?</Link>
        </div>
        {error && <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:bg-rose-950/30 dark:text-rose-300">{error}</p>}
        <button disabled={busy} className="h-12 w-full rounded-2xl bg-indigo-600 text-sm font-bold text-white shadow-soft transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70">
          {busy ? "Signing in..." : "Login"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">New here? <Link className="font-bold text-indigo-600 dark:text-indigo-400" to="/register">Create an account</Link></p>
    </AuthLayout>
  );
}
