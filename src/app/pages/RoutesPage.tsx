// src/app/pages/RoutesPage.tsx
import { useState, useMemo } from "react";
import { useOutletContext } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import {
  MapPin,
  Navigation,
  Clock,
  Package,
  User,
  Search,
  QrCode,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  Maximize2,
  Minimize2,
  Truck,
  Circle,
  Users,
} from "lucide-react";
import QRScanner from '../components/ui/QRScanner';
import toast from 'react-hot-toast';
import { CEBU_CITY_BARANGAYS } from '../../lib/constants';

type Role = "resident" | "admin" | "collector";

// Group barangays into 4 collector zones (20 each)
const barangayGroups = {
  "North District": CEBU_CITY_BARANGAYS.slice(0, 20),
  "South District": CEBU_CITY_BARANGAYS.slice(20, 40),
  "East District": CEBU_CITY_BARANGAYS.slice(40, 60),
  "West District": CEBU_CITY_BARANGAYS.slice(60, 80),
};

// 4 Collectors with their assigned groups
const collectors = [
  {
    id: "collector-1",
    name: "Ramon Dela Cruz",
    group: "North District",
    color: "#2E7D32",
    bgColor: "#E8F5E9",
    vehicle: "Truck TN-1234",
    phone: "0912-345-6789",
    status: "active" as const,
  },
  {
    id: "collector-2",
    name: "Pedro Santos",
    group: "South District",
    color: "#FFA726",
    bgColor: "#FFF3E0",
    vehicle: "Truck TS-5678",
    phone: "0912-345-6790",
    status: "active" as const,
  },
  {
    id: "collector-3",
    name: "Jose Reyes",
    group: "East District",
    color: "#42A5F5",
    bgColor: "#E3F2FD",
    vehicle: "Truck TE-9012",
    phone: "0912-345-6791",
    status: "active" as const,
  },
  {
    id: "collector-4",
    name: "Miguel Garcia",
    group: "West District",
    color: "#AB47BC",
    bgColor: "#F3E5F5",
    vehicle: "Truck TW-3456",
    phone: "0912-345-6792",
    status: "active" as const,
  },
];

// Generate mock rides for each collector with their assigned barangays
const generateMockRides = () => {
  const rides: any[] = [];

  collectors.forEach((collector) => {
    const barangays = barangayGroups[collector.group as keyof typeof barangayGroups] || [];

    barangays.forEach((barangay, index) => {
      const households = Math.floor(Math.random() * 40) + 40; // 40-80 households
      const completed = index < 5 ? households : Math.floor(Math.random() * households * 0.7); // First 5 completed
      const progress = Math.round((completed / households) * 100);

      rides.push({
        id: `${collector.id}-${index}`,
        collectorId: collector.id,
        collectorName: collector.name,
        collectorGroup: collector.group,
        collectorColor: collector.color,
        collectorBg: collector.bgColor,
        zone: barangay,
        barangay: barangay,
        households,
        completed,
        progress,
        status: index < 5 ? "completed" : index < 10 ? "in_progress" : "pending",
        eta: index < 5 ? "Completed" : `${Math.floor(Math.random() * 45) + 15} min`,
        time: `${Math.floor(Math.random() * 4) + 6}:00 ${index % 2 === 0 ? 'AM' : 'PM'}`,
        priority: index + 1,
        color: collector.color,
      });
    });
  });

  return rides;
};

const allRides = generateMockRides();

