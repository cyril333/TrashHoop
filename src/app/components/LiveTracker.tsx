import { useState, useEffect } from "react";
import { Truck, CheckCircle2, Clock, MapPin, Radio, User, RefreshCw } from "lucide-react";

interface TruckState {
  id: string;
  zone: string;
  barangay: string;
  collector: string;
  status: "Completed" | "In Progress" | "Pending";
  color: string;
  waypointIndex: number;
  waypoints: { x: number; y: number; label: string }[];
}

const initialTrucks: TruckState[] = [
  {
    id: "A",
    zone: "Zone A",
    barangay: "Brgy. Lahug",
    collector: "Ramon Dela Cruz",
    status: "Completed",
    color: "#66BB6A",
    waypointIndex: 3,
    waypoints: [
      { x: 63, y: 10, label: "Nivel Hills Rd." },
      { x: 70, y: 16, label: "Gorordo Avenue" },
      { x: 74, y: 22, label: "Lahug Roundabout" },
      { x: 71, y: 28, label: "Route Completed ✓" },
    ],
  },
  {
    id: "B",
    zone: "Zone B",
    barangay: "Brgy. Apas",
    collector: "Pedro Santos",
    status: "In Progress",
    color: "#FFA726",
    waypointIndex: 1,
    waypoints: [
      { x: 76, y: 32, label: "Archbishop Reyes Ave" },
      { x: 83, y: 38, label: "Escario Street" },
      { x: 80, y: 44, label: "Near IT Park" },
      { x: 76, y: 50, label: "Cardinal Rosales Ave" },
    ],
  },
  {
    id: "C",
    zone: "Zone C",
    barangay: "Brgy. Capitol Site",
    collector: "Jose Reyes",
    status: "Pending",
    color: "#42A5F5",
    waypointIndex: 0,
    waypoints: [
      { x: 46, y: 46, label: "Jones Avenue" },
      { x: 42, y: 54, label: "Fuente Circle" },
      { x: 36, y: 60, label: "Osmeña Blvd." },
    ],
  },
  {
    id: "D",
    zone: "Zone D",
    barangay: "Brgy. Kamputhaw",
    collector: "Miguel Garcia",
    status: "Pending",
    color: "#AB47BC",
    waypointIndex: 0,
    waypoints: [
      { x: 34, y: 64, label: "Jakosalem Street" },
      { x: 26, y: 70, label: "Mango Avenue" },
      { x: 20, y: 76, label: "Colon Street" },
    ],
  },
  {
    id: "E",
    zone: "Zone E",
    barangay: "Brgy. Mabolo",
    collector: "Antonio Cruz",
    status: "Pending",
    color: "#EF5350",
    waypointIndex: 0,
    waypoints: [
      { x: 62, y: 68, label: "Salinas Drive" },
      { x: 68, y: 74, label: "Gen. Maxilom Ave" },
      { x: 72, y: 80, label: "Maria Luisa Road" },
    ],
  },
];

// Street grid lines for map background
const streetLines = [
  // Horizontal streets
  { x1: 0, y1: 25, x2: 100, y2: 25, label: "Gorordo Avenue" },
  { x1: 0, y1: 40, x2: 100, y2: 40, label: "Archbishop Reyes Ave" },
  { x1: 0, y1: 55, x2: 100, y2: 55, label: "Jones Avenue" },
  { x1: 0, y1: 68, x2: 100, y2: 68, label: "Mango Avenue" },
  { x1: 0, y1: 80, x2: 100, y2: 80, label: "Colon Street" },
  // Vertical streets
  { x1: 20, y1: 0, x2: 20, y2: 100, label: "" },
  { x1: 35, y1: 0, x2: 35, y2: 100, label: "Osmeña Blvd" },
  { x1: 50, y1: 0, x2: 50, y2: 100, label: "" },
  { x1: 65, y1: 0, x2: 65, y2: 100, label: "Escario St" },
  { x1: 80, y1: 0, x2: 80, y2: 100, label: "" },
];

