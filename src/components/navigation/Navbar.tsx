import { Menu, Bell, Search, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

interface NavbarProps {
  onToggleSidebar: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="sticky top-0 z-50 w-full h-16 glass-panel border-x-0 border-t-0 border-b border-glass-border flex items-center justify-between px-6">
      {/* Brand & Toggle */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-glass-border transition-all duration-200 cursor-pointer"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-light to-secondary flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(93,140,226,0.25)] group-hover:scale-105 transition-all duration-200">
            <GraduationCap className="w-5 h-5 text-accent" />
          </div>
          <span className="font-display font-extrabold text-xl tracking-wider text-white">
            EDU<span className="text-secondary font-semibold">LAB</span>
          </span>
        </Link>
      </div>

      {/* Global Dashboard Actions */}
      <div className="flex items-center gap-4">
        {/* Search Input Stub */}
        <div className="relative max-md:hidden w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar becas y programas..."
            className="w-full pl-10 pr-4 py-1.5 rounded-xl text-xs bg-white/5 border border-glass-border focus:border-secondary/50 focus:outline-none text-gray-300 transition-all duration-200"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-glass-border transition-all duration-200 cursor-pointer">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-accent rounded-full border-2 border-[#010414] animate-pulse"></span>
        </button>

        {/* User Badge */}
        {user && (
          <div className="flex items-center gap-3 pl-3 border-l border-glass-border">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-secondary to-accent flex items-center justify-center font-bold text-xs text-primary-dark">
              {user.email.substring(0, 2).toUpperCase()}
            </div>
            <div className="max-sm:hidden text-left">
              <p className="text-xs font-semibold text-white leading-none mb-0.5">
                {user.email.split("@")[0]}
              </p>
              <span className="text-[10px] text-gray-500 font-semibold tracking-wide uppercase">
                {user.role}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
