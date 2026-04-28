import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, ArrowRight, Lock, Key } from 'lucide-react';

export function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, password);
    if (!success) {
      setError(true);
    }
  };

  const handleTestAccountClick = (testEmail: string) => {
    setEmail(testEmail);
    setPassword('SecurePass123!');
    setError(false);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center items-center p-4 bg-grid relative overflow-hidden">
      
      {/* Decorative background elements */}
      <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-[#14532d] via-[#d4a843] to-[#0284c7]" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#14532d]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#0284c7]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[420px] bg-white rounded-md shadow-xl shadow-slate-200/50 border border-[#e2e8f0] overflow-hidden relative z-10">
        
        {/* Header Block */}
        <div className="px-8 pt-10 pb-6 text-center border-b border-[#e2e8f0] bg-slate-50/50">
          <img src="/prov-logo.png" alt="Provincial Treasury Logo" className="h-20 mx-auto mb-6 object-contain" />
          <h1 className="text-xl font-bold text-[#0f172a] mb-1 tracking-tight">SentinelProcure AI</h1>
          <p className="text-[#64748b] text-[12px] uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5">
            <Shield size={12} className="text-[#14532d]" />
            Restricted Access
          </p>
        </div>

        {/* Login Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-sm text-center">
                Invalid credentials or unauthorised role.
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-[#334155] text-xs font-semibold block uppercase tracking-wide">Government Email Address</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(false); }}
                  placeholder="name@westerncape.gov.za"
                  className="w-full border border-[#cbd5e1] rounded-sm py-2 pl-9 pr-3 text-sm text-[#0f172a] bg-[#f8fafc] focus:outline-none focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[#334155] text-xs font-semibold block uppercase tracking-wide flex justify-between">
                <span>Secure Password</span>
                <span className="text-[#0284c7] font-normal cursor-pointer hover:underline">Forgot?</span>
              </label>
              <div className="relative">
                <Key size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(false); }}
                  placeholder="••••••••••••"
                  className="w-full border border-[#cbd5e1] rounded-sm py-2 pl-9 pr-3 text-sm text-[#0f172a] bg-[#f8fafc] focus:outline-none focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] transition-all"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#14532d] hover:bg-[#166534] text-white font-medium text-sm py-2.5 rounded-sm transition-colors flex items-center justify-center gap-2 mt-2 shadow-sm"
            >
              Authenticate <ArrowRight size={14} />
            </button>
          </form>

          {/* Seed accounts for testing */}
          <div className="mt-8 pt-6 border-t border-[#e2e8f0]">
            <p className="text-xs text-[#64748b] text-center mb-3 uppercase tracking-widest font-semibold">Test Accounts (Auto-fills Password)</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#334155]">WC MEC for Finance</span>
                <code className="text-[#0284c7] bg-blue-50 px-1.5 py-0.5 rounded cursor-pointer" onClick={() => handleTestAccountClick('executive@westerncape.gov.za')}>executive@westerncape.gov.za</code>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#334155]">AG WC Executive</span>
                <code className="text-[#0284c7] bg-blue-50 px-1.5 py-0.5 rounded cursor-pointer" onClick={() => handleTestAccountClick('provincial.executive@agsa.gov.za')}>provincial.executive@agsa.gov.za</code>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#334155]">WC Lead Analyst</span>
                <code className="text-[#0284c7] bg-blue-50 px-1.5 py-0.5 rounded cursor-pointer" onClick={() => handleTestAccountClick('analyst@westerncape.gov.za')}>analyst@westerncape.gov.za</code>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#f1f5f9] px-8 py-4 border-t border-[#e2e8f0] flex items-center justify-between text-[10px] text-[#64748b]">
          <span>Unauthorised access is prohibited by law.</span>
          <div className="flex items-center gap-1.5">
            <img src="/sa-flag.png" alt="SA" className="w-3" />
            <span className="uppercase tracking-wider font-semibold">RSA</span>
          </div>
        </div>

      </div>
    </div>
  );
}
