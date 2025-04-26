import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FiHome,
  FiUsers,
  FiMessageSquare,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";

const DashboardLayout = ({ children }) => {
  const { user, setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    setToken(null);
    navigate("/");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const navigation = [
    { name: "Dashboard", icon: FiHome, href: "/dashboard", current: true },
    {
      name: "Friends",
      icon: FiUsers,
      href: "/dashboard/friends",
      current: false,
    },
    {
      name: "Messages",
      icon: FiMessageSquare,
      href: "/dashboard/messages",
      current: false,
    },
    {
      name: "Settings",
      icon: FiSettings,
      href: "/dashboard/settings",
      current: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      {/* Account for fixed header height */}
      <div className="max-w-6xl mx-auto px-4 flex flex-col lg:flex-row gap-6">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-gray-600 bg-opacity-75 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Left Sidebar (Navigation) */}
        <div
          className={`fixed lg:sticky top-16 z-30 w-56 transition-transform duration-300 transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          } bg-white rounded-lg shadow-lg h-[calc(100vh-4rem)] overflow-y-auto lg:block`}
        >
          <div className="pt-5 pb-4 px-2">
            {/* Mobile sidebar header */}
            <div className="flex items-center justify-between px-4 lg:hidden">
              <div className="flex items-center">
                <svg
                  className="h-8 w-8 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                </svg>
                <span className="ml-2 text-xl font-bold text-gray-800">
                  Social App
                </span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="ml-4 inline-flex items-center justify-center h-10 w-10 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors duration-150 ${
                    item.current
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      item.current
                        ? "text-blue-600"
                        : "text-gray-400 group-hover:text-gray-500"
                    }`}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content (Center) */}
        <div className="flex-1 lg:w-3/5 bg-white rounded-lg shadow-lg p-6">
          {children}
        </div>

        {/* Mobile Menu Button (Overlay Trigger) */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed bottom-4 right-4 p-4 bg-blue-600 text-white rounded-full shadow-lg focus:outline-none"
        >
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>
    </div>
  );
};

export default DashboardLayout;
