// src/app/pages/ViolationsPage.tsx
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Filter,
  User,
  Clock,
  MapPin,
  X,
  Bell,
  Lock,
  Loader2
} from "lucide-react";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
  addDoc
} from "firebase/firestore";
import { db } from "../../lib/firebase";

type Role = "resident" | "admin" | "collector";

const warningColors: Record<string, { badge: string; dot: string }> = {
  "1st_warning": { badge: "bg-[#FFF3E0] text-[#E65100] border-[#FFCC80]", dot: "bg-[#FFA726]" },
  "2nd_warning": { badge: "bg-[#FFF8E1] text-[#F57F17] border-[#FFE082]", dot: "bg-[#FFC107]" },
  "final_warning": { badge: "bg-[#FCE4EC] text-[#C62828] border-[#F48FB1]", dot: "bg-[#EF5350]" },
  "sanction": { badge: "bg-[#B71C1C] text-white border-[#B71C1C]", dot: "bg-[#B71C1C]" },
};

const warningLevelDisplay: Record<string, string> = {
  "1st_warning": "1st Warning",
  "2nd_warning": "2nd Warning",
  "final_warning": "Final Warning",
  "sanction": "Sanction",
};

const statusColors: Record<string, string> = {
  active: "bg-[#FCE4EC] text-[#C62828] border-[#F48FB1]",
  resolved: "bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]",
};

const statusDisplay: Record<string, string> = {
  active: "Active",
  resolved: "Resolved",
};

interface ViolationItem {
  id: string;
  userId: string;
  residentName: string;
  address: string;
  violationType: string;
  createdAt: Date;
  updatedAt: Date;
  offenseCount: number;
  status: string;
  warningLevel: string;
  remarks: string;
  recordedBy: string;
  recordedByName: string;
  history?: { date: Date; violation: string; action: string }[];
}

