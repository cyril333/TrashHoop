import { useState } from "react";
import { Search, Leaf, RotateCcw, Trash, Info } from "lucide-react";

const categories = [
  {
    id: "biodegradable",
    label: "Biodegradable",
    icon: "🌿",
    color: "#66BB6A",
    bg: "#E8F5E9",
    border: "#A5D6A7",
    description: "Organic waste that can be broken down naturally by microorganisms.",
    collectionDay: "Tuesday & Friday",
    binColor: "Green bin",
    examples: [
      { name: "Food scraps", icon: "🍎" },
      { name: "Vegetable peels", icon: "🥕" },
      { name: "Fruit waste", icon: "🍌" },
      { name: "Garden waste", icon: "🌱" },
      { name: "Leaves & twigs", icon: "🍂" },
      { name: "Rice / bread", icon: "🍚" },
      { name: "Coffee grounds", icon: "☕" },
      { name: "Eggshells", icon: "🥚" },
    ],
    tips: [
      "Drain excess liquid before disposing",
      "Can be composted at home",
      "Keep separate from recyclables",
    ],
  },
  {
    id: "recyclable",
    label: "Recyclable",
    icon: "♻️",
    color: "#42A5F5",
    bg: "#E3F2FD",
    border: "#90CAF9",
    description: "Materials that can be processed and reused to make new products.",
    collectionDay: "Wednesday & Saturday",
    binColor: "Blue bin",
    examples: [
      { name: "Plastic bottles", icon: "🍶" },
      { name: "Glass jars", icon: "🫙" },
      { name: "Cardboard", icon: "📦" },
      { name: "Newspapers", icon: "📰" },
      { name: "Metal cans", icon: "🥫" },
      { name: "Aluminum foil", icon: "🪙" },
      { name: "Tetra Paks", icon: "🧃" },
      { name: "Clean plastics", icon: "🧴" },
    ],
    tips: [
      "Rinse containers before recycling",
      "Flatten cardboard boxes",
      "Remove caps from bottles",
    ],
  },
  {
    id: "residual",
    label: "Residual / Trash",
    icon: "🗑️",
    color: "#FFA726",
    bg: "#FFF3E0",
    border: "#FFCC80",
    description: "Non-recyclable, non-biodegradable waste that goes to the landfill.",
    collectionDay: "Monday & Thursday",
    binColor: "Black/Gray bin",
    examples: [
      { name: "Styrofoam", icon: "📋" },
      { name: "Plastic bags", icon: "🛍️" },
      { name: "Diapers", icon: "👶" },
      { name: "Broken ceramics", icon: "🏺" },
      { name: "Used tissues", icon: "🧻" },
      { name: "Rubber items", icon: "🪣" },
      { name: "Wrappers", icon: "🍬" },
      { name: "Cigarette butts", icon: "🚬" },
    ],
    tips: [
      "Minimize residual waste by choosing reusable products",
      "Never burn residual waste",
      "Keep in sealed bags to reduce odor",
    ],
  },
  {
    id: "hazardous",
    label: "Hazardous",
    icon: "⚠️",
    color: "#EF5350",
    bg: "#FCE4EC",
    border: "#F48FB1",
    description: "Dangerous materials that require special handling and disposal.",
    collectionDay: "Special schedule (contact barangay)",
    binColor: "Red bin (special)",
    examples: [
      { name: "Batteries", icon: "🔋" },
      { name: "Paint cans", icon: "🪣" },
      { name: "Light bulbs", icon: "💡" },
      { name: "Medicine", icon: "💊" },
      { name: "Pesticides", icon: "🧪" },
      { name: "Motor oil", icon: "🛢️" },
      { name: "Electronics", icon: "📱" },
      { name: "Chemicals", icon: "⚗️" },
    ],
    tips: [
      "NEVER mix with regular waste",
      "Contact barangay for special collection",
      "Store safely until proper disposal",
    ],
  },
];

const quickSearch: Record<string, string> = {
  banana: "biodegradable",
  apple: "biodegradable",
  rice: "biodegradable",
  leaves: "biodegradable",
  plastic: "recyclable",
  bottle: "recyclable",
  glass: "recyclable",
  paper: "recyclable",
  cardboard: "recyclable",
  can: "recyclable",
  styrofoam: "residual",
  diaper: "residual",
  tissue: "residual",
  battery: "hazardous",
  medicine: "hazardous",
  bulb: "hazardous",
  electronic: "hazardous",
};