function PulseDot({ color, x, y }: { color: string; x: number; y: number }) {
  return (
    <div
      style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
      className="absolute"
    >
      {/* Outer pulse ring */}
      <div
        className="absolute rounded-full opacity-40 animate-ping"
        style={{
          width: 28,
          height: 28,
          background: color,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
      {/* Truck icon background */}
      <div
        className="relative w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white z-10"
        style={{ background: color }}
      >
        <Truck className="w-4 h-4 text-white" />
      </div>
    </div>
  );
}

function StaticDot({ color, x, y, status }: { color: string; x: number; y: number; status: string }) {
  return (
    <div
      style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
      className="absolute"
    >
      <div
        className="relative w-7 h-7 rounded-full flex items-center justify-center shadow border-2 border-white opacity-60 z-10"
        style={{ background: color }}
      >
        {status === "Completed" ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
        ) : (
          <Clock className="w-3.5 h-3.5 text-white" />
        )}
      </div>
    </div>
  );
}

export default function LiveTracker() {
  const [trucks, setTrucks] = useState(initialTrucks);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [tick, setTick] = useState(0);
  const [selectedTruck, setSelectedTruck] = useState<string | null>("B");

  // Simulate real-time truck movement for Zone B (In Progress)
  useEffect(() => {
    const interval = setInterval(() => {
      setTrucks((prev) =>
        prev.map((truck) => {
          if (truck.status === "In Progress") {
            const nextIndex = (truck.waypointIndex + 1) % truck.waypoints.length;
            return { ...truck, waypointIndex: nextIndex };
          }
          return truck;
        })
      );
      setLastUpdated(new Date());
      setTick((t) => t + 1);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const activeTruck = trucks.find((t) => t.id === selectedTruck);
  const currentWaypoint = activeTruck
    ? activeTruck.waypoints[activeTruck.waypointIndex]
    : null;

  return (
    <div className="space-y-4">
      {/* Live badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#FCE4EC] text-[#C62828] px-3 py-1 rounded-full text-xs font-semibold">
            <Radio className="w-3 h-3 animate-pulse" />
            LIVE
          </div>
          <span className="text-xs text-[#558B5A]">
            Updated {lastUpdated.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-[#2E7D32]">
          <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: "3s" }} />
          Auto-refresh
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Visual Map */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-[#E8F5E9] overflow-hidden">
          <div className="p-4 border-b border-[#E8F5E9] flex items-center justify-between">
            <h3 className="font-semibold text-[#1A2E1A] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#2E7D32]" />
              Cebu City – Live Collection Map
            </h3>
            <span className="text-xs text-[#558B5A]">Barangay Coverage</span>
          </div>
          {/* Map area */}
          <div
            className="relative w-full overflow-hidden"
            style={{ height: 340, background: "#E8F0E8" }}
          >
            {/* SVG Street Grid */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Block fills */}
              <rect x="0" y="0" width="20" height="25" fill="#F0F4F0" />
              <rect x="20" y="0" width="15" height="25" fill="#EAF2EA" />
              <rect x="35" y="0" width="15" height="25" fill="#F0F4F0" />
              <rect x="50" y="0" width="15" height="25" fill="#EAF2EA" />
              <rect x="65" y="0" width="15" height="25" fill="#F0F4F0" />
              <rect x="80" y="0" width="20" height="25" fill="#EAF2EA" />

              <rect x="0" y="25" width="20" height="15" fill="#EAF2EA" />
              <rect x="20" y="25" width="15" height="15" fill="#F5FAF5" />
              <rect x="35" y="25" width="15" height="15" fill="#EAF2EA" />
              <rect x="50" y="25" width="15" height="15" fill="#F5FAF5" />
              <rect x="65" y="25" width="15" height="15" fill="#EAF2EA" />
              <rect x="80" y="25" width="20" height="15" fill="#F5FAF5" />

              <rect x="0" y="40" width="35" height="15" fill="#F0F4F0" />
              <rect x="35" y="40" width="30" height="15" fill="#EAF2EA" />
              <rect x="65" y="40" width="35" height="15" fill="#F0F4F0" />

              <rect x="0" y="55" width="20" height="13" fill="#EAF2EA" />
              <rect x="20" y="55" width="15" height="13" fill="#F5FAF5" />
              <rect x="35" y="55" width="30" height="13" fill="#EAF2EA" />
              <rect x="65" y="55" width="15" height="13" fill="#F5FAF5" />
              <rect x="80" y="55" width="20" height="13" fill="#EAF2EA" />

              <rect x="0" y="68" width="100" height="12" fill="#F0F4F0" />
              <rect x="0" y="80" width="100" height="20" fill="#EAF2EA" />

              {/* Streets */}
              {streetLines.map((line, i) => (
                <line key={i} x1={`${line.x1}%`} y1={`${line.y1}%`} x2={`${line.x2}%`} y2={`${line.y2}%`} stroke="white" strokeWidth="0.8" />
              ))}

              {/* Zone color overlays */}
              <rect x="55" y="3" width="28" height="24" rx="1" fill="#66BB6A" fillOpacity="0.12" />
              <rect x="68" y="27" width="24" height="16" rx="1" fill="#FFA726" fillOpacity="0.14" />
              <rect x="35" y="42" width="28" height="14" rx="1" fill="#42A5F5" fillOpacity="0.12" />
              <rect x="8" y="57" width="26" height="12" rx="1" fill="#AB47BC" fillOpacity="0.12" />
              <rect x="57" y="57" width="26" height="22" rx="1" fill="#EF5350" fillOpacity="0.10" />

              {/* Zone labels */}
              <text x="58" y="12" fontSize="2.5" fill="#2E7D32" fontWeight="600">Brgy. Lahug</text>
              <text x="72" y="36" fontSize="2.5" fill="#E65100" fontWeight="600">Brgy. Apas</text>
              <text x="38" y="50" fontSize="2.5" fill="#1565C0" fontWeight="600">Capitol Site</text>
              <text x="10" y="64" fontSize="2.5" fill="#7B1FA2" fontWeight="600">Kamputhaw</text>
              <text x="60" y="63" fontSize="2.5" fill="#C62828" fontWeight="600">Brgy. Mabolo</text>

              {/* Truck trail dots for In Progress zone B */}
              {trucks.filter(t => t.status === "In Progress").map(truck => {
                const prev = truck.waypoints[(truck.waypointIndex - 1 + truck.waypoints.length) % truck.waypoints.length];
                return (
                  <line
                    key={`trail-${truck.id}`}
                    x1={`${prev.x}%`}
                    y1={`${prev.y}%`}
                    x2={`${truck.waypoints[truck.waypointIndex].x}%`}
                    y2={`${truck.waypoints[truck.waypointIndex].y}%`}
                    stroke={truck.color}
                    strokeWidth="0.8"
                    strokeDasharray="2,1"
                    strokeOpacity="0.7"
                  />
                );
              })}

              {/* Completed route line for Zone A */}
              {trucks.filter(t => t.status === "Completed").map(truck => (
                truck.waypoints.slice(0, -1).map((wp, i) => (
                  <line
                    key={`completed-${truck.id}-${i}`}
                    x1={`${wp.x}%`}
                    y1={`${wp.y}%`}
                    x2={`${truck.waypoints[i + 1].x}%`}
                    y2={`${truck.waypoints[i + 1].y}%`}
                    stroke={truck.color}
                    strokeWidth="1"
                    strokeOpacity="0.5"
                  />
                ))
              ))}
            </svg>

            {/* Truck markers */}
            {trucks.map((truck) => {
              const wp = truck.waypoints[truck.waypointIndex];
              if (truck.status === "In Progress") {
                return (
                  <div key={truck.id} style={{ transition: "left 1.2s ease, top 1.2s ease", position: "absolute", left: `${wp.x}%`, top: `${wp.y}%`, transform: "translate(-50%,-50%)", zIndex: 20 }}>
                    <div className="animate-ping absolute rounded-full opacity-30 w-8 h-8" style={{ background: truck.color, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
                    <div
                      className="relative w-9 h-9 rounded-full flex items-center justify-center shadow-lg border-2 border-white cursor-pointer"
                      style={{ background: truck.color }}
                      onClick={() => setSelectedTruck(truck.id)}
                    >
                      <Truck className="w-4 h-4 text-white" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white animate-pulse" />
                    </div>
                  </div>
                );
              }
              return (
                <div
                  key={truck.id}
                  className="absolute cursor-pointer"
                  style={{ left: `${wp.x}%`, top: `${wp.y}%`, transform: "translate(-50%,-50%)", zIndex: 15 }}
                  onClick={() => setSelectedTruck(truck.id)}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shadow border-2 border-white"
                    style={{ background: truck.color, opacity: truck.status === "Completed" ? 0.9 : 0.55 }}
                  >
                    {truck.status === "Completed" ? (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    ) : (
                      <Clock className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>
              );
            })}

            {/* Legend */}
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-xl p-2.5 shadow-sm text-xs space-y-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#66BB6A]" />
                <span className="text-[#558B5A]">Completed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FFA726] animate-pulse" />
                <span className="text-[#558B5A]">In Progress</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#90CAF9]" />
                <span className="text-[#558B5A]">Pending</span>
              </div>
            </div>
          </div>
        </div>

        {/* Truck Status Panel */}
        <div className="space-y-3">
          <h3 className="font-semibold text-[#1A2E1A] text-sm flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#2E7D32]" />
            Fleet Status
          </h3>
          <div className="space-y-2">
            {trucks.map((truck) => {
              const wp = truck.waypoints[truck.waypointIndex];
              const isSelected = selectedTruck === truck.id;
              return (
                <button
                  key={truck.id}
                  onClick={() => setSelectedTruck(truck.id === selectedTruck ? null : truck.id)}
                  className={`w-full text-left p-3 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? "border-[#2E7D32] bg-[#F4FAF4] shadow-sm"
                      : "border-[#E8F5E9] bg-white hover:border-[#A5D6A7]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: truck.color + "20" }}
                    >
                      <span className="font-bold text-sm" style={{ color: truck.color }}>{truck.id}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-medium text-[#1A2E1A] text-sm truncate">{truck.barangay}</span>
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                            truck.status === "Completed"
                              ? "bg-[#E8F5E9] text-[#2E7D32]"
                              : truck.status === "In Progress"
                              ? "bg-[#FFF3E0] text-[#E65100]"
                              : "bg-[#F5F5F5] text-[#558B5A]"
                          }`}
                        >
                          {truck.status === "In Progress" ? "🔴 Live" : truck.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#558B5A] truncate flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        {wp.label}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="mt-2.5 pt-2.5 border-t border-[#E8F5E9] space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-[#558B5A]">
                        <User className="w-3 h-3 flex-shrink-0" />
                        <span>{truck.collector}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#558B5A]">
                        <MapPin className="w-3 h-3 flex-shrink-0 text-[#2E7D32]" />
                        <span className="text-[#1A2E1A] font-medium">{wp.label}</span>
                      </div>
                      <div className="mt-1">
                        <div className="flex justify-between text-xs text-[#558B5A] mb-1">
                          <span>Route progress</span>
                          <span className="font-medium text-[#1A2E1A]">
                            {truck.waypointIndex + 1}/{truck.waypoints.length} stops
                          </span>
                        </div>
                        <div className="w-full bg-[#E8F5E9] rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full transition-all duration-700"
                            style={{
                              width: `${((truck.waypointIndex + 1) / truck.waypoints.length) * 100}%`,
                              background: truck.color,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
