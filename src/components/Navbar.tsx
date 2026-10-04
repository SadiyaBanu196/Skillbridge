import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Layers, Plus, LogOut, LayoutDashboard, Terminal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-[#FCF9F5]/90 backdrop-blur-md border-b border-[#E8DCCB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-[#5C4033]/10 border border-[#5C4033]/20 flex items-center justify-center text-[#5C4033] group-hover:bg-[#5C4033] group-hover:text-white transition-all duration-200">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-[#3E3028] group-hover:text-[#5C4033] transition-colors">
              SkillBridge
            </span>
            <span className="hidden md:inline-block ml-2 text-[10px] font-mono uppercase tracking-wider text-[#8B6F47] bg-[#F5EFE6] px-1.5 py-0.5 rounded border border-[#DCC9B6]">
              FSD Lab & Venture
            </span>
          </div>
        </Link>

        {/* Center / Right Links */}
        <nav className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive('/dashboard')
                    ? 'bg-[#E8DCCB] text-[#3E3028] font-semibold'
                    : 'text-[#75675C] hover:text-[#3E3028] hover:bg-[#F5EFE6]'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-[#8B6F47]" />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/projects/new"
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-[#5C4033] text-white hover:bg-[#4A3227] transition-all shadow-sm shadow-[#5C4033]/20"
              >
                <Plus className="w-4 h-4" />
                <span>New Project</span>
              </Link>

              <div className="h-4 w-px bg-[#E8DCCB] mx-1 hidden sm:block" />

              <div className="flex items-center gap-2 pl-1">
                <div className="w-8 h-8 rounded-full bg-[#E8DCCB] border border-[#DCC9B6] flex items-center justify-center text-xs font-semibold text-[#5C4033]">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-medium text-[#3E3028] leading-none">{user.name}</div>
                  <div className="text-[10px] text-[#75675C] font-mono leading-none mt-1 truncate max-w-[120px]">{user.email}</div>
                </div>
                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="p-1.5 text-[#75675C] hover:text-[#8E3E3E] hover:bg-[#FAECEC] rounded-lg transition-colors ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/"
                className="hidden sm:inline-flex px-3 py-1.5 text-sm font-medium text-[#75675C] hover:text-[#3E3028] hover:bg-[#F5EFE6] rounded-lg transition-colors"
              >
                Overview
              </Link>
              <Link
                to="/login"
                className="px-3 py-1.5 text-sm font-medium text-[#5C4033] hover:text-[#3E3028] hover:bg-[#F5EFE6] rounded-lg transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium rounded-lg bg-[#5C4033] text-white hover:bg-[#4A3227] transition-all shadow-sm shadow-[#5C4033]/20"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Get Started</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
