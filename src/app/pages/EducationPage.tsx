import { useState } from "react";
import { Lightbulb, BookOpen, Award, ChevronDown, ChevronUp, Play, Star } from "lucide-react";

const tips = [
  {
    id: 1,
    category: "Segregation",
    title: "The 3-Bin Method",
    summary: "Use separate bins at home for biodegradable, recyclable, and residual waste.",
    content:
      "Place three distinct bins in your kitchen: GREEN for biodegradable (food scraps, peels), BLUE for recyclable (bottles, cans, paper), and BLACK/GRAY for residual (non-recyclable plastics, diapers). Label them clearly and teach all household members.",
    icon: "🗑️",
    difficulty: "Beginner",
    impact: "High",
    color: "#66BB6A",
  },
  {
    id: 2,
    category: "Composting",
    title: "Start a Backyard Compost",
    summary: "Turn food scraps and garden waste into nutrient-rich compost for your plants.",
    content:
      "Composting is simple: collect fruit peels, vegetable scraps, dried leaves, and coffee grounds in a corner of your yard. Keep it moist and turn it every week. In 4–8 weeks, you'll have free organic fertilizer! Avoid meat, dairy, and oily foods in your compost.",
    icon: "🌱",
    difficulty: "Intermediate",
    impact: "High",
    color: "#388E3C",
  },
  {
    id: 3,
    category: "Recycling",
    title: "Clean Before You Recycle",
    summary: "Rinse containers before placing them in the recyclable bin to avoid contamination.",
    content:
      "Dirty containers contaminate entire batches of recyclables, sending them to landfills instead. Rinse bottles, cans, and jars with a small amount of water before recycling. Flatten cardboard to save space. Remove caps from plastic bottles — they may be a different plastic type.",
    icon: "♻️",
    difficulty: "Beginner",
    impact: "Medium",
    color: "#42A5F5",
  },
  {
    id: 4,
    category: "Reduce",
    title: "Bring a Reusable Bag",
    summary: "Plastic bags are one of the biggest sources of waste — refuse them at the store.",
    content:
      "A single-use plastic bag takes 100–500 years to decompose. Keep a reusable bag (bayong or eco-bag) in your purse or backpack so you always have it when shopping. Buying in bulk also reduces packaging waste significantly.",
    icon: "🛍️",
    difficulty: "Beginner",
    impact: "Medium",
    color: "#FFA726",
  },
  {
    id: 5,
    category: "Hazardous",
    title: "Safe Disposal of Medicines",
    summary: "Never flush expired medicines — they contaminate water sources.",
    content:
      "Expired medicines should NEVER be flushed down the toilet or thrown in regular trash. Mix them with coffee grounds or dirt in a sealed bag before disposal, or return them to pharmacies that have take-back programs. This prevents accidental ingestion and water contamination.",
    icon: "💊",
    difficulty: "Intermediate",
    impact: "High",
    color: "#EF5350",
  },
  {
    id: 6,
    category: "Community",
    title: "Participate in Clean-Up Drives",
    summary: "Join monthly barangay clean-up events to keep your community clean.",
    content:
      "Participating in community clean-ups strengthens neighborhood bonds and keeps public spaces clean. Encourage your neighbors to join. You can also organize mini-cleanups in your street by coordinating with the barangay office. Remember: every piece of trash picked up matters!",
    icon: "🤝",
    difficulty: "Beginner",
    impact: "High",
    color: "#AB47BC",
  },
];

const faqs = [
  {
    q: "Can I mix biodegradable and recyclable waste?",
    a: "No. Mixing waste types contaminates recyclables and prevents proper processing. Always segregate into separate bins.",
  },
  {
    q: "What happens to my recyclable waste after collection?",
    a: "Recyclables are sorted at a materials recovery facility (MRF), then sold to recycling companies that process them into new products.",
  },
  {
    q: "Can I be penalized for improper disposal?",
    a: "Yes. Under RA 9003 (Ecological Solid Waste Management Act), improper disposal can result in fines and community service penalties.",
  },
  {
    q: "Is it okay to burn garden waste?",
    a: "Burning waste (including garden waste) is illegal in most areas and contributes to air pollution. Compost it instead!",
  },
  {
    q: "What is RA 9003?",
    a: "Republic Act 9003 is the Ecological Solid Waste Management Act of 2000, which mandates proper waste segregation, recycling, and composting in the Philippines.",
  },
];

const difficultyColors: Record<string, string> = {
  Beginner: "bg-[#E8F5E9] text-[#2E7D32]",
  Intermediate: "bg-[#FFF3E0] text-[#E65100]",
};

const impactColors: Record<string, string> = {
  High: "bg-[#E8F5E9] text-[#2E7D32]",
  Medium: "bg-[#FFF3E0] text-[#E65100]",
  Low: "bg-[#F5F5F5] text-[#558B5A]",
};

