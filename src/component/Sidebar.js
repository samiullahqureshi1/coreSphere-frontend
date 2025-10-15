// // import { useEffect, useState } from "react";
// // import { NavLink, useLocation, useNavigate } from "react-router-dom";
// // import {
// //   LayoutDashboard,
// //   FolderKanban,
// //   Users,
// //   Briefcase,
// //   BarChart2,
// //   Settings,
// //   LifeBuoy,
// //   LogOut,
// // } from "lucide-react";
// // import { jwtDecode } from "jwt-decode";

// // export default function Sidebar() {
// //   const location = useLocation();
// //   const navigate = useNavigate();
// //   const [role, setRole] = useState(null);

// //   useEffect(() => {
// //     const token = localStorage.getItem("token");
// //     if (token) {
// //       try {
// //         const decoded = jwtDecode(token);
// //         setRole(decoded.role);
// //       } catch (error) {
// //         console.error("Invalid token", error);
// //         setRole(null);
// //       }
// //     }
// //   }, []);

// //   const allMenuItems = [
// //     {
// //       name: "Dashboard",
// //       icon: <LayoutDashboard size={18} />,
// //       path: "/dashboard",
// //       access: ["admin", "hr", "manager", "user"],
// //     },
// //     {
// //       name: "Projects",
// //       icon: <FolderKanban size={18} />,
// //       path: "/taskbar",
// //       access: ["admin", "manager"],
// //     },
// //     {
// //       name: "HR",
// //       icon: <Users size={18} />,
// //       path: "/human-resources",
// //       access: ["admin", "hr"],
// //     },
// //     {
// //       name: "CRM",
// //       icon: <Briefcase size={18} />,
// //       path: "/crm",
// //       access: ["admin"],
// //     },
// //     {
// //       name: "Performance",
// //       icon: <BarChart2 size={18} />,
// //       path: "/performance",
// //       access: ["admin", "manager", "hr"],
// //     },
// //   ];

// //   const bottomMenu = [
// //     { name: "Settings", icon: <Settings size={18} />, path: "/settings" },
// //     { name: "Support", icon: <LifeBuoy size={18} />, path: "/support" },
// //   ];

// //   const handleLogout = async () => {
// //     const userId = localStorage.getItem("userid");
// //     try {
// //       await fetch(
// //         `https://core-sphere-backend.vercel.app/auth/logout/${userId}`,
// //         { method: "POST" }
// //       );
// //       localStorage.clear();
// //       navigate("/login", { replace: true });
// //     } catch (error) {
// //       console.error("Logout failed:", error);
// //     }
// //   };

// //   // ✅ Filter items based on role
// //   const visibleMenu = role
// //     ? allMenuItems.filter((item) => item.access.includes(role))
// //     : [];

// //   return (
// //     <div className="h-screen w-60 bg-[#0d1321] text-white flex flex-col justify-between py-6">
// //       {/* === Logo === */}
// //       <div>
// //         <div className="flex items-center gap-3 px-6 mb-8">
// //           <div className="bg-[#00aaff] w-10 h-10 flex items-center justify-center rounded-lg">
// //             <span className="text-white font-bold text-xl">⨂</span>
// //           </div>
// //           <span className="font-semibold text-xl tracking-wide">
// //             CoreSphere
// //           </span>
// //         </div>

// //         <p className="text-xs text-gray-400 uppercase px-6 mb-3 tracking-widest">
// //           Menu
// //         </p>

// //         {/* === Menu Items === */}
// //         <nav className="flex flex-col">
// //           {visibleMenu.length > 0 ? (
// //             visibleMenu.map((item) => {
// //               const isActive = location.pathname === item.path;
// //               return (
// //                 <NavLink
// //                   key={item.name}
// //                   to={item.path}
// //                   className={`flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-colors ${
// //                     isActive
// //                       ? "bg-[#1a2235] text-white"
// //                       : "text-gray-300 hover:text-white hover:bg-[#1a2235]"
// //                   }`}
// //                 >
// //                   {item.icon}
// //                   <span>{item.name}</span>
// //                 </NavLink>
// //               );
// //             })
// //           ) : (
// //             <p className="text-gray-500 text-xs px-6 mt-3">
// //               No modules available
// //             </p>
// //           )}
// //         </nav>
// //       </div>

