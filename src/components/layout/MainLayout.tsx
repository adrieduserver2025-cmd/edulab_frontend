import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../navigation/Navbar";
import Sidebar from "../navigation/Sidebar";
import { useAuthStore } from "../../store/useAuthStore";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate();

  // Route protection redirect
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-dark flex items-center justify-center">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-secondary animate-spin"></div>
          <div className="absolute inset-0 m-auto w-4 h-4 bg-accent rounded-full animate-ping"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col bg-[#f8fafc]"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(0, 19, 91, 0.02) 1.5px, transparent 1.5px),
          linear-gradient(to bottom, rgba(0, 19, 91, 0.02) 1.5px, transparent 1.5px)
        `,
        backgroundSize: "40px 40px"
      }}
    >
      <Navbar onToggleSidebar={handleToggleSidebar} />
      
      <div className="flex-1 flex relative">
        <Sidebar isOpen={sidebarOpen} />
        
        {/* Main Content Area */}
        <main 
          className={`flex-1 min-h-[calc(100vh-64px)] transition-all duration-300 p-8
            ${sidebarOpen ? "ml-64" : "ml-20"}`}
        >
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
