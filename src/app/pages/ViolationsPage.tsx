import { useState } from "react";
import { useOutletContext } from "react-router";
import { ShieldAlert, AlertTriangle, CheckCircle2, Eye, Filter, User, Clock, MapPin, X, Bell, Lock } from "lucide-react";

type Role = "resident" | "admin" | "collector";

const allViolations = [
  {
    id: 1,
    household: "Juan Dela Cruz",
    address: "Brgy. Lahug, Gorordo Avenue",
    violation: "Improper Segregation",
    date: "Mar 9, 2026",
    count: 3,
    status: "Active",
    history: [
      { date: "Mar 9, 2026", violation: "Mixed biodegradable & recyclable" },
      { date: "Feb 20, 2026", violation: "Plastics in biodegradable bin" },
      { date: "Jan 15, 2026", violation: "Mixed waste" },
    ],
    warningLevel: "Final Warning",
  },
  {
    id: 2,
    household: "Maria Santos",
    address: "Brgy. Apas, Escario Street",
    violation: "Illegal Dumping",
    date: "Mar 8, 2026",
    count: 1,
    status: "Active",
    history: [{ date: "Mar 8, 2026", violation: "Dumped garbage on sidewalk" }],
    warningLevel: "1st Warning",
  },
  {
    id: 3,
    household: "Pedro Reyes",
    address: "Brgy. Capitol Site, Fuente Circle",
    violation: "Littering",
    date: "Feb 28, 2026",
    count: 2,
    status: "Resolved",
    history: [
      { date: "Feb 28, 2026", violation: "Plastic wrappers near playground" },
      { date: "Feb 10, 2026", violation: "Littering in common area" },
    ],
    warningLevel: "2nd Warning",
  },
  {
    id: 4,
    household: "Ana Garcia",
    address: "Brgy. Kamputhaw, Mango Avenue",
    violation: "Burning Waste",
    date: "Mar 6, 2026",
    count: 4,
    status: "Active",
    history: [
      { date: "Mar 6, 2026", violation: "Open burning in backyard" },
      { date: "Feb 14, 2026", violation: "Burning plastic materials" },
      { date: "Jan 30, 2026", violation: "Open burning" },
      { date: "Jan 5, 2026", violation: "Burning waste near creek" },
    ],
    warningLevel: "Sanction",
  },
  {
    id: 5,
    household: "Roberto Cruz",
    address: "Brgy. Mabolo, Salinas Drive",
    violation: "Out-of-Schedule Disposal",
    date: "Mar 4, 2026",
    count: 1,
    status: "Resolved",
    history: [{ date: "Mar 4, 2026", violation: "Put out garbage on non-collection day" }],
    warningLevel: "1st Warning",
  },
];

const warningColors: Record<string, { badge: string; dot: string }> = {
  "1st Warning": { badge: "bg-[#FFF3E0] text-[#E65100] border-[#FFCC80]", dot: "bg-[#FFA726]" },
  "2nd Warning": { badge: "bg-[#FFF8E1] text-[#F57F17] border-[#FFE082]", dot: "bg-[#FFC107]" },
  "Final Warning": { badge: "bg-[#FCE4EC] text-[#C62828] border-[#F48FB1]", dot: "bg-[#EF5350]" },
  Sanction: { badge: "bg-[#B71C1C] text-white border-[#B71C1C]", dot: "bg-[#B71C1C]" },
};

const statusColors: Record<string, string> = {
  Active: "bg-[#FCE4EC] text-[#C62828] border-[#F48FB1]",
  Resolved: "bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]",
};

