import { NavLink, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { name: "Panel Control", path: "/dashboard", icon: LayoutDashboard },
    { name: "Programas", path: "/programs", icon: Globe },
    { name: "IA Asistente", path: "/ai-tools", icon: BrainCircuit },
    { name: "Mi Perfil", path: "/profile", icon: User },
  ];

  return (
    <aside 
      className={`fixed top-16 left-0 h-[calc(100vh-64px)] z-40 transition-all duration-300 glass-panel border-y-0 border-l-0 border-r border-glass-border flex flex-col justify-between py-6
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
                flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group
                ${isActive 
                  ? "bg-secondary/15 text-secondary border border-secondary/35 shadow-[0_0_15px_rgba(93,140,226,0.15)]" 
                  : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"}
              `}
            >
              <Icon className="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
              {isOpen && <span className="truncate">{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / User Session Details */}
      <div className="space-y-4 pt-4 border-t border-glass-border">
        {isOpen && user && (
          <div className="px-4 py-2 bg-white/5 rounded-xl border border-glass-border">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Sesión como</p>
            <p className="text-sm font-medium text-white truncate">{user.email}</p>
            <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-accent/20 text-accent font-semibold border border-accent/25 uppercase">
              {user.role}
            </span>
          </div>
        )}
        
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent transition-all duration-200 cursor-pointer
            ${!isOpen && "justify-center"}`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {isOpen && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
}
