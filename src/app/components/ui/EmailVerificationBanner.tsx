// src/app/components/ui/EmailVerificationBanner.tsx
import { useAuth } from '../../contexts/AuthContext';
import { Mail, RefreshCw, X } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function EmailVerificationBanner() {
  const { firebaseUser, sendVerificationEmail, isEmailVerified } = useAuth();
  const [isSending, setIsSending] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (!firebaseUser || isEmailVerified || dismissed) {
    return null;
  }

  const handleResend = async () => {
    setIsSending(true);
    try {
      await sendVerificationEmail();
    } catch (error) {
      toast.error('Failed to send verification email');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
        <Mail className="w-4 h-4 text-yellow-700" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-yellow-800">
          Please verify your email address
        </p>
        <p className="text-xs text-yellow-700">
          Check your inbox for the verification link.
        </p>
      </div>
      <button
        onClick={handleResend}
        disabled={isSending}
        className="flex items-center gap-1 px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-lg text-sm hover:bg-yellow-200 transition disabled:opacity-50"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${isSending ? 'animate-spin' : ''}`} />
        {isSending ? 'Sending...' : 'Resend'}
      </button>
      <button
        onClick={() => setDismissed(true)}
        className="p-1 text-yellow-600 hover:text-yellow-800"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}