export default function WasteGuidePage() {
  const [activeCategory, setActiveCategory] = useState("biodegradable");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<string | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) { setSearchResult(null); return; }
    const key = query.toLowerCase().trim();
    const found = Object.keys(quickSearch).find((k) => k.includes(key) || key.includes(k));
    setSearchResult(found ? quickSearch[found] : "not_found");
  };

  const active = categories.find((c) => c.id === activeCategory)!;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Search */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8F5E9]">
        <h3 className="font-semibold text-[#1A2E1A] mb-3 flex items-center gap-2">
          <Search className="w-5 h-5 text-[#2E7D32]" />
          Quick Waste Finder
        </h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A5D6A7]" />
          <input
            type="text"
            placeholder="Type an item (e.g. banana, plastic bottle, battery...)"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#A5D6A7] bg-[#F4FAF4] focus:outline-none focus:ring-2 focus:ring-[#66BB6A] text-[#1A2E1A] placeholder-[#A5D6A7]"
          />
        </div>
        {searchResult && (
          <div className="mt-3">
            {searchResult === "not_found" ? (
              <div className="flex items-center gap-2 p-3 bg-[#FFF3E0] rounded-xl text-[#E65100] text-sm">
                <Info className="w-4 h-4" />
                Item not found in database. Try another term or consult your barangay.
              </div>
            ) : (
              <div
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer"
                style={{ background: categories.find((c) => c.id === searchResult)?.bg }}
                onClick={() => { setActiveCategory(searchResult); setSearchQuery(""); setSearchResult(null); }}
              >
                <span className="text-xl">{categories.find((c) => c.id === searchResult)?.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-[#1A2E1A]">
                    This belongs to: <span style={{ color: categories.find((c) => c.id === searchResult)?.color }}>
                      {categories.find((c) => c.id === searchResult)?.label}
                    </span>
                  </p>
                  <p className="text-xs text-[#558B5A]">Click to view category details</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Category tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
              activeCategory === cat.id
                ? "text-white shadow-md"
                : "bg-white text-[#558B5A] hover:shadow-sm"
            }`}
            style={activeCategory === cat.id ? { background: cat.color, borderColor: cat.color } : { borderColor: cat.border }}
          >
            <span className="text-xl">{cat.icon}</span>
            <span className="text-sm font-medium">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Active category detail */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8F5E9] overflow-hidden">
        {/* Header */}
        <div className="p-6" style={{ background: active.bg, borderBottom: `2px solid ${active.border}` }}>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl" style={{ background: active.color + "30" }}>
              {active.icon}
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: active.color }}>{active.label} Waste</h2>
              <p className="text-[#558B5A] text-sm mt-1 max-w-lg">{active.description}</p>
              <div className="flex flex-wrap gap-3 mt-3">
                <div className="flex items-center gap-1.5 bg-white/70 px-3 py-1 rounded-full text-xs text-[#1A2E1A]">
                  <span>🗓️</span>
                  <span>Collection: <strong>{active.collectionDay}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/70 px-3 py-1 rounded-full text-xs text-[#1A2E1A]">
                  <span>🗑️</span>
                  <span><strong>{active.binColor}</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Examples */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold text-[#1A2E1A] mb-3">Examples of {active.label} Waste</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {active.examples.map((ex) => (
                <div key={ex.name} className="flex flex-col items-center gap-1.5 p-3 rounded-xl" style={{ background: active.bg }}>
                  <span className="text-2xl">{ex.icon}</span>
                  <span className="text-xs text-center text-[#558B5A] font-medium">{ex.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div>
            <h4 className="text-sm font-semibold text-[#1A2E1A] mb-3">Disposal Tips</h4>
            <div className="space-y-2">
              {active.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2 p-3 bg-[#F4FAF4] rounded-xl">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: active.color }}>
                    <span className="text-white text-xs font-bold">{i + 1}</span>
                  </div>
                  <p className="text-sm text-[#558B5A]">{tip}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 rounded-xl flex items-start gap-2" style={{ background: active.bg, border: `1px solid ${active.border}` }}>
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: active.color }} />
              <p className="text-xs text-[#558B5A]">
                When in doubt, contact your barangay office for proper disposal guidance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick reference */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8F5E9]">
        <h3 className="font-semibold text-[#1A2E1A] mb-4">Quick Reference: Collection Schedule</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {categories.map((cat) => (
            <div key={cat.id} className="p-3 rounded-xl" style={{ background: cat.bg, border: `1px solid ${cat.border}` }}>
              <div className="flex items-center gap-2 mb-1">
                <span>{cat.icon}</span>
                <span className="font-medium text-sm" style={{ color: cat.color }}>{cat.label}</span>
              </div>
              <p className="text-xs text-[#558B5A]">{cat.collectionDay}</p>
              <p className="text-xs text-[#558B5A]">{cat.binColor}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
