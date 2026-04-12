// src/app/contexts/ScoreContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, updateDoc, setDoc, increment } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from './AuthContext';

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
  addScore: (points: number, reason: string) => Promise<void>;
  deductScore: (points: number, reason: string) => Promise<void>;
  getScoreHistory: () => ScoreAction[];
}

const ScoreContext = createContext<ScoreContextType | undefined>(undefined);

export const SCORE_ACTIONS = {
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

export function ScoreProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [score, setScore] = useState<number>(() => {
    const saved = localStorage.getItem("userWasteScore");
    return saved ? parseInt(saved) : 100;
  });

  const [actions, setActions] = useState<ScoreAction[]>(() => {
    const saved = localStorage.getItem("scoreActions");
    if (saved) {
      try {
        return JSON.parse(saved, (key, value) => {
          if (key === "timestamp") return new Date(value);
          return value;
        });
      } catch {
        return [];
      }
    }
    return [];
  });

  // Sync score with user data from Firestore
  useEffect(() => {
    if (user?.creditScore !== undefined) {
      setScore(user.creditScore);
      localStorage.setItem("userWasteScore", user.creditScore.toString());
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("scoreActions", JSON.stringify(actions));
  }, [actions]);

  const addScore = async (points: number, reason: string) => {
    if (!user?.uid) return;

    const newScore = Math.min(100, score + points);
    setScore(newScore);
    localStorage.setItem("userWasteScore", newScore.toString());

    const action: ScoreAction = {
      id: Date.now().toString(),
      type: "increase",
      points,
      reason,
      timestamp: new Date(),
    };
    setActions(prev => [action, ...prev].slice(0, 50));

    // Update Firestore
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        creditScore: increment(points),
        updatedAt: new Date(),
      });

      // Log transaction
      const transactionRef = doc(db, 'creditTransactions', `${user.uid}_${Date.now()}`);
      await setDoc(transactionRef, {
        userId: user.uid,
        points,
        reason,
        type: 'earned',
        createdAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating score in Firestore:', error);
    }
  };

  const deductScore = async (points: number, reason: string) => {
    if (!user?.uid) return;

    const newScore = Math.max(0, score - points);
    setScore(newScore);
    localStorage.setItem("userWasteScore", newScore.toString());

    const action: ScoreAction = {
      id: Date.now().toString(),
      type: "decrease",
      points,
      reason,
      timestamp: new Date(),
    };
    setActions(prev => [action, ...prev].slice(0, 50));

    // Update Firestore
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        creditScore: increment(-points),
        updatedAt: new Date(),
      });

      // Log transaction
      const transactionRef = doc(db, 'creditTransactions', `${user.uid}_${Date.now()}`);
      await setDoc(transactionRef, {
        userId: user.uid,
        points: -points,
        reason,
        type: 'deducted',
        createdAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating score in Firestore:', error);
    }
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