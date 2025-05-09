import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const EditLearningPlan = () => {
  const { planId } = useParams();
  const { currentUser, setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      if (!currentUser || !currentUser.token) {
        MySwal.fire({
          icon: "error",
          title: "Unauthorized",
          text: "Please log in to edit this plan.",
        });
        navigate("/login");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:8081/api/user/learning-plans/${planId}`,
          { headers: { Authorization: `Bearer ${currentUser.token}` } }
        );
        console.log("Fetched plan:", response.data); // Log response
        setTitle(response.data.title);
        setDescription(response.data.description);
        setTopics(response.data.topics);
      } catch (error) {
        console.error("Error fetching plan:", error.response || error); // Log error
        MySwal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.error || "Failed to load learning plan.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [planId, currentUser, navigate]);

  const handleTopicChange = (index, field, value) => {
    const newTopics = [...topics];
    newTopics[index][field] = value;
    setTopics(newTopics);
  };

  const handleResourceChange = (topicIndex, resourceIndex, value) => {
    const newTopics = [...topics];
    newTopics[topicIndex].resources[resourceIndex] = value;
    setTopics(newTopics);
  };

  const handleAddTopic = () => {
    setTopics([...topics, { title: "", description: "", resources: [""] }]);
  };

  const handleRemoveTopic = (index) => {
    setTopics(topics.filter((_, i) => i !== index));
  };

  const handleAddResource = (topicIndex) => {
    const newTopics = [...topics];
    newTopics[topicIndex].resources.push("");
    setTopics(newTopics);
  };

  const handleRemoveResource = (topicIndex, resourceIndex) => {
    const newTopics = [...topics];
    newTopics[topicIndex].resources.splice(resourceIndex, 1);
    setTopics(newTopics);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser || !currentUser.token) {
      MySwal.fire({
        icon: "error",
        title: "Unauthorized",
        text: "Please log in to edit this plan.",
      });
      navigate("/login");
      return;
    }
    if (!title.trim()) {
      MySwal.fire({
        icon: "error",
        title: "Missing Field",
        text: "Learning plan title is required.",
      });
      return;
    }
    for (const topic of topics) {
      if (!topic.title.trim()) {
        MySwal.fire({
          icon: "error",
          title: "Missing Field",
          text: "All topics must have a title.",
        });
        return;
      }
    }

    setLoading(true);

    const updatedPlan = {
      title,
      description,
      topics: topics.map((topic) => ({
        id: topic.id,
        title: topic.title,
        description: topic.description,
        resources: topic.resources.filter((r) => r.trim() !== ""),
        completed: topic.completed || false,
      })),
    };

    try {
      await axios.put(
        `http://localhost:8081/api/user/learning-plans/${planId}`,
        updatedPlan,
        {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        }
      );
      MySwal.fire({
        icon: "success",
        title: "Updated",
        text: "Learning plan updated successfully.",
        timer: 1500,
      });
      navigate(`/learning-plan/${planId}`);
    } catch (error) {
      console.error("Error updating plan:", error.response || error);
      if (error.response && error.response.status === 401) {
        MySwal.fire({
          icon: "error",
          title: "Session Expired",
          text: "Your session has expired. Please log in again.",
        });
        setToken(null);
        navigate("/login");
      } else if (error.response && error.response.status === 400) {
        MySwal.fire({
          icon: "error",
          title: "Invalid Input",
          text:
            error.response.data.error ||
            "Please check your input and try again.",
        });
      } else {
        MySwal.fire({
          icon: "error",
          title: "Error",
          text:
            error.response?.data?.error ||
            "Failed to update learning plan. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className="container mx-auto p-4 text-center">Loading...</div>;

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Edit Learning Plan</h2>
        <button
          type="button"
          onClick={() => navigate(`/learning-plan/${planId}`)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
        >
          Back to Plan
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter learning plan title"
            required
            disabled={loading}
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter learning plan description"
            rows="3"
            disabled={loading}
          />
        </div>

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Topics</h3>
          <button
            type="button"
            onClick={handleAddTopic}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
            disabled={loading}
          >
            + Add Topic
          </button>
        </div>

        {topics.map((topic, topicIndex) => (
          <div
            key={topic.id || topicIndex}
            className="p-4 border rounded mb-4 bg-gray-50"
          >
            <div className="mb-3">
              <label className="block mb-1 font-medium">Topic Title *</label>
              <input
                type="text"
                value={topic.title}
                onChange={(e) =>
                  handleTopicChange(topicIndex, "title", e.target.value)
                }
                className="w-full p-2 border rounded"
                placeholder="Enter topic title"
                required
                disabled={loading}
              />
            </div>

            <div className="mb-3">
              <label className="block mb-1 font-medium">
                Topic Description
              </label>
              <input
                type="text"
                value={topic.description}
                onChange={(e) =>
                  handleTopicChange(topicIndex, "description", e.target.value)
                }
                className="w-full p-2 border rounded"
                placeholder="Enter topic description"
                disabled={loading}
              />
            </div>

            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Resources</label>
                <button
                  type="button"
                  onClick={() => handleAddResource(topicIndex)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                  disabled={loading}
                >
                  + Add Resource
                </button>
              </div>

              {topic.resources &&
                topic.resources.map((resource, resourceIndex) => (
                  <div key={resourceIndex} className="flex mb-2">
                    <input
                      type="text"
                      value={resource}
                      onChange={(e) =>
                        handleResourceChange(
                          topicIndex,
                          resourceIndex,
                          e.target.value
                        )
                      }
                      className="flex-1 p-2 border rounded"
                      placeholder="Enter resource URL or description"
                      disabled={loading}
                    />
                    {topic.resources.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveResource(topicIndex, resourceIndex)
                        }
                        className="ml-2 text-red-500 hover:text-red-700"
                        disabled={loading}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
            </div>

            {topics.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveTopic(topicIndex)}
                className="text-red-500 hover:text-red-700 text-sm"
                disabled={loading}
              >
                Remove Topic
              </button>
            )}
          </div>
        ))}

        <div className="mt-6 flex space-x-2">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Learning Plan"}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/learning-plan/${planId}`)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditLearningPlan;
