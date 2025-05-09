import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { AuthContext } from "../../context/AuthContext";

const MySwal = withReactContent(Swal);

const ProfileCard = ({ user, isFollowing, onFollowChange }) => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

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
        `http://localhost:8081/api/user/follow/${user.id}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      MySwal.fire({
        icon: "success",
        title: "Followed",
        text: `You are now following ${user.name}!`,
        timer: 1500,
      });
      onFollowChange(true);
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
        `http://localhost:8081/api/user/unfollow/${user.id}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      MySwal.fire({
        icon: "success",
        title: "Unfollowed",
        text: `You have unfollowed ${user.name}.`,
        timer: 1500,
      });
      onFollowChange(false);
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data || "Failed to unfollow user.",
      });
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm mb-4 flex items-center justify-between">
      <div className="flex items-center">
        <img
          src={user.pictureUrl || "https://via.placeholder.com/48"}
          alt={user.name}
          className="w-12 h-12 rounded-full object-cover mr-3"
        />
        <div>
          <h4 className="text-base font-semibold text-gray-800">{user.name}</h4>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => navigate(`/profile/${user.id}`)}
          className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50"
        >
          View Profile
        </button>
        {currentUser && currentUser.id !== user.id && (
          <button
            onClick={isFollowing ? handleUnfollow : handleFollow}
            className={`px-3 py-1 text-sm rounded-full ${
              isFollowing
                ? "bg-gray-200 text-gray-600 hover:bg-gray-300"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
