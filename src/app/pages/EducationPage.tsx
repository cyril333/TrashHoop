// src/app/pages/EducationPage.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useScore, SCORE_ACTIONS } from "../contexts/ScoreContext";
import { Lightbulb, BookOpen, Award, ChevronDown, ChevronUp, Play, Star, Loader2, AlertTriangle, X } from "lucide-react";
import { collection, query, getDocs, addDoc, updateDoc, doc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../../lib/firebase";

interface Tip {
  id: string;
  category: string;
  title: string;
  summary: string;
  content: string;
  icon: string;
  difficulty: string;
  impact: string;
  color: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

// Default tips to seed
const defaultTips: Omit<Tip, "id">[] = [
  {
    category: "Segregation",
    title: "The 3-Bin Method",
    summary: "Use separate bins at home for biodegradable, recyclable, and residual waste.",
    content: "Place three distinct bins in your kitchen: GREEN for biodegradable (food scraps, peels), BLUE for recyclable (bottles, cans, paper), and BLACK/GRAY for residual (non-recyclable plastics, diapers). Label them clearly and teach all household members.",
    icon: "🗑️",
    difficulty: "Beginner",
    impact: "High",
    color: "#66BB6A",
  },
  {
    category: "Composting",
    title: "Start a Backyard Compost",
    summary: "Turn food scraps and garden waste into nutrient-rich compost for your plants.",
    content: "Composting is simple: collect fruit peels, vegetable scraps, dried leaves, and coffee grounds in a corner of your yard. Keep it moist and turn it every week. In 4–8 weeks, you'll have free organic fertilizer! Avoid meat, dairy, and oily foods in your compost.",
    icon: "🌱",
    difficulty: "Intermediate",
    impact: "High",
    color: "#388E3C",
  },
  {
    category: "Recycling",
    title: "Clean Before You Recycle",
    summary: "Rinse containers before placing them in the recyclable bin to avoid contamination.",
    content: "Dirty containers contaminate entire batches of recyclables, sending them to landfills instead. Rinse bottles, cans, and jars with a small amount of water before recycling. Flatten cardboard to save space. Remove caps from plastic bottles — they may be a different plastic type.",
    icon: "♻️",
    difficulty: "Beginner",
    impact: "Medium",
    color: "#42A5F5",
  },
  {
    category: "Reduce",
    title: "Bring a Reusable Bag",
    summary: "Plastic bags are one of the biggest sources of waste — refuse them at the store.",
    content: "A single-use plastic bag takes 100–500 years to decompose. Keep a reusable bag (bayong or eco-bag) in your purse or backpack so you always have it when shopping. Buying in bulk also reduces packaging waste significantly.",
    icon: "🛍️",
    difficulty: "Beginner",
    impact: "Medium",
    color: "#FFA726",
  },
  {
    category: "Hazardous",
    title: "Safe Disposal of Medicines",
    summary: "Never flush expired medicines — they contaminate water sources.",
    content: "Expired medicines should NEVER be flushed down the toilet or thrown in regular trash. Mix them with coffee grounds or dirt in a sealed bag before disposal, or return to pharmacies that have take-back programs.",
    icon: "💊",
    difficulty: "Intermediate",
    impact: "High",
    color: "#EF5350",
  },
  {
    category: "Community",
    title: "Participate in Clean-Up Drives",
    summary: "Join monthly barangay clean-up events to keep your community clean.",
    content: "Participating in community clean-ups strengthens neighborhood bonds and keeps public spaces clean. Encourage your neighbors to join. You can also organize mini-cleanups in your street by coordinating with the barangay office.",
    icon: "🤝",
    difficulty: "Beginner",
    impact: "High",
    color: "#AB47BC",
  },
];

const defaultFAQs: Omit<FAQ, "id">[] = [
  {
    question: "Can I mix biodegradable and recyclable waste?",
    answer: "No. Mixing waste types contaminates recyclables and prevents proper processing. Always segregate into separate bins.",
  },
  {
    question: "What happens to my recyclable waste after collection?",
    answer: "Recyclables are sorted at a materials recovery facility (MRF), then sold to recycling companies that process them into new products.",
  },
  {
    question: "Can I be penalized for improper disposal?",
    answer: "Yes. Under RA 9003 (Ecological Solid Waste Management Act), improper disposal can result in fines and community service penalties.",
  },
  {
    question: "Is it okay to burn garden waste?",
    answer: "Burning waste (including garden waste) is illegal in most areas and contributes to air pollution. Compost it instead!",
  },
  {
    question: "What is RA 9003?",
    answer: "Republic Act 9003 is the Ecological Solid Waste Management Act of 2000, which mandates proper waste segregation, recycling, and composting in the Philippines.",
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
  const { user } = useAuth();
  const { addScore } = useScore();
  const [expandedTip, setExpandedTip] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [savedTips, setSavedTips] = useState<string[]>([]);
  const [completedTips, setCompletedTips] = useState<string[]>([]);
  const [tips, setTips] = useState<Tip[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTips();
    fetchFAQs();
    if (user) {
      fetchUserProgress();
    }
  }, [user]);

  const seedData = async () => {
    setIsSeeding(true);
    try {
      // Seed tips
      const tipsRef = collection(db, "educationTips");
      for (const tip of defaultTips) {
        await addDoc(tipsRef, tip);
      }

      // Seed FAQs
      const faqsRef = collection(db, "educationFAQs");
      for (const faq of defaultFAQs) {
        await addDoc(faqsRef, faq);
      }

      await fetchTips();
      await fetchFAQs();
    } catch (err) {
      console.error("Error seeding data:", err);
      setError("Failed to create data. Please try again.");
    } finally {
      setIsSeeding(false);
    }
  };

  const fetchTips = async () => {
    try {
      const tipsRef = collection(db, "educationTips");
      const querySnapshot = await getDocs(query(tipsRef));

      if (querySnapshot.empty) {
        setTips([]);
      } else {
        const fetchedTips: Tip[] = [];
        querySnapshot.forEach((doc) => {
          fetchedTips.push({ id: doc.id, ...doc.data() } as Tip);
        });
        setTips(fetchedTips);
      }
    } catch (err: any) {
      console.error("Error fetching tips:", err);
      if (err.code === "not-found") {
        setError("Education tips not found. Would you like to create default data?");
      } else {
        setError("Failed to load tips. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFAQs = async () => {
    try {
      const faqsRef = collection(db, "educationFAQs");
      const querySnapshot = await getDocs(query(faqsRef));

      if (!querySnapshot.empty) {
        const fetchedFAQs: FAQ[] = [];
        querySnapshot.forEach((doc) => {
          fetchedFAQs.push({ id: doc.id, ...doc.data() } as FAQ);
        });
        setFaqs(fetchedFAQs);
      }
    } catch (err) {
      console.error("Error fetching FAQs:", err);
    }
  };

  const fetchUserProgress = async () => {
    if (!user) return;
    try {
      const progressRef = collection(db, "userEducationProgress");
      const q = query(progressRef);
      const querySnapshot = await getDocs(q);
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.userId === user.uid) {
          setSavedTips(data.savedTips || []);
          setCompletedTips(data.completedTips || []);
        }
      });
    } catch (err) {
      console.error("Error fetching user progress:", err);
    }
  };

  const saveUserProgress = async (saved: string[], completed: string[]) => {
    if (!user) return;
    try {
      const progressRef = collection(db, "userEducationProgress");
      const q = query(progressRef);
      const querySnapshot = await getDocs(q);
      
      let docId: string | null = null;
      querySnapshot.forEach((doc) => {
        if (doc.data().userId === user.uid) {
          docId = doc.id;
        }
      });

      if (docId) {
        await updateDoc(doc(db, "userEducationProgress", docId), {
          savedTips: saved,
          completedTips: completed,
          updatedAt: new Date(),
        });
      } else {
        await addDoc(progressRef, {
          userId: user.uid,
          savedTips: saved,
          completedTips: completed,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    } catch (err) {
      console.error("Error saving progress:", err);
    }
  };

  const toggleSave = async (tipId: string) => {
    const newSaved = savedTips.includes(tipId)
      ? savedTips.filter((s) => s !== tipId)
      : [...savedTips, tipId];
    
    setSavedTips(newSaved);
    await saveUserProgress(newSaved, completedTips);
  };

  const markAsCompleted = async (tipId: string) => {
    if (completedTips.includes(tipId)) return;
    
    const newCompleted = [...completedTips, tipId];
    setCompletedTips(newCompleted);
    await saveUserProgress(savedTips, newCompleted);
    
    // Award points for completing a tip
    if (user) {
      await addScore(SCORE_ACTIONS.EDUCATION_COMPLETED.points, SCORE_ACTIONS.EDUCATION_COMPLETED.reason);
    }
  };

  const categories = ["All", ...Array.from(new Set(tips.map((t) => t.category)))];
  const filtered = activeCategory === "All" ? tips : tips.filter((t) => t.category === activeCategory);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-[#2E7D32] animate-spin" />
      </div>
    );
  }

  // Show empty state with seed button
  if (tips.length === 0 && !error) {
    return (
      <div className="max-w-4xl">
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-[#E8F5E9]">
          <BookOpen className="w-16 h-16 text-[#A5D6A7] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#1A2E1A] mb-2">No Education Tips Found</h3>
          <p className="text-[#558B5A] mb-6">Would you like to create the default education content?</p>
          <button
            onClick={seedData}
            disabled={isSeeding}
            className="px-6 py-3 bg-[#2E7D32] text-white rounded-xl hover:bg-[#1B5E20] transition cursor-pointer disabled:opacity-60 flex items-center gap-2 mx-auto"
          >
            {isSeeding ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating Content...
              </>
            ) : (
              "Create Default Content"
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-700">{error}</p>
            {error.includes("Would you like to create") && (
              <button
                onClick={seedData}
                disabled={isSeeding}
                className="mt-2 px-4 py-2 bg-[#2E7D32] text-white rounded-lg text-sm hover:bg-[#1B5E20] transition cursor-pointer disabled:opacity-60"
              >
                {isSeeding ? "Creating..." : "Create Default Content"}
              </button>
            )}
          </div>
          <button onClick={() => { setError(null); fetchTips(); }} className="ml-auto">
            <X className="w-4 h-4 text-red-500" />
          </button>
        </div>
      )}

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
              <p className="text-xl font-bold">{completedTips.length}</p>
              <p className="text-xs text-green-200">Completed</p>
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
          const isCompleted = completedTips.includes(tip.id);

          return (
            <div key={tip.id} className={`bg-white rounded-2xl shadow-sm border transition ${isCompleted ? "border-[#2E7D32] bg-[#E8F5E9]/30" : "border-[#E8F5E9]"}`}>
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
                        {isCompleted && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[#2E7D32] text-white">Completed ✓</span>
                        )}
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
                  {!isCompleted && (
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); markAsCompleted(tip.id); }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-white transition cursor-pointer"
                        style={{ background: tip.color }}
                      >
                        <Play className="w-3 h-3 fill-white" />
                        Mark as Completed (+10 pts)
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* FAQ */}
      {faqs.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8F5E9]">
          <div className="flex items-center gap-2 p-5 border-b border-[#E8F5E9]">
            <BookOpen className="w-5 h-5 text-[#2E7D32]" />
            <h3 className="font-semibold text-[#1A2E1A]">Frequently Asked Questions</h3>
          </div>
          <div className="divide-y divide-[#E8F5E9]">
            {faqs.map((faq) => {
              const isOpen = expandedFaq === faq.id;
              return (
                <div key={faq.id}>
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                    className="w-full flex items-center justify-between gap-3 px-5 py-4 hover:bg-[#F4FAF4] transition text-left cursor-pointer"
                  >
                    <span className="font-medium text-[#1A2E1A] text-sm">{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#A5D6A7] flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#A5D6A7] flex-shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 bg-[#E8F5E9]/30">
                      <p className="text-sm text-[#558B5A] leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reward teaser */}
      <div className="rounded-2xl p-5 border-2 border-dashed border-[#A5D6A7] bg-[#E8F5E9]/50 text-center">
        <Award className="w-10 h-10 text-[#FFA726] mx-auto mb-3" />
        <h3 className="font-semibold text-[#1A2E1A]">Earn Eco Points!</h3>
        <p className="text-sm text-[#558B5A] mt-1 max-w-sm mx-auto">
          Complete tips above to earn points! You've earned {completedTips.length * 10} points so far.
        </p>
        <button className="mt-4 px-6 py-2.5 bg-[#2E7D32] text-white rounded-xl text-sm hover:bg-[#1B5E20] transition cursor-pointer">
          View Rewards Program
        </button>
      </div>
    </div>
  );
}