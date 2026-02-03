import React, { useState } from 'react';
import { api } from '../services/api';

interface RegisterProps {
  onSuccess: () => void;
  onNavigate: (path: string) => void;
}

const Register: React.FC<RegisterProps> = ({ onSuccess, onNavigate }) => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.register(formData);
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#faf5ff]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-8">
            <div className="h-16 w-16 bg-gradient-to-tr from-violet-600 to-fuchsia-600 rounded-full flex items-center justify-center shadow-xl shadow-fuchsia-100 rotate-6">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
            </div>
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h2>
        <p className="mt-2 text-slate-500 font-medium">Join the PQuizzer community today</p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-12 px-8 shadow-2xl shadow-violet-100/50 sm:rounded-[2.5rem] border border-violet-50">
          {error && (
            <div className="mb-6 p-4 bg-rose-50 text-rose-700 rounded-2xl text-sm font-bold border border-rose-100 flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Username</label>
              <input
                type="text"
                required
                placeholder="pquizzer_fan"
                className="block w-full px-5 py-4 bg-violet-50/50 border-2 border-transparent rounded-2xl outline-none focus:border-violet-400 focus:bg-white transition-all text-slate-900 font-medium"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="dev@pquizzer.com"
                className="block w-full px-5 py-4 bg-violet-50/50 border-2 border-transparent rounded-2xl outline-none focus:border-violet-400 focus:bg-white transition-all text-slate-900 font-medium"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Password</label>
              <input
                type="password"
                required
                placeholder="Strong password"
                className="block w-full px-5 py-4 bg-violet-50/50 border-2 border-transparent rounded-2xl outline-none focus:border-violet-400 focus:bg-white transition-all text-slate-900 font-medium"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <div className="pt-2">
                <button
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-fuchsia-100 hover:shadow-fuchsia-200 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                {loading ? 'Creating...' : 'REGISTER'}
                </button>
            </div>
          </form>
          <div className="mt-8 text-center">
             <button onClick={() => onNavigate('login')} className="text-violet-600 font-bold text-sm hover:underline">Already registered? Log in</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;