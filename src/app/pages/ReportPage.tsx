// src/app/pages/ReportPage.tsx
import { createReport, uploadReportPhoto, getUserReports, getAllReports, updateReportStatus } from "../../services/report.service";
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { useScore, SCORE_ACTIONS } from "../contexts/ScoreContext";
import {
  AlertTriangle,
  Camera,
  MapPin,
  Clock,
  CheckCircle2,
  Eye,
  Filter,
  Plus,
  X,
} from "lucide-react";

type Role = "resident" | "admin" | "collector";

// Temporary mock data until Firebase service is connected
const initialReports = [
  {
    id: "1",
    address: "Brgy. Lahug, Gorordo Avenue",
    type: "Mixed Waste",
    description: "Resident mixing biodegradable and non-biodegradable waste in the same bin.",
    status: "Pending",
    date: "Mar 9, 2026",
    time: "8:30 AM",
    reporter: "Juan dela Cruz",
    severity: "high",
    hasPhoto: true,
  },
  {
    id: "2",
    address: "Brgy. Apas, Near IT Park",
    type: "Illegal Dumping",
    description: "Household garbage dumped on the sidewalk outside collection schedule.",
    status: "Under Review",
    date: "Mar 8, 2026",
    time: "6:45 PM",
    reporter: "Maria Santos",
    severity: "medium",
    hasPhoto: true,
  },
  {
    id: "3",
    address: "Brgy. Capitol Site, Fuente Circle",
    type: "Littering",
    description: "Individual spotted littering plastic wrappers near the playground.",
    status: "Resolved",
    date: "Mar 7, 2026",
    time: "3:00 PM",
    reporter: "Pedro Reyes",
    severity: "low",
    hasPhoto: false,
  },
];

