import React, { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FiChevronDown, FiUser, FiSettings, FiLogOut } from "react-icons/fi";

const Header = () => {
  const { isAuthenticated, currentUser, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  return (
    <header className="fixed w-full bg-white shadow-sm z-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div>
            <Link to="/" className="flex items-center">
              <svg
                className="h-8 w-8 text-blue-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
              </svg>
              <span className="ml-2 text-xl font-bold text-gray-800">
                Social Skill
              </span>
            </Link>
          </div>

          <div>
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors focus:outline-none"
                >
                  <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 border border-gray-300">
                    {currentUser?.pictureUrl ? (
                      <img
                        src={currentUser.pictureUrl}
                        alt={currentUser.name || currentUser.email}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-500">
                        <FiUser />
                      </div>
                    )}
                  </div>
                  <span className="font-medium">
                    {currentUser?.name || currentUser?.email || "User"}
                  </span>
                  <FiChevronDown
                    className={`transition-transform duration-200 ${
                      dropdownOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                <div
                  className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 transition-all duration-200 ease-in-out origin-top-right ${
                    dropdownOpen
                      ? "transform opacity-100 scale-100"
                      : "transform opacity-0 scale-95 pointer-events-none"
                  }`}
                >
                  <Link
                    to={`/profile/${currentUser.id}`}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <FiUser className="mr-2" />
                    Profile
                  </Link>
                  <Link
                    to="/edit-profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <FiSettings className="mr-2" />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
                  >
                    <FiLogOut className="mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Get started
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
