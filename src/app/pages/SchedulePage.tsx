// src/app/pages/SchedulePage.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Calendar, Clock, Bell, Trash2, CheckCircle2, Loader2, AlertTriangle, X } from "lucide-react";
import { collection, query, orderBy, getDocs, updateDoc, doc, addDoc, where } from "firebase/firestore";
import { db } from "../../lib/firebase";

interface Collection {
  id?: string;
  type: string;
  time: string;
  zone: string;
  color: string;
  icon: string;
}

interface ScheduleDay {
  id?: string;
  day: string;
  date: string;
  collections: Collection[];
  isToday: boolean;
}

interface Reminder {
  id: string;
  message: string;
  type: string;
  read: boolean;
  userId?: string;
  createdAt: Date;
}

const reminderColors: Record<string, { bg: string; border: string; dot: string }> = {
  biodegradable: { bg: "#E8F5E9", border: "#A5D6A7", dot: "#66BB6A" },
  recyclable: { bg: "#E3F2FD", border: "#90CAF9", dot: "#42A5F5" },
  special: { bg: "#F3E5F5", border: "#CE93D8", dot: "#AB47BC" },
  residual: { bg: "#FFF3E0", border: "#FFCC80", dot: "#FFA726" },
};

const wasteTypeColors: Record<string, { color: string; icon: string }> = {
  "Biodegradable": { color: "#66BB6A", icon: "🌿" },
  "Recyclable": { color: "#42A5F5", icon: "♻️" },
  "Residual": { color: "#FFA726", icon: "🗑️" },
  "Special": { color: "#AB47BC", icon: "⚠️" },
  "Hazardous": { color: "#EF5350", icon: "⚠️" },
};

// Default schedule to seed if collection is empty
const defaultSchedule: ScheduleDay[] = [
  {
    day: "Monday",
    date: "Mar 10",
    collections: [{ type: "Residual", time: "6:00–8:00 AM", zone: "Zone A & B", color: "#FFA726", icon: "🗑️" }],
    isToday: false,
  },
  {
    day: "Tuesday",
    date: "Mar 11",
    collections: [{ type: "Biodegradable", time: "6:00–8:00 AM", zone: "All Zones", color: "#66BB6A", icon: "🌿" }],
    isToday: false,
  },
  {
    day: "Wednesday",
    date: "Mar 12",
    collections: [
      { type: "Recyclable", time: "6:00–9:00 AM", zone: "Zone A & C", color: "#42A5F5", icon: "♻️" },
      { type: "Residual", time: "9:00–11:00 AM", zone: "Zone C & D", color: "#FFA726", icon: "🗑️" },
    ],
    isToday: false,
  },
  {
    day: "Thursday",
    date: "Mar 13",
    collections: [
      { type: "Biodegradable", time: "6:00–8:00 AM", zone: "Zone B & D", color: "#66BB6A", icon: "🌿" },
      { type: "Residual", time: "8:00–10:00 AM", zone: "Zone E", color: "#FFA726", icon: "🗑️" },
    ],
    isToday: false,
  },
  {
    day: "Friday",
    date: "Mar 14",
    collections: [
      { type: "Biodegradable", time: "6:00–8:00 AM", zone: "All Zones", color: "#66BB6A", icon: "🌿" },
    ],
    isToday: false,
  },
  {
    day: "Saturday",
    date: "Mar 15",
    collections: [
      { type: "Recyclable", time: "7:00–10:00 AM", zone: "Zone B, D & E", color: "#42A5F5", icon: "♻️" },
      { type: "Special", time: "10:00 AM–12:00 PM", zone: "All Zones", color: "#AB47BC", icon: "⚠️" },
    ],
    isToday: false,
  },
  {
    day: "Sunday",
    date: "Mar 16",
    collections: [],
    isToday: false,
  },
];