// //       {/* === Bottom Section === */}
// //       <div className="flex flex-col border-t border-[#1f2a44] pt-4">
// //         {bottomMenu.map((item) => {
// //           const isActive = location.pathname === item.path;
// //           return (
// //             <NavLink
// //               key={item.name}
// //               to={item.path}
// //               className={`flex items-center gap-3 px-6 py-2.5 text-sm transition-colors ${
// //                 isActive
// //                   ? "bg-[#1a2235] text-white"
// //                   : "text-gray-300 hover:text-white hover:bg-[#1a2235]"
// //               }`}
// //             >
// //               {item.icon}
// //               <span>{item.name}</span>
// //             </NavLink>
// //           );
// //         })}

// //         {/* === Logout Button === */}
// //         <button
// //           onClick={handleLogout}
// //           className="flex items-center gap-3 px-6 py-2.5 text-sm text-gray-300 hover:text-red-400 hover:bg-[#1a2235] transition-colors mt-2"
// //         >
// //           <LogOut size={18} />
// //           <span>Logout</span>
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }
// import { useEffect, useState } from "react";
// import { NavLink, useLocation, useNavigate } from "react-router-dom";
// import {
//   LayoutDashboard,
//   FolderKanban,
//   Users,
//   Briefcase,
//   BarChart2,
//   Settings,
//   LifeBuoy,
//   LogOut,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import { jwtDecode } from "jwt-decode";
// import { motion, AnimatePresence } from "framer-motion";

// export default function Sidebar() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [role, setRole] = useState(null);
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   // ✅ Decode role from token
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         setRole(decoded.role);
//       } catch (error) {
//         console.error("Invalid token", error);
//         setRole(null);
//       }
//     }
//   }, []);

//   // ✅ Define menu access by role
//   const allMenuItems = [
//     { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/dashboard", access: ["admin", "hr", "manager", "user"] },
//     { name: "Projects", icon: <FolderKanban size={18} />, path: "/taskbar", access: ["admin", "manager"] },
//     { name: "HR", icon: <Users size={18} />, path: "/human-resources", access: ["admin", "hr"] },
//     { name: "CRM", icon: <Briefcase size={18} />, path: "/crm", access: ["admin"] },
//     { name: "Performance", icon: <BarChart2 size={18} />, path: "/performance", access: ["admin", "manager", "hr"] },
//   ];

//   const bottomMenu = [
//     { name: "Settings", icon: <Settings size={18} />, path: "/settings" },
//     { name: "Support", icon: <LifeBuoy size={18} />, path: "/support" },
//   ];

//   const handleLogout = async () => {
//     const userId = localStorage.getItem("userid");
//     try {
//       await fetch(`https://core-sphere-backend.vercel.app/auth/logout/${userId}`, { method: "POST" });
//       localStorage.clear();
//       navigate("/login", { replace: true });
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

//   // ✅ Filter items based on role
//   const visibleMenu = role
//     ? allMenuItems.filter((item) => item.access.includes(role))
//     : [];

//   return (
//     <motion.div
//       initial={{ x: -200, opacity: 0 }}
//       animate={{ x: 0, opacity: 1 }}
//       transition={{ duration: 0.4, ease: "easeOut" }}
//       className={`h-screen ${
//         isCollapsed ? "w-20" : "w-64"
//       } bg-gradient-to-b from-[#0d1321] to-[#141b2f] text-white flex flex-col justify-between py-6 shadow-xl transition-all duration-300 relative`}
//     >
//       {/* === Collapse Button === */}
//       <button
//         onClick={() => setIsCollapsed(!isCollapsed)}
//         className="absolute top-5 -right-3 bg-[#1a2235] p-1.5 rounded-full hover:bg-[#00aaff] transition-all"
//       >
//         {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
//       </button>