export default function EducationPage() {
  const [expandedTip, setExpandedTip] = useState<number | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [savedTips, setSavedTips] = useState<number[]>([]);

  const categories = ["All", ...Array.from(new Set(tips.map((t) => t.category)))];
  const filtered = activeCategory === "All" ? tips : tips.filter((t) => t.category === activeCategory);

  const toggleSave = (id: number) => {
    setSavedTips((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Hero */}
      <div className="rounded-2xl p-6 text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1B5E20, #388E3C)" }}>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-6 h-6 text-yellow-300" />
            <span className="text-green-200 text-sm font-medium">Education Hub</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Learn to Waste Less</h2>
          <p className="text-green-200 text-sm mt-2 max-w-md">
            Practical tips, guides, and FAQs to help you and your community practice proper waste management.
          </p>
          <div className="flex gap-3 mt-4">
            <div className="text-center bg-white/10 rounded-xl px-4 py-2">
              <p className="text-xl font-bold">{tips.length}</p>
              <p className="text-xs text-green-200">Tips</p>
            </div>
            <div className="text-center bg-white/10 rounded-xl px-4 py-2">
              <p className="text-xl font-bold">{faqs.length}</p>
              <p className="text-xs text-green-200">FAQs</p>
            </div>
            <div className="text-center bg-white/10 rounded-xl px-4 py-2">
              <p className="text-xl font-bold">{savedTips.length}</p>
              <p className="text-xs text-green-200">Saved</p>
            </div>
          </div>
        </div>
        <BookOpen className="absolute right-6 top-6 w-20 h-20 text-white/10" />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${
              activeCategory === cat
                ? "bg-[#2E7D32] text-white"
                : "bg-white text-[#558B5A] border border-[#E8F5E9] hover:border-[#A5D6A7]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tips cards */}
      <div className="space-y-3">
        {filtered.map((tip) => {
          const isExpanded = expandedTip === tip.id;
          const isSaved = savedTips.includes(tip.id);
          return (
            <div key={tip.id} className="bg-white rounded-2xl shadow-sm border border-[#E8F5E9] overflow-hidden">
              <div
                className="flex items-start gap-4 p-4 cursor-pointer hover:bg-[#F4FAF4] transition"
                onClick={() => setExpandedTip(isExpanded ? null : tip.id)}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: tip.color + "20" }}
                >
                  {tip.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs text-[#558B5A] bg-[#F4FAF4] px-2 py-0.5 rounded-full">{tip.category}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyColors[tip.difficulty]}`}>{tip.difficulty}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${impactColors[tip.impact]}`}>
                          {tip.impact} impact
                        </span>
                      </div>
                      <h3 className="font-semibold text-[#1A2E1A]">{tip.title}</h3>
                      <p className="text-sm text-[#558B5A] mt-0.5">{tip.summary}</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleSave(tip.id); }}
                        className={`p-1.5 rounded-lg transition cursor-pointer ${isSaved ? "text-[#FFA726]" : "text-[#A5D6A7] hover:text-[#FFA726]"}`}
                      >
                        <Star className="w-4 h-4" fill={isSaved ? "currentColor" : "none"} />
                      </button>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-[#A5D6A7]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#A5D6A7]" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-[#E8F5E9] p-4" style={{ background: tip.color + "08" }}>
                  <p className="text-sm text-[#1A2E1A] leading-relaxed">{tip.content}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: tip.color }}>
                      <Play className="w-3 h-3 text-white fill-white" />
                    </div>
                    <span className="text-xs text-[#558B5A]">Practice this tip today and earn 10 points!</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8F5E9]">
        <div className="flex items-center gap-2 p-5 border-b border-[#E8F5E9]">
          <BookOpen className="w-5 h-5 text-[#2E7D32]" />
          <h3 className="font-semibold text-[#1A2E1A]">Frequently Asked Questions</h3>
        </div>
        <div className="divide-y divide-[#E8F5E9]">
          {faqs.map((faq, i) => {
            const isOpen = expandedFaq === i;
            return (
              <div key={i}>
                <button
                  onClick={() => setExpandedFaq(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-3 px-5 py-4 hover:bg-[#F4FAF4] transition text-left cursor-pointer"
                >
                  <span className="font-medium text-[#1A2E1A] text-sm">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#A5D6A7] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#A5D6A7] flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 bg-[#E8F5E9]/30">
                    <p className="text-sm text-[#558B5A] leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Reward teaser */}
      <div className="rounded-2xl p-5 border-2 border-dashed border-[#A5D6A7] bg-[#E8F5E9]/50 text-center">
        <Award className="w-10 h-10 text-[#FFA726] mx-auto mb-3" />
        <h3 className="font-semibold text-[#1A2E1A]">Earn Eco Points!</h3>
        <p className="text-sm text-[#558B5A] mt-1 max-w-sm mx-auto">
          Complete weekly waste segregation challenges and earn points redeemable for community incentives.
        </p>
        <button className="mt-4 px-6 py-2.5 bg-[#2E7D32] text-white rounded-xl text-sm hover:bg-[#1B5E20] transition cursor-pointer">
          View Rewards Program
        </button>
      </div>
    </div>
  );
}
