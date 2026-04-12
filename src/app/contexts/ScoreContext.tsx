import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface ScoreAction {
  id: string;
  type: "increase" | "decrease";
  points: number;
  reason: string;
  timestamp: Date;
}

interface ScoreContextType {
  score: number;
  actions: ScoreAction[];
  addScore: (points: number, reason: string) => void;
  deductScore: (points: number, reason: string) => void;
  getScoreHistory: () => ScoreAction[];
}

const ScoreContext = createContext<ScoreContextType | undefined>(undefined);

const SCORE_ACTIONS = {
  // Positive actions
  REPORT_SUBMITTED: { points: 5, reason: "Reported improper disposal" },
  PROPER_SEGREGATION: { points: 10, reason: "Proper waste segregation" },
  EDUCATION_COMPLETED: { points: 8, reason: "Completed education module" },
  SCHEDULE_COMPLIANCE: { points: 3, reason: "Followed collection schedule" },
  COMMUNITY_CLEANUP: { points: 15, reason: "Participated in cleanup drive" },
  
  // Negative actions
  MIXED_WASTE: { points: 15, reason: "Mixed waste violation" },
  ILLEGAL_DUMPING: { points: 25, reason: "Illegal dumping" },
  LITTERING: { points: 10, reason: "Littering violation" },
  BURNING_WASTE: { points: 30, reason: "Burning waste violation" },
  IMPROPER_SEGREGATION: { points: 12, reason: "Improper segregation" },
  OUT_OF_SCHEDULE: { points: 8, reason: "Out-of-schedule disposal" },
  MISSED_COLLECTION: { points: 5, reason: "Missed collection schedule" },
};

export { SCORE_ACTIONS };

export function ScoreProvider({ children }: { children: ReactNode }) {
  const [score, setScore] = useState<number>(() => {
    const saved = localStorage.getItem("userWasteScore");
    return saved ? parseInt(saved) : 100; // Start at 100 (perfect score)
  });
  
  const [actions, setActions] = useState<ScoreAction[]>(() => {
    const saved = localStorage.getItem("scoreActions");
    return saved ? JSON.parse(saved, (key, value) => {
      if (key === "timestamp") return new Date(value);
      return value;
    }) : [];
  });

  useEffect(() => {
    localStorage.setItem("userWasteScore", score.toString());
  }, [score]);

  useEffect(() => {
    localStorage.setItem("scoreActions", JSON.stringify(actions));
  }, [actions]);

  const addScore = (points: number, reason: string) => {
    const newScore = Math.min(100, score + points); // Cap at 100
    setScore(newScore);
    
    const action: ScoreAction = {
      id: Date.now().toString(),
      type: "increase",
      points,
      reason,
      timestamp: new Date(),
    };
    setActions(prev => [action, ...prev].slice(0, 50)); // Keep last 50 actions
  };

  const deductScore = (points: number, reason: string) => {
    const newScore = Math.max(0, score - points); // Floor at 0
    setScore(newScore);
    
    const action: ScoreAction = {
      id: Date.now().toString(),
      type: "decrease",
      points,
      reason,
      timestamp: new Date(),
    };
    setActions(prev => [action, ...prev].slice(0, 50)); // Keep last 50 actions
  };

  const getScoreHistory = () => actions;

  return (
    <ScoreContext.Provider value={{ score, actions, addScore, deductScore, getScoreHistory }}>
      {children}
    </ScoreContext.Provider>
  );
}

export function useScore() {
  const context = useContext(ScoreContext);
  if (context === undefined) {
    throw new Error("useScore must be used within a ScoreProvider");
  }
  return context;
}
