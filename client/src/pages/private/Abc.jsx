import React, { useState, useEffect } from "react";
import axios from "axios";

const ABC = () => {
  const [post, setPost] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/api/user/posts"
        );
        setPost(response.data);
        console.log(response.data);
      } catch (err) {
        setError("Failed to load posts. Please try again later.");
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h1 className="text-xl">Post data</h1>
      {post.map((x) => {
        return (
          <div className="py-6">
            {x.content}
            {x.createdAt}
            {x.title}
            {/* {x.id}
                {x.id} */}
          </div>
        );
      })}
    </div>
  );
};

export default ABC;
