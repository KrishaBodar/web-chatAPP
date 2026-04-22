import { Link } from "react-router-dom";
import { useState } from "react";
import AuthLayout from "../components/AuthLayout.jsx";
import FormField from "../components/FormField.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function ForgotPasswordPage() {
  const { forgotPassword, resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function requestReset(event) {
    event.preventDefault();
    setError("");
    try {
      const data = await forgotPassword(email);
      setNotice(data.resetTokenPreview ? `Reset token generated: ${data.resetTokenPreview}` : data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create reset request.");
    }
  }

  async function completeReset(event) {
    event.preventDefault();
    setError("");
    try {
      const data = await resetPassword({ token: resetToken, password });
      setNotice(data.message);
      setResetToken("");
      setPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not reset password.");
    }
  }

  return (
    <AuthLayout title="Recover access" subtitle="Generate a reset token, then set a new password. Wire this endpoint to email before launch.">
      <form onSubmit={requestReset} className="space-y-4">
        <FormField label="Account email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        <button className="h-12 w-full rounded-2xl bg-indigo-600 text-sm font-bold text-white shadow-soft transition hover:bg-indigo-500">Send reset token</button>
      </form>
      <form onSubmit={completeReset} className="mt-6 space-y-4 border-t border-slate-200 pt-6 dark:border-slate-800">
        <FormField label="Reset token" value={resetToken} onChange={(event) => setResetToken(event.target.value)} />
        <FormField label="New password" type="password" minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} />
        <button className="h-12 w-full rounded-2xl border border-slate-200 bg-white text-sm font-bold text-slate-900 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-800">Reset password</button>
      </form>
      {notice && <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">{notice}</p>}
      {error && <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:bg-rose-950/30 dark:text-rose-300">{error}</p>}
      <p className="mt-6 text-center text-sm"><Link className="font-bold text-indigo-600 dark:text-indigo-400" to="/login">Back to login</Link></p>
    </AuthLayout>
  );
}
