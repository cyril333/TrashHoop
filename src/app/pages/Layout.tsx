// src/app/pages/Layout.tsx
import { useState } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router";
import {
  LayoutDashboard,
  Trash2,
  BookOpen,
  AlertTriangle,
  Map,
  ShieldAlert,
  Lightbulb,
  Calendar,
  Users,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Leaf,
  Megaphone,
  QrCode,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import NotificationBell from "../components/ui/NotificationBell";
import EmailVerificationBanner from "../components/ui/EmailVerificationBanner";
import ThemeToggle from "../components/ui/ThemeToggle";

type Role = "resident" | "admin" | "collector";

const navItems = {
  resident: [
    { path: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/app/waste-guide", label: "Waste Guide", icon: BookOpen },
    { path: "/app/report", label: "Report Disposal", icon: AlertTriangle },
    { path: "/app/routes", label: "Track Collection", icon: Map },
    { path: "/app/violations", label: "Violations", icon: ShieldAlert },
    { path: "/app/schedule", label: "Collection Schedule", icon: Calendar },
    { path: "/app/education", label: "Education Tips", icon: Lightbulb },
  ],
  admin: [
    { path: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/app/waste-guide", label: "Waste Guide", icon: BookOpen },
    { path: "/app/report", label: "Reports", icon: AlertTriangle },
    { path: "/app/violations", label: "Violations", icon: ShieldAlert },
    { path: "/app/schedule", label: "Schedule", icon: Calendar },
    { path: "/app/routes", label: "Garbage Routes", icon: Map },
    { path: "/app/users", label: "User Management", icon: Users },
    { path: "/app/education", label: "Education Tips", icon: Lightbulb },
    { path: "/app/announcements", label: "Announcements", icon: Megaphone },
    { path: "/app/bins", label: "Smart Bins", icon: QrCode },
  ],
  collector: [
    { path: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/app/routes", label: "My Routes", icon: Map },
    { path: "/app/violations", label: "Violations", icon: ShieldAlert },
    { path: "/app/schedule", label: "Schedule", icon: Calendar },
  ],
};

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const role = (user?.role as Role) || "resident";
  const items = navItems[role] || navItems.resident;
  const userName = user?.fullName || user?.email?.split("@")[0] || "User";
  const userInitial = userName.charAt(0).toUpperCase();

  const roleLabels: Record<Role, string> = {
    resident: "Resident",
    admin: "Barangay Admin",
    collector: "Garbage Collector",
  };

  const roleBadgeColors: Record<Role, string> = {
    resident: "bg-[#A5D6A7]/30 text-[#A5D6A7] dark:bg-[#2E4A2E]/50 dark:text-[#A5D6A7]",
    admin: "bg-[#FFA726]/20 text-[#FFA726] dark:bg-[#FFA726]/20 dark:text-[#FFA726]",
    collector: "bg-[#42A5F5]/20 text-[#42A5F5] dark:bg-[#42A5F5]/20 dark:text-[#42A5F5]",
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F4FAF4] dark:bg-[#0D1F0D] transition-colors duration-200">
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } bg-gradient-to-b from-[#1B5E20] to-[#2E7D32] dark:from-[#0A1A0A] dark:to-[#1A3A1A]`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10 dark:border-white/5">
          <div className="w-10 h-10 bg-white/20 dark:bg-white/10 rounded-xl flex items-center justify-center">
            <Trash2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-white font-bold text-xl">TrashHoop</span>
            <p className="text-green-300 dark:text-green-400 text-xs">Waste Management</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden text-white/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User info */}
        <div className="px-5 py-4 border-b border-white/10 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 dark:bg-white/10 flex items-center justify-center text-white font-semibold text-sm">
              {userInitial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate capitalize">{userName}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${roleBadgeColors[role]}`}>
                {roleLabels[role]}
              </span>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-white/20 dark:bg-white/15 text-white"
                    : "text-green-200 dark:text-green-300 hover:bg-white/10 dark:hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-white" : "text-green-300 dark:text-green-400 group-hover:text-white"}`} />
                <span className="text-sm font-medium">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto text-white/70" />}
              </Link>
            );
          })}
        </nav>

        {/* Eco tip */}
        <div className="mx-3 mb-3 p-3 bg-white/10 dark:bg-white/5 rounded-xl">
          <div className="flex items-center gap-2 text-green-300 dark:text-green-400 text-xs mb-1">
            <Leaf className="w-3.5 h-3.5" />
            <span className="font-medium">Eco Tip</span>
          </div>
          <p className="text-green-200 dark:text-green-300 text-xs leading-relaxed">
            Segregate waste at source. Every small action counts!
          </p>
        </div>

        {/* Logout */}
        <div className="px-3 pb-5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-green-200 dark:text-green-300 hover:bg-white/10 dark:hover:bg-white/5 hover:text-white transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white dark:bg-[#1A2E1A] border-b border-[#E8F5E9] dark:border-[#1A3A1A] px-4 lg:px-6 py-4 flex items-center gap-4 flex-shrink-0 transition-colors duration-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-[#2E7D32] dark:text-[#66BB6A] hover:bg-[#E8F5E9] dark:hover:bg-[#1A3A1A] p-1.5 rounded-lg transition"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1">
            <h1 className="text-[#1A2E1A] dark:text-[#E8F5E9] font-semibold text-lg">
              {items.find((i) => i.path === location.pathname)?.label || "TrashHoop"}
            </h1>
            <p className="text-[#558B5A] dark:text-[#A5D6A7] text-xs">
              {new Date().toLocaleDateString("en-PH", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notification Bell Component */}
          <NotificationBell />

          <div className="hidden sm:flex items-center gap-2 bg-[#E8F5E9] dark:bg-[#1A3A1A] px-3 py-1.5 rounded-xl transition-colors duration-200">
            <div className="w-7 h-7 rounded-full bg-[#2E7D32] dark:bg-[#66BB6A] flex items-center justify-center text-white dark:text-[#0D1F0D] text-xs font-bold">
              {userInitial}
            </div>
            <span className="text-[#2E7D32] dark:text-[#A5D6A7] text-sm font-medium capitalize truncate max-w-[150px]">
              {userName}
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-[#F4FAF4] dark:bg-[#0D1F0D] transition-colors duration-200">
          <div className="max-w-7xl mx-auto space-y-4">
            <EmailVerificationBanner />
            <Outlet context={{ role }} />
          </div>
        </main>
      </div>
    </div>
  );
}