// Mark today based on current date
const today = new Date();
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function SchedulePage() {
  const { user } = useAuth();
  const [activeDay, setActiveDay] = useState(dayNames[today.getDay()]);
  const [schedule, setSchedule] = useState<ScheduleDay[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSchedule();
    if (user) {
      fetchReminders();
    }
  }, [user]);

  const seedSchedule = async () => {
    setIsSeeding(true);
    try {
      const scheduleRef = collection(db, "schedules");
      
      // Update today flag based on actual current day
      const currentDayName = dayNames[today.getDay()];
      const updatedSchedule = defaultSchedule.map(day => ({
        ...day,
        isToday: day.day === currentDayName,
      }));
      
      for (const day of updatedSchedule) {
        await addDoc(scheduleRef, {
          ...day,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      
      await fetchSchedule();
    } catch (err) {
      console.error("Error seeding schedule:", err);
      setError("Failed to create schedule. Please try again.");
    } finally {
      setIsSeeding(false);
    }
  };

  const fetchSchedule = async () => {
    try {
      const scheduleRef = collection(db, "schedules");
      const q = query(scheduleRef);
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setSchedule([]);
      } else {
        const fetchedSchedule: ScheduleDay[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          
          // Check if this day is today
          const isToday = data.day === dayNames[today.getDay()];
          
          fetchedSchedule.push({
            id: doc.id,
            day: data.day,
            date: data.date,
            collections: data.collections || [],
            isToday: isToday,
          });
        });
        
        // Sort by day order
        const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        fetchedSchedule.sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));
        
        setSchedule(fetchedSchedule);
      }
    } catch (err: any) {
      console.error("Error fetching schedule:", err);
      if (err.code === "not-found" || err.message?.includes("Missing or insufficient permissions")) {
        setError("Schedule collection not found. Would you like to create default schedule?");
      } else {
        setError("Failed to load schedule. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReminders = async () => {
    if (!user) return;
    
    try {
      const remindersRef = collection(db, "reminders");
      const q = query(
        remindersRef,
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);

      const fetchedReminders: Reminder[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedReminders.push({
          id: doc.id,
          message: data.message,
          type: data.type,
          read: data.read || false,
          userId: data.userId,
          createdAt: data.createdAt?.toDate() || new Date(),
        });
      });

      setReminders(fetchedReminders);
    } catch (err: any) {
      console.error("Error fetching reminders:", err);
      // If collection doesn't exist, just use empty array
      if (err.code === "not-found") {
        setReminders([]);
      }
    }
  };

  const markReminderRead = async (reminderId: string) => {
    try {
      const reminderRef = doc(db, "reminders", reminderId);
      await updateDoc(reminderRef, { read: true });
      
      setReminders(prev => 
        prev.map(r => r.id === reminderId ? { ...r, read: true } : r)
      );
    } catch (err) {
      console.error("Error marking reminder as read:", err);
    }
  };

  const selectedDay = schedule.find((s) => s.day === activeDay);
  const unreadCount = reminders.filter((n) => !n.read).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-[#2E7D32] animate-spin" />
      </div>
    );
  }

  // Show empty state with seed button
  if (schedule.length === 0 && !error) {
    return (
      <div className="max-w-4xl">
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-[#E8F5E9]">
          <Calendar className="w-16 h-16 text-[#A5D6A7] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#1A2E1A] mb-2">No Schedule Found</h3>
          <p className="text-[#558B5A] mb-6">Would you like to create the default collection schedule?</p>
          <button
            onClick={seedSchedule}
            disabled={isSeeding}
            className="px-6 py-3 bg-[#2E7D32] text-white rounded-xl hover:bg-[#1B5E20] transition cursor-pointer disabled:opacity-60 flex items-center gap-2 mx-auto"
          >
            {isSeeding ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating Schedule...
              </>
            ) : (
              "Create Default Schedule"
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
                onClick={seedSchedule}
                disabled={isSeeding}
                className="mt-2 px-4 py-2 bg-[#2E7D32] text-white rounded-lg text-sm hover:bg-[#1B5E20] transition cursor-pointer disabled:opacity-60"
              >
                {isSeeding ? "Creating..." : "Create Default Schedule"}
              </button>
            )}
          </div>
          <button onClick={() => { setError(null); fetchSchedule(); }} className="ml-auto">
            <X className="w-4 h-4 text-red-500" />
          </button>
        </div>
      )}

      {/* Reminders */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8F5E9]">
        <div className="flex items-center gap-2 p-5 border-b border-[#E8F5E9]">
          <Bell className="w-5 h-5 text-[#2E7D32]" />
          <h3 className="font-semibold text-[#1A2E1A]">Collection Reminders</h3>
          {unreadCount > 0 && (
            <span className="ml-auto bg-[#D32F2F] text-white text-xs px-2 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="divide-y divide-[#E8F5E9]">
          {reminders.length === 0 ? (
            <div className="p-8 text-center text-[#558B5A] text-sm">
              <Bell className="w-8 h-8 text-[#A5D6A7] mx-auto mb-2" />
              No reminders at this time.
            </div>
          ) : (
            reminders.map((reminder) => {
              const colors = reminderColors[reminder.type] || reminderColors.biodegradable;
              return (
                <div
                  key={reminder.id}
                  className={`flex items-start gap-3 p-4 transition ${reminder.read ? "opacity-60" : ""}`}
                  style={{ background: reminder.read ? "transparent" : colors.bg + "40" }}
                >
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: colors.dot }} />
                  <p className="flex-1 text-sm text-[#1A2E1A]">{reminder.message}</p>
                  {!reminder.read && (
                    <button
                      onClick={() => markReminderRead(reminder.id)}
                      className="text-xs text-[#2E7D32] hover:underline flex-shrink-0 cursor-pointer"
                    >
                      Mark read
                    </button>
                  )}
                  {reminder.read && <CheckCircle2 className="w-4 h-4 text-[#A5D6A7] flex-shrink-0" />}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Weekly calendar */}
      {schedule.length > 0 && (
        <>
          <div className="bg-white rounded-2xl shadow-sm border border-[#E8F5E9]">
            <div className="flex items-center gap-2 p-5 border-b border-[#E8F5E9]">
              <Calendar className="w-5 h-5 text-[#2E7D32]" />
              <h3 className="font-semibold text-[#1A2E1A]">Weekly Collection Schedule</h3>
              <span className="ml-auto text-xs text-[#558B5A] bg-[#E8F5E9] px-2 py-1 rounded-full">
                Week of {schedule[0]?.date}–{schedule[schedule.length - 1]?.date}, 2026
              </span>
            </div>

            {/* Day tabs */}
            <div className="grid grid-cols-7 border-b border-[#E8F5E9]">
              {schedule.map((day) => (
                <button
                  key={day.day}
                  onClick={() => setActiveDay(day.day)}
                  className={`py-3 flex flex-col items-center gap-1 transition cursor-pointer ${
                    activeDay === day.day
                      ? "bg-[#2E7D32] text-white"
                      : day.isToday
                      ? "bg-[#E8F5E9] text-[#2E7D32]"
                      : "hover:bg-[#F4FAF4] text-[#558B5A]"
                  }`}
                >
                  <span className="text-xs font-medium">{day.day.slice(0, 3)}</span>
                  <span className="text-sm font-bold">{day.date.split(" ")[1]}</span>
                  {day.collections.length > 0 && (
                    <div className="flex gap-0.5">
                      {day.collections.slice(0, 3).map((c, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: activeDay === day.day ? "white" : c.color }} />
                      ))}
                    </div>
                  )}
                  {day.isToday && activeDay !== day.day && (
                    <span className="text-[8px] bg-[#2E7D32] text-white px-1 rounded-full">Today</span>
                  )}
                </button>
              ))}
            </div>

            {/* Day detail */}
            <div className="p-5">
              {selectedDay && selectedDay.collections.length === 0 ? (
                <div className="text-center py-8">
                  <span className="text-4xl">😴</span>
                  <p className="text-[#558B5A] mt-3">No collections scheduled for {selectedDay.day}.</p>
                  <p className="text-xs text-[#A5D6A7] mt-1">Enjoy your rest day!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <h4 className="font-semibold text-[#1A2E1A]">
                    {selectedDay?.day}, {selectedDay?.date}
                    {selectedDay?.isToday && (
                      <span className="ml-2 text-xs bg-[#2E7D32] text-white px-2 py-0.5 rounded-full">Today</span>
                    )}
                  </h4>
                  {selectedDay?.collections.map((col, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 rounded-xl border"
                      style={{ background: col.color + "15", borderColor: col.color + "40" }}
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                        style={{ background: col.color + "25" }}
                      >
                        {col.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-[#1A2E1A]">{col.type} Waste Collection</p>
                        <div className="flex flex-wrap gap-3 mt-1 text-xs text-[#558B5A]">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{col.time}</span>
                          <span className="flex items-center gap-1"><Trash2 className="w-3 h-3" />{col.zone}</span>
                        </div>
                      </div>
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ background: col.color }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Monthly overview */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8F5E9]">
            <h3 className="font-semibold text-[#1A2E1A] mb-4">Collection Frequency (Monthly)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { type: "Biodegradable", freq: "8–10x/month", color: "#66BB6A", bg: "#E8F5E9", icon: "🌿" },
                { type: "Recyclable", freq: "4–6x/month", color: "#42A5F5", bg: "#E3F2FD", icon: "♻️" },
                { type: "Residual", freq: "6–8x/month", color: "#FFA726", bg: "#FFF3E0", icon: "🗑️" },
                { type: "Hazardous", freq: "By request", color: "#EF5350", bg: "#FCE4EC", icon: "⚠️" },
              ].map((item) => (
                <div key={item.type} className="p-3 rounded-xl text-center" style={{ background: item.bg }}>
                  <span className="text-2xl">{item.icon}</span>
                  <p className="font-semibold text-sm mt-2" style={{ color: item.color }}>{item.type}</p>
                  <p className="text-xs text-[#558B5A] mt-0.5">{item.freq}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}