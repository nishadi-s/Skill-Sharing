import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { storage } from "../../firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { HiOutlineCamera, HiOutlineUser, HiOutlineTrash } from "react-icons/hi";
import { MdOutlineEmail } from "react-icons/md";

const MySwal = withReactContent(Swal);

const EditProfile = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pictureUrl, setPictureUrl] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Fetch current user details on mount
  useEffect(() => {
    const fetchUser = async () => {
      if (!currentUser) return;

      try {
        const response = await axios.get("http://localhost:8081/api/user/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setName(response.data.name || "");
        setPictureUrl(response.data.pictureUrl || "");
      } catch (err) {
        setError("Failed to load user data.");
      }
    };
    fetchUser();
  }, [currentUser]);

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Handle profile update
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      MySwal.fire({
        icon: "error",
        title: "Unauthorized",
        text: "Please log in to update your profile.",
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let updatedPictureUrl = pictureUrl;

      // Upload new profile picture to Firebase if a file is selected
      if (file) {
        const storageRef = ref(
          storage,
          `profile-pictures/${currentUser.id}-${file.name}`
        );
        await uploadBytes(storageRef, file);
        updatedPictureUrl = await getDownloadURL(storageRef);
      }

      // Send update request to backend
      const response = await axios.put(
        "http://localhost:8081/api/user/me",
        { name, pictureUrl: updatedPictureUrl },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      MySwal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your profile has been updated successfully!",
        timer: 1500,
      });

      // Update local state
      setPictureUrl(response.data.pictureUrl);
      setFile(null);
      setPreviewUrl(null);
    } catch (err) {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data || "Failed to update profile.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle account deletion
  const handleDelete = async () => {
    if (!currentUser) {
      MySwal.fire({
        icon: "error",
        title: "Unauthorized",
        text: "Please log in to delete your account.",
      });
      return;
    }

    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone. Your account and all associated data will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        await axios.delete("http://localhost:8081/api/user/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        MySwal.fire({
          icon: "success",
          title: "Account Deleted",
          text: "Your account has been deleted successfully.",
          timer: 1500,
        });

        // Clear local storage and redirect to login or home
        localStorage.removeItem("token");
        navigate("/login");
      } catch (err) {
        MySwal.fire({
          icon: "error",
          title: "Error",
          text: err.response?.data || "Failed to delete account.",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-white p-6 text-gray-600">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-3 text-white hover:text-blue-200 transition"
            disabled={loading}
          ></button>
          <h2 className="text-2xl font-bold">Edit Profile</h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
          {/* Profile Picture */}
          <div className="flex justify-center mb-2">
            <div className="relative">
              <img
                src={
                  previewUrl || pictureUrl || "https://via.placeholder.com/150"
                }
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
              />
              <label
                htmlFor="profile-picture"
                className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition"
              >
                <HiOutlineCamera size={20} />
              </label>
              <input
                id="profile-picture"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={loading}
              />
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg">
            {/* Name Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineUser className="text-gray-400" size={20} />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your name"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email Input (Read-only) */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute top-4 left-0 pl-3 flex items-center pointer-events-none">
                  <MdOutlineEmail className="text-gray-400" size={20} />
                </div>
                <input
                  type="email"
                  value={currentUser?.email || ""}
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  disabled={true}
                  readOnly
                />
                <p className="mt-1 text-xs text-gray-500 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Email address cannot be changed
                </p>
              </div>
            </div>

            {/* Update Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-blue-400 flex justify-center items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Updating...
                </>
              ) : (
                "Update Profile"
              )}
            </button>
          </div>
        </form>

        {/* Danger Zone */}
        <div className="mt-10 border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Danger Zone
          </h3>
          <div className="bg-red-50 p-4 rounded-lg border border-red-100">
            <p className="text-sm text-gray-600 mb-4">
              Once you delete your account, there is no going back. Please be
              certain.
            </p>
            <button
              onClick={handleDelete}
              className="w-full bg-white border border-red-500 text-red-600 py-3 rounded-lg font-medium hover:bg-red-500 hover:text-white transition flex justify-center items-center"
              disabled={loading}
            >
              <HiOutlineTrash className="mr-2" size={20} />
              {loading ? "Processing..." : "Delete Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
