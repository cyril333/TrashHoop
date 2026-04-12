// src/app/pages/admin/BinManagementPage.tsx
import { useState } from 'react';
import { QrCode, Plus, MapPin, Trash2 } from 'lucide-react';
import QRCodeGenerator from '../../components/ui/QRCodeGenerator';
import { CEBU_CITY_BARANGAYS } from '../../../lib/constants';
import toast from 'react-hot-toast';

interface Bin {
  id: string;
  location: string;
  barangay: string;
  wasteType: string;
  status: 'active' | 'inactive';
}

export default function BinManagementPage() {
  const [bins, setBins] = useState<Bin[]>([]);
  const [showGenerator, setShowGenerator] = useState(false);
  const [selectedBin, setSelectedBin] = useState<Bin | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    location: '',
    barangay: '',
    wasteType: 'biodegradable',
  });

  const handleCreateBin = () => {
    const newBin: Bin = {
      id: `BIN-${Date.now().toString().slice(-6)}`,
      location: form.location,
      barangay: form.barangay,
      wasteType: form.wasteType,
      status: 'active',
    };

    setBins([...bins, newBin]);
    setSelectedBin(newBin);
    setShowGenerator(true);
    setShowForm(false);
    setForm({ location: '', barangay: '', wasteType: 'biodegradable' });
    toast.success('Bin created successfully!');
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#1A2E1A]">Smart Bin Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-[#2E7D32] text-white px-4 py-2 rounded-xl hover:bg-[#1B5E20] transition"
        >
          <Plus className="w-4 h-4" />
          Add New Bin
        </button>
      </div>

      {/* Create Bin Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
            <h3 className="font-bold text-[#1A2E1A] text-lg mb-4">Create New Smart Bin</h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-[#1A2E1A] mb-1.5 block">Location/Street</label>
                <input
                  type="text"
                  placeholder="e.g., Gorordo Avenue"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#A5D6A7] bg-[#F4FAF4] focus:outline-none focus:ring-2 focus:ring-[#66BB6A]"
                />
              </div>

              <div>
                <label className="text-sm text-[#1A2E1A] mb-1.5 block">Barangay</label>
                <select
                  value={form.barangay}
                  onChange={(e) => setForm({ ...form, barangay: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#A5D6A7] bg-[#F4FAF4] focus:outline-none focus:ring-2 focus:ring-[#66BB6A]"
                >
                  <option value="">Select barangay</option>
                  {CEBU_CITY_BARANGAYS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-[#1A2E1A] mb-1.5 block">Waste Type</label>
                <select
                  value={form.wasteType}
                  onChange={(e) => setForm({ ...form, wasteType: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#A5D6A7] bg-[#F4FAF4] focus:outline-none focus:ring-2 focus:ring-[#66BB6A]"
                >
                  <option value="biodegradable">🌿 Biodegradable</option>
                  <option value="recyclable">♻️ Recyclable</option>
                  <option value="residual">🗑️ Residual</option>
                  <option value="hazardous">⚠️ Hazardous</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 rounded-xl border border-[#A5D6A7] text-[#558B5A] hover:bg-[#E8F5E9] transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateBin}
                  disabled={!form.location || !form.barangay}
                  className="flex-1 py-3 rounded-xl bg-[#2E7D32] text-white hover:bg-[#1B5E20] transition disabled:opacity-60"
                >
                  Create & Generate QR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Generator Modal */}
      {showGenerator && selectedBin && (
        <QRCodeGenerator
          binId={selectedBin.id}
          location={`${selectedBin.location}, ${selectedBin.barangay}`}
          wasteType={selectedBin.wasteType}
          onClose={() => {
            setShowGenerator(false);
            setSelectedBin(null);
          }}
        />
      )}

      {/* Bins List */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8F5E9] overflow-hidden">
        <div className="p-5 border-b border-[#E8F5E9]">
          <h3 className="font-semibold text-[#1A2E1A]">Registered Smart Bins</h3>
        </div>

        {bins.length === 0 ? (
          <div className="p-10 text-center text-[#558B5A]">
            <QrCode className="w-12 h-12 mx-auto mb-3 text-[#A5D6A7]" />
            <p>No smart bins registered yet.</p>
            <p className="text-sm mt-1">Click "Add New Bin" to create one.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#E8F5E9]">
            {bins.map((bin) => (
              <div key={bin.id} className="p-4 flex items-center justify-between hover:bg-[#F4FAF4] transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#E8F5E9] rounded-xl flex items-center justify-center">
                    <QrCode className="w-5 h-5 text-[#2E7D32]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#1A2E1A]">{bin.id}</p>
                    <p className="text-xs text-[#558B5A] flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {bin.location}, {bin.barangay}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    bin.wasteType === 'biodegradable' ? 'bg-green-100 text-green-700' :
                    bin.wasteType === 'recyclable' ? 'bg-blue-100 text-blue-700' :
                    bin.wasteType === 'residual' ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {bin.wasteType}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedBin(bin);
                      setShowGenerator(true);
                    }}
                    className="p-2 text-[#2E7D32] hover:bg-[#E8F5E9] rounded-lg transition"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}