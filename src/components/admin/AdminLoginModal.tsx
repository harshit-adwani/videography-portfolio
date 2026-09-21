import React, { useState } from 'react';
import { KeyRound, Lock, ShieldCheck, X } from 'lucide-react';
import { storage } from '../../services/storage';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = storage.login(password);
    if (success) {
      setError(false);
      setPassword('');
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl transition-all duration-300 animate-in fade-in"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md glass-panel-elevated rounded-2xl p-6 sm:p-8 border border-white/15 shadow-2xl transition-all duration-300 animate-in zoom-in-95"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-cinema-amber/20 border border-cinema-amber/40 flex items-center justify-center text-cinema-amber">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-sans">DIRECTOR ADMIN SUITE</h3>
            <p className="text-xs font-mono text-neutral-400">Authenticated project manager</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-neutral-300 mb-1.5">
              MASTER PASSCODE
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="Enter admin passcode"
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder-neutral-500 font-mono text-sm focus:outline-none focus:border-cinema-amber transition-colors"
                autoFocus
              />
              <KeyRound className="w-4 h-4 text-neutral-500 absolute right-3.5 top-3" />
            </div>
            {error && (
              <p className="text-xs font-mono text-red-400 mt-1.5">
                Incorrect passcode. Try default: <span className="underline">cinema2026</span>
              </p>
            )}
          </div>

          <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-[11px] font-mono text-neutral-400">
            <span className="text-cinema-amber font-semibold">Demo Hint: </span>
            The default passcode is <code className="text-white bg-black/40 px-1 py-0.5 rounded">cinema2026</code>.
            You can change this anytime inside the dashboard.
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-cinema-amber hover:bg-amber-400 text-obsidian-950 font-bold font-mono text-sm transition-all shadow-lg shadow-cinema-amber/20 flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            UNLOCK DASHBOARD
          </button>
        </form>
      </div>
    </div>
  );
};
