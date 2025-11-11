import { useState } from "react";
import {
  HiMenu,
  HiX,
  HiViewList,
  HiChartBar,
  HiLogout,
  HiUserCircle,
} from "react-icons/hi";
import { FaBowlFood } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/client"; // ✅ make sure this path is correct
import type { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Optional: clear local storage or session state if you store user info manually
      localStorage.removeItem("supabase.auth.token");
      sessionStorage.clear();

      // Redirect to login
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Failed to logout. Please try again.");
    }
  };

  const links = [
    { name: "Homepage", icon: <HiViewList />, url: "index" },
    { name: "Menu Items", icon: <FaBowlFood />, url: "menu" },
    { name: "Polls", icon: <HiChartBar />, url: "polls" },
    { name: "Logout", icon: <HiLogout />, url: "logout" },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-[#3a1f1d] via-[#4b2b2a] to-[#2a1615] text-gray-100 relative">
      {/* Background texture overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/food.png')] opacity-10 pointer-events-none" />

      {/* Sidebar */}
      <aside
        className={`z-30 fixed inset-y-0 left-0 w-64 bg-[#6b1e1f] shadow-lg p-6 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Welcome Admin */}
        <div className="flex items-center gap-3 mb-8">
          <HiUserCircle className="text-3xl text-rose-300" />
          <div>
            <p className="text-sm text-rose-200">Welcome,</p>
            <p className="font-bold text-white text-lg">Admin</p>
          </div>
        </div>

        {/* Navigation Links */}
        <ul className="space-y-3">
          {links.map((link) => {
            const isActive =
              link.url === "logout"
                ? false
                : location.pathname.endsWith(link.url.toLowerCase());
            return (
              <li key={link.name}>
                <button
                  onClick={() => {
                    if (link.url === "logout") {
                      handleLogout();
                      return;
                    }
                    navigate(`/dashboard/${link.url.toLowerCase()}`);
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded transition ${
                    isActive
                      ? "bg-rose-700 text-white font-semibold"
                      : "hover:bg-rose-700/50 text-rose-100"
                  }`}
                >
                  <span className="text-lg">{link.icon}</span>
                  <span>{link.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="z-40 fixed inset-0 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 p-6 relative z-10 ml-0 md:ml-64">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white text-2xl"
          >
            {sidebarOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>

        {/* Content container */}
        <div className="bg-white rounded-lg shadow-lg p-6 min-h-[80vh]">
          {children}
        </div>
      </main>
    </div>
  );
}
