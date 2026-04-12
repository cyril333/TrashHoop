// src/app/pages/UsersPage.tsx
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { Users, Plus, Search, Edit2, Trash2, ShieldAlert, CheckCircle2, X, User, Mail, Phone, Lock, Loader2, AlertTriangle } from "lucide-react";
import { collection, query, getDocs, addDoc, updateDoc, doc, deleteDoc, where } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../../lib/firebase";

type Role = "resident" | "admin" | "collector";

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  address: string;
  status: string;
  violations: number;
  uid?: string;
}

const roleColors: Record<string, string> = {
  resident: "bg-[#E8F5E9] text-[#2E7D32]",
  collector: "bg-[#E3F2FD] text-[#1565C0]",
  admin: "bg-[#FFF3E0] text-[#E65100]",
};

const statusColors: Record<string, string> = {
  Active: "bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]",
  Suspended: "bg-[#FCE4EC] text-[#C62828] border-[#F48FB1]",
};

export default function UsersPage() {
  const { role } = useOutletContext<{ role: Role }>();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState<UserData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserData | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "resident", address: "", password: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (role === "admin") {
      fetchUsers();
    } else {
      setIsLoading(false);
    }
  }, [role]);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(query(usersRef));

      const fetchedUsers: UserData[] = [];

      // Also get violation counts for each user
      const violationsRef = collection(db, "violations");
      const violationsSnapshot = await getDocs(query(violationsRef));

      // Count violations per user
      const violationCounts: Record<string, number> = {};
      violationsSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.userId) {
          violationCounts[data.userId] = (violationCounts[data.userId] || 0) + 1;
        }
      });

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedUsers.push({
          id: doc.id,
          uid: doc.id,
          name: data.fullName || data.name || "Unknown",
          email: data.email || "",
          phone: data.phone || "",
          role: data.role || "resident",
          address: data.address || data.barangay || "",
          status: data.status || "Active",
          violations: violationCounts[doc.id] || 0,
        });
      });

      setUsers(fetchedUsers);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "All" || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editUser) {
        // Update existing user
        const userRef = doc(db, "users", editUser.id);
        await updateDoc(userRef, {
          fullName: form.name,
          name: form.name,
          phone: form.phone,
          role: form.role,
          address: form.address,
          updatedAt: new Date(),
        });
      } else {
        // Create new user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password || "defaultPass123");
        const { user: fbUser } = userCredential;

        // Create user document in Firestore
        const userData = {
          uid: fbUser.uid,
          fullName: form.name,
          name: form.name,
          email: form.email,
          phone: form.phone,
          role: form.role,
          address: form.address,
          barangay: form.address,
          status: "Active",
          creditScore: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await addDoc(collection(db, "users"), userData);
      }

      await fetchUsers();
      setShowForm(false);
      setEditUser(null);
      setForm({ name: "", email: "", phone: "", role: "resident", address: "", password: "" });
    } catch (err: any) {
      console.error("Error saving user:", err);
      if (err.code === "auth/email-already-in-use") {
        alert("This email is already registered.");
      } else {
        alert("Failed to save user. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEdit = (user: UserData) => {
    setEditUser(user);
    setForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      address: user.address,
      password: ""
    });
    setShowForm(true);
  };

  const deleteUser = async () => {
    if (!deleteTarget) return;

    try {
      const userRef = doc(db, "users", deleteTarget.id);
      await updateDoc(userRef, {
        status: "Deleted",
        deletedAt: new Date(),
      });

      setUsers(users.filter((u) => u.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user. Please try again.");
    }
  };

  const toggleStatus = async (userId: string, currentStatus: string) => {
    if (role !== "admin") return;

    try {
      const userRef = doc(db, "users", userId);
      const newStatus = currentStatus === "Active" ? "Suspended" : "Active";
      await updateDoc(userRef, {
        status: newStatus,
        updatedAt: new Date(),
      });

      setUsers(users.map((u) =>
        u.id === userId ? { ...u, status: newStatus } : u
      ));
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update user status.");
    }
  };

  const counts = {
    all: users.length,
    resident: users.filter((u) => u.role === "resident").length,
    collector: users.filter((u) => u.role === "collector").length,
    admin: users.filter((u) => u.role === "admin").length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-[#2E7D32] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
          <button onClick={() => { setError(null); fetchUsers(); }} className="ml-auto">
            <X className="w-4 h-4 text-red-500" />
          </button>
        </div>
      )}

      {/* Read-only banner for non-admins */}
      {role !== "admin" && (
        <div className="flex items-center gap-3 px-4 py-3 bg-[#E3F2FD] border border-[#90CAF9] rounded-xl text-[#1565C0] text-sm">
          <Lock className="w-4 h-4 flex-shrink-0" />
          <span>You are viewing the user list in <strong>read-only mode</strong>. Only Barangay Admins can add, edit, or remove users.</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: counts.all, color: "bg-[#E8F5E9] text-[#2E7D32]" },
          { label: "Residents", value: counts.resident, color: "bg-[#E8F5E9] text-[#2E7D32]" },
          { label: "Collectors", value: counts.collector, color: "bg-[#E3F2FD] text-[#1565C0]" },
          { label: "Admins", value: counts.admin, color: "bg-[#FFF3E0] text-[#E65100]" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-[#E8F5E9]">
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
              <Users className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-[#1A2E1A]">{s.value}</p>
            <p className="text-[#558B5A] text-sm">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search & filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A5D6A7]" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#A5D6A7] bg-white focus:outline-none focus:ring-2 focus:ring-[#66BB6A] text-[#1A2E1A] placeholder-[#A5D6A7]"
          />
        </div>
        <div className="flex gap-2">
          {["All", "resident", "collector", "admin"].map((r) => (
            <button
              key={r}
              onClick={() => setFilterRole(r)}
              className={`px-3 py-2 rounded-xl text-sm capitalize transition cursor-pointer ${
                filterRole === r ? "bg-[#2E7D32] text-white" : "bg-white border border-[#E8F5E9] text-[#558B5A] hover:border-[#A5D6A7]"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        {/* Add User button - admin only */}
        {role === "admin" && (
          <button
            onClick={() => { setEditUser(null); setForm({ name: "", email: "", phone: "", role: "resident", address: "", password: "" }); setShowForm(true); }}
            className="flex items-center gap-2 bg-[#2E7D32] text-white px-4 py-2.5 rounded-xl hover:bg-[#1B5E20] transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add User
          </button>
        )}
      </div>

      {/* Form modal - admin only */}
      {showForm && role === "admin" && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[#E8F5E9]">
              <h3 className="font-semibold text-[#1A2E1A]">{editUser ? "Edit User" : "Add New User"}</h3>
              <button onClick={() => setShowForm(false)} className="text-[#558B5A] hover:text-[#1A2E1A] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {[
                { label: "Full Name", key: "name", icon: User, placeholder: "Juan Dela Cruz", type: "text" },
                { label: "Email", key: "email", icon: Mail, placeholder: "juan@example.com", type: "email" },
                { label: "Phone", key: "phone", icon: Phone, placeholder: "09171234567", type: "tel" },
                { label: "Address", key: "address", icon: null, placeholder: "Block 1, Zone A", type: "text" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="text-sm text-[#1A2E1A] mb-1.5 block">{field.label}</label>
                  <div className="relative">
                    {field.icon && <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A5D6A7]" />}
                    <input
                      required
                      type={field.type}
                      placeholder={field.placeholder}
                      value={form[field.key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      className={`w-full ${field.icon ? "pl-10" : "pl-4"} pr-4 py-3 rounded-xl border border-[#A5D6A7] bg-[#F4FAF4] focus:outline-none focus:ring-2 focus:ring-[#66BB6A] text-[#1A2E1A] placeholder-[#A5D6A7]`}
                    />
                  </div>
                </div>
              ))}

              {!editUser && (
                <div>
                  <label className="text-sm text-[#1A2E1A] mb-1.5 block">Password</label>
                  <input
                    required={!editUser}
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#A5D6A7] bg-[#F4FAF4] focus:outline-none focus:ring-2 focus:ring-[#66BB6A] text-[#1A2E1A] placeholder-[#A5D6A7]"
                  />
                </div>
              )}

              <div>
                <label className="text-sm text-[#1A2E1A] mb-1.5 block">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#A5D6A7] bg-[#F4FAF4] focus:outline-none focus:ring-2 focus:ring-[#66BB6A] text-[#1A2E1A]"
                >
                  <option value="resident">Resident</option>
                  <option value="collector">Garbage Collector</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl border border-[#A5D6A7] text-[#558B5A] hover:bg-[#E8F5E9] transition cursor-pointer">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl bg-[#2E7D32] text-white hover:bg-[#1B5E20] transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {editUser ? "Saving..." : "Creating..."}
                    </>
                  ) : (
                    editUser ? "Save Changes" : "Add User"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm - admin only */}
      {deleteTarget && role === "admin" && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center">
            <div className="w-14 h-14 bg-[#FCE4EC] rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-[#C62828]" />
            </div>
            <h3 className="font-bold text-[#1A2E1A] text-lg">Delete User?</h3>
            <p className="text-[#558B5A] text-sm mt-2 mb-5">
              Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 rounded-xl border border-[#A5D6A7] text-[#558B5A] hover:bg-[#E8F5E9] transition cursor-pointer">
                Cancel
              </button>
              <button onClick={deleteUser} className="flex-1 py-2.5 rounded-xl bg-[#D32F2F] text-white hover:bg-[#B71C1C] transition cursor-pointer">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users table */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8F5E9] overflow-hidden">
        <div className="p-4 border-b border-[#E8F5E9]">
          <p className="text-sm text-[#558B5A]">Showing {filtered.length} of {users.length} users</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F4FAF4] text-[#558B5A] text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3">User</th>
                <th className="text-left px-5 py-3 hidden sm:table-cell">Contact</th>
                <th className="text-left px-5 py-3">Role</th>
                <th className="text-left px-5 py-3 hidden md:table-cell">Violations</th>
                <th className="text-left px-5 py-3">Status</th>
                {role === "admin" && <th className="text-left px-5 py-3">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8F5E9]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={role === "admin" ? 6 : 5} className="px-5 py-8 text-center text-[#558B5A]">
                    No users found.
                  </td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-[#F4FAF4] transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#2E7D32] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#1A2E1A]">{user.name}</p>
                          <p className="text-xs text-[#558B5A] hidden sm:block">{user.address}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <p className="text-sm text-[#558B5A]">{user.email}</p>
                      <p className="text-xs text-[#A5D6A7]">{user.phone}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${roleColors[user.role]}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      {user.violations > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <ShieldAlert className="w-3.5 h-3.5 text-[#C62828]" />
                          <span className="text-sm font-medium text-[#C62828]">{user.violations}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                          <span className="text-sm text-[#558B5A]">None</span>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {role === "admin" ? (
                        <button
                          onClick={() => toggleStatus(user.id, user.status)}
                          className={`px-2 py-0.5 rounded-full text-xs font-medium border transition cursor-pointer ${statusColors[user.status]}`}
                        >
                          {user.status}
                        </button>
                      ) : (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[user.status]}`}>
                          {user.status}
                        </span>
                      )}
                    </td>
                    {role === "admin" && (
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEdit(user)}
                            className="p-1.5 rounded-lg bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#A5D6A7]/30 transition cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(user)}
                            className="p-1.5 rounded-lg bg-[#FCE4EC] text-[#C62828] hover:bg-[#F48FB1]/30 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}