// Map locations with actual coordinates for major areas
const mapLocations = [
  // North District
  { name: "Lahug", lat: 10.3157, lng: 123.8854, group: "North District", color: "#2E7D32" },
  { name: "Apas", lat: 10.3250, lng: 123.8950, group: "North District", color: "#2E7D32" },
  { name: "Banilad", lat: 10.3400, lng: 123.9000, group: "North District", color: "#2E7D32" },
  { name: "Talamban", lat: 10.3600, lng: 123.9100, group: "North District", color: "#2E7D32" },
  { name: "Mabolo", lat: 10.3100, lng: 123.9100, group: "North District", color: "#2E7D32" },
  // South District
  { name: "Guadalupe", lat: 10.2950, lng: 123.8750, group: "South District", color: "#FFA726" },
  { name: "Labangon", lat: 10.2900, lng: 123.8650, group: "South District", color: "#FFA726" },
  { name: "Tisa", lat: 10.2750, lng: 123.8600, group: "South District", color: "#FFA726" },
  { name: "Pardo", lat: 10.2650, lng: 123.8500, group: "South District", color: "#FFA726" },
  { name: "Bulacao", lat: 10.2550, lng: 123.8400, group: "South District", color: "#FFA726" },
  // East District
  { name: "Capitol Site", lat: 10.3150, lng: 123.8950, group: "East District", color: "#42A5F5" },
  { name: "Cogon Ramos", lat: 10.3050, lng: 123.9000, group: "East District", color: "#42A5F5" },
  { name: "Day-as", lat: 10.3200, lng: 123.9150, group: "East District", color: "#42A5F5" },
  { name: "Zapatera", lat: 10.2950, lng: 123.9050, group: "East District", color: "#42A5F5" },
  { name: "Carreta", lat: 10.3100, lng: 123.9200, group: "East District", color: "#42A5F5" },
  // West District
  { name: "Basak San Nicolas", lat: 10.2850, lng: 123.8550, group: "West District", color: "#AB47BC" },
  { name: "Mambaling", lat: 10.2800, lng: 123.8450, group: "West District", color: "#AB47BC" },
  { name: "Duljo-Fatima", lat: 10.2900, lng: 123.8400, group: "West District", color: "#AB47BC" },
  { name: "Pasil", lat: 10.2950, lng: 123.8350, group: "West District", color: "#AB47BC" },
  { name: "Sawang Calero", lat: 10.2850, lng: 123.8300, group: "West District", color: "#AB47BC" },
];

