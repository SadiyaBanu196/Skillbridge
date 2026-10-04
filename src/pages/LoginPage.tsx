import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layers, ArrowRight, AlertCircle, Loader2, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setError(null);
    setLoading(true);
    const demoEmail = 'sadiya@example.edu';
    const demoPassword = 'password123';

    try {
      // Try login first
      await login(demoEmail, demoPassword);
      navigate('/dashboard');
    } catch {
      // If demo user does not exist yet, auto-register
      try {
        await register('Sadiya Rahman', demoEmail, demoPassword, demoPassword);
        navigate('/dashboard');
      } catch (err: any) {
        setError(err.message || 'Could not auto-login with demo account.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FCF9F5] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-[#5C4033]/10 border border-[#5C4033]/20 text-[#5C4033] mb-3">
            <Layers className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-[#3E3028] tracking-tight">Welcome back to SkillBridge</h1>
          <p className="text-xs text-[#75675C] mt-1">
            Sign in to continue your project roadmap and AI mentoring session.
          </p>
        </div>

        <div className="bg-[#F5EFE6] border border-[#E8DCCB] rounded-2xl p-6 sm:p-8 shadow-md">
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-[#FAECEC] border border-[#E2B6B6] text-[#8E3E3E] text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#3E3028] mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full px-3.5 py-2.5 bg-[#FCF9F5] border border-[#DCC9B6] rounded-lg text-sm text-[#3E3028] placeholder-[#75675C] focus:outline-none focus:border-[#5C4033] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3E3028] mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-3.5 py-2.5 bg-[#FCF9F5] border border-[#DCC9B6] rounded-lg text-sm text-[#3E3028] placeholder-[#75675C] focus:outline-none focus:border-[#5C4033] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-[#5C4033] hover:bg-[#4A3227] disabled:opacity-50 text-white font-medium text-sm rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm shadow-[#5C4033]/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access for FSD Evaluation */}
          <div className="mt-4 pt-4 border-t border-[#E8DCCB]">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={loading}
              className="w-full py-2.5 px-3 bg-[#E8DCCB] hover:bg-[#DCC9B6] text-xs font-semibold text-[#3E3028] rounded-lg border border-[#DCC9B6] flex items-center justify-center gap-2 transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#5C4033]" />
              <span>Quick Login as Demo Student (Sadiya)</span>
            </button>
          </div>

          <div className="mt-5 pt-4 border-t border-[#E8DCCB] text-center">
            <p className="text-xs text-[#75675C]">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#5C4033] hover:text-[#8B6F47] font-semibold">
                Create one for free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
