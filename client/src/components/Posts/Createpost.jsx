import React, { useState } from "react";
import { FaImage, FaVideo, FaTag, FaPaperPlane } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import { storage } from "../../firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const MySwal = withReactContent(Swal);

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [fileTypes, setFileTypes] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);

  const MAX_IMAGES = 4;
  const MAX_VIDEO_DURATION = 30; // seconds
  const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"];
  const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm"];

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    let newMediaFiles = [...mediaFiles];
    let newFileTypes = [...fileTypes];
    let newMediaPreviews = [...mediaPreviews];

    files.forEach((file) => {
      if (newMediaFiles.length >= MAX_IMAGES) {
        MySwal.fire({
          icon: "error",
          title: "Limit Exceeded",
          text: `You can only upload up to ${MAX_IMAGES} files.`,
        });
        return;
      }

      if (ALLOWED_IMAGE_TYPES.includes(file.type)) {
        newMediaFiles.push(file);
        newFileTypes.push("image");
        newMediaPreviews.push(URL.createObjectURL(file));
      } else if (ALLOWED_VIDEO_TYPES.includes(file.type)) {
        // Check video duration
        const video = document.createElement("video");
        video.preload = "metadata";
        video.onloadedmetadata = () => {
          window.URL.revokeObjectURL(video.src);
          if (video.duration > MAX_VIDEO_DURATION) {
            MySwal.fire({
              icon: "error",
              title: "Video Too Long",
              text: `Video duration cannot exceed ${MAX_VIDEO_DURATION} seconds.`,
            });
          } else {
            newMediaFiles.push(file);
            newFileTypes.push("video");
            newMediaPreviews.push(URL.createObjectURL(file));
          }
        };
        video.src = URL.createObjectURL(file);
      } else {
        MySwal.fire({
          icon: "error",
          title: "Invalid File Type",
          text: "Only JPEG, PNG, GIF images and MP4, WebM videos are allowed.",
        });
      }
    });

    setMediaFiles(newMediaFiles);
    setFileTypes(newFileTypes);
    setMediaPreviews(newMediaPreviews);
  };

  const uploadMediaToFirebase = async (file, index) => {
    const fileExtension = file.name.split(".").pop();
    const storageRef = ref(
      storage,
      `media/${Date.now()}_${index}.${fileExtension}`
    );
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      MySwal.fire({
        icon: "error",
        title: "Missing Fields",
        text: "Title and content are required.",
      });
      return;
    }

    setUploading(true);

    try {
      // Upload media files to Firebase Storage and get URLs
      const mediaUrls = await Promise.all(
        mediaFiles.map(async (file, index) => {
          return await uploadMediaToFirebase(file, index);
        })
      );

      // Prepare post data
      const postData = {
        title,
        content,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        mediaUrls,
        fileTypes,
      };

      // Send post data to backend
      const response = await axios.post(
        "http://localhost:8081/api/user/posts",
        postData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        MySwal.fire({
          icon: "success",
          title: "Post Created",
          text: "Your post has been successfully created!",
        });
        // Reset form
        setTitle("");
        setContent("");
        setTags("");
        setMediaFiles([]);
        setFileTypes([]);
        setMediaPreviews([]);
      } else {
        throw new Error("Failed to create post");
      }
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to create post. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  // Clean up object URLs to prevent memory leaks
  React.useEffect(() => {
    return () => {
      mediaPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [mediaPreviews]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter post title"
            required
            disabled={uploading}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="6"
            placeholder="Write your post content..."
            required
            disabled={uploading}
          ></textarea>
        </div>

        <div className="mb-4">
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tags
          </label>
          <div className="flex items-center">
            <FaTag className="text-gray-500 mr-2" />
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter tags (comma-separated)"
              disabled={uploading}
            />
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="media"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Upload Media (Max {MAX_IMAGES} files)
          </label>
          <div className="flex items-center">
            <FaImage className="text-gray-500 mr-2" />
            <FaVideo className="text-gray-500 mr-2" />
            <input
              type="file"
              id="media"
              multiple
              accept="image/jpeg,image/png,image/gif,video/mp4,video/webm"
              onChange={handleMediaChange}
              className="w-full p-2 border rounded-md"
              disabled={uploading}
            />
          </div>
          {mediaFiles.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                Selected files: {mediaFiles.length}
              </p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {mediaPreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    {fileTypes[index] === "image" ? (
                      <img
                        src={preview}
                        alt={`Preview ${index}`}
                        className="w-full h-32 object-cover rounded-md"
                      />
                    ) : (
                      <video
                        src={preview}
                        controls
                        className="w-full h-32 object-cover rounded-md"
                      />
                    )}
                    <p className="text-xs text-gray-600 mt-1">
                      {mediaFiles[index].name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          className={`w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 flex items-center justify-center ${
            uploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={uploading}
        >
          <FaPaperPlane className="mr-2" />
          {uploading ? "Uploading..." : "Create Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
