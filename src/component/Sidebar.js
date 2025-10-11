import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Briefcase,
  BarChart2,
  Settings,
  LifeBuoy,
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/dashboard" },
    { name: "Projects", icon: <FolderKanban size={18} />, path: "/taskbar" },
    { name: "HR", icon: <Users size={18} />, path: "/human-resources" },
    { name: "CRM", icon: <Briefcase size={18} />, path: "/crm" },
    { name: "Performance", icon: <BarChart2 size={18} />, path: "/performance" },
  ];

  const bottomMenu = [
    { name: "Settings", icon: <Settings size={18} />, path: "/settings" },
    { name: "Support", icon: <LifeBuoy size={18} />, path: "/support" },
  ];

  return (
    <div className="h-screen w-60 bg-[#0d1321] text-white flex flex-col justify-between py-6">
      {/* Logo */}
      <div>
        <div className="flex items-center gap-3 px-6 mb-8">
          <div className="bg-[#00aaff] w-10 h-10 flex items-center justify-center rounded-lg">
            <span className="text-white font-bold text-xl">⨂</span>
          </div>
          <span className="font-semibold text-xl tracking-wide">CoreSphere</span>
        </div>

        <p className="text-xs text-gray-400 uppercase px-6 mb-3 tracking-widest">
          Menu
        </p>

        {/* Menu Items */}
        <nav className="flex flex-col">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#1a2235] text-white"
                    : "text-gray-300 hover:text-white hover:bg-[#1a2235]"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Menu */}
      <div className="flex flex-col border-t border-[#1f2a44] pt-4">
        {bottomMenu.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-6 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-[#1a2235] text-white"
                  : "text-gray-300 hover:text-white hover:bg-[#1a2235]"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
