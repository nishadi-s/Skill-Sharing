import { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FiHome,
  FiUsers,
  FiMessageSquare,
  FiSettings,
  FiLogOut,
  FiBell,
  FiCheckSquare,
  FiCoffee,
  FiCompass,
} from "react-icons/fi";
import { LuUserRound } from "react-icons/lu";
import { IoBookOutline } from "react-icons/io5";
import Vecimg from "../assets/vector.svg";

const DashboardLayout = ({ children }) => {
  const { setToken, currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navigation = [
    {
      name: "Home",
      icon: FiHome,
      href: "/feed",
      current: location.pathname === "/feed",
    },
    {
      name: "Network",
      icon: FiUsers,
      href: "/friends",
      current: location.pathname === "/friends",
    },
    {
      name: "Learning Plans",
      icon: IoBookOutline,
      href: "/learning-plans",
      current: location.pathname === "/learning-plans",
    },
    {
      name: "Progress Updates",
      icon: FiCheckSquare,
      href: "/progress-updates",
      current: location.pathname === "/progress-updates",
    },
    {
      name: "My Profile",
      icon: LuUserRound,
      href: currentUser ? `/profile/${currentUser.id}` : "/login",
      current: location.pathname === `/profile/${currentUser?.id}`,
    },
    {
      name: "Edit Profile",
      icon: FiSettings,
      href: "/edit-profile",
      current: location.pathname === "/edit-profile",
    },
  ];

  const learningQuotes = [
    "The only bug that's truly unfixable is giving up!",
    "Learning is like debugging life — one step at a time!",
    "Today's 'I have no idea' is tomorrow's 'Oh, that's easy'",
    "Fall seven times, debug eight.",
    "Your brain has infinite storage capacity, no AWS charges!",
  ];

  // Pick a random quote
  const randomQuote =
    learningQuotes[Math.floor(Math.random() * learningQuotes.length)];

  return (
    <div className="min-h-screen bg-[#f3f2ef] pt-20">
      {/* Main Content */}
      <div className="max-w-[1128px] mx-auto flex py-5">
        {/* Left Sidebar */}
        <aside className="w-[225px] sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto">
          <nav className="px-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center p-3 rounded mb-1 no-underline ${
                  item.current
                    ? "font-semibold text-black bg-gray-200"
                    : "font-normal text-gray-600 hover:bg-gray-200"
                }`}
              >
                <item.icon className="mr-3 text-xl" />
                <span>{item.name}</span>
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center p-3 w-full text-gray-600 font-normal rounded mt-2 border-none bg-transparent cursor-pointer hover:bg-gray-200"
            >
              <FiLogOut className="mr-3 text-xl" />
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* Main Feed */}
        <main className="flex-1 mx-6 max-w-[600px]">{children}</main>

        {/* Right Sidebar */}
        <aside className="w-[300px] sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto">
          <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <h3 className="text-base font-semibold mb-4">Recent Activity</h3>
            <p className="text-gray-600 text-sm">No recent activity</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm mt-4">
            <h3 className="text-base font-semibold mb-4">
              How to Use This App
            </h3>
            <img
              src={Vecimg}
              alt="Learning vector"
              className="w-full h-40 object-contain mb-3"
            />
            <ul className="space-y-2 mb-4">
              <li className="flex items-start">
                <FiCompass className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
                <span className="text-sm">
                  Set clear, achievable goals in Learning Plans
                </span>
              </li>
              <li className="flex items-start">
                <FiUsers className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                <span className="text-sm">
                  Connect with peers studying similar topics
                </span>
              </li>
              <li className="flex items-start">
                <FiCheckSquare className="text-purple-500 mt-1 mr-2 flex-shrink-0" />
                <span className="text-sm">
                  Track weekly progress to build momentum
                </span>
              </li>
              <li className="flex items-start">
                <FiCoffee className="text-orange-500 mt-1 mr-2 flex-shrink-0" />
                <span className="text-sm">
                  Take breaks! Learning happens during rest too
                </span>
              </li>
            </ul>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-xs italic text-gray-700">{randomQuote}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DashboardLayout;
