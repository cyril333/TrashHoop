import { useState } from "react";
import { useOutletContext } from "react-router";
import { MapPin, CheckCircle2, Clock, Truck, Package, ChevronDown, ChevronUp, User, Map, List } from "lucide-react";
import LiveTracker from "../components/LiveTracker";

type Role = "resident" | "admin" | "collector";

const zones = [
  {
    id: "A",
    name: "Brgy. Lahug",
    blocks: "Gorordo-Nivel Area",
    time: "6:00 – 8:00 AM",
    collector: "Ramon Dela Cruz",
    households: 52,
    status: "Completed",
    color: "#66BB6A",
    bg: "#E8F5E9",
    streets: ["Gorordo Avenue", "Nivel Hills", "Lahug Road"],
    notes: "Upscale residential – expect recyclables",
  },
  {
    id: "B",
    name: "Brgy. Apas",
    blocks: "Escario-IT Park Area",
    time: "8:30 – 10:30 AM",
    collector: "Pedro Santos",
    households: 47,
    status: "In Progress",
    color: "#FFA726",
    bg: "#FFF3E0",
    streets: ["Escario Street", "Archbishop Reyes Ave", "Cardinal Rosales Ave"],
    notes: "Commercial area – expect larger volume",
  },
  {
    id: "C",
    name: "Brgy. Capitol Site",
    blocks: "Downtown-Osmeña Area",
    time: "11:00 AM – 1:00 PM",
    collector: "Jose Reyes",
    households: 61,
    status: "Pending",
    color: "#42A5F5",
    bg: "#E3F2FD",
    streets: ["Osmeña Boulevard", "Fuente Circle", "Jones Avenue"],
    notes: "Government offices – collect during lunch",
  },
  {
    id: "D",
    name: "Brgy. Kamputhaw",
    blocks: "Mango-Colon Area",
    time: "1:30 – 3:30 PM",
    collector: "Miguel Garcia",
    households: 39,
    status: "Pending",
    color: "#AB47BC",
    bg: "#F3E5F5",
    streets: ["Mango Avenue", "Colon Street", "Jakosalem Street"],
    notes: "Old downtown – narrow streets, careful navigation",
  },
  {
    id: "E",
    name: "Brgy. Mabolo",
    blocks: "Banilad-Ayala Area",
    time: "4:00 – 6:00 PM",
    collector: "Antonio Cruz",
    households: 44,
    status: "Pending",
    color: "#EF5350",
    bg: "#FCE4EC",
    streets: ["Gen. Maxilom Ave", "Salinas Drive", "Maria Luisa Road"],
    notes: "High density residential – may need extra truck",
  },
];

const statusIcon: Record<string, JSX.Element> = {
  Completed: <CheckCircle2 className="w-5 h-5 text-[#2E7D32]" />,
  "In Progress": <Truck className="w-5 h-5 text-[#E65100]" />,
  Pending: <Clock className="w-5 h-5 text-[#558B5A]" />,
};

const statusBadge: Record<string, string> = {
  Completed: "bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]",
  "In Progress": "bg-[#FFF3E0] text-[#E65100] border-[#FFCC80]",
  Pending: "bg-[#F5F5F5] text-[#558B5A] border-[#E0E0E0]",
};

