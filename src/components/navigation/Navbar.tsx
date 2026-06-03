import { Menu, Bell, Search, GraduationCap } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

interface NavbarProps {
  onToggleSidebar: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const user = useAuthStore((state) => state.user);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchVal = searchParams.get("q") || "";

  return (
    <header className="sticky top-0 z-50 w-full h-16 bg-white border-b border-gray-200/80 flex items-center justify-between px-6 shadow-sm text-[#00135B]">
      {/* Brand & Toggle */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-gray-500 hover:text-[#00135B] hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all duration-200 cursor-pointer bg-transparent"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00135B] to-[#5D8CE2] flex items-center justify-center border border-white/10 shadow-sm group-hover:scale-105 transition-all duration-200">
            <GraduationCap className="w-5 h-5 text-[#F5C542]" />
          </div>
          <span className="font-display font-extrabold text-xl tracking-wider text-[#00135B]">
            EDU<span className="text-[#5D8CE2] font-semibold">LAB</span>
          </span>
        </Link>
      </div>

      {/* Global Dashboard Actions */}
      <div className="flex items-center gap-4">
        {/* Search Input */}
        <div className="relative max-md:hidden w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => {
              const val = e.target.value;
              if (val) {
                setSearchParams({ q: val });
              } else {
                setSearchParams({});
              }
            }}
            placeholder="Buscar becas y programas..."
            className="w-full pl-10 pr-4 py-1.5 rounded-xl text-xs bg-gray-50 border border-gray-200 focus:border-[#5D8CE2] focus:bg-white focus:outline-none text-gray-700 transition-all duration-200"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl text-gray-500 hover:text-[#00135B] hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all duration-200 cursor-pointer bg-transparent">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F5C542] rounded-full animate-pulse"></span>
        </button>

        {/* User Badge */}
        {user && (
          <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#5D8CE2] to-[#F5C542] flex items-center justify-center font-bold text-xs text-[#00135B]">
              {user.email.substring(0, 2).toUpperCase()}
            </div>
            <div className="max-sm:hidden text-left">
              <p className="text-xs font-bold text-[#00135B] leading-none mb-0.5">
                {user.displayName || user.email.split("@")[0]}
              </p>
              <span className="text-[10px] text-gray-400 font-semibold tracking-wide uppercase">
                {user.role}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
