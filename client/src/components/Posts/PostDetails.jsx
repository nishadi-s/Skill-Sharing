import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Trash2, Edit, ThumbsUp, MessageCircle } from "lucide-react";

const MySwal = withReactContent(Swal);

const PostDetails = () => {
  const { postId } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        // Fetch post details
        const postResponse = await axios.get(
          `http://localhost:8081/api/user/posts/${postId}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );
        setPost(postResponse.data);

        // Fetch comments
        const commentsResponse = await axios.get(
          `http://localhost:8081/api/user/comments/post/${postId}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );
        setComments(commentsResponse.data);

        // Fetch likes
        const likesResponse = await axios.get(
          `http://localhost:8081/api/user/likes/post/${postId}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );
        setLikeCount(likesResponse.data.length);
        setLiked(
          currentUser && currentUser.id
            ? likesResponse.data.some((like) => like.user.id === currentUser.id)
            : false
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [postId, currentUser]);

  const handleLike = async () => {
    try {
      if (liked) {
        await axios.delete(
          `http://localhost:8081/api/user/likes/post/${postId}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );
        setLiked(false);
        setLikeCount(likeCount - 1);
      } else {
        await axios.post(
          `http://localhost:8081/api/user/likes/post/${postId}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );
        setLiked(true);
        setLikeCount(likeCount + 1);
      }
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update like status.",
      });
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      MySwal.fire({
        icon: "warning",
        title: "Empty Comment",
        text: "Please enter a comment before posting.",
      });
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8081/api/user/comments/post/${postId}`,
        { content: comment },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
      setComments([...comments, response.data]);
      setComment("");
      MySwal.fire({
        icon: "success",
        title: "Comment Posted",
        text: "Your comment has been added.",
        timer: 1500,
      });
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to post comment. Please try again.",
      });
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editCommentText.trim()) {
      MySwal.fire({
        icon: "warning",
        title: "Empty Comment",
        text: "Please enter a comment before saving.",
      });
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8081/api/user/comments/${commentId}`,
        { content: editCommentText },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
      setComments(
        comments.map((c) =>
          c.id === commentId ? { ...c, content: response.data.content } : c
        )
      );
      setEditingCommentId(null);
      setEditCommentText("");
      MySwal.fire({
        icon: "success",
        title: "Comment Updated",
        text: "Your comment has been updated.",
        timer: 1500,
      });
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update comment. Please try again.",
      });
    }
  };

  const handleDeleteComment = async (commentId) => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this comment? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `http://localhost:8081/api/user/comments/${commentId}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );
        setComments(comments.filter((c) => c.id !== commentId));
        MySwal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Your comment has been deleted.",
          timer: 1500,
        });
      } catch (error) {
        MySwal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete comment. Please try again.",
        });
      }
    }
  };

  const startEditingComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditCommentText(comment.content);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditCommentText("");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Post not found</h2>
          <p>The post you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 max-w-4xl">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Post header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center mb-4">
            <img
              src={post.user.pictureUrl || "/api/placeholder/40/40"}
              alt={post.user.name}
              className="w-12 h-12 rounded-full object-cover mr-4"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {post.user.name}
              </h3>
              <p className="text-sm text-gray-500">
                {formatDate(post.createdAt)}
              </p>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {post.title}
          </h1>
          <p className="text-gray-700 whitespace-pre-line mb-4">
            {post.content}
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Media gallery */}
        {post.mediaUrls && post.mediaUrls.length > 0 && (
          <div className="border-b border-gray-100">
            <div className="relative">
              {post.fileTypes[activeMediaIndex] === "video" ? (
                <video
                  src={post.mediaUrls[activeMediaIndex]}
                  controls
                  className="w-full object-contain max-h-96"
                />
              ) : (
                <img
                  src={post.mediaUrls[activeMediaIndex]}
                  alt={`Media ${activeMediaIndex + 1}`}
                  className="w-full object-contain max-h-96"
                />
              )}

              {post.mediaUrls.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveMediaIndex((prev) =>
                        prev === 0 ? post.mediaUrls.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75"
                    aria-label="Previous media"
                  >
                    ←
                  </button>
                  <button
                    onClick={() =>
                      setActiveMediaIndex((prev) =>
                        prev === post.mediaUrls.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75"
                    aria-label="Next media"
                  >
                    →
                  </button>
                </>
              )}
            </div>

            {post.mediaUrls.length > 1 && (
              <div className="flex overflow-x-auto p-2 gap-2">
                {post.mediaUrls.map((url, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveMediaIndex(idx)}
                    className={`cursor-pointer flex-shrink-0 ${
                      activeMediaIndex === idx ? "ring-2 ring-blue-500" : ""
                    }`}
                  >
                    {post.fileTypes[idx] === "video" ? (
                      <div className="relative w-16 h-16">
                        <video
                          src={url}
                          className="w-16 h-16 object-cover rounded"
                          muted
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-gray-800 bg-opacity-50 rounded-full p-1">
                            <span className="text-white text-xs">▶</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={url}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Engagement stats */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-6">
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-500">{likeCount} likes</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-500">
              {comments.length} comments
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex border-b border-gray-100">
          <button
            className={`flex-1 py-3 flex items-center justify-center gap-2 hover:bg-gray-50 ${
              liked ? "text-blue-600" : "text-gray-600"
            }`}
            onClick={handleLike}
          >
            <ThumbsUp />
            <span>{liked ? "Unlike" : "Like"}</span>
          </button>
          <button
            className="flex-1 py-3 flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-50"
            onClick={() => document.getElementById("comment-input").focus()}
          >
            <MessageCircle />
            <span>Comment</span>
          </button>
        </div>

        {/* Comment input */}
        <div className="p-4 border-b border-gray-100">
          <form onSubmit={handleComment} className="flex gap-3">
            <img
              src={currentUser?.pictureUrl || "/api/placeholder/40/40"}
              alt="Your profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 flex">
              <input
                id="comment-input"
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 border border-gray-300 rounded-l-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!comment.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded-r-full font-medium disabled:bg-blue-300 hover:bg-blue-700"
              >
                Post
              </button>
            </div>
          </form>
        </div>

        {/* Comments list */}
        <div className="divide-y divide-gray-100">
          {comments.length === 0 ? (
            <p className="p-4 text-gray-500">No comments yet.</p>
          ) : (
            comments.map((comment) => {
              const isAuthor =
                currentUser && comment.user.id === currentUser.id;
              return (
                <div key={comment.id} className="p-4">
                  <div className="flex gap-3">
                    <img
                      src={comment.user.pictureUrl || "/api/placeholder/40/40"}
                      alt={comment.user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      {editingCommentId === comment.id ? (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <input
                            type="text"
                            value={editCommentText}
                            onChange={(e) => setEditCommentText(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Edit your comment..."
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditComment(comment.id)}
                              className="bg-blue-600 text-white px-4 py-1 rounded font-medium hover:bg-blue-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="bg-gray-300 text-gray-800 px-4 py-1 rounded font-medium hover:bg-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-lg p-3 relative">
                          <div className="font-semibold">
                            {comment.user.name}
                          </div>
                          <p className="text-gray-700">{comment.content}</p>
                          {isAuthor && (
                            <div className="absolute top-3 right-3 flex space-x-2">
                              <button
                                onClick={() => startEditingComment(comment)}
                                className="p-1 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100"
                                title="Edit comment"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="p-1 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100"
                                title="Delete comment"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 pl-2">
                        <span>{formatDate(comment.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
