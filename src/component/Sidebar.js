// import { useState } from "react";
// import { NavLink, useLocation } from "react-router-dom";
// import {
//   LayoutDashboard,
//   FolderKanban,
//   Users,
//   Briefcase,
//   BarChart2,
//   Settings,
//   LifeBuoy,
// } from "lucide-react";

// export default function Sidebar() {
//   const location = useLocation();

//   const menuItems = [
//     { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/dashboard" },
//     { name: "Projects", icon: <FolderKanban size={18} />, path: "/taskbar" },
//     { name: "HR", icon: <Users size={18} />, path: "/human-resources" },
//     { name: "CRM", icon: <Briefcase size={18} />, path: "/crm" },
//     { name: "Performance", icon: <BarChart2 size={18} />, path: "/performance" },
//   ];

//   const bottomMenu = [
//     { name: "Settings", icon: <Settings size={18} />, path: "/settings" },
//     { name: "Support", icon: <LifeBuoy size={18} />, path: "/support" },
//   ];

//   return (
//     <div className="h-screen w-60 bg-[#0d1321] text-white flex flex-col justify-between py-6">
//       {/* Logo */}
//       <div>
//         <div className="flex items-center gap-3 px-6 mb-8">
//           <div className="bg-[#00aaff] w-10 h-10 flex items-center justify-center rounded-lg">
//             <span className="text-white font-bold text-xl">⨂</span>
//           </div>
//           <span className="font-semibold text-xl tracking-wide">CoreSphere</span>
//         </div>

//         <p className="text-xs text-gray-400 uppercase px-6 mb-3 tracking-widest">
//           Menu
//         </p>

//         {/* Menu Items */}
//         <nav className="flex flex-col">
//           {menuItems.map((item) => {
//             const isActive = location.pathname === item.path;
//             return (
//               <NavLink
//                 key={item.name}
//                 to={item.path}
//                 className={`flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-colors ${
//                   isActive
//                     ? "bg-[#1a2235] text-white"
//                     : "text-gray-300 hover:text-white hover:bg-[#1a2235]"
//                 }`}
//               >
//                 {item.icon}
//                 <span>{item.name}</span>
//               </NavLink>
//             );
//           })}
//         </nav>
//       </div>

//       {/* Bottom Menu */}
//       <div className="flex flex-col border-t border-[#1f2a44] pt-4">
//         {bottomMenu.map((item) => {
//           const isActive = location.pathname === item.path;
//           return (
//             <NavLink
//               key={item.name}
//               to={item.path}
//               className={`flex items-center gap-3 px-6 py-2.5 text-sm transition-colors ${
//                 isActive
//                   ? "bg-[#1a2235] text-white"
//                   : "text-gray-300 hover:text-white hover:bg-[#1a2235]"
//               }`}
//             >
//               {item.icon}
//               <span>{item.name}</span>
//             </NavLink>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Briefcase,
  BarChart2,
  Settings,
  LifeBuoy,
  LogOut,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  // ✅ Decode role from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role); // role stored in JWT payload
      } catch (error) {
        console.error("Invalid token", error);
        setRole(null);
      }
    }
  }, []);

  // ✅ Define menu access by role
  const allMenuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/dashboard", access: ["admin", "hr", "manager", "user"] },
    { name: "Projects", icon: <FolderKanban size={18} />, path: "/taskbar", access: ["admin", "manager"] },
    { name: "HR", icon: <Users size={18} />, path: "/human-resources", access: ["admin", "hr"] },
    { name: "CRM", icon: <Briefcase size={18} />, path: "/crm", access: ["admin"] },
    { name: "Performance", icon: <BarChart2 size={18} />, path: "/performance", access: ["admin", "manager", "hr"] },
  ];

  const bottomMenu = [
    { name: "Settings", icon: <Settings size={18} />, path: "/settings" },
    { name: "Support", icon: <LifeBuoy size={18} />, path: "/support" },
  ];

  // ✅ Logout function
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  // ✅ Filter items based on role
  const visibleMenu = role
    ? allMenuItems.filter((item) => item.access.includes(role))
    : [];

  return (
    <div className="h-screen w-60 bg-[#0d1321] text-white flex flex-col justify-between py-6">
      {/* === Logo === */}
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

        {/* === Menu Items === */}
        <nav className="flex flex-col">
          {visibleMenu.length > 0 ? (
            visibleMenu.map((item) => {
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
            })
          ) : (
            <p className="text-gray-500 text-xs px-6 mt-3">No modules available</p>
          )}
        </nav>
      </div>

      {/* === Bottom Section === */}
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

        {/* === Logout Button === */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-6 py-2.5 text-sm text-gray-300 hover:text-red-400 hover:bg-[#1a2235] transition-colors mt-2"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