//       {/* === Logo === */}
//       <div>
//         <div className="flex items-center gap-3 px-6 mb-8">
//           <motion.div
//             whileHover={{ rotate: 360 }}
//             transition={{ duration: 0.6 }}
//             className="bg-[#00aaff] w-10 h-10 flex items-center justify-center rounded-lg shadow-md"
//           >
//             <span className="text-white font-bold text-xl">⨂</span>
//           </motion.div>
//           <AnimatePresence>
//             {!isCollapsed && (
//               <motion.span
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -10 }}
//                 className="font-semibold text-xl tracking-wide"
//               >
//                 CoreSphere
//               </motion.span>
//             )}
//           </AnimatePresence>
//         </div>

//         {!isCollapsed && (
//           <p className="text-xs text-gray-400 uppercase px-6 mb-3 tracking-widest">
//             Menu
//           </p>
//         )}

//         {/* === Menu Items === */}
//         <nav className="flex flex-col">
//           {visibleMenu.length > 0 ? (
//             visibleMenu.map((item) => {
//               const isActive = location.pathname === item.path;
//               return (
//                 <NavLink
//                   key={item.name}
//                   to={item.path}
//                   className={`flex items-center gap-3 px-6 py-2.5 text-sm font-medium rounded-md transition-all ${
//                     isActive
//                       ? "bg-[#1a2235] text-white shadow-md"
//                       : "text-gray-300 hover:text-white hover:bg-[#1a2235]"
//                   }`}
//                 >
//                   <motion.div
//                     whileHover={{ scale: 1.2 }}
//                     transition={{ duration: 0.2 }}
//                   >
//                     {item.icon}
//                   </motion.div>
//                   {!isCollapsed && <span>{item.name}</span>}
//                 </NavLink>
//               );
//             })
//           ) : (
//             <p className="text-gray-500 text-xs px-6 mt-3">
//               No modules available
//             </p>
//           )}
//         </nav>
//       </div>

//       {/* === Bottom Section === */}
//       <div className="flex flex-col border-t border-[#1f2a44] pt-4">
//         {bottomMenu.map((item) => {
//           const isActive = location.pathname === item.path;
//           return (
//             <NavLink
//               key={item.name}
//               to={item.path}
//               className={`flex items-center gap-3 px-6 py-2.5 text-sm rounded-md transition-all ${
//                 isActive
//                   ? "bg-[#1a2235] text-white shadow-md"
//                   : "text-gray-300 hover:text-white hover:bg-[#1a2235]"
//               }`}
//             >
//               {item.icon}
//               {!isCollapsed && <span>{item.name}</span>}
//             </NavLink>
//           );
//         })}