const violationTypes = [
  "Mixed Waste",
  "Illegal Dumping",
  "Littering",
  "Burning Waste",
  "Improper Segregation",
  "Out-of-Schedule Disposal",
  "Other",
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Pending: "bg-[#FFF3E0] text-[#E65100] border-[#FFCC80]",
    Resolved: "bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]",
    "Under Review": "bg-[#E3F2FD] text-[#1565C0] border-[#90CAF9]",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${map[status] || "bg-gray-100 text-gray-500 border-gray-200"}`}>
      {status}
    </span>
  );
}

function SeverityDot({ severity }: { severity: string }) {
  const colors: Record<string, string> = { high: "bg-[#D32F2F]", medium: "bg-[#FFA726]", low: "bg-[#66BB6A]" };
  return <span className={`inline-block w-2.5 h-2.5 rounded-full ${colors[severity] || "bg-gray-400"}`} />;
}

interface ReportItem {
  id: string;
  address: string;
  type: string;
  description: string;
  status: string;
  date: string;
  time: string;
  reporter: string;
  severity: string;
  hasPhoto: boolean;
}

export default function ReportPage() {
  const { role } = useOutletContext<{ role: Role }>();
  const { user } = useAuth();
  const { addScore } = useScore();
  const [reports, setReports] = useState<ReportItem[]>(initialReports);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    address: "",
    type: "",
    description: "",
    photo: null as File | null,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in");
      return;
    }

    setIsSubmitting(true);

    try {
      let photoURL;
      if (form.photo) {
        photoURL = await uploadReportPhoto(form.photo, user.uid);
      }

      await createReport({
        userId: user.uid,
        reporterName: user.fullName || user.email || "Anonymous",
        address: form.address,
        type: form.type || "Other",
        description: form.description,
        photoURL,
        status: "pending",
        severity: "medium",
      });

      if (role === "resident") {
        addScore(SCORE_ACTIONS.REPORT_SUBMITTED.points, SCORE_ACTIONS.REPORT_SUBMITTED.reason);
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setShowForm(false);
        setForm({ address: "", type: "", description: "", photo: null });
        fetchReports();
      }, 2000);
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Failed to submit report.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateStatus = (id: string, status: string) => {
    setReports(reports.map((r) => (r.id === id ? { ...r, status } : r)));
    setSelectedReport(null);
  };

  const filtered = filterStatus === "All" ? reports : reports.filter((r) => r.status === filterStatus);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2 flex-wrap">
          {["All", "Pending", "Under Review", "Resolved"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${
                filterStatus === s
                  ? "bg-[#2E7D32] text-white"
                  : "bg-white text-[#558B5A] border border-[#E8F5E9] hover:border-[#A5D6A7]"
              }`}
            >
              {s}
              {s !== "All" && (
                <span className="ml-1.5 bg-white/20 px-1.5 py-0.5 rounded-full text-xs">
                  {reports.filter((r) => r.status === s).length}
                </span>
              )}
            </button>
          ))}
        </div>
        {role === "resident" && (
          <button
            onClick={() => setShowForm(true)}
            className="sm:ml-auto flex items-center gap-2 bg-[#2E7D32] text-white px-4 py-2 rounded-xl hover:bg-[#1B5E20] transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Report
          </button>
        )}
      </div>

      {/* Report form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-[#E8F5E9]">
              <h3 className="font-semibold text-[#1A2E1A] flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#E65100]" />
                Report Improper Disposal
              </h3>
              <button onClick={() => setShowForm(false)} className="text-[#558B5A] hover:text-[#1A2E1A] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            {submitted ? (
              <div className="p-8 text-center">
                <CheckCircle2 className="w-16 h-16 text-[#2E7D32] mx-auto mb-3" />
                <h3 className="font-bold text-[#1A2E1A] text-lg">Report Submitted!</h3>
                <p className="text-[#558B5A] text-sm mt-1">Your report has been received and will be reviewed shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div>
                  <label className="text-sm text-[#1A2E1A] mb-1.5 block">Violation Type *</label>
                  <select
                    required
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#A5D6A7] bg-[#F4FAF4] focus:outline-none focus:ring-2 focus:ring-[#66BB6A] text-[#1A2E1A]"
                  >
                    <option value="">Select type...</option>
                    {violationTypes.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-[#1A2E1A] mb-1.5 block">Location / Address *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A5D6A7]" />
                    <input
                      required
                      type="text"
                      placeholder="Block 1, Zone A..."
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#A5D6A7] bg-[#F4FAF4] focus:outline-none focus:ring-2 focus:ring-[#66BB6A] text-[#1A2E1A] placeholder-[#A5D6A7]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-[#1A2E1A] mb-1.5 block">Description *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe what you observed..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#A5D6A7] bg-[#F4FAF4] focus:outline-none focus:ring-2 focus:ring-[#66BB6A] text-[#1A2E1A] placeholder-[#A5D6A7] resize-none"
                  />
                </div>

                <div>
                  <label className="text-sm text-[#1A2E1A] mb-1.5 block">Attach Photo (optional)</label>
                  <label className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-[#A5D6A7] bg-[#F4FAF4] cursor-pointer hover:border-[#66BB6A] transition">
                    <Camera className="w-6 h-6 text-[#A5D6A7]" />
                    <span className="text-sm text-[#558B5A]">
                      {form.photo ? form.photo.name : "Click to upload or drag photo here"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setForm({ ...form, photo: e.target.files?.[0] || null })}
                    />
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-3 rounded-xl border border-[#A5D6A7] text-[#558B5A] hover:bg-[#E8F5E9] transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 rounded-xl bg-[#2E7D32] text-white hover:bg-[#1B5E20] transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Report"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Detail modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-[#E8F5E9]">
              <h3 className="font-semibold text-[#1A2E1A]">Report #{selectedReport.id}</h3>
              <button onClick={() => setSelectedReport(null)} className="text-[#558B5A] hover:text-[#1A2E1A] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-2">
                <SeverityDot severity={selectedReport.severity} />
                <span className="font-semibold text-[#1A2E1A]">{selectedReport.type}</span>
                <StatusBadge status={selectedReport.status} />
              </div>
              <div className="space-y-2 text-sm text-[#558B5A]">
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />{selectedReport.address}</div>
                <div className="flex items-center gap-2"><Clock className="w-4 h-4" />{selectedReport.date} at {selectedReport.time}</div>
                <div className="flex items-center gap-2"><AlertTriangle className="w-4 h-4" />Reported by: {selectedReport.reporter}</div>
              </div>
              <p className="text-sm text-[#1A2E1A] bg-[#F4FAF4] p-3 rounded-xl">{selectedReport.description}</p>
              {selectedReport.hasPhoto && (
                <div className="bg-[#E8F5E9] rounded-xl p-4 text-center text-[#558B5A] text-sm">
                  📷 Photo evidence attached
                </div>
              )}
              {role === "admin" && selectedReport.status !== "Resolved" && (
                <div className="flex gap-2 pt-2">
                  {selectedReport.status === "Pending" && (
                    <button
                      onClick={() => updateStatus(selectedReport.id, "Under Review")}
                      className="flex-1 py-2.5 rounded-xl bg-[#E3F2FD] text-[#1565C0] hover:bg-[#BBDEFB] transition text-sm cursor-pointer"
                    >
                      Mark Under Review
                    </button>
                  )}
                  <button
                    onClick={() => updateStatus(selectedReport.id, "Resolved")}
                    className="flex-1 py-2.5 rounded-xl bg-[#2E7D32] text-white hover:bg-[#1B5E20] transition text-sm cursor-pointer"
                  >
                    Mark Resolved
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reports list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-[#E8F5E9]">
            <Filter className="w-10 h-10 text-[#A5D6A7] mx-auto mb-3" />
            <p className="text-[#558B5A]">No reports match this filter.</p>
          </div>
        ) : (
          filtered.map((report) => (
            <div key={report.id} className="bg-white rounded-2xl p-4 shadow-sm border border-[#E8F5E9] hover:border-[#A5D6A7] transition">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  report.severity === "high" ? "bg-[#FCE4EC]" : report.severity === "medium" ? "bg-[#FFF3E0]" : "bg-[#E8F5E9]"
                }`}>
                  <AlertTriangle className={`w-5 h-5 ${
                    report.severity === "high" ? "text-[#C62828]" : report.severity === "medium" ? "text-[#E65100]" : "text-[#2E7D32]"
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-[#1A2E1A] text-sm">{report.type}</span>
                        <StatusBadge status={report.status} />
                        {report.hasPhoto && (
                          <span className="text-xs text-[#558B5A] flex items-center gap-1">
                            <Camera className="w-3 h-3" /> Photo
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#558B5A] mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {report.address}
                      </p>
                    </div>
                    <span className="text-xs text-[#A5D6A7] flex-shrink-0 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {report.date}
                    </span>
                  </div>
                  <p className="text-sm text-[#558B5A] mt-2 line-clamp-2">{report.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#E8F5E9]">
                <span className="text-xs text-[#A5D6A7]">By: {report.reporter} · {report.time}</span>
                <button
                  onClick={() => setSelectedReport(report)}
                  className="flex items-center gap-1 text-[#2E7D32] text-xs hover:underline cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  {role === "admin" ? "Review" : "View"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}