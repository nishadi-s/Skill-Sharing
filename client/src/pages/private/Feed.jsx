import React, { useState, useEffect } from "react";
import axios from "axios";
import PostCard from "../../components/Posts/PostCard";
import { Link } from "react-router-dom";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/api/user/posts"
        );
        setPosts(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load posts. Please try again later.");
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="flex justify-center mt-6">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center mt-6 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">Feed</h1>
        <Link
          to="/post/new"
          className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition-colors"
        >
          New Post
        </Link>
      </header>

      {posts.length === 0 ? (
        <p className="text-center text-gray-500 my-10">No posts available</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Feed;