//         {/* === Logout Button === */}
//         <button
//           onClick={handleLogout}
//           className="flex items-center gap-3 px-6 py-2.5 text-sm text-gray-300 hover:text-red-400 hover:bg-[#1a2235] transition-all mt-2 rounded-md"
//         >
//           <LogOut size={18} />
//           {!isCollapsed && <span>Logout</span>}
//         </button>
//       </div>
//     </motion.div>
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
      } catch (error) {
        console.error("Invalid token", error);
        setRole(null);
      }
    }
  }, []);

  const allMenuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/dashboard", access: ["admin", "hr", "manager", "employee"] },
    { name: "Projects", icon: <FolderKanban size={18} />, path: "/taskbar", access: ["admin", "manager"] },
    { name: "HR", icon: <Users size={18} />, path: "/human-resources", access: ["admin", "hr"] },
    { name: "CRM", icon: <Briefcase size={18} />, path: "/crm", access: ["admin"] },
    { name: "Performance", icon: <BarChart2 size={18} />, path: "/performance", access: ["admin", "manager", "hr"] },
  ];

  const bottomMenu = [
    { name: "Settings", icon: <Settings size={18} />, path: "/settings" },
    { name: "Support", icon: <LifeBuoy size={18} />, path: "/support" },
  ];

  const handleLogout = async () => {
    const userId = localStorage.getItem("userid");
    try {
      await fetch(`https://core-sphere-backend.vercel.app/auth/logout/${userId}`, { method: "POST" });
      localStorage.clear();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const visibleMenu = role
    ? allMenuItems.filter((item) => item.access.includes(role))
    : [];

  // --- NEW COLOR PALETTE & STYLING ---

  const baseBg = "bg-indigo-950"; // Deepest Indigo/Navy
  const hoverBg = "hover:bg-indigo-800/50"; // Subtle hover
  const activeBg = "bg-indigo-800"; // Active item background
  const activeBorder = "bg-cyan-400"; // Vibrant cyan accent for active border
  const textColor = "text-indigo-200";
  const activeTextColor = "text-white";

  return (
    <motion.div
      initial={{ x: -200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      // Updated background and width/shadow classes
      className={`h-screen ${
        isCollapsed ? "w-20" : "w-64"
      } ${baseBg} ${textColor} flex flex-col justify-between py-6 transition-all duration-300 relative shadow-2xl shadow-indigo-900/50`}
    >
      {/* === Collapse Button === */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        // Updated button styling for better contrast/pop
        className={`absolute top-5 -right-3 ${activeBg} p-1.5 rounded-full hover:bg-indigo-700 transition-all shadow-lg text-white z-20`}
      >
        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      {/* === Logo & Title === */}
      <div>
        <div className="flex items-center gap-3 px-6 mb-10">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.8 }}
            // Updated logo colors to match the theme (Gradient from light blue to indigo)
            className="bg-gradient-to-br from-cyan-400 to-indigo-500 w-10 h-10 flex items-center justify-center rounded-xl shadow-xl"
          >
            <span className="text-indigo-950 font-extrabold text-xl">CS</span>
          </motion.div>

          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-bold text-xl tracking-wide text-white" // Brighter white title
              >
                CoreSphere
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {!isCollapsed && (
          // Slightly darker, more prominent section header
          <p className="text-xs text-indigo-400 uppercase px-6 mb-3 tracking-[0.2em] font-semibold">
            Navigation
          </p>
        )}

        {/* === Menu Items (Top) === */}
        <nav className="flex flex-col space-y-1 px-3">
          {visibleMenu.length > 0 ? (
            visibleMenu.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={`group flex items-center gap-3 py-3 text-sm font-medium rounded-lg transition-all relative overflow-hidden ${
                    // Apply new active/inactive states
                    isActive
                      ? `${activeBg} ${activeTextColor} shadow-lg`
                      : `${textColor} ${hoverBg}`
                  } ${isCollapsed ? "justify-center" : "px-3"}`} // Adjust padding for collapsed state
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10"
                  >
                    {item.icon}
                  </motion.div>
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -5 }}
                        transition={{ duration: 0.3 }}
                        className="relative z-10 whitespace-nowrap"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {/* Vibrant active border/pill */}
                  <span
                    className={`absolute left-0 top-1/2 -translate-y-1/2 h-3/5 w-1 rounded-r-md transition-all ${
                      isActive
                        ? activeBorder // Show vibrant cyan
                        : "opacity-0 group-hover:opacity-100 group-hover:bg-cyan-400/30" // Subtle hover highlight
                    }`}
                  />
                </NavLink>
              );
            })
          ) : (
            <p className="text-indigo-400/70 text-xs px-3 mt-3">
              No modules available
            </p>
          )}
        </nav>
      </div>

      {/* === Bottom Section === */}
      <div className="flex flex-col border-t border-indigo-800/50 pt-4 px-3">
        {bottomMenu.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={`group flex items-center gap-3 py-3 text-sm font-medium rounded-lg transition-all ${
                isActive
                  ? `${activeBg} ${activeTextColor} shadow-lg`
                  : `${textColor} ${hoverBg}`
              } ${isCollapsed ? "justify-center" : "px-3"}`}
            >
              {item.icon}
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -5 }}
                    transition={{ duration: 0.3 }}
                    className="whitespace-nowrap"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 py-3 text-sm text-indigo-400 hover:text-red-400 hover:bg-indigo-800/50 transition-all mt-2 rounded-lg ${isCollapsed ? "justify-center" : "px-3"}`}
        >
          <LogOut size={18} />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -5 }}
                transition={{ duration: 0.3 }}
                className="whitespace-nowrap"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  );
}