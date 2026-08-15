import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Car, User, Mail, Phone, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await signup({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      navigate("/dashboard");
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
          <h1 className="text-xl font-bold text-ink-900">Create your account</h1>
          <p className="text-sm text-ink-500 mt-1">Join DriveEasy and start booking premium vehicles.</p>

          {error && (
            <div className="mt-4 bg-error-50 border border-error-200 text-error-700 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="label flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> Full Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Ahmed Raza"
                className="form-field"
              />
            </div>

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
              <label className="label flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> Phone</label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="0300-1234567"
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
                  placeholder="At least 6 characters"
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

            <div>
              <label className="label flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> Confirm Password</label>
              <input
                type="password"
                required
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                placeholder="Re-enter password"
                className="form-field"
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full btn-lg">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Create Account <ArrowRight className="h-5 w-5" /></>}
            </button>
          </form>

          <p className="text-center text-sm text-ink-500 mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-800 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