export default function RoutesPage() {
  const { role } = useOutletContext<{ role: Role }>();
  const [expanded, setExpanded] = useState<string | null>("B");
  const [statuses, setStatuses] = useState<Record<string, string>>(
    Object.fromEntries(zones.map((z) => [z.id, z.status]))
  );
  // Default to Live Tracker for residents, Route List for collectors/admins
  const [activeTab, setActiveTab] = useState<"tracker" | "list">(role === "resident" ? "tracker" : "list");

  const markCollected = (id: string) => {
    setStatuses((prev) => ({ ...prev, [id]: "Completed" }));
  };

  const markNotCollected = (id: string) => {
    setStatuses((prev) => ({ ...prev, [id]: "Pending" }));
  };

  const completedCount = Object.values(statuses).filter((s) => s === "Completed").length;
  const totalHouseholds = zones.reduce((acc, z) => acc + z.households, 0);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Tab switcher */}
      <div className="flex gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-[#E8F5E9] w-fit">
        <button
          onClick={() => setActiveTab("tracker")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${
            activeTab === "tracker"
              ? "bg-[#2E7D32] text-white shadow-sm"
              : "text-[#558B5A] hover:bg-[#F4FAF4]"
          }`}
        >
          <Map className="w-4 h-4" />
          Live Tracker
          {activeTab !== "tracker" && (
            <span className="w-2 h-2 bg-[#D32F2F] rounded-full animate-pulse" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("list")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${
            activeTab === "list"
              ? "bg-[#2E7D32] text-white shadow-sm"
              : "text-[#558B5A] hover:bg-[#F4FAF4]"
          }`}
        >
          <List className="w-4 h-4" />
          Route List
        </button>
      </div>

      {/* Live Tracker Tab */}
      {activeTab === "tracker" && <LiveTracker />}

      {/* Route List Tab */}
      {activeTab === "list" && (
        <>
          {/* Summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Zones", value: zones.length, icon: MapPin, color: "bg-[#E8F5E9] text-[#2E7D32]" },
              { label: "Completed", value: completedCount, icon: CheckCircle2, color: "bg-[#E8F5E9] text-[#2E7D32]" },
              { label: "In Progress", value: Object.values(statuses).filter((s) => s === "In Progress").length, icon: Truck, color: "bg-[#FFF3E0] text-[#E65100]" },
              { label: "Households", value: totalHouseholds, icon: Package, color: "bg-[#E3F2FD] text-[#1565C0]" },
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

          {/* Progress bar */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8F5E9]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-[#1A2E1A]">Today's Collection Progress</h3>
              <span className="text-[#2E7D32] font-bold">{Math.round((completedCount / zones.length) * 100)}%</span>
            </div>
            <div className="w-full bg-[#E8F5E9] rounded-full h-3 mb-2">
              <div
                className="bg-[#2E7D32] h-3 rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / zones.length) * 100}%` }}
              />
            </div>
            <p className="text-xs text-[#558B5A]">{completedCount} of {zones.length} zones completed</p>
          </div>

          {/* Route list */}
          <div className="space-y-3">
            {zones.map((zone) => {
              const currentStatus = statuses[zone.id];
              const isExpanded = expanded === zone.id;

              return (
                <div key={zone.id} className="bg-white rounded-2xl shadow-sm border border-[#E8F5E9] overflow-hidden">
                  <button
                    onClick={() => setExpanded(isExpanded ? null : zone.id)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-[#F4FAF4] transition cursor-pointer"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-white text-lg"
                      style={{ background: zone.color }}
                    >
                      {zone.id}
                    </div>

                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-[#1A2E1A]">{zone.name} – {zone.blocks}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs border ${statusBadge[currentStatus]}`}>
                          {currentStatus}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-[#558B5A] flex-wrap">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{zone.time}</span>
                        <span className="flex items-center gap-1"><User className="w-3 h-3" />{zone.collector}</span>
                        <span className="flex items-center gap-1"><Package className="w-3 h-3" />{zone.households} households</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {statusIcon[currentStatus]}
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-[#A5D6A7]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#A5D6A7]" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-[#E8F5E9] p-4" style={{ background: zone.bg }}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-xs font-semibold text-[#558B5A] uppercase tracking-wider mb-2">Streets / Areas</h4>
                          <ul className="space-y-1.5">
                            {zone.streets.map((st) => (
                              <li key={st} className="flex items-center gap-2 text-sm text-[#1A2E1A]">
                                <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: zone.color }} />
                                {st}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-[#558B5A] uppercase tracking-wider mb-2">Notes</h4>
                          <p className="text-sm text-[#558B5A] bg-white/70 p-3 rounded-xl">{zone.notes}</p>
                        </div>
                      </div>

                      {/* Action buttons – collector & admin only */}
                      {(role === "collector" || role === "admin") && (
                        <div className="flex gap-2 mt-4">
                          {currentStatus !== "Completed" && (
                            <button
                              onClick={() => markCollected(zone.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-[#2E7D32] text-white text-sm rounded-xl hover:bg-[#1B5E20] transition cursor-pointer"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              Mark as Collected
                            </button>
                          )}
                          {currentStatus === "Completed" && (
                            <button
                              onClick={() => markNotCollected(zone.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#A5D6A7] text-[#558B5A] text-sm rounded-xl hover:bg-[#E8F5E9] transition cursor-pointer"
                            >
                              <Clock className="w-4 h-4" />
                              Mark as Not Collected
                            </button>
                          )}
                          {currentStatus === "Pending" && (
                            <button
                              onClick={() => setStatuses((prev) => ({ ...prev, [zone.id]: "In Progress" }))}
                              className="flex items-center gap-2 px-4 py-2 bg-[#FFF3E0] border border-[#FFCC80] text-[#E65100] text-sm rounded-xl hover:bg-[#FFE0B2] transition cursor-pointer"
                            >
                              <Truck className="w-4 h-4" />
                              Start Collection
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}