export default function ViolationsPage() {
  const { role } = useOutletContext<{ role: Role }>();
  const { user } = useAuth();
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<ViolationItem | null>(null);
  const [violations, setViolations] = useState<ViolationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [warningTarget, setWarningTarget] = useState<ViolationItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchViolations();
  }, [role, user]);

  const fetchViolations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const violationsRef = collection(db, "violations");
      let q;

      if (role === "admin") {
        q = query(violationsRef, orderBy("createdAt", "desc"));
      } else if (user) {
        q = query(
          violationsRef,
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
      } else {
        setViolations([]);
        setIsLoading(false);
        return;
      }

      const querySnapshot = await getDocs(q);
      const fetchedViolations: ViolationItem[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedViolations.push({
          id: doc.id,
          userId: data.userId,
          residentName: data.residentName,
          address: data.address,
          violationType: data.violationType,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          offenseCount: data.offenseCount || 1,
          status: data.status || "active",
          warningLevel: data.warningLevel || "1st_warning",
          remarks: data.remarks || "",
          recordedBy: data.recordedBy || "",
          recordedByName: data.recordedByName || "",
          history: data.history || [],
        });
      });

      setViolations(fetchedViolations);
    } catch (err: any) {
      console.error("Error fetching violations:", err);

      // If collection doesn't exist, just show empty state
      if (err.code === "not-found" || err.message?.includes("Missing or insufficient permissions")) {
        setViolations([]);
      } else {
        setError("Failed to load violations. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolve = async (violationId: string) => {
    if (!user || role !== "admin") return;

    setIsSubmitting(true);
    try {
      const violationRef = doc(db, "violations", violationId);
      await updateDoc(violationRef, {
        status: "resolved",
        updatedAt: new Date(),
        resolvedAt: new Date(),
        resolvedBy: user.uid,
        resolvedByName: user.fullName,
      });

      await fetchViolations();
      setSelected(null);
    } catch (err) {
      console.error("Error resolving violation:", err);
      alert("Failed to resolve violation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendWarning = async () => {
    if (!user || role !== "admin" || !warningTarget) return;

    setIsSubmitting(true);
    try {
      const violationRef = doc(db, "violations", warningTarget.id);
      const historyEntry = {
        date: new Date(),
        violation: warningTarget.violationType,
        action: `Warning sent by ${user.fullName}`,
      };

      await updateDoc(violationRef, {
        updatedAt: new Date(),
        history: arrayUnion(historyEntry),
      });

      setShowWarning(false);
      setWarningTarget(null);
      await fetchViolations();
      alert("Warning notification sent successfully!");
    } catch (err) {
      console.error("Error sending warning:", err);
      alert("Failed to send warning. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
  };

  const filtered = filter === "All"
    ? violations
    : violations.filter((v) =>
        filter === "Active" ? v.status === "active" : v.status === "resolved"
      );

  const stats = {
    total: violations.length,
    active: violations.filter(v => v.status === "active").length,
    resolved: violations.filter(v => v.status === "resolved").length,
    sanction: violations.filter(v => v.warningLevel === "sanction").length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-[#2E7D32] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
          <button onClick={() => { setError(null); fetchViolations(); }} className="ml-auto">
            <X className="w-4 h-4 text-red-500" />
          </button>
        </div>
      )}

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
          { label: "Total Violations", value: stats.total, icon: ShieldAlert, color: "bg-[#FCE4EC] text-[#C62828]" },
          { label: "Active", value: stats.active, icon: AlertTriangle, color: "bg-[#FFF3E0] text-[#E65100]" },
          { label: "Resolved", value: stats.resolved, icon: CheckCircle2, color: "bg-[#E8F5E9] text-[#2E7D32]" },
          { label: "For Sanction", value: stats.sanction, icon: ShieldAlert, color: "bg-[#B71C1C] text-white" },
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
                  v.status === "active" ? "bg-[#FCE4EC]" : "bg-[#E8F5E9]"
                }`}>
                  <ShieldAlert className={`w-5 h-5 ${v.status === "active" ? "text-[#C62828]" : "text-[#2E7D32]"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <p className="font-semibold text-[#1A2E1A] text-sm">{v.residentName}</p>
                      <p className="text-xs text-[#558B5A] flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {v.address}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs border ${statusColors[v.status]}`}>
                        {statusDisplay[v.status]}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs border ${warningColors[v.warningLevel]?.badge}`}>
                        {warningLevelDisplay[v.warningLevel] || v.warningLevel}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-[#558B5A]">
                    <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{v.violationType}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDate(v.createdAt)}</span>
                    <span className="font-medium text-[#1A2E1A]">{v.offenseCount} offense(s)</span>
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

      {/* Warning sent modal */}
      {showWarning && warningTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center">
            <div className="w-16 h-16 bg-[#FFF3E0] rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-[#E65100]" />
            </div>
            <h3 className="font-bold text-[#1A2E1A] text-lg mb-2">Send Warning Notification</h3>
            <p className="text-[#558B5A] text-sm mb-5">
              Send a formal warning to <strong>{warningTarget.residentName}</strong> at {warningTarget.address}?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowWarning(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#A5D6A7] text-[#558B5A] hover:bg-[#E8F5E9] transition cursor-pointer"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSendWarning}
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-[#E65100] text-white hover:bg-[#BF360C] transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Warning"
                )}
              </button>
            </div>
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
                  <p className="font-bold text-[#1A2E1A]">{selected.residentName}</p>
                  <p className="text-xs text-[#558B5A] flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {selected.address}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[selected.status]}`}>
                  {statusDisplay[selected.status]}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${warningColors[selected.warningLevel]?.badge}`}>
                  {warningLevelDisplay[selected.warningLevel] || selected.warningLevel}
                </span>
                <span className="px-3 py-1 rounded-full text-xs bg-[#F4FAF4] border border-[#E8F5E9] text-[#558B5A]">
                  {selected.offenseCount} offense(s)
                </span>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-[#558B5A] uppercase tracking-wider mb-2">Remarks</h4>
                <p className="text-sm text-[#1A2E1A] bg-[#F4FAF4] p-3 rounded-xl">
                  {selected.remarks || "No remarks provided."}
                </p>
              </div>

              {selected.history && selected.history.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-[#558B5A] uppercase tracking-wider mb-2">History</h4>
                  <div className="space-y-2">
                    {selected.history.map((h, i) => (
                      <div key={i} className="p-3 bg-[#F4FAF4] rounded-xl">
                        <p className="text-sm text-[#1A2E1A]">{h.action}</p>
                        <p className="text-xs text-[#558B5A] mt-1">
                          {formatDate(h.date instanceof Date ? h.date : new Date(h.date))}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-xs text-[#A5D6A7]">
                Recorded by: {selected.recordedByName} on {formatDate(selected.createdAt)}
              </div>

              {/* Admin-only action buttons */}
              {role === "admin" && selected.status === "active" && (
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      setWarningTarget(selected);
                      setShowWarning(true);
                    }}
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 bg-[#FFF3E0] border border-[#FFCC80] text-[#E65100] text-sm rounded-xl hover:bg-[#FFE0B2] transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    <Bell className="w-4 h-4" /> Send Warning
                  </button>
                  <button
                    onClick={() => handleResolve(selected.id)}
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 bg-[#2E7D32] text-white text-sm rounded-xl hover:bg-[#1B5E20] transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Resolving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Resolve
                      </>
                    )}
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
    </div>
  );
}