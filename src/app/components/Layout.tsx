import { useState, useEffect } from "react";
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
  Bell,
  ChevronRight,
  Leaf,
} from "lucide-react";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [role, setRole] = useState<Role>("resident");
  const [notifications] = useState(3);

  useEffect(() => {
    const storedRole = localStorage.getItem("trashhoop_role") as Role;
    if (storedRole) setRole(storedRole);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("trashhoop_role");
    localStorage.removeItem("trashhoop_user");
    navigate("/login");
  };

  const items = navItems[role] || navItems.resident;
  const userEmail = localStorage.getItem("trashhoop_user") || "user@trashhoop.com";
  const userName = userEmail.split("@")[0];

  const roleLabels: Record<Role, string> = {
    resident: "Resident",
    admin: "Barangay Admin",
    collector: "Garbage Collector",
  };

  const roleBadgeColors: Record<Role, string> = {
    resident: "bg-[#A5D6A7]/30 text-[#A5D6A7]",
    admin: "bg-[#FFA726]/20 text-[#FFA726]",
    collector: "bg-[#42A5F5]/20 text-[#42A5F5]",
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F4FAF4]">
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
        }`}
        style={{ background: "linear-gradient(180deg, #1B5E20 0%, #2E7D32 100%)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Trash2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-white font-bold text-xl">TrashHoop</span>
            <p className="text-green-300 text-xs">Waste Management</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden text-white/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User info */}
        <div className="px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold text-sm">
              {userName.charAt(0).toUpperCase()}
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
                    ? "bg-white/20 text-white"
                    : "text-green-200 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-white" : "text-green-300 group-hover:text-white"}`} />
                <span className="text-sm font-medium">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto text-white/70" />}
              </Link>
            );
          })}
        </nav>

        {/* Eco tip */}
        <div className="mx-3 mb-3 p-3 bg-white/10 rounded-xl">
          <div className="flex items-center gap-2 text-green-300 text-xs mb-1">
            <Leaf className="w-3.5 h-3.5" />
            <span className="font-medium">Eco Tip</span>
          </div>
          <p className="text-green-200 text-xs leading-relaxed">Segregate waste at source. Every small action counts!</p>
        </div>

        {/* Logout */}
        <div className="px-3 pb-5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-green-200 hover:bg-white/10 hover:text-white transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-[#E8F5E9] px-4 lg:px-6 py-4 flex items-center gap-4 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-[#2E7D32] hover:bg-[#E8F5E9] p-1.5 rounded-lg transition"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1">
            <h1 className="text-[#1A2E1A] font-semibold text-lg">
              {items.find((i) => i.path === location.pathname)?.label || "TrashHoop"}
            </h1>
            <p className="text-[#558B5A] text-xs">
              {new Date().toLocaleDateString("en-PH", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          <button className="relative p-2 rounded-xl bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#A5D6A7]/30 transition">
            <Bell className="w-5 h-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D32F2F] text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                {notifications}
              </span>
            )}
          </button>

          <div className="hidden sm:flex items-center gap-2 bg-[#E8F5E9] px-3 py-1.5 rounded-xl">
            <div className="w-7 h-7 rounded-full bg-[#2E7D32] flex items-center justify-center text-white text-xs font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="text-[#2E7D32] text-sm font-medium capitalize">{userName}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet context={{ role }} />
        </main>
      </div>
    </div>
  );
}