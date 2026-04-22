import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ChatDashboard from "./pages/ChatDashboard.jsx";

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) return <div className="grid min-h-screen place-items-center bg-slate-950 text-white">Loading LUMORA...</div>;
  return token ? children : <Navigate to="/login" replace />;
}

function PublicOnly({ children }) {
  const { token, loading } = useAuth();
  if (loading) return <div className="grid min-h-screen place-items-center bg-slate-950 text-white">Loading LUMORA...</div>;
  return token ? <Navigate to="/app" replace /> : children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<PublicOnly><LoginPage /></PublicOnly>} />
      <Route path="/register" element={<PublicOnly><RegisterPage /></PublicOnly>} />
      <Route path="/forgot-password" element={<PublicOnly><ForgotPasswordPage /></PublicOnly>} />
      <Route path="/app" element={<ProtectedRoute><ChatDashboard /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
