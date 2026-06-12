import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Globe, 
  BrainCircuit, 
  User, 
  LogOut
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const navItems = user?.role === "organization"
    ? [
        { name: "Panel Control", path: "/dashboard", icon: LayoutDashboard },
        { name: "Perfil Org", path: "/profile", icon: User },
      ]
    : [
        { name: "Panel Control", path: "/dashboard", icon: LayoutDashboard },
        { name: "Programas", path: "/programs", icon: Globe },
        { name: "IA Asistente", path: "/ai-tools", icon: BrainCircuit },
        { name: "Mi Perfil", path: "/profile", icon: User },
      ];

  return (
    <aside 
      className={`fixed top-16 left-0 h-[calc(100vh-64px)] z-40 transition-all duration-300 bg-white border-r border-gray-200 flex flex-col justify-between py-6
        ${isOpen ? "w-64 px-4" : "w-20 px-2"}`}
    >
      {/* Navigation Links */}
      <nav className="flex-1 space-y-2 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 group border
                ${isActive 
                  ? "bg-gradient-to-r from-[#00135B] to-[#5D8CE2] text-white border-transparent shadow-sm" 
                  : "text-gray-500 hover:text-[#00135B] hover:bg-slate-50 border-transparent"}
              `}
            >
              <Icon className="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
              {isOpen && <span className="truncate">{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / User Session Details */}
      <div className="space-y-4 pt-4 border-t border-gray-150">
        {isOpen && user && (
          <div className="px-4 py-2 bg-slate-50 rounded-xl border border-gray-100 text-gray-700">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Sesión como</p>
            <p className="text-xs font-semibold text-[#00135B] truncate">{user.email}</p>
            <span className="inline-block mt-1 text-[9px] px-2 py-0.5 rounded-full bg-[#F5C542]/20 text-[#00135B] font-bold border border-[#F5C542]/30 uppercase">
              {user.role}
            </span>
          </div>
        )}
        
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-transparent transition-all duration-200 cursor-pointer bg-transparent
            ${!isOpen && "justify-center"}`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {isOpen && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
}
