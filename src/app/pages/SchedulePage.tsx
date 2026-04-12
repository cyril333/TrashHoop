import { useState } from "react";
import { Calendar, Clock, Bell, Trash2, CheckCircle2 } from "lucide-react";

const schedule = [
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

// Mark today (Monday Mar 9 in demo context)
schedule[0].isToday = true;

const reminders = [
  { id: 1, message: "Biodegradable collection tomorrow (Tuesday) – Prepare your green bin!", type: "biodegradable", read: false },
  { id: 2, message: "Recyclable collection on Wednesday for Zone A & C", type: "recyclable", read: false },
  { id: 3, message: "Special hazardous waste collection Saturday. Contact barangay for details.", type: "special", read: true },
];

const reminderColors: Record<string, { bg: string; border: string; dot: string }> = {
  biodegradable: { bg: "#E8F5E9", border: "#A5D6A7", dot: "#66BB6A" },
  recyclable: { bg: "#E3F2FD", border: "#90CAF9", dot: "#42A5F5" },
  special: { bg: "#F3E5F5", border: "#CE93D8", dot: "#AB47BC" },
  residual: { bg: "#FFF3E0", border: "#FFCC80", dot: "#FFA726" },
};

export default function SchedulePage() {
  const [activeDay, setActiveDay] = useState("Monday");
  const [notifList, setNotifList] = useState(reminders);

  const markRead = (id: number) => {
    setNotifList(notifList.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const selectedDay = schedule.find((s) => s.day === activeDay);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Reminders */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8F5E9]">
        <div className="flex items-center gap-2 p-5 border-b border-[#E8F5E9]">
          <Bell className="w-5 h-5 text-[#2E7D32]" />
          <h3 className="font-semibold text-[#1A2E1A]">Collection Reminders</h3>
          {notifList.filter((n) => !n.read).length > 0 && (
            <span className="ml-auto bg-[#D32F2F] text-white text-xs px-2 py-0.5 rounded-full">
              {notifList.filter((n) => !n.read).length} new
            </span>
          )}
        </div>
        <div className="divide-y divide-[#E8F5E9]">
          {notifList.map((notif) => {
            const colors = reminderColors[notif.type];
            return (
              <div
                key={notif.id}
                className={`flex items-start gap-3 p-4 transition ${notif.read ? "opacity-60" : ""}`}
                style={{ background: notif.read ? "transparent" : colors.bg + "40" }}
              >
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: colors.dot }} />
                <p className="flex-1 text-sm text-[#1A2E1A]">{notif.message}</p>
                {!notif.read && (
                  <button
                    onClick={() => markRead(notif.id)}
                    className="text-xs text-[#2E7D32] hover:underline flex-shrink-0 cursor-pointer"
                  >
                    Mark read
                  </button>
                )}
                {notif.read && <CheckCircle2 className="w-4 h-4 text-[#A5D6A7] flex-shrink-0" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly calendar */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8F5E9]">
        <div className="flex items-center gap-2 p-5 border-b border-[#E8F5E9]">
          <Calendar className="w-5 h-5 text-[#2E7D32]" />
          <h3 className="font-semibold text-[#1A2E1A]">Weekly Collection Schedule</h3>
          <span className="ml-auto text-xs text-[#558B5A] bg-[#E8F5E9] px-2 py-1 rounded-full">
            Week of Mar 10–16, 2026
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
    </div>
  );
}
