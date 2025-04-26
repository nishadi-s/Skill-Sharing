import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [followingCount, setFollowingCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Fetch user's posts
        const postsResponse = await axios.get(
          "http://localhost:8080/api/users/me/posts",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setPosts(postsResponse.data);

        // Fetch following count (mock for now)
        // Replace with actual API call: axios.get("http://localhost:8080/api/users/me/following")
        setFollowingCount(42); // Mock data

        // Fetch followers count (mock for now)
        // Replace with actual API call: axios.get("http://localhost:8080/api/users/me/followers")
        setFollowersCount(128); // Mock data
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  return (
    <div className="space-y-6">
      {/* User Details Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <img
            src={user?.pictureUrl || "https://via.placeholder.com/100"}
            alt="Profile"
            className="w-24 h-24 rounded-full border-2 border-blue-500 p-1"
          />
          <div className="text-center md:text-left flex-1">
            <h1 className="text-2xl font-bold text-gray-800">
              {user?.name || "User"}
            </h1>
            <p className="text-gray-600">{user?.email || "user@example.com"}</p>
            <div className="mt-2 flex justify-center md:justify-start space-x-6">
              <div>
                <span className="font-semibold text-gray-800">
                  {posts.length}
                </span>
                <span className="text-gray-600"> Posts</span>
              </div>
              <div>
                <span className="font-semibold text-gray-800">
                  {followingCount}
                </span>
                <span className="text-gray-600"> Following</span>
              </div>
              <div>
                <span className="font-semibold text-gray-800">
                  {followersCount}
                </span>
                <span className="text-gray-600"> Followers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User's Posts Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">My Posts</h2>
        {loading ? (
          <p className="text-gray-600">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-gray-600">You haven't posted anything yet.</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-gray-50 p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-800">
                  {post.title}
                </h3>
                <p className="text-gray-600">{post.content}</p>
                <Link
                  to={`/dashboard/post/${post.id}`}
                  className="text-blue-500 hover:underline mt-2 inline-block"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
