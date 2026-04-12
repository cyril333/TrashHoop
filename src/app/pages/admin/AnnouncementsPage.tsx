// src/app/pages/admin/AnnouncementsPage.tsx
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { createAnnouncement } from '../../../services/notification.service';
import { Megaphone, Send, Loader2, Users, MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { CEBU_CITY_BARANGAYS } from '../../../lib/constants';

export default function AnnouncementsPage() {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    body: '',
    type: 'info' as 'event' | 'schedule' | 'info' | 'reminder' | 'urgent',
    urgent: false,
    targetRoles: [] as string[],
    targetBarangay: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in');
      return;
    }

    if (!form.title.trim() || !form.body.trim()) {
      toast.error('Title and message are required');
      return;
    }

    setIsSubmitting(true);
    try {
      // Build announcement data - only include targetBarangay if it has a value
      const announcementData: any = {
        title: form.title.trim(),
        body: form.body.trim(),
        type: form.type,
        urgent: form.urgent,
        createdBy: user.uid,
        createdByName: user.fullName || user.email || 'Admin',
      };

      // Only add targetRoles if selected
      if (form.targetRoles.length > 0) {
        announcementData.targetRoles = form.targetRoles;
      }

      // Only add targetBarangay if a specific barangay is selected (not empty string)
      if (form.targetBarangay && form.targetBarangay.trim() !== '') {
        announcementData.targetBarangay = form.targetBarangay.trim();
      }

      console.log('📢 Sending announcement:', announcementData);

      const announcementId = await createAnnouncement(announcementData);

      console.log('✅ Announcement created with ID:', announcementId);
      toast.success('Announcement sent successfully!');

      // Reset form
      setForm({
        title: '',
        body: '',
        type: 'info',
        urgent: false,
        targetRoles: [],
        targetBarangay: '',
      });
    } catch (error: any) {
      console.error('❌ Error creating announcement:', error);
      toast.error(error.message || 'Failed to send announcement. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleRole = (role: string) => {
    setForm(prev => ({
      ...prev,
      targetRoles: prev.targetRoles.includes(role)
        ? prev.targetRoles.filter(r => r !== role)
        : [...prev.targetRoles, role]
    }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8F5E9] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#E8F5E9] rounded-xl flex items-center justify-center">
            <Megaphone className="w-5 h-5 text-[#2E7D32]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1A2E1A]">Create Announcement</h2>
            <p className="text-sm text-[#558B5A]">Send real-time notifications to residents, collectors, or all users</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="text-sm font-medium text-[#1A2E1A] mb-1.5 block">Title *</label>
            <input
              type="text"
              required
              placeholder="e.g., Schedule Change Notice"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[#A5D6A7] bg-[#F4FAF4] focus:outline-none focus:ring-2 focus:ring-[#66BB6A] text-[#1A2E1A] placeholder-[#A5D6A7]"
            />
          </div>

          {/* Message */}
          <div>
            <label className="text-sm font-medium text-[#1A2E1A] mb-1.5 block">Message *</label>
            <textarea
              required
              rows={5}
              placeholder="Enter your announcement message..."
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[#A5D6A7] bg-[#F4FAF4] focus:outline-none focus:ring-2 focus:ring-[#66BB6A] text-[#1A2E1A] placeholder-[#A5D6A7] resize-none"
            />
          </div>

          {/* Type and Urgency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-[#1A2E1A] mb-1.5 block">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                className="w-full px-4 py-3 rounded-xl border border-[#A5D6A7] bg-[#F4FAF4] focus:outline-none focus:ring-2 focus:ring-[#66BB6A] text-[#1A2E1A]"
              >
                <option value="info">📋 Information</option>
                <option value="event">🎉 Event</option>
                <option value="schedule">📅 Schedule</option>
                <option value="reminder">🔔 Reminder</option>
                <option value="urgent">🚨 Urgent</option>
              </select>
            </div>
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.urgent}
                  onChange={(e) => setForm({ ...form, urgent: e.target.checked })}
                  className="w-4 h-4 accent-[#D32F2F] rounded"
                />
                <span className="text-sm text-[#1A2E1A] flex items-center gap-1">
                  <AlertCircle className="w-4 h-4 text-[#D32F2F]" />
                  Mark as Urgent
                </span>
              </label>
            </div>
          </div>

          {/* Target Roles */}
          <div>
            <label className="text-sm font-medium text-[#1A2E1A] mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Send to (leave empty for all users)
            </label>
            <div className="flex gap-3">
              {['resident', 'collector', 'admin'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => toggleRole(r)}
                  className={`px-4 py-2 rounded-xl text-sm capitalize transition ${
                    form.targetRoles.includes(r)
                      ? 'bg-[#2E7D32] text-white shadow-sm'
                      : 'bg-white border border-[#A5D6A7] text-[#558B5A] hover:bg-[#F4FAF4]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            {form.targetRoles.length > 0 && (
              <p className="text-xs text-[#A5D6A7] mt-2">
                Only {form.targetRoles.join(' and ')} will receive this announcement
              </p>
            )}
          </div>

          {/* Target Barangay */}
          <div>
            <label className="text-sm font-medium text-[#1A2E1A] mb-1.5 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Specific Barangay (optional)
            </label>
            <select
              value={form.targetBarangay}
              onChange={(e) => setForm({ ...form, targetBarangay: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[#A5D6A7] bg-[#F4FAF4] focus:outline-none focus:ring-2 focus:ring-[#66BB6A] text-[#1A2E1A]"
            >
              <option value="">All Barangays</option>
              {CEBU_CITY_BARANGAYS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            {form.targetBarangay && form.targetBarangay.trim() !== '' && (
              <p className="text-xs text-[#A5D6A7] mt-2">
                Only users in {form.targetBarangay} will receive this announcement
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-[#2E7D32] text-white font-semibold hover:bg-[#1B5E20] transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending Announcement...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Announcement
              </>
            )}
          </button>
        </form>
      </div>

      {/* Help text */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-5">
        <h3 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          About Announcements
        </h3>
        <ul className="text-sm text-blue-700 space-y-1.5">
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            Announcements appear in real-time for all targeted users
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-500">•</span>
            Urgent announcements show a special orange toast notification
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">•</span>
            Users receive in-app notifications instantly
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500">•</span>
            You can target specific roles or barangays for focused communication
          </li>
        </ul>
      </div>
    </div>
  );
}