import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { AuthContext } from "../../context/AuthContext";
import PostCard from "../../components/Posts/PostCard";

const MySwal = withReactContent(Swal)

const ProfilePage = () => {
  const { userId } = useParams();
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("posts"); // Track active tab

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Fetch user details
        const userResponse = await axios.get(
          `http://localhost:8081/api/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUser(userResponse.data);

        // Check if current user is following this user
        if (currentUser) {
          const currentUserResponse = await axios.get(
            "http://localhost:8081/api/user/me",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setIsFollowing(currentUserResponse.data.following.includes(userId));
        }

        // Fetch user's posts
        const postsResponse = await axios.get(
          `http://localhost:8081/api/user/posts/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setPosts(postsResponse.data);

        // Fetch user's progress updates
        const progressResponse = await axios.get(
          `http://localhost:8081/api/user/progress-updates?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUpdates(progressResponse.data);

        setLoading(false);
      } catch (error) {
        setError(error.response?.data || "Failed to load profile data.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, currentUser]);

  const handleFollow = async () => {
    if (!currentUser) {
      MySwal.fire({
        icon: "error",
        title: "Unauthorized",
        text: "Please log in to follow users.",
      });
      return;
    }

    try {
      await axios.post(
        `http://localhost:8081/api/user/follow/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setIsFollowing(true);
      setUser((prev) => ({
        ...prev,
        followers: [...prev.followers, currentUser.id],
      }));
      MySwal.fire({
        icon: "success",
        title: "Followed",
        text: `You are now following ${user.name}!`,
        timer: 1500,
      });
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data || "Failed to follow user.",
      });
    }
  };

  const handleUnfollow = async () => {
    if (!currentUser) {
      MySwal.fire({
        icon: "error",
        title: "Unauthorized",
        text: "Please log in to unfollow users.",
      });
      return;
    }

    try {
      await axios.post(
        `http://localhost:8081/api/user/unfollow/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setIsFollowing(false);
      setUser((prev) => ({
        ...prev,
        followers: prev.followers.filter((id) => id !== currentUser.id),
      }));
      MySwal.fire({
        icon: "success",
        title: "Unfollowed",
        text: `You have unfollowed ${user.name}.`,
        timer: 1500,
      });
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data || "Failed to unfollow user.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {/* Profile Header */}
      <div className=" p-6 text-gray-600">
        <div className="flex items-center">
          <img
            src={user.pictureUrl || "https://via.placeholder.com/96"}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-white"
          />
          <div className="ml-6">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-blue-500">{user.email}</p>
            <div className="flex space-x-6 mt-2">
              <p className="text-sm">
                <span className="font-semibold">{user.followers.length}</span>{" "}
                Followers
              </p>
              <p className="text-sm">
                <span className="font-semibold">{user.following.length}</span>{" "}
                Following
              </p>
            </div>
          </div>
        </div>

        {currentUser && currentUser.id !== userId && (
          <div className="mt-4">
            <button
              onClick={isFollowing ? handleUnfollow : handleFollow}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                isFollowing
                  ? "bg-white text-blue-600 hover:bg-blue-50"
                  : "bg-blue-500 text-white border border-white hover:bg-blue-700"
              }`}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex">
          <button
            onClick={() => setActiveTab("posts")}
            className={`px-4 py-3 font-medium text-sm ${
              activeTab === "posts"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab("updates")}
            className={`px-4 py-3 font-medium text-sm ${
              activeTab === "updates"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Progress Updates
          </button>
        </nav>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {activeTab === "posts" && (
          <>
            {posts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No posts yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "updates" && (
          <>
            {updates.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No progress updates yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {updates.map((update) => (
                  <div key={update.id} className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-gray-800">{update.content}</p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-blue-600 font-medium">
                        {update.templateType || "Standard Update"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(update.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
