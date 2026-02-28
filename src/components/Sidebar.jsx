// Sidebar.tsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, MapPin, Hotel, Tag, Package, Film, Info, LogOut } from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Destination", path: "/destination", icon: <MapPin size={18} /> },
    { name: "Tour", path: "/tour", icon: <Film size={18} /> },
    { name: "Tour Schedule", path: "/tour-schedule", icon: <Film size={18} /> },
    { name: "Tour Tag", path: "/tour-tag", icon: <Tag size={18} /> },
    { name: "Hotel", path: "/hotel", icon: <Hotel size={18} /> },
    { name: "Category", path: "/category", icon: <Hotel size={18} /> },
    { name: "Country", path: "/country", icon: <Hotel size={18} /> },
    { name: "Package Tour", path: "/package-tour", icon: <Package size={18} /> },
    { name: "Package Hotel", path: "/package-hotel", icon: <Package size={18} /> },
    { name: "Package Tag", path: "/package-tag", icon: <Tag size={18} /> },
    { name: "Packages", path: "/packages", icon: <Package size={18} /> },
    { name: "Tags", path: "/tags", icon: <Tag size={18} /> },
    { name: "Media", path: "/media", icon: <Info size={18} /> },
    { name: "FAQ", path: "/faq", icon: <Info size={18} /> },
  ];

  const handleLogout = () => {
    // Local storage dan auth ma'lumotlarini o'chirish
    localStorage.removeItem("auth");
    // Login sahifaga yo'naltirish
    navigate("/login");
  };

  return (
    <aside className="w-64 h-screen bg-gray-100 shadow-md p-4 flex flex-col justify-between">
      <div>
        <h1 className="text-xl font-bold mb-4">Admin Panel</h1>
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => (
            <NavLink
              to={item.path}
              key={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded hover:bg-gray-200 ${isActive ? "bg-blue-500 text-white" : "text-gray-700"
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="flex cursor-pointer items-center gap-2 p-2 rounded duration-200 hover:bg-red-500 hover:text-white text-gray-700 mt-4"
      >
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;