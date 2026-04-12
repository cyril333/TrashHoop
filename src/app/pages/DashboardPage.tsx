import { useOutletContext, Link } from "react-router";
import { useState } from "react";
import { useScore, SCORE_ACTIONS } from "../contexts/ScoreContext";
import {
  Truck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Users,
  MapPin,
  Calendar,
  ShieldAlert,
  Award,
  ArrowRight,
  TrendingDown,
  History,
  Megaphone,
  ChevronDown,
  ChevronUp,
  Bell,
  Info,
  AlertCircle,
  X,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

type Role = "resident" | "admin" | "collector";

const wasteMonthlyData = [
  { month: "Oct", biodegradable: 42, recyclable: 28, residual: 19 },
  { month: "Nov", biodegradable: 38, recyclable: 32, residual: 22 },
  { month: "Dec", biodegradable: 55, recyclable: 25, residual: 30 },
  { month: "Jan", biodegradable: 47, recyclable: 35, residual: 18 },
  { month: "Feb", biodegradable: 50, recyclable: 40, residual: 20 },
  { month: "Mar", biodegradable: 60, recyclable: 38, residual: 24 },
];

const wasteTypePie = [
  { name: "Biodegradable", value: 45, color: "#66BB6A" },
  { name: "Recyclable", value: 30, color: "#42A5F5" },
  { name: "Residual", value: 25, color: "#FFA726" },
];

const recentReports = [
  { id: 1, address: "Brgy. Lahug, Gorordo Ave.", type: "Mixed waste", status: "Pending", time: "2 hrs ago", severity: "high" },
  { id: 2, address: "Brgy. Apas, Escario St.", type: "Improper disposal", status: "Resolved", time: "5 hrs ago", severity: "low" },
  { id: 3, address: "Brgy. Capitol Site, Osmeña Blvd.", type: "Littering", status: "Under Review", time: "Yesterday", severity: "medium" },
  { id: 4, address: "Brgy. Kamputhaw, Mango Ave.", type: "Burning waste", status: "Pending", time: "Yesterday", severity: "high" },
];

const collectionRoutes = [
  { zone: "Brgy. Lahug – Gorordo Area", time: "6:00 AM", status: "Completed", count: 24 },
  { zone: "Brgy. Apas – Escario Area", time: "8:30 AM", status: "In Progress", count: 18 },
  { zone: "Brgy. Capitol Site – Downtown", time: "11:00 AM", status: "Pending", count: 20 },
  { zone: "Brgy. Kamputhaw – Mango Area", time: "2:00 PM", status: "Pending", count: 15 },
];

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Pending: "bg-[#FFF3E0] text-[#E65100]",
    Resolved: "bg-[#E8F5E9] text-[#2E7D32]",
    "Under Review": "bg-[#E3F2FD] text-[#1565C0]",
    Completed: "bg-[#E8F5E9] text-[#2E7D32]",
    "In Progress": "bg-[#FFF3E0] text-[#E65100]",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Reports", value: "47", icon: AlertTriangle, color: "bg-[#FFF3E0] text-[#E65100]", trend: "+12%" },
          { label: "Resolved", value: "31", icon: CheckCircle2, color: "bg-[#E8F5E9] text-[#2E7D32]", trend: "+8%" },
          { label: "Active Violations", value: "12", icon: ShieldAlert, color: "bg-[#FCE4EC] text-[#C62828]", trend: "-3%" },
          { label: "Households", value: "284", icon: Users, color: "bg-[#E3F2FD] text-[#1565C0]", trend: "+2" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm border border-[#E8F5E9]">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs text-[#558B5A] bg-[#E8F5E9] px-2 py-0.5 rounded-full">{stat.trend}</span>
              </div>
              <p className="text-2xl font-bold text-[#1A2E1A]">{stat.value}</p>
              <p className="text-[#558B5A] text-sm">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-[#E8F5E9]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#1A2E1A]">Monthly Waste Collection (kg)</h3>
            <span className="text-xs text-[#558B5A]">Last 6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={wasteMonthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8F5E9" />
              <XAxis dataKey="month" tick={{ fill: "#558B5A", fontSize: 12 }} />
              <YAxis tick={{ fill: "#558B5A", fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E8F5E9" }} />
              <Legend />
              <Bar dataKey="biodegradable" name="Biodegradable" fill="#66BB6A" radius={[4, 4, 0, 0]} />
              <Bar dataKey="recyclable" name="Recyclable" fill="#42A5F5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="residual" name="Residual" fill="#FFA726" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8F5E9]">
          <h3 className="font-semibold text-[#1A2E1A] mb-4">Waste Distribution</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={wasteTypePie} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {wasteTypePie.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {wasteTypePie.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                  <span className="text-[#558B5A]">{item.name}</span>
                </div>
                <span className="font-semibold text-[#1A2E1A]">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8F5E9]">
        <div className="flex items-center justify-between p-5 border-b border-[#E8F5E9]">
          <h3 className="font-semibold text-[#1A2E1A]">Recent Reports</h3>
          <Link to="/app/report" className="text-[#2E7D32] text-sm flex items-center gap-1 hover:underline">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="divide-y divide-[#E8F5E9]">
          {recentReports.map((report) => (
            <div key={report.id} className="flex items-center gap-4 px-5 py-3.5">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                report.severity === "high" ? "bg-[#D32F2F]" : report.severity === "medium" ? "bg-[#FFA726]" : "bg-[#66BB6A]"
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1A2E1A] truncate">{report.address}</p>
                <p className="text-xs text-[#558B5A]">{report.type}</p>
              </div>
              <StatusBadge status={report.status} />
              <span className="text-xs text-[#A5D6A7] flex-shrink-0">{report.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Announcements data ────────────────────────────────────────────────────────
const announcements = [
  {
    id: 1,
    title: "Special Clean-Up Drive – Brgy. Lahug",
    body: "Join us this Saturday, March 15 from 7:00 AM at Gorordo Avenue for the monthly barangay clean-up drive. Gloves, trash bags, and breakfast will be provided for all volunteers!",
    type: "event",
    date: "Mar 10, 2026",
    urgent: false,
  },
  {
    id: 2,
    title: "⚠️ Schedule Change: No Residual Collection on Mar 12",
    body: "Due to the DILG Regional Conference, residual waste collection for Zone A & B is moved to March 13, 2026. Please hold your bins until then. Thank you for your cooperation.",
    type: "schedule",
    date: "Mar 9, 2026",
    urgent: true,
  },
  {
    id: 3,
    title: "New Hazardous Waste Drop-off Points",
    body: "Two new hazardous waste collection stations are now available at Apas Community Center (M–F, 8AM–5PM) and Mabolo Barangay Hall (Sat, 8AM–12PM). Bring expired medicines, batteries & chemicals.",
    type: "info",
    date: "Mar 8, 2026",
    urgent: false,
  },
  {
    id: 4,
    title: "Waste Segregation Reminder – Biodegradable Bins",
    body: "Please ensure all food waste, garden trimmings, and organic materials are placed in GREEN bins only. Improper segregation may result in a formal warning under Barangay Ordinance No. 2025-04.",
    type: "reminder",
    date: "Mar 7, 2026",
    urgent: false,
  },
];

const announcementStyles: Record<string, { bg: string; border: string; icon: React.ReactNode; badge: string }> = {
  event: {
    bg: "bg-[#E8F5E9]",
    border: "border-[#A5D6A7]",
    icon: <Megaphone className="w-4 h-4 text-[#2E7D32]" />,
    badge: "bg-[#E8F5E9] text-[#2E7D32]",
  },
  schedule: {
    bg: "bg-[#FFF3E0]",
    border: "border-[#FFCC80]",
    icon: <AlertCircle className="w-4 h-4 text-[#E65100]" />,
    badge: "bg-[#FFF3E0] text-[#E65100]",
  },
  info: {
    bg: "bg-[#E3F2FD]",
    border: "border-[#90CAF9]",
    icon: <Info className="w-4 h-4 text-[#1565C0]" />,
    badge: "bg-[#E3F2FD] text-[#1565C0]",
  },
  reminder: {
    bg: "bg-[#F3E5F5]",
    border: "border-[#CE93D8]",
    icon: <Bell className="w-4 h-4 text-[#7B1FA2]" />,
    badge: "bg-[#F3E5F5] text-[#7B1FA2]",
  },
};

function AnnouncementsSection() {
  const [expanded, setExpanded] = useState<number | null>(1);
  const [dismissed, setDismissed] = useState<number[]>([]);

  const visible = announcements.filter((a) => !dismissed.includes(a.id));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E8F5E9]">
      <div className="flex items-center gap-3 p-5 border-b border-[#E8F5E9]">
        <div className="w-8 h-8 bg-[#E8F5E9] rounded-xl flex items-center justify-center">
          <Megaphone className="w-4 h-4 text-[#2E7D32]" />
        </div>
        <h3 className="font-semibold text-[#1A2E1A]">Barangay Announcements</h3>
        {visible.some((a) => a.urgent) && (
          <span className="ml-auto bg-[#D32F2F] text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
            Urgent
          </span>
        )}
      </div>

      {visible.length === 0 ? (
        <div className="p-6 text-center text-[#558B5A] text-sm">
          No announcements at this time.
        </div>
      ) : (
        <div className="divide-y divide-[#E8F5E9]">
          {visible.map((ann) => {
            const style = announcementStyles[ann.type];
            const isOpen = expanded === ann.id;
            return (
              <div key={ann.id} className={`${ann.urgent ? style.bg : ""}`}>
                <div className="flex items-start gap-3 px-5 py-3.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${style.bg}`}>
                    {style.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <button
                        onClick={() => setExpanded(isOpen ? null : ann.id)}
                        className="text-left flex-1 cursor-pointer"
                      >
                        <p className="text-sm font-medium text-[#1A2E1A] leading-snug">{ann.title}</p>
                        <p className="text-xs text-[#558B5A] mt-0.5">{ann.date}</p>
                      </button>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => setExpanded(isOpen ? null : ann.id)}
                          className="p-1 text-[#A5D6A7] hover:text-[#2E7D32] cursor-pointer"
                        >
                          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => setDismissed((d) => [...d, ann.id])}
                          className="p-1 text-[#A5D6A7] hover:text-[#558B5A] cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    {isOpen && (
                      <p className="text-sm text-[#558B5A] mt-2 leading-relaxed pr-2">{ann.body}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ResidentDashboard() {
  const { score, actions, addScore, deductScore } = useScore();
  const [showHistory, setShowHistory] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  
  const getScoreColor = () => {
    if (score >= 80) return { gradient: "linear-gradient(135deg, #2E7D32, #66BB6A)", text: "Excellent work!" };
    if (score >= 60) return { gradient: "linear-gradient(135deg, #FFA726, #FFB74D)", text: "Good, keep improving!" };
    return { gradient: "linear-gradient(135deg, #EF5350, #E57373)", text: "Needs improvement" };
  };

  const scoreInfo = getScoreColor();
  const recentActions = actions.slice(0, 5);

  const simulateGoodAction = () => {
    addScore(SCORE_ACTIONS.PROPER_SEGREGATION.points, SCORE_ACTIONS.PROPER_SEGREGATION.reason);
    setShowDemo(false);
  };

  const simulateBadAction = () => {
    deductScore(SCORE_ACTIONS.MIXED_WASTE.points, SCORE_ACTIONS.MIXED_WASTE.reason);
    setShowDemo(false);
  };

  return (
    <div className="space-y-6">
      {/* Demo modal */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
            <h3 className="font-bold text-[#1A2E1A] text-lg mb-4">Demo Score System</h3>
            <p className="text-[#558B5A] text-sm mb-5">
              Try these actions to see how your credit score changes automatically:
            </p>
            <div className="space-y-3">
              <button
                onClick={simulateGoodAction}
                className="w-full p-4 rounded-xl bg-[#E8F5E9] border-2 border-[#66BB6A] text-left hover:bg-[#C8E6C9] transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-[#2E7D32]" />
                  <div>
                    <p className="font-semibold text-[#1A2E1A]">Proper Segregation</p>
                    <p className="text-xs text-[#558B5A]">+{SCORE_ACTIONS.PROPER_SEGREGATION.points} points</p>
                  </div>
                </div>
              </button>
              <button
                onClick={simulateBadAction}
                className="w-full p-4 rounded-xl bg-[#FCE4EC] border-2 border-[#EF5350] text-left hover:bg-[#F8BBD0] transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <TrendingDown className="w-6 h-6 text-[#D32F2F]" />
                  <div>
                    <p className="font-semibold text-[#1A2E1A]">Mixed Waste Violation</p>
                    <p className="text-xs text-[#558B5A]">-{SCORE_ACTIONS.MIXED_WASTE.points} points</p>
                  </div>
                </div>
              </button>
            </div>
            <button
              onClick={() => setShowDemo(false)}
              className="w-full mt-4 py-3 rounded-xl border border-[#A5D6A7] text-[#558B5A] hover:bg-[#E8F5E9] transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Announcements - top of resident dashboard */}
      <AnnouncementsSection />

      {/* Welcome card with dynamic score */}
      <div className="rounded-2xl p-6 text-white relative overflow-hidden" style={{ background: scoreInfo.gradient }}>
        <div className="relative z-10">
          <p className="text-green-100 text-sm mb-1">Good morning! 👋</p>
          <h2 className="text-2xl font-bold">Your Waste Credit Score</h2>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-5xl font-bold">{score}</span>
            <span className="text-green-200 mb-1">/100 pts</span>
          </div>
          <p className="text-green-100 text-sm mt-2">{scoreInfo.text}</p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-1 text-white/90 hover:text-white text-sm cursor-pointer bg-white/10 px-3 py-1.5 rounded-lg"
            >
              <History className="w-4 h-4" />
              History
            </button>
            <button
              onClick={() => setShowDemo(true)}
              className="flex items-center gap-1 text-white/90 hover:text-white text-sm cursor-pointer bg-white/10 px-3 py-1.5 rounded-lg"
            >
              Try Demo
            </button>
          </div>
        </div>
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute -right-2 -bottom-10 w-20 h-20 bg-white/10 rounded-full" />
        <Award className="absolute right-6 top-6 w-8 h-8 text-white/30" />
      </div>

      {/* Score History */}
      {showHistory && recentActions.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8F5E9]">
          <h3 className="font-semibold text-[#1A2E1A] mb-4">Recent Score Changes</h3>
          <div className="space-y-2">
            {recentActions.map((action) => (
              <div key={action.id} className="flex items-center gap-3 p-3 bg-[#F4FAF4] rounded-xl">
                {action.type === "increase" ? (
                  <TrendingUp className="w-5 h-5 text-[#2E7D32] flex-shrink-0" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-[#D32F2F] flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#1A2E1A]">{action.reason}</p>
                  <p className="text-xs text-[#558B5A]">
                    {new Date(action.timestamp).toLocaleDateString()} at {new Date(action.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <span className={`font-bold text-sm flex-shrink-0 ${action.type === "increase" ? "text-[#2E7D32]" : "text-[#D32F2F]"}`}>
                  {action.type === "increase" ? "+" : "-"}{action.points}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Reports Made", value: "3", icon: "📋" },
          { label: "Violations", value: "0", icon: "✅" },
          { label: "Next Pickup", value: "Thu", icon: "🗓️" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 text-center shadow-sm border border-[#E8F5E9]">
            <span className="text-2xl">{s.icon}</span>
            <p className="text-2xl font-bold text-[#1A2E1A] mt-1">{s.value}</p>
            <p className="text-xs text-[#558B5A] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Next collection */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8F5E9]">
        <h3 className="font-semibold text-[#1A2E1A] mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#2E7D32]" />
          Upcoming Collections
        </h3>
        <div className="space-y-3">
          {[
            { day: "Tuesday", date: "Mar 11", type: "Biodegradable", time: "6:00–8:00 AM", color: "#66BB6A" },
            { day: "Thursday", date: "Mar 13", type: "Recyclable", time: "7:00–9:00 AM", color: "#42A5F5" },
            { day: "Saturday", date: "Mar 15", type: "Residual", time: "8:00–10:00 AM", color: "#FFA726" },
          ].map((item) => (
            <div key={item.day} className="flex items-center gap-3 p-3 rounded-xl bg-[#F4FAF4]">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: item.color + "20" }}>
                <Truck className="w-5 h-5" style={{ color: item.color }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#1A2E1A]">{item.type} Collection</p>
                <p className="text-xs text-[#558B5A]">{item.day}, {item.date} · {item.time}</p>
              </div>
              <Clock className="w-4 h-4 text-[#A5D6A7]" />
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link to="/app/report" className="bg-[#FFF3E0] rounded-2xl p-4 flex items-center gap-3 border border-[#FFE0B2] hover:shadow-md transition">
          <AlertTriangle className="w-6 h-6 text-[#E65100]" />
          <div>
            <p className="font-semibold text-[#1A2E1A] text-sm">Report</p>
            <p className="text-xs text-[#558B5A]">Improper disposal</p>
          </div>
        </Link>
        <Link to="/app/routes" className="bg-[#E8F5E9] rounded-2xl p-4 flex items-center gap-3 border border-[#C8E6C9] hover:shadow-md transition">
          <Truck className="w-6 h-6 text-[#2E7D32]" />
          <div>
            <p className="font-semibold text-[#1A2E1A] text-sm">Track Truck</p>
            <p className="text-xs text-[#558B5A]">Live collection map</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

function CollectorDashboard() {
  return (
    <div className="space-y-6">
      {/* Announcements for collectors */}
      <AnnouncementsSection />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Today's Zones", value: "4", icon: MapPin, color: "bg-[#E8F5E9] text-[#2E7D32]" },
          { label: "Completed", value: "1", icon: CheckCircle2, color: "bg-[#E3F2FD] text-[#1565C0]" },
          { label: "Pending", value: "3", icon: Clock, color: "bg-[#FFF3E0] text-[#E65100]" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl p-4 text-center shadow-sm border border-[#E8F5E9]">
              <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mx-auto mb-2`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-[#1A2E1A]">{s.value}</p>
              <p className="text-xs text-[#558B5A] mt-0.5">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Today's routes */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8F5E9]">
        <div className="flex items-center justify-between p-5 border-b border-[#E8F5E9]">
          <h3 className="font-semibold text-[#1A2E1A]">Today's Collection Routes</h3>
          <Link to="/app/routes" className="text-[#2E7D32] text-sm flex items-center gap-1 hover:underline">
            Full map <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="p-4 space-y-3">
          {collectionRoutes.map((route) => (
            <div key={route.zone} className="flex items-center gap-3 p-3 bg-[#F4FAF4] rounded-xl">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                route.status === "Completed" ? "bg-[#E8F5E9]" : route.status === "In Progress" ? "bg-[#FFF3E0]" : "bg-[#F5F5F5]"
              }`}>
                {route.status === "Completed" ? (
                  <CheckCircle2 className="w-5 h-5 text-[#2E7D32]" />
                ) : (
                  <Clock className="w-5 h-5 text-[#E65100]" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#1A2E1A]">{route.zone}</p>
                <p className="text-xs text-[#558B5A]">{route.time} · {route.count} households</p>
              </div>
              <StatusBadge status={route.status} />
            </div>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8F5E9]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-[#1A2E1A]">Today's Progress</h3>
          <span className="text-[#2E7D32] font-bold">25%</span>
        </div>
        <div className="w-full bg-[#E8F5E9] rounded-full h-3">
          <div className="bg-[#2E7D32] h-3 rounded-full transition-all duration-500" style={{ width: "25%" }} />
        </div>
        <p className="text-xs text-[#558B5A] mt-2">1 of 4 zones completed</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { role } = useOutletContext<{ role: Role }>();

  return (
    <>
      {role === "admin" && <AdminDashboard />}
      {role === "resident" && <ResidentDashboard />}
      {role === "collector" && <CollectorDashboard />}
    </>
  );
}