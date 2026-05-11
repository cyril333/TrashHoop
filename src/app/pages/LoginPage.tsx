// src/app/pages/LoginPage.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Trash2, Leaf, Shield, Truck, User, AlertCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import ThemeToggle from "../components/ui/ThemeToggle";

type Role = "resident" | "admin" | "collector";

const roles = [
  {
    id: "resident" as Role,
    label: "Resident",
    icon: User,
    description: "Report waste & view schedule",
    color: "bg-[#E8F5E9] border-[#66BB6A] text-[#2E7D32]",
    activeColor: "bg-[#2E7D32] border-[#2E7D32] text-white",
  },
  {
    id: "admin" as Role,
    label: "Barangay Admin",
    icon: Shield,
    description: "Manage reports & violations",
    color: "bg-[#E8F5E9] border-[#66BB6A] text-[#2E7D32]",
    activeColor: "bg-[#2E7D32] border-[#2E7D32] text-white",
  },
  {
    id: "collector" as Role,
    label: "Garbage Collector",
    icon: Truck,
    description: "View collection routes",
    color: "bg-[#E8F5E9] border-[#66BB6A] text-[#2E7D32]",
    activeColor: "bg-[#2E7D32] border-[#2E7D32] text-white",
  },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, resetPassword } = useAuth();
  const [selectedRole, setSelectedRole] = useState<Role>("resident");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset password states
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt with:", email);
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      console.log("Login successful, navigating to dashboard");
      navigate("/app/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Failed to login. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      toast.error('Please enter your email');
      return;
    }
    setIsResetting(true);
    try {
      await resetPassword(resetEmail);
      setShowResetModal(false);
      setResetEmail("");
    } catch (error) {
      // Error already handled in resetPassword
    } finally {
      setIsResetting(false);
    }
  };

  // Demo quick login
  const demoLogin = (role: Role) => {
    const demoEmails: Record<Role, string> = {
      resident: "juan@example.com",
      admin: "admin@trashhoop.com",
      collector: "pedro@example.com"
    };
    setEmail(demoEmails[role]);
    setSelectedRole(role);
    setPassword("password123");
    console.log("Demo login set for:", role, demoEmails[role]);
  };

  return (
    <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, #1B5E20 0%, #2E7D32 40%, #388E3C 100%)" }}>
    {/* ✅ ADD THEME TOGGLE - Top Right */}
          <div className="fixed top-4 right-4 z-50">
            <ThemeToggle />
          </div>
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 text-white">
        <div className="max-w-md text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Trash2 className="w-9 h-9 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-white">TrashHoop</h1>
              <p className="text-green-200 text-sm">Smart Waste Management</p>
            </div>
          </div>

          <div className="space-y-6 mt-10">
            {[
              { icon: "🗑️", title: "Proper Segregation", desc: "Guide residents on biodegradable, recyclable & residual waste" },
              { icon: "📍", title: "Smart Routes", desc: "Optimized garbage collection routes for collectors" },
              { icon: "📊", title: "Real-time Monitoring", desc: "Track violations, reports, and waste data in one dashboard" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 bg-white/10 rounded-xl p-4 text-left backdrop-blur-sm">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="text-green-200 text-sm mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center gap-2 justify-center text-green-300 text-sm">
            <Leaf className="w-4 h-4" />
            <span>Building a cleaner community together</span>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <div className="w-10 h-10 bg-[#2E7D32] rounded-xl flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#2E7D32]">TrashHoop</span>
          </div>

          <h2 className="text-2xl font-bold text-[#1A2E1A] mb-1">Welcome back!</h2>
          <p className="text-[#558B5A] text-sm mb-7">Sign in to your account to continue</p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Demo Quick Login */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-xs text-blue-700 mb-2 font-medium">Demo Accounts (click to fill):</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => demoLogin("resident")}
                className="flex-1 py-1.5 px-2 bg-white text-blue-600 text-xs rounded-lg border border-blue-200 hover:bg-blue-100 transition"
              >
                Resident
              </button>
              <button
                type="button"
                onClick={() => demoLogin("collector")}
                className="flex-1 py-1.5 px-2 bg-white text-blue-600 text-xs rounded-lg border border-blue-200 hover:bg-blue-100 transition"
              >
                Collector
              </button>
              <button
                type="button"
                onClick={() => demoLogin("admin")}
                className="flex-1 py-1.5 px-2 bg-white text-blue-600 text-xs rounded-lg border border-blue-200 hover:bg-blue-100 transition"
              >
                Admin
              </button>
            </div>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="text-sm text-[#558B5A] mb-3 block">Select your role</label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((role) => {
                const Icon = role.icon;
                const isActive = selectedRole === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                      isActive ? role.activeColor : role.color
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium leading-tight text-center">{role.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm text-[#1A2E1A] mb-1.5 block">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-[#A5D6A7] bg-[#F4FAF4] focus:outline-none focus:ring-2 focus:ring-[#66BB6A] text-[#1A2E1A] placeholder-[#A5D6A7] transition"
              />
            </div>
            <div>
              <label className="text-sm text-[#1A2E1A] mb-1.5 block">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-[#A5D6A7] bg-[#F4FAF4] focus:outline-none focus:ring-2 focus:ring-[#66BB6A] text-[#1A2E1A] placeholder-[#A5D6A7] transition"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-[#558B5A] cursor-pointer">
                <input type="checkbox" className="accent-[#2E7D32]" />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                className="text-[#2E7D32] hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : "Sign In"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#E8F5E9] text-center">
            <p className="text-sm text-[#558B5A]">
              Don't have an account?{" "}
              <Link to="/register" className="text-[#2E7D32] font-semibold hover:underline">Register here</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
            <h3 className="font-bold text-[#1A2E1A] text-lg mb-4">Reset Password</h3>
            <p className="text-[#558B5A] text-sm mb-4">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <form onSubmit={handleResetPassword}>
              <input
                type="email"
                placeholder="your@email.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#A5D6A7] bg-[#F4FAF4] focus:outline-none focus:ring-2 focus:ring-[#66BB6A] text-[#1A2E1A] mb-4"
                required
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 py-3 rounded-xl border border-[#A5D6A7] text-[#558B5A] hover:bg-[#E8F5E9] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isResetting}
                  className="flex-1 py-3 rounded-xl bg-[#2E7D32] text-white hover:bg-[#1B5E20] transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isResetting ? 'Sending...' : 'Send Reset Email'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}