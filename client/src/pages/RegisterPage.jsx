import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthLayout from "../components/AuthLayout.jsx";
import FormField from "../components/FormField.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await register(form);
      navigate("/app");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try a different email or username.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Start a clean, realtime chat workspace with secure JWT authentication.">
      <form onSubmit={submit} className="space-y-4">
        <FormField label="Full name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
        <FormField label="Username" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} required />
        <FormField label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        <FormField label="Password" type="password" minLength={6} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        {error && <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:bg-rose-950/30 dark:text-rose-300">{error}</p>}
        <button disabled={busy} className="h-12 w-full rounded-2xl bg-indigo-600 text-sm font-bold text-white shadow-soft transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70">
          {busy ? "Creating account..." : "Register"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">Already have an account? <Link className="font-bold text-indigo-600 dark:text-indigo-400" to="/login">Login</Link></p>
    </AuthLayout>
  );
}