export default function RoutesPage() {
  const { role } = useOutletContext<{ role: Role }>();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"active" | "upcoming" | "completed">("active");
  const [selectedCollector, setSelectedCollector] = useState<string | null>("collector-1");
  const [selectedRide, setSelectedRide] = useState<string | null>(null);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [scanMode, setScanMode] = useState<'verify' | 'track'>('track');
  const [searchQuery, setSearchQuery] = useState("");
  const [mapExpanded, setMapExpanded] = useState(false);
  const [showList, setShowList] = useState(true);

  // Filter rides based on search and selected collector
  const filteredRides = useMemo(() => {
    let rides = allRides;

    if (selectedCollector) {
      rides = rides.filter(r => r.collectorId === selectedCollector);
    }

    if (searchQuery) {
      rides = rides.filter(r =>
        r.barangay.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.collectorName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return rides;
  }, [selectedCollector, searchQuery]);

  const activeRides = filteredRides.filter(r => r.status === "in_progress");
  const upcomingRides = filteredRides.filter(r => r.status === "pending");
  const completedRides = filteredRides.filter(r => r.status === "completed");

  const handleQRScan = async (data: string) => {
    try {
      const scanData = JSON.parse(data);
      toast.success(`Bin ${scanData.binId} scanned successfully!`);
      setShowQRScanner(false);
    } catch (error) {
      toast.error('Invalid QR code. Please scan a valid TrashHoop bin code.');
    }
  };

  const mapHeight = mapExpanded ? "h-[500px]" : "h-[280px]";

  // Enhanced Map with all barangays
  const EnhancedMap = () => (
    <div className={`relative w-full ${mapHeight} bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] rounded-2xl overflow-hidden shadow-inner transition-all duration-300`}>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        <defs>
          <pattern id="grid" width="6" height="6" patternUnits="userSpaceOnUse">
            <path d="M 6 0 L 0 0 0 6" fill="none" stroke="#A5D6A7" strokeWidth="0.2" opacity="0.4" />
          </pattern>
        </defs>

        <rect width="100" height="100" fill="url(#grid)" />

        {/* District Regions */}
        <path d="M 10,20 Q 30,15 40,30 Q 35,45 20,40 Q 5,35 10,20 Z" fill="#2E7D32" opacity="0.15" />
        <path d="M 30,45 Q 50,40 55,60 Q 40,70 25,60 Q 20,50 30,45 Z" fill="#FFA726" opacity="0.15" />
        <path d="M 45,25 Q 65,20 75,35 Q 70,55 50,45 Q 40,35 45,25 Z" fill="#42A5F5" opacity="0.15" />
        <path d="M 15,50 Q 30,55 35,75 Q 20,85 10,70 Q 5,60 15,50 Z" fill="#AB47BC" opacity="0.15" />

        {/* Roads */}
        <line x1="20" y1="0" x2="20" y2="100" stroke="#FFFFFF" strokeWidth="1" opacity="0.6" />
        <line x1="40" y1="0" x2="40" y2="100" stroke="#FFFFFF" strokeWidth="1" opacity="0.6" />
        <line x1="60" y1="0" x2="60" y2="100" stroke="#FFFFFF" strokeWidth="1" opacity="0.6" />
        <line x1="80" y1="0" x2="80" y2="100" stroke="#FFFFFF" strokeWidth="1" opacity="0.6" />
        <line x1="0" y1="25" x2="100" y2="25" stroke="#FFFFFF" strokeWidth="1" opacity="0.6" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="#FFFFFF" strokeWidth="1" opacity="0.6" />
        <line x1="0" y1="75" x2="100" y2="75" stroke="#FFFFFF" strokeWidth="1" opacity="0.6" />

        {/* Location Pins */}
        {mapLocations.map((loc, i) => {
          const xPos = 15 + (i * 11) % 70;
          const yPos = 20 + (i * 7) % 60;

          return (
            <g key={loc.name}>
              <circle cx={xPos} cy={yPos + 1} r="3" fill="#000" opacity="0.15" />
              <path
                d={`M ${xPos},${yPos - 3} Q ${xPos - 3},${yPos - 3} ${xPos - 3},${yPos} L ${xPos},${yPos + 4} L ${xPos + 3},${yPos} Q ${xPos + 3},${yPos - 3} ${xPos},${yPos - 3} Z`}
                fill={loc.color}
                stroke="white"
                strokeWidth="0.8"
              />
              <circle cx={xPos} cy={yPos - 1.5} r="1.5" fill="white" opacity="0.8" />
              <text x={xPos} y={yPos + 9} textAnchor="middle" fontSize="2.5" fill="#1A2E1A" fontWeight="500">
                {loc.name.length > 8 ? loc.name.slice(0, 7) + "…" : loc.name}
              </text>
            </g>
          );
        })}

        {/* Collector Trucks */}
        <g transform="translate(25, 35)">
          <rect x="-4" y="-3" width="8" height="6" rx="1.5" fill="#2E7D32" stroke="white" strokeWidth="0.5" />
          <circle cx="-2" cy="3.5" r="1.5" fill="#333" />
          <circle cx="2" cy="3.5" r="1.5" fill="#333" />
        </g>
        <g transform="translate(55, 60)">
          <rect x="-4" y="-3" width="8" height="6" rx="1.5" fill="#FFA726" stroke="white" strokeWidth="0.5" />
          <circle cx="-2" cy="3.5" r="1.5" fill="#333" />
          <circle cx="2" cy="3.5" r="1.5" fill="#333" />
        </g>
        <g transform="translate(65, 30)">
          <rect x="-4" y="-3" width="8" height="6" rx="1.5" fill="#42A5F5" stroke="white" strokeWidth="0.5" />
          <circle cx="-2" cy="3.5" r="1.5" fill="#333" />
          <circle cx="2" cy="3.5" r="1.5" fill="#333" />
        </g>
        <g transform="translate(30, 70)">
          <rect x="-4" y="-3" width="8" height="6" rx="1.5" fill="#AB47BC" stroke="white" strokeWidth="0.5" />
          <circle cx="-2" cy="3.5" r="1.5" fill="#333" />
          <circle cx="2" cy="3.5" r="1.5" fill="#333" />
        </g>
      </svg>

      {/* Map Controls */}
      <div className="absolute top-3 left-3 flex gap-2">
        <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl text-xs font-medium shadow-sm">
          <span className="text-[#2E7D32]">📍 Cebu City</span>
        </div>
        <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl text-xs shadow-sm">
          <span className="text-[#558B5A]">80 Barangays</span>
        </div>
      </div>

      <button
        onClick={() => setMapExpanded(!mapExpanded)}
        className="absolute top-3 right-3 w-8 h-8 bg-white/95 backdrop-blur-sm rounded-xl shadow-sm flex items-center justify-center text-[#2E7D32] hover:bg-white transition"
      >
        {mapExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </button>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex gap-3">
        {collectors.map(c => (
          <div key={c.id} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: c.color }} />
            <span className="text-[9px] text-[#1A2E1A] font-medium">{c.name.split(' ')[0]}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-[#1A2E1A]">Collections</h1>
          <span className="bg-[#E8F5E9] text-[#2E7D32] text-xs px-2 py-1 rounded-full">
            {new Date().toLocaleDateString("en-PH", { weekday: "long", month: "short", day: "numeric" })}
          </span>
        </div>

        {role === 'collector' && (
          <button
            onClick={() => { setScanMode('track'); setShowQRScanner(true); }}
            className="flex items-center gap-2 bg-[#2E7D32] text-white px-4 py-2.5 rounded-xl hover:bg-[#1B5E20] transition shadow-sm"
          >
            <QrCode className="w-4 h-4" />
            Scan Bin
          </button>
        )}
      </div>

      {/* Collector Selector */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedCollector(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
            selectedCollector === null
              ? "bg-[#2E7D32] text-white"
              : "bg-white border border-[#E8F5E9] text-[#558B5A]"
          }`}
        >
          <Users className="w-3 h-3 inline mr-1" />
          All Collectors (80)
        </button>
        {collectors.map((collector) => (
          <button
            key={collector.id}
            onClick={() => setSelectedCollector(collector.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition flex items-center gap-1 ${
              selectedCollector === collector.id
                ? "text-white shadow-sm"
                : "bg-white border border-[#E8F5E9] text-[#558B5A]"
            }`}
            style={selectedCollector === collector.id ? { background: collector.color } : {}}
          >
            <Truck className="w-3 h-3" />
            {collector.name.split(' ')[0]} ({barangayGroups[collector.group as keyof typeof barangayGroups]?.length || 0})
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A5D6A7]" />
        <input
          type="text"
          placeholder="Search barangay or collector..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8F5E9] bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32] text-sm"
        />
      </div>

      {/* Map View */}
      <EnhancedMap />

      {/* Toggle List Button */}
      <button
        onClick={() => setShowList(!showList)}
        className="flex items-center justify-center gap-1 py-2 text-sm text-[#2E7D32] hover:bg-[#E8F5E9] rounded-lg transition mt-2"
      >
        {showList ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        {showList ? "Hide Collections" : "Show Collections"}
      </button>

      {/* Collection List */}
      {showList && (
        <>
          {/* Stats Summary */}
          <div className="grid grid-cols-3 gap-2 my-3">
            <div className="bg-white rounded-xl p-2.5 shadow-sm border border-[#E8F5E9] text-center">
              <p className="text-[10px] text-[#558B5A]">Active</p>
              <p className="text-lg font-bold text-[#2E7D32]">{activeRides.length}</p>
            </div>
            <div className="bg-white rounded-xl p-2.5 shadow-sm border border-[#E8F5E9] text-center">
              <p className="text-[10px] text-[#558B5A]">Upcoming</p>
              <p className="text-lg font-bold text-[#FFA726]">{upcomingRides.length}</p>
            </div>
            <div className="bg-white rounded-xl p-2.5 shadow-sm border border-[#E8F5E9] text-center">
              <p className="text-[10px] text-[#558B5A]">Completed</p>
              <p className="text-lg font-bold text-[#42A5F5]">{completedRides.length}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-3 border-b border-[#E8F5E9]">
            {["active", "upcoming", "completed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`px-3 py-2 text-xs font-medium capitalize transition border-b-2 ${
                  activeTab === tab
                    ? "border-[#2E7D32] text-[#2E7D32]"
                    : "border-transparent text-[#558B5A] hover:text-[#2E7D32]"
                }`}
              >
                {tab}
                {tab === "active" && activeRides.length > 0 && (
                  <span className="ml-1.5 bg-[#2E7D32] text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {activeRides.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto space-y-2 pb-4 max-h-[300px]">
            {activeTab === "active" && activeRides.map((ride) => (
              <div
                key={ride.id}
                className={`bg-white rounded-xl p-3 shadow-sm border transition-all cursor-pointer ${
                  selectedRide === ride.id ? "border-[#2E7D32] ring-1 ring-[#2E7D32]/20" : "border-[#E8F5E9]"
                }`}
                onClick={() => setSelectedRide(ride.id)}
                style={{ borderLeftWidth: '4px', borderLeftColor: ride.color }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: ride.color + "20" }}>
                      <Package className="w-4 h-4" style={{ color: ride.color }} />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1A2E1A] text-sm">{ride.barangay}</p>
                      <p className="text-[10px] text-[#558B5A] flex items-center gap-1">
                        <User className="w-3 h-3" />{ride.collectorName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium" style={{ color: ride.color }}>{ride.eta}</p>
                    <p className="text-[10px] text-[#A5D6A7]">ETA</p>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="flex justify-between text-[10px] mb-0.5">
                    <span className="text-[#558B5A]">{ride.completed}/{ride.households} households</span>
                    <span className="font-medium text-[#1A2E1A]">{ride.progress}%</span>
                  </div>
                  <div className="w-full bg-[#E8F5E9] rounded-full h-1.5">
                    <div className="h-1.5 rounded-full" style={{ width: `${ride.progress}%`, background: ride.color }} />
                  </div>
                </div>

                {selectedRide === ride.id && (
                  <div className="mt-2 pt-2 border-t border-[#E8F5E9] flex gap-2">
                    <button className="flex-1 py-1.5 bg-[#2E7D32] text-white text-xs rounded-lg hover:bg-[#1B5E20] transition">
                      Mark Complete
                    </button>
                    <button className="flex-1 py-1.5 bg-white border border-[#A5D6A7] text-[#2E7D32] text-xs rounded-lg hover:bg-[#E8F5E9] transition">
                      Contact
                    </button>
                  </div>
                )}
              </div>
            ))}
            {activeTab === "active" && activeRides.length === 0 && (
              <div className="text-center py-8 text-[#558B5A] text-sm">No active collections</div>
            )}

            {activeTab === "upcoming" && upcomingRides.map((ride) => (
              <div key={ride.id} className="bg-white rounded-xl p-3 shadow-sm border border-[#E8F5E9]" style={{ borderLeftWidth: '4px', borderLeftColor: ride.color }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: ride.color + "20" }}>
                      <Clock className="w-4 h-4" style={{ color: ride.color }} />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1A2E1A] text-sm">{ride.barangay}</p>
                      <p className="text-[10px] text-[#558B5A] flex items-center gap-1">
                        <User className="w-3 h-3" />{ride.collectorName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-[#1A2E1A]">{ride.time}</p>
                    <p className="text-[10px] text-[#A5D6A7]">{ride.households} households</p>
                  </div>
                </div>
              </div>
            ))}
            {activeTab === "upcoming" && upcomingRides.length === 0 && (
              <div className="text-center py-8 text-[#558B5A] text-sm">No upcoming collections</div>
            )}

            {activeTab === "completed" && completedRides.map((ride) => (
              <div key={ride.id} className="bg-white rounded-xl p-3 shadow-sm border border-[#E8F5E9] opacity-70" style={{ borderLeftWidth: '4px', borderLeftColor: ride.color }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: ride.color + "20" }}>
                      <CheckCircle2 className="w-4 h-4" style={{ color: ride.color }} />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1A2E1A] text-sm">{ride.barangay}</p>
                      <p className="text-[10px] text-[#558B5A] flex items-center gap-1">
                        <User className="w-3 h-3" />{ride.collectorName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-[#A5D6A7]">{ride.households} households</p>
                    <p className="text-[10px] text-[#2E7D32]">✓ Completed</p>
                  </div>
                </div>
              </div>
            ))}
            {activeTab === "completed" && completedRides.length === 0 && (
              <div className="text-center py-8 text-[#558B5A] text-sm">No completed collections</div>
            )}
          </div>
        </>
      )}

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <QRScanner mode={scanMode} onScan={handleQRScan} onClose={() => setShowQRScanner(false)} />
      )}
    </div>
  );
}