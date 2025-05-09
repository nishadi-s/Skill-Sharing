import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Trash2, Edit } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  // Check if the current user is the author of the post
  const isAuthor = currentUser && post.user.id === currentUser.id;

  // Truncate content to 150 characters
  const truncatedContent =
    post.content.length > 150
      ? post.content.substring(0, 150) + "..."
      : post.content;

  // Format date from createdAt timestamp
  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "Recently";

  // Get the first image URL (if available)
  const imageUrl =
    post.mediaUrls && post.mediaUrls.length > 0 ? post.mediaUrls[0] : null;

  // Check if media is video
  const isVideo = imageUrl && post.fileTypes && post.fileTypes[0] === "video";

  // Handle click to navigate to post details
  const handlePostClick = () => {
    navigate(`/post/${post.id}`);
  };

  // Handle delete click with confirmation
  const handleDeleteClick = async (e) => {
    e.stopPropagation();

    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this post? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        console.log("Attempting to delete post ID:", post.id);
        const response = await fetch(
          `http://localhost:8081/api/user/posts/${post.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to delete post: ${response.statusText}`);
        }

        MySwal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Your post has been deleted.",
          timer: 1500,
        });

        // Navigate to a safe page (e.g., home or profile) after deletion
        navigate("/");
      } catch (error) {
        console.error("Delete error:", error.message);
        MySwal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete post. Please try again.",
        });
      }
    }
  };

  // Parse tags for display
  const displayTags =
    post.tags && post.tags.length > 0
      ? post.tags.map((tag) => `#${tag}`).join(" ")
      : "";

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-4 cursor-pointer hover:shadow-md transition-shadow duration-200 relative"
      onClick={handlePostClick}
    >
      {/* Header with user info */}
      <div className="p-4">
        <div className="flex items-center mb-3">
          <img
            src={post.user.pictureUrl || "/api/placeholder/40/40"}
            alt={post.user.name}
            className="w-12 h-12 rounded-full object-cover mr-3"
          />
          <div className="flex-1">
            <div className="flex items-baseline flex-wrap">
              <h3 className="text-base font-semibold text-gray-900">
                {post.user.name}
              </h3>
              <span className="mx-1 text-gray-500">•</span>
              <span className="text-sm text-gray-500">
                {post.user.headline || ""}
              </span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <span>{formattedDate}</span>
            </div>
          </div>

          {/* Edit and Delete buttons - Only visible for post author */}
          {isAuthor && (
            <div className="flex space-x-2">
              <Link
                to={`/edit-post/${post.id}`}
                state={{ post }}
                className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100"
                onClick={(e) => e.stopPropagation()}
              >
                <Edit size={18} />
              </Link>

              <button
                onClick={handleDeleteClick}
                className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100"
                title="Delete post"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        </div>
        ış {/* Post title and content */}
        <div className="mb-3">
          {post.title && (
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              {post.title}
            </h4>
          )}
          <p className="text-sm text-gray-700 whitespace-pre-line">
            {truncatedContent}
          </p>

          {/* Display tags */}
          {displayTags && (
            <p className="text-sm text-blue-600 mt-2">{displayTags}</p>
          )}
        </div>
      </div>

      {/* Media content */}
      {imageUrl && (
        <div className="border-t border-gray-100">
          {isVideo ? (
            <video
              src={imageUrl}
              controls
              className="w-full max-h-96"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <img
              src={imageUrl}
              alt={post.title || "Post image"}
              className="w-full object-cover max-h-96"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;
