// src/app/pages/DashboardPage.tsx
import { useOutletContext, Link } from "react-router";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
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
  Loader2,
  Circle,
  Trash2,
  Package,
  Navigation,
  Lightbulb,
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
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import { collection, query, getDocs, where, orderBy, limit, addDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

type Role = "resident" | "admin" | "collector";

// ──────────────────────────────────────────────────────────────────────────────
// MODERN ADMIN DASHBOARD
// ──────────────────────────────────────────────────────────────────────────────
function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalReports: 0, resolved: 0, activeViolations: 0, households: 0 });
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [upcomingCollections, setUpcomingCollections] = useState<any[]>([]);
  const [smartBins, setSmartBins] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchUpcomingCollections();
    fetchSmartBins();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const reportsRef = collection(db, "reports");
      const reportsSnapshot = await getDocs(query(reportsRef));
      const reports: any[] = [];
      reportsSnapshot.forEach((doc) => {
        const data = doc.data();
        reports.push({
          id: doc.id,
          address: data.address,
          type: data.type,
          status: data.status,
          severity: data.severity,
          createdAt: data.createdAt?.toDate() || new Date(),
        });
      });

      const violationsRef = collection(db, "violations");
      const violationsSnapshot = await getDocs(query(violationsRef, where("status", "==", "active")));
      const usersRef = collection(db, "users");
      const usersSnapshot = await getDocs(query(usersRef));

      setStats({
        totalReports: reports.length,
        resolved: reports.filter(r => r.status === "resolved").length,
        activeViolations: violationsSnapshot.size,
        households: usersSnapshot.size,
      });

      setRecentReports(reports.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5));
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUpcomingCollections = async () => {
    setUpcomingCollections([
      { id: 1, location: "Abellana St.", time: "6:00 PM - 7:00 AM", type: "Residual", color: "#FFA726" },
      { id: 2, location: "Brgy. Plaza", time: "6:00 AM - 7:00 AM", type: "Biodegradable", color: "#66BB6A" },
      { id: 3, location: "Juan St.", time: "6:00 AM - 7:00 AM", type: "Recyclable", color: "#42A5F5" },
    ]);
  };

  const fetchSmartBins = async () => {
    setSmartBins([
      { id: 1, location: "Gorordo Ave.", fullness: 85, status: "full", lastEmptied: "2 days ago" },
      { id: 2, location: "Escario St.", fullness: 45, status: "normal", lastEmptied: "Yesterday" },
      { id: 3, location: "Mango Ave.", fullness: 92, status: "full", lastEmptied: "3 days ago" },
    ]);
  };

  const wasteMonthlyData = [
    { month: "Oct", biodegradable: 42, recyclable: 28, residual: 19 },
    { month: "Nov", biodegradable: 38, recyclable: 32, residual: 22 },
    { month: "Dec", biodegradable: 55, recyclable: 25, residual: 30 },
    { month: "Jan", biodegradable: 47, recyclable: 35, residual: 18 },
    { month: "Feb", biodegradable: 50, recyclable: 40, residual: 20 },
    { month: "Mar", biodegradable: 60, recyclable: 38, residual: 24 },
  ];

  const collectorPerformance = [
    { name: "Ramon", collections: 52, completed: 48 },
    { name: "Pedro", collections: 47, completed: 42 },
    { name: "Jose", collections: 61, completed: 55 },
    { name: "Miguel", collections: 39, completed: 30 },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            {new Date().toLocaleDateString("en-PH", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Hello, {user?.fullName || "Admin"}</span>
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Users className="w-4 h-4 text-primary" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Reports", value: stats.totalReports, icon: AlertTriangle, color: "from-orange-500 to-orange-600", bg: "bg-orange-50 dark:bg-orange-950/20" },
          { label: "Resolved", value: stats.resolved, icon: CheckCircle2, color: "from-green-500 to-green-600", bg: "bg-green-50 dark:bg-green-950/20" },
          { label: "Active Violations", value: stats.activeViolations, icon: ShieldAlert, color: "from-red-500 to-red-600", bg: "bg-red-50 dark:bg-red-950/20" },
          { label: "Households", value: stats.households, icon: Users, color: "from-blue-500 to-blue-600", bg: "bg-blue-50 dark:bg-blue-950/20" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-muted-foreground text-sm mt-1">{stat.label}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Monthly Waste Collection (kg)</h3>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">Last 6 months</span>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={wasteMonthlyData}>
                <defs>
                  <linearGradient id="colorBio" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#66BB6A" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#66BB6A" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRecycle" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#42A5F5" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#42A5F5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorResidual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFA726" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#FFA726" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2E4A2E" />
                <XAxis dataKey="month" tick={{ fill: "#9CCC9C", fontSize: 12 }} />
                <YAxis tick={{ fill: "#9CCC9C", fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #2E4A2E", backgroundColor: "#142114" }} />
                <Legend />
                <Area type="monotone" dataKey="biodegradable" name="Biodegradable" stroke="#66BB6A" fillOpacity={1} fill="url(#colorBio)" />
                <Area type="monotone" dataKey="recyclable" name="Recyclable" stroke="#42A5F5" fillOpacity={1} fill="url(#colorRecycle)" />
                <Area type="monotone" dataKey="residual" name="Residual" stroke="#FFA726" fillOpacity={1} fill="url(#colorResidual)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-foreground mb-4">Collector Performance</h3>
            <div className="space-y-3">
              {collectorPerformance.map((collector) => (
                <div key={collector.name} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Truck className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{collector.name}</span>
                      <span className="text-xs text-muted-foreground">{collector.completed}/{collector.collections}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${(collector.completed / collector.collections) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Upcoming Collections</h3>
              <Link to="/app/schedule" className="text-primary text-xs hover:underline">View All</Link>
            </div>
            <div className="space-y-3">
              {upcomingCollections.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: item.color + "20" }}>
                    <Truck className="w-5 h-5" style={{ color: item.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{item.location}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full" style={{ background: item.color + "20", color: item.color }}>
                    {item.type}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-foreground mb-2">Smart Bin Status</h3>
            <p className="text-xs text-muted-foreground mb-4">Keep track of smart bin fullness for timely disposal.</p>
            <div className="space-y-3 mb-4">
              {smartBins.map((bin) => (
                <div key={bin.id} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${bin.status === 'full' ? 'bg-red-500' : 'bg-green-500'}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-foreground">{bin.location}</span>
                      <span className="text-xs text-muted-foreground">{bin.lastEmptied}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full transition-all ${bin.fullness > 80 ? 'bg-red-500' : bin.fullness > 50 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${bin.fullness}%` }} />
                    </div>
                  </div>
                  <span className={`text-xs font-medium ${bin.fullness > 80 ? 'text-red-500' : 'text-green-500'}`}>{bin.fullness}%</span>
                </div>
              ))}
            </div>
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-700 dark:text-red-400">Full Smart Bins</p>
                  <p className="text-xs text-red-600 dark:text-red-300">
                    {smartBins.filter(b => b.status === 'full').length} bins need immediate collection
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] dark:from-[#0A1A0A] dark:to-[#1A3A1A] rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5" />
              <h3 className="font-semibold">Garbage Collectors Map</h3>
            </div>
            <p className="text-sm text-green-100 mb-4">View real-time locations of collection trucks</p>
            <Link to="/app/routes" className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm transition">
              <Navigation className="w-4 h-4" />
              View Live Map
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Reports Table */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-semibold text-foreground">Recent Reports</h3>
          <Link to="/app/report" className="text-primary text-sm flex items-center gap-1 hover:underline">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted text-muted-foreground text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3">Location</th>
                <th className="text-left px-5 py-3">Type</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Severity</th>
                <th className="text-left px-5 py-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentReports.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">No reports yet.</td></tr>
              ) : (
                recentReports.map((report) => (
                  <tr key={report.id} className="hover:bg-muted/50 transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">{report.address}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5"><span className="text-sm text-foreground">{report.type}</span></td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        report.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400' :
                        report.status === 'resolved' ? 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400' :
                        'bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400'
                      }`}>{report.status}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${report.severity === 'high' ? 'bg-red-500' : report.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                        <span className="text-sm text-foreground capitalize">{report.severity}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-muted-foreground">{new Date(report.createdAt).toLocaleDateString()}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// MODERN RESIDENT DASHBOARD
// ──────────────────────────────────────────────────────────────────────────────
function ResidentDashboard() {
  const { user } = useAuth();
  const { score, actions, addScore, deductScore } = useScore();
  const [showHistory, setShowHistory] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [stats, setStats] = useState({ reports: 0, violations: 0 });
  const [upcomingCollections, setUpcomingCollections] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [nearbyBins, setNearbyBins] = useState<any[]>([]);

  useEffect(() => {
    if (user) fetchUserStats();
    fetchUpcomingCollections();
    fetchNearbyBins();
  }, [user]);

  const fetchUserStats = async () => {
    if (!user) return;
    try {
      const reportsRef = collection(db, "reports");
      const reportsQuery = query(reportsRef, where("userId", "==", user.uid));
      const reportsSnapshot = await getDocs(reportsQuery);

      const violationsRef = collection(db, "violations");
      const violationsQuery = query(violationsRef, where("userId", "==", user.uid), where("status", "==", "active"));
      const violationsSnapshot = await getDocs(violationsQuery);

      setStats({
        reports: reportsSnapshot.size,
        violations: violationsSnapshot.size,
      });

      const activities: any[] = [];
      reportsSnapshot.forEach((doc) => {
        const data = doc.data();
        activities.push({
          id: doc.id,
          type: 'report',
          action: 'Submitted a report',
          location: data.address,
          time: data.createdAt?.toDate() || new Date(),
          status: data.status,
        });
      });
      setRecentActivities(activities.sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 4));
    } catch (err) {
      console.error("Error fetching user stats:", err);
    }
  };

  const fetchUpcomingCollections = async () => {
    setUpcomingCollections([
      { id: 1, day: "Tomorrow", date: "Apr 14", type: "Biodegradable", time: "6:00 - 8:00 AM", color: "#66BB6A", icon: "🌿" },
      { id: 2, day: "Thursday", date: "Apr 16", type: "Recyclable", time: "7:00 - 9:00 AM", color: "#42A5F5", icon: "♻️" },
      { id: 3, day: "Saturday", date: "Apr 18", type: "Residual", time: "8:00 - 10:00 AM", color: "#FFA726", icon: "🗑️" },
    ]);
  };

  const fetchNearbyBins = async () => {
    setNearbyBins([
      { id: 1, location: "Gorordo Ave.", distance: "0.2 km", fullness: 45, type: "Recyclable", color: "#42A5F5" },
      { id: 2, location: "Escario St.", distance: "0.5 km", fullness: 80, type: "Biodegradable", color: "#66BB6A" },
      { id: 3, location: "Mango Ave.", distance: "0.8 km", fullness: 30, type: "Residual", color: "#FFA726" },
    ]);
  };

  const getScoreColor = () => {
    if (score >= 80) return { gradient: "from-green-500 to-emerald-600", text: "Excellent!", color: "#66BB6A" };
    if (score >= 60) return { gradient: "from-yellow-500 to-orange-500", text: "Good", color: "#FFA726" };
    return { gradient: "from-red-500 to-red-600", text: "Needs Work", color: "#EF5350" };
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {getGreeting()}, {user?.fullName?.split(" ")[0] || "there"}! 👋
          </h1>
          <p className="text-muted-foreground text-sm">
            {new Date().toLocaleDateString("en-PH", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Award className="w-5 h-5 text-primary" />
          </div>
        </div>
      </div>

      {/* Credit Score Card */}
      <div className={`bg-gradient-to-br ${scoreInfo.gradient} rounded-2xl p-6 text-white shadow-lg`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm mb-1">Your Waste Credit Score</p>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-bold">{score}</span>
              <span className="text-white/70 mb-1">/100 pts</span>
            </div>
            <p className="text-white/90 text-sm mt-2">{scoreInfo.text}</p>
          </div>
          <div className="text-right">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <Award className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-1 text-white/90 hover:text-white text-sm bg-white/10 px-3 py-1.5 rounded-lg transition">
            <History className="w-4 h-4" /> History
          </button>
          <button onClick={() => setShowDemo(true)} className="flex items-center gap-1 text-white/90 hover:text-white text-sm bg-white/10 px-3 py-1.5 rounded-lg transition">
            <TrendingUp className="w-4 h-4" /> Try Demo
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Reports Made", value: stats.reports, icon: AlertTriangle, color: "from-orange-500 to-orange-600" },
          { label: "Violations", value: stats.violations, icon: ShieldAlert, color: "from-red-500 to-red-600" },
          { label: "Next Pickup", value: "Tomorrow", icon: Calendar, color: "from-blue-500 to-blue-600" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-4 shadow-sm">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-2`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link to="/app/report" className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">Report Disposal</p>
              <p className="text-xs text-muted-foreground">Report improper waste</p>
            </div>
          </div>
        </Link>
        <Link to="/app/routes" className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">Track Collection</p>
              <p className="text-xs text-muted-foreground">Live truck tracking</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Upcoming Collections</h3>
            <Link to="/app/schedule" className="text-primary text-xs hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {upcomingCollections.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: item.color + "20" }}>{item.icon}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{item.type} Collection</p>
                  <p className="text-xs text-muted-foreground">{item.day}, {item.date} · {item.time}</p>
                </div>
                <Clock className="w-4 h-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Nearby Smart Bins</h3>
            <Link to="/app/routes" className="text-primary text-xs hover:underline">View Map</Link>
          </div>
          <div className="space-y-3">
            {nearbyBins.map((bin) => (
              <div key={bin.id} className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bin.color + "20" }}>
                  <Trash2 className="w-5 h-5" style={{ color: bin.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{bin.location}</span>
                    <span className="text-xs text-muted-foreground">{bin.distance}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted-foreground/20 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${bin.fullness > 80 ? 'bg-red-500' : bin.fullness > 50 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${bin.fullness}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground">{bin.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {recentActivities.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-2">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.status === 'resolved' ? 'bg-green-100 dark:bg-green-950/30' : 'bg-yellow-100 dark:bg-yellow-950/30'}`}>
                  {activity.status === 'resolved' ? <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" /> : <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{activity.action} at {activity.location}</p>
                  <p className="text-xs text-muted-foreground">{new Date(activity.time).toLocaleDateString()} · {activity.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card text-card-foreground rounded-2xl w-full max-w-md shadow-2xl p-6">
            <h3 className="font-bold text-foreground text-lg mb-4">Demo Score System</h3>
            <p className="text-muted-foreground text-sm mb-5">Try these actions to see how your credit score changes:</p>
            <div className="space-y-3">
              <button onClick={simulateGoodAction} className="w-full p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border-2 border-green-500 text-left hover:bg-green-100 dark:hover:bg-green-900/30 transition">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  <div><p className="font-semibold text-foreground">Proper Segregation</p><p className="text-xs text-muted-foreground">+{SCORE_ACTIONS.PROPER_SEGREGATION.points} points</p></div>
                </div>
              </button>
              <button onClick={simulateBadAction} className="w-full p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border-2 border-red-500 text-left hover:bg-red-100 dark:hover:bg-red-900/30 transition">
                <div className="flex items-center gap-3">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                  <div><p className="font-semibold text-foreground">Mixed Waste Violation</p><p className="text-xs text-muted-foreground">-{SCORE_ACTIONS.MIXED_WASTE.points} points</p></div>
                </div>
              </button>
            </div>
            <button onClick={() => setShowDemo(false)} className="w-full mt-4 py-3 rounded-xl border border-border text-muted-foreground hover:bg-muted transition">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// MODERN COLLECTOR DASHBOARD
// ──────────────────────────────────────────────────────────────────────────────
function CollectorDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ zones: 0, completed: 0, pending: 0, households: 0 });
  const [routes, setRoutes] = useState<any[]>([]);
  const [todaySchedule, setTodaySchedule] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCollectorData();
      fetchTodaySchedule();
    }
  }, [user]);

  const fetchCollectorData = async () => {
    if (!user) return;
    try {
      const routesRef = collection(db, "routes");
      const q = query(routesRef, where("collectorId", "==", user.uid));
      const snapshot = await getDocs(q);

      const fetchedRoutes: any[] = [];
      let completed = 0, pending = 0, totalHouseholds = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        const status = data.status || "Pending";
        fetchedRoutes.push({
          id: doc.id,
          zone: data.barangay,
          location: data.blocks || data.barangay,
          time: data.time,
          status: status,
          households: data.households,
          color: data.color || "#66BB6A",
        });
        if (status === "Completed") completed++;
        if (status === "Pending") pending++;
        totalHouseholds += data.households || 0;
      });

      setRoutes(fetchedRoutes);
      setStats({ zones: fetchedRoutes.length, completed, pending, households: totalHouseholds });
    } catch (err) {
      console.error("Error fetching collector data:", err);
      // Mock data fallback
      setStats({ zones: 5, completed: 2, pending: 3, households: 243 });
      setRoutes([
        { id: "1", zone: "Lahug", location: "Gorordo-Nivel Area", time: "6:00 - 8:00 AM", status: "Completed", households: 52, color: "#66BB6A" },
        { id: "2", zone: "Apas", location: "Escario-IT Park", time: "8:30 - 10:30 AM", status: "In Progress", households: 47, color: "#FFA726" },
        { id: "3", zone: "Capitol Site", location: "Downtown Area", time: "11:00 AM - 1:00 PM", status: "Pending", households: 61, color: "#42A5F5" },
        { id: "4", zone: "Kamputhaw", location: "Mango-Colon", time: "1:30 - 3:30 PM", status: "Pending", households: 39, color: "#AB47BC" },
        { id: "5", zone: "Mabolo", location: "Banilad-Ayala", time: "4:00 - 6:00 PM", status: "Pending", households: 44, color: "#EF5350" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTodaySchedule = async () => {
    setTodaySchedule([
      { id: 1, time: "6:00 AM", location: "Lahug", type: "Biodegradable", completed: true },
      { id: 2, time: "8:30 AM", location: "Apas", type: "Recyclable", completed: false },
      { id: 3, time: "11:00 AM", location: "Capitol Site", type: "Residual", completed: false },
    ]);
  };

  const progress = stats.zones > 0 ? Math.round((stats.completed / stats.zones) * 100) : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Hello, {user?.fullName?.split(" ")[0] || "Collector"}! 👋
          </h1>
          <p className="text-muted-foreground text-sm">
            {new Date().toLocaleDateString("en-PH", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
        <Link to="/app/routes" className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:bg-primary/90 transition">
          <Navigation className="w-4 h-4" /> Start Route
        </Link>
      </div>

      {/* Progress Card */}
      <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 text-white shadow-lg">
        <p className="text-white/80 text-sm mb-2">Today's Collection Progress</p>
        <div className="flex items-end gap-3 mb-3">
          <span className="text-5xl font-bold">{progress}%</span>
          <span className="text-white/70 mb-1">{stats.completed} of {stats.zones} zones</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-3 mb-3">
          <div className="bg-white h-3 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center justify-between text-sm text-white/80">
          <span>{stats.pending} zones remaining</span>
          <span>{stats.households} households total</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Completed", value: stats.completed, icon: CheckCircle2, color: "from-green-500 to-green-600" },
          { label: "Pending", value: stats.pending, icon: Clock, color: "from-orange-500 to-orange-600" },
          { label: "Households", value: stats.households, icon: Users, color: "from-blue-500 to-blue-600" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-4 shadow-sm">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-2`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Today's Schedule */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
        <h3 className="font-semibold text-foreground mb-4">Today's Schedule</h3>
        <div className="space-y-2">
          {todaySchedule.map((item, index) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                item.completed ? 'bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400'
                : index === 0 ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
              }`}>
                {item.completed ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{item.time} - {item.location}</p>
                <p className="text-xs text-muted-foreground">{item.type} Collection</p>
              </div>
              {index === 0 && !item.completed && <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">Current</span>}
              {item.completed && <span className="text-xs bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400 px-2 py-1 rounded-full">Done</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Route List */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-semibold text-foreground">My Collection Routes</h3>
          <Link to="/app/routes" className="text-primary text-sm flex items-center gap-1 hover:underline">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="divide-y divide-border">
          {routes.slice(0, 5).map((route) => (
            <div key={route.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/50 transition">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: route.color }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{route.zone} - {route.location}</p>
                <p className="text-xs text-muted-foreground">{route.time} · {route.households} households</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                route.status === 'Completed' ? 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400' :
                route.status === 'In Progress' ? 'bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400' :
                'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}>{route.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Tip */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Collection Tip</h4>
            <p className="text-sm text-muted-foreground">
              Scan QR codes on bins to automatically mark them as collected and earn efficiency points!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ──────────────────────────────────────────────────────────────────────────────
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