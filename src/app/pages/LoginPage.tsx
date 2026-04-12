import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Trash2, Leaf, Shield, Truck, User } from "lucide-react";

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
  const [selectedRole, setSelectedRole] = useState<Role>("resident");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem("trashhoop_role", selectedRole);
      localStorage.setItem("trashhoop_user", email || "demo@trashhoop.com");
      setIsLoading(false);
      navigate("/app/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, #1B5E20 0%, #2E7D32 40%, #388E3C 100%)" }}>
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
                className="w-full px-4 py-3 rounded-xl border border-[#A5D6A7] bg-[#F4FAF4] focus:outline-none focus:ring-2 focus:ring-[#66BB6A] text-[#1A2E1A] placeholder-[#A5D6A7] transition"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-[#558B5A] cursor-pointer">
                <input type="checkbox" className="accent-[#2E7D32]" />
                Remember me
              </label>
              <button type="button" onClick={() => alert("Password reset link would be sent to your email")} className="text-[#2E7D32] hover:underline">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
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

          <div className="mt-4 text-center">
            <p className="text-xs text-[#A5D6A7]">Demo: Use any email & password</p>
          </div>
        </div>
      </div>
    </div>
  );
}
