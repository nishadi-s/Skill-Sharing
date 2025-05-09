import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { UserPlus, UserCheck, UserX } from "lucide-react";
import { Link } from "react-router-dom";

const NetworkPage = () => {
  const { currentUser } = useContext(AuthContext);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [otherUsers, setOtherUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("following");

  useEffect(() => {
    const fetchNetwork = async () => {
      if (!currentUser) {
        setError("Please log in to view your network.");
        setLoading(false);
        return;
      }

      try {
        // Fetch current user with followers and following
        const userResponse = await axios.get(
          "http://localhost:8081/api/user/me",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Fetch followers
        const followersData = await Promise.all(
          userResponse.data.followers.map(async (userId) => {
            const response = await axios.get(
              `http://localhost:8081/api/user/${userId}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            return response.data;
          })
        );

        // Fetch following
        const followingData = await Promise.all(
          userResponse.data.following.map(async (userId) => {
            const response = await axios.get(
              `http://localhost:8081/api/user/${userId}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            return response.data;
          })
        );

        // Fetch other users (not followers or following)
        const otherUsersResponse = await axios.get(
          "http://localhost:8081/api/users",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setFollowers(followersData);
        setFollowing(followingData);
        setOtherUsers(otherUsersResponse.data);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data || "Failed to load network data.");
        setLoading(false);
      }
    };

    fetchNetwork();
  }, [currentUser]);

  const handleFollowChange = async (userId, isFollowing) => {
    try {
      if (isFollowing) {
        // Follow user
        await axios.post(
          `http://localhost:8081/api/user/follow/${userId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Move user from otherUsers to following
        const userToFollow =
          otherUsers.find((u) => u.id === userId) ||
          followers.find((u) => u.id === userId);

        if (userToFollow) {
          setFollowing((prev) => [...prev, userToFollow]);
          setOtherUsers((prev) => prev.filter((u) => u.id !== userId));
        }
      } else {
        // Unfollow user
        await axios.post(
          `http://localhost:8081/api/user/unfollow/${userId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Move user from following to otherUsers
        const userToUnfollow = following.find((u) => u.id === userId);
        if (userToUnfollow) {
          setFollowing((prev) => prev.filter((u) => u.id !== userId));
          // Only add to otherUsers if they're not already a follower
          if (!followers.some((f) => f.id === userId)) {
            setOtherUsers((prev) => [...prev, userToUnfollow]);
          }
        }
      }
    } catch (error) {
      console.error("Error updating follow status:", error);
    }
  };

  const UserCard = ({ user, isFollowing }) => {
    return (
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 overflow-hidden">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={`${user.name}'s profile`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-200 text-blue-600 text-lg font-medium">
                {user.name?.charAt(0).toUpperCase() ||
                  user.username?.charAt(0).toUpperCase() ||
                  "U"}
              </div>
            )}
          </div>
          <Link to={`/profile/${user.id}`}>
            <div className="ml-4">
              <h4 className="font-medium">{user.name || user.username}</h4>
              {user.title && (
                <p className="text-sm text-gray-600">{user.title}</p>
              )}
            </div>
          </Link>
        </div>
        <button
          onClick={() => handleFollowChange(user.id, !isFollowing)}
          className={`flex items-center px-4 py-2 rounded-md ${
            isFollowing
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
              : "bg-blue-500 text-white hover:bg-blue-600"
          } transition-colors`}
        >
          {isFollowing ? (
            <>
              <UserCheck size={16} className="mr-1" /> Following
            </>
          ) : (
            <>
              <UserPlus size={16} className="mr-1" /> Follow
            </>
          )}
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="inline-flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
          <UserX size={20} className="mr-2" />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">My Network</h1>
        <p className="text-gray-600">
          Connect and manage your professional network
        </p>
      </header>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("following")}
            className={`px-6 py-3 font-medium text-sm flex items-center ${
              activeTab === "following"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Following{" "}
            <span className="ml-2 bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full">
              {following.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("followers")}
            className={`px-6 py-3 font-medium text-sm flex items-center ${
              activeTab === "followers"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Followers{" "}
            <span className="ml-2 bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full">
              {followers.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("discover")}
            className={`px-6 py-3 font-medium text-sm flex items-center ${
              activeTab === "discover"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Discover{" "}
            <span className="ml-2 bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full">
              {otherUsers.length}
            </span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "following" && (
            <div>
              {following.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <UserPlus size={40} className="mx-auto mb-4 text-gray-400" />
                  <p>You're not following anyone yet.</p>
                  <button
                    onClick={() => setActiveTab("discover")}
                    className="mt-4 text-blue-500 hover:text-blue-600"
                  >
                    Discover people to follow
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {following.map((user) => (
                    <UserCard key={user.id} user={user} isFollowing={true} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "followers" && (
            <div>
              {followers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <UserCheck size={40} className="mx-auto mb-4 text-gray-400" />
                  <p>You don't have any followers yet.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {followers.map((user) => (
                    <UserCard
                      key={user.id}
                      user={user}
                      isFollowing={following.some((u) => u.id === user.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "discover" && (
            <div>
              {otherUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <UserPlus size={40} className="mx-auto mb-4 text-gray-400" />
                  <p>No new people to connect with right now.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {otherUsers.map((user) => (
                    <UserCard key={user.id} user={user} isFollowing={false} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkPage;