export default function ViolationsPage() {
  const { role } = useOutletContext<{ role: Role }>();
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<typeof allViolations[0] | null>(null);
  const [violations, setViolations] = useState(allViolations);
  const [showWarning, setShowWarning] = useState(false);
  const [warningTarget, setWarningTarget] = useState<typeof allViolations[0] | null>(null);

  const resolve = (id: number) => {
    setViolations(violations.map((v) => (v.id === id ? { ...v, status: "Resolved" } : v)));
    setSelected(null);
  };

  const sendWarning = (v: typeof allViolations[0]) => {
    setWarningTarget(v);
    setShowWarning(true);
  };

  const filtered = filter === "All" ? violations : violations.filter((v) => v.status === filter);

  const activeCount = violations.filter((v) => v.status === "Active").length;
  const resolvedCount = violations.filter((v) => v.status === "Resolved").length;
  const sanctionCount = violations.filter((v) => v.warningLevel === "Sanction").length;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Read-only banner for non-admins */}
      {role !== "admin" && (
        <div className="flex items-center gap-3 px-4 py-3 bg-[#E3F2FD] border border-[#90CAF9] rounded-xl text-[#1565C0] text-sm">
          <Lock className="w-4 h-4 flex-shrink-0" />
          <span>You are viewing violations in <strong>read-only mode</strong>. Only Barangay Admins can resolve or send warnings.</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Violations", value: violations.length, icon: ShieldAlert, color: "bg-[#FCE4EC] text-[#C62828]" },
          { label: "Active", value: activeCount, icon: AlertTriangle, color: "bg-[#FFF3E0] text-[#E65100]" },
          { label: "Resolved", value: resolvedCount, icon: CheckCircle2, color: "bg-[#E8F5E9] text-[#2E7D32]" },
          { label: "For Sanction", value: sanctionCount, icon: ShieldAlert, color: "bg-[#B71C1C] text-white" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-[#E8F5E9]">
              <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-[#1A2E1A]">{s.value}</p>
              <p className="text-[#558B5A] text-sm">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {["All", "Active", "Resolved"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${
              filter === f
                ? "bg-[#2E7D32] text-white"
                : "bg-white text-[#558B5A] border border-[#E8F5E9] hover:border-[#A5D6A7]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Warning sent modal */}
      {showWarning && warningTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center">
            <div className="w-16 h-16 bg-[#FFF3E0] rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-[#E65100]" />
            </div>
            <h3 className="font-bold text-[#1A2E1A] text-lg mb-2">Warning Notification Sent</h3>
            <p className="text-[#558B5A] text-sm mb-5">
              A formal warning has been sent to <strong>{warningTarget.household}</strong> at {warningTarget.address}.
            </p>
            <button
              onClick={() => setShowWarning(false)}
              className="w-full py-3 bg-[#2E7D32] text-white rounded-xl hover:bg-[#1B5E20] transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[#E8F5E9]">
              <h3 className="font-semibold text-[#1A2E1A]">Violation Record</h3>
              <button onClick={() => setSelected(null)} className="text-[#558B5A] hover:text-[#1A2E1A] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#E8F5E9] flex items-center justify-center">
                  <User className="w-6 h-6 text-[#2E7D32]" />
                </div>
                <div>
                  <p className="font-bold text-[#1A2E1A]">{selected.household}</p>
                  <p className="text-xs text-[#558B5A] flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {selected.address}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[selected.status]}`}>
                  {selected.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${warningColors[selected.warningLevel]?.badge}`}>
                  {selected.warningLevel}
                </span>
                <span className="px-3 py-1 rounded-full text-xs bg-[#F4FAF4] border border-[#E8F5E9] text-[#558B5A]">
                  {selected.count} offense(s)
                </span>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-[#558B5A] uppercase tracking-wider mb-2">Violation History</h4>
                <div className="space-y-2">
                  {selected.history.map((h, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-[#F4FAF4] rounded-xl">
                      <div className="w-5 h-5 rounded-full bg-[#2E7D32] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs">{i + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm text-[#1A2E1A]">{h.violation}</p>
                        <p className="text-xs text-[#558B5A] flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" /> {h.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin-only action buttons */}
              {role === "admin" && selected.status === "Active" && (
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => sendWarning(selected)}
                    className="flex-1 py-2.5 bg-[#FFF3E0] border border-[#FFCC80] text-[#E65100] text-sm rounded-xl hover:bg-[#FFE0B2] transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Bell className="w-4 h-4" /> Send Warning
                  </button>
                  <button
                    onClick={() => resolve(selected.id)}
                    className="flex-1 py-2.5 bg-[#2E7D32] text-white text-sm rounded-xl hover:bg-[#1B5E20] transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Resolve
                  </button>
                </div>
              )}

              {/* Read-only notice for non-admins */}
              {role !== "admin" && (
                <div className="flex items-center gap-2 p-3 bg-[#F4FAF4] rounded-xl text-[#558B5A] text-xs">
                  <Lock className="w-4 h-4 flex-shrink-0" />
                  <span>Actions restricted to Barangay Admin only.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Violations list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-[#E8F5E9]">
            <Filter className="w-10 h-10 text-[#A5D6A7] mx-auto mb-3" />
            <p className="text-[#558B5A]">No violations match this filter.</p>
          </div>
        ) : (
          filtered.map((v) => (
            <div key={v.id} className="bg-white rounded-2xl p-4 shadow-sm border border-[#E8F5E9] hover:border-[#A5D6A7] transition">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  v.status === "Active" ? "bg-[#FCE4EC]" : "bg-[#E8F5E9]"
                }`}>
                  <ShieldAlert className={`w-5 h-5 ${v.status === "Active" ? "text-[#C62828]" : "text-[#2E7D32]"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <p className="font-semibold text-[#1A2E1A] text-sm">{v.household}</p>
                      <p className="text-xs text-[#558B5A] flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {v.address}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs border ${statusColors[v.status]}`}>{v.status}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs border ${warningColors[v.warningLevel]?.badge}`}>
                        {v.warningLevel}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-[#558B5A]">
                    <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{v.violation}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{v.date}</span>
                    <span className="font-medium text-[#1A2E1A]">{v.count} offense(s)</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-3 pt-3 border-t border-[#E8F5E9]">
                <button
                  onClick={() => setSelected(v)}
                  className="flex items-center gap-1 text-[#2E7D32] text-xs hover:underline cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" /> View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}