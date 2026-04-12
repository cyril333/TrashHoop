import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Trash2, Leaf, User, Shield, Truck, MapPin, Home } from "lucide-react";

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

const barangays = [
  "Lahug",
  "Apas",
  "Capitol Site",
  "Kamputhaw",
  "Mabolo",
  "Guadalupe",
  "Talamban",
  "Banilad",
  "Busay",
  "Tisa",
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<Role>("resident");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    barangay: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords don't match";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.barangay) newErrors.barangay = "Please select a barangay";
    if (!formData.address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    // Simulate registration
    setTimeout(() => {
      localStorage.setItem("trashhoop_role", selectedRole);
      localStorage.setItem("trashhoop_user", formData.email);
      localStorage.setItem("trashhoop_barangay", formData.barangay);
      setIsLoading(false);
      navigate("/app/dashboard");
    }, 1500);
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
              { icon: "🎯", title: "Credit Score System", desc: "Build your reputation with our 0-100 credit scoring" },
              { icon: "📱", title: "Real-time Updates", desc: "Get instant notifications about collection schedules" },
              { icon: "🌱", title: "Educational Resources", desc: "Learn proper waste segregation and disposal" },
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
            <span>Join our pilot program to build a cleaner Cebu City</span>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 my-8">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-6 justify-center">
            <div className="w-10 h-10 bg-[#2E7D32] rounded-xl flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#2E7D32]">TrashHoop</span>
          </div>

          <h2 className="text-2xl font-bold text-[#1A2E1A] mb-1">Create Account</h2>
          <p className="text-[#558B5A] text-sm mb-6">Join the waste management revolution</p>

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
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-sm text-[#1A2E1A] mb-1.5 block">Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="Juan Dela Cruz"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.fullName ? "border-red-400" : "border-[#A5D6A7]"
                } bg-[#F4FAF4] focus:outline-none focus:ring-2 focus:ring-[#66BB6A] text-[#1A2E1A] placeholder-[#A5D6A7] transition`}
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="text-sm text-[#1A2E1A] mb-1.5 block">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.email ? "border-red-400" : "border-[#A5D6A7]"
                } bg-[#F4FAF4] focus:outline-none focus:ring-2 focus:ring-[#66BB6A] text-[#1A2E1A] placeholder-[#A5D6A7] transition`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="text-sm text-[#1A2E1A] mb-1.5 block">Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="+63 912 345 6789"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.phone ? "border-red-400" : "border-[#A5D6A7]"
                } bg-[#F4FAF4] focus:outline-none focus:ring-2 focus:ring-[#66BB6A] text-[#1A2E1A] placeholder-[#A5D6A7] transition`}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="text-sm text-[#1A2E1A] mb-1.5 block">Barangay</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A5D6A7]" />
                <select
                  name="barangay"
                  value={formData.barangay}
                  onChange={handleInputChange}
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                    errors.barangay ? "border-red-400" : "border-[#A5D6A7]"
                  } bg-[#F4FAF4] focus:outline-none focus:ring-2 focus:ring-[#66BB6A] text-[#1A2E1A] transition appearance-none cursor-pointer`}
                >
                  <option value="">Select your barangay</option>
                  {barangays.map((barangay) => (
                    <option key={barangay} value={barangay}>
                      {barangay}
                    </option>
                  ))}
                </select>
              </div>
              {errors.barangay && <p className="text-red-500 text-xs mt-1">{errors.barangay}</p>}
            </div>

            <div>
              <label className="text-sm text-[#1A2E1A] mb-1.5 block">Street Address</label>
              <div className="relative">
                <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A5D6A7]" />
                <input
                  type="text"
                  name="address"
                  placeholder="123 Example St."
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                    errors.address ? "border-red-400" : "border-[#A5D6A7]"
                  } bg-[#F4FAF4] focus:outline-none focus:ring-2 focus:ring-[#66BB6A] text-[#1A2E1A] placeholder-[#A5D6A7] transition`}
                />
              </div>
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            <div>
              <label className="text-sm text-[#1A2E1A] mb-1.5 block">Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.password ? "border-red-400" : "border-[#A5D6A7]"
                } bg-[#F4FAF4] focus:outline-none focus:ring-2 focus:ring-[#66BB6A] text-[#1A2E1A] placeholder-[#A5D6A7] transition`}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="text-sm text-[#1A2E1A] mb-1.5 block">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.confirmPassword ? "border-red-400" : "border-[#A5D6A7]"
                } bg-[#F4FAF4] focus:outline-none focus:ring-2 focus:ring-[#66BB6A] text-[#1A2E1A] placeholder-[#A5D6A7] transition`}
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <div className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="accent-[#2E7D32] mt-1" required />
              <label className="text-[#558B5A]">
                I agree to the{" "}
                <button
                  type="button"
                  onClick={() => alert("Terms of Service\n\nBy using TrashHoop, you agree to follow proper waste management practices and community guidelines.")}
                  className="text-[#2E7D32] hover:underline"
                >
                  Terms of Service
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  onClick={() => alert("Privacy Policy\n\nWe protect your data and only use it to improve waste management services in your barangay.")}
                  className="text-[#2E7D32] hover:underline"
                >
                  Privacy Policy
                </button>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : "Create Account"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#E8F5E9] text-center">
            <p className="text-sm text-[#558B5A]">
              Already have an account?{" "}
              <Link to="/login" className="text-[#2E7D32] font-semibold hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
