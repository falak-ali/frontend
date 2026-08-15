import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Car, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login({ email: form.email, password: form.password });
      if (from) {
        navigate(from);
      } else if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 bg-ink-50/50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-800 text-white">
              <Car className="h-6 w-6" />
            </span>
            <span className="text-xl font-extrabold text-ink-900">
              Drive<span className="text-primary-800">Easy</span>
            </span>
          </Link>
        </div>

        <div className="card p-6 sm:p-8">
          <h1 className="text-xl font-bold text-ink-900">Welcome back</h1>
          <p className="text-sm text-ink-500 mt-1">Sign in to manage your bookings and profile.</p>

          {error && (
            <div className="mt-4 bg-error-50 border border-error-200 text-error-700 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="label flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="form-field"
              />
            </div>

            <div>
              <label className="label flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="form-field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-ink-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={(e) => setForm({ ...form, remember: e.target.checked })}
                  className="h-4 w-4 rounded border-ink-300 text-primary-800 focus:ring-primary-500"
                />
                Remember me
              </label>
              <button type="button" className="text-sm text-primary-800 font-medium hover:underline">Forgot password?</button>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full btn-lg">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Sign In <ArrowRight className="h-5 w-5" /></>}
            </button>
          </form>

          <p className="text-center text-sm text-ink-500 mt-5">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary-800 font-semibold hover:underline">Sign up</Link>
          </p>
        </div>

        <div className="mt-4 text-center text-xs text-ink-400">
          Demo admin: admin@driveeasy.com / admin123
        </div>
      </div>
    </div>
  );
}
