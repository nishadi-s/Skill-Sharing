import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { AuthContext } from "../../context/AuthContext";

const MySwal = withReactContent(Swal);

const LearningPlanDetails = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { currentUser, setToken } = useContext(AuthContext);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newTopic, setNewTopic] = useState({
    title: "",
    description: "",
    resources: [""],
  });

  useEffect(() => {
    const fetchPlan = async () => {
      if (!currentUser || !currentUser.token) {
        MySwal.fire({
          icon: "error",
          title: "Unauthorized",
          text: "Please log in to view this learning plan.",
        });
        navigate("/login");
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8081/api/user/learning-plans/${planId}`,
          {
            headers: { Authorization: `Bearer ${currentUser.token}` },
          }
        );
        setPlan(response.data);
      } catch (error) {
        handleError(error, "Failed to fetch learning plan");
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [planId, currentUser, navigate]);

  const handleAddTopic = async (e) => {
    e.preventDefault();
    if (!currentUser || !currentUser.token) {
      MySwal.fire({
        icon: "error",
        title: "Unauthorized",
        text: "Please log in to add a topic.",
      });
      navigate("/login");
      return;
    }
    if (!newTopic.title.trim()) {
      MySwal.fire({
        icon: "error",
        title: "Missing Field",
        text: "Topic title is required.",
      });
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:8081/api/user/learning-plans/${planId}/topics`,
        {
          title: newTopic.title,
          description: newTopic.description,
          resources: newTopic.resources.filter((r) => r.trim() !== ""),
          completed: false,
        },
        {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        }
      );
      setPlan(response.data);
      setNewTopic({ title: "", description: "", resources: [""] });
      MySwal.fire({
        icon: "success",
        title: "Topic Added",
        text: "Topic added successfully.",
        timer: 1500,
      });
    } catch (error) {
      handleError(error, "Failed to add topic");
    }
  };

  const handleToggleComplete = async (topicId, completed) => {
    if (!currentUser || !currentUser.token) {
      MySwal.fire({
        icon: "error",
        title: "Unauthorized",
        text: "Please log in to update topic status.",
      });
      navigate("/login");
      return;
    }
    try {
      const response = await axios.patch(
        `http://localhost:8081/api/user/learning-plans/${planId}/topics/${topicId}/complete`,
        completed,
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setPlan(response.data);
    } catch (error) {
      handleError(error, "Failed to update topic status");
    }
  };

  const handleDeleteTopic = async (topicId) => {
    if (!currentUser || !currentUser.token) {
      MySwal.fire({
        icon: "error",
        title: "Unauthorized",
        text: "Please log in to delete a topic.",
      });
      navigate("/login");
      return;
    }
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "This topic will be deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    });
    if (result.isConfirmed) {
      try {
        const response = await axios.delete(
          `http://localhost:8081/api/user/learning-plans/${planId}/topics/${topicId}`,
          {
            headers: { Authorization: `Bearer ${currentUser.token}` },
          }
        );
        setPlan(response.data);
        MySwal.fire({
          icon: "success",
          title: "Deleted",
          text: "Topic deleted successfully.",
          timer: 1500,
        });
      } catch (error) {
        handleError(error, "Failed to delete topic");
      }
    }
  };

  const handleError = (error, defaultMessage) => {
    if (error.response) {
      if (error.response.status === 401) {
        MySwal.fire({
          icon: "error",
          title: "Session Expired",
          text: "Your session has expired. Please log in again.",
        });
        setToken(null);
        navigate("/login");
      } else if (error.response.status === 400) {
        MySwal.fire({
          icon: "error",
          title: "Invalid Input",
          text: error.response.data.error || defaultMessage,
        });
      } else {
        MySwal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data.error || defaultMessage,
        });
      }
    } else if (error.request) {
      MySwal.fire({
        icon: "error",
        title: "Network Error",
        text: "Unable to connect to the server. Please check your connection.",
      });
    } else {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: defaultMessage,
      });
    }
  };

  const handleAddResource = () => {
    setNewTopic({
      ...newTopic,
      resources: [...newTopic.resources, ""],
    });
  };

  const handleRemoveResource = (index) => {
    const updatedResources = newTopic.resources.filter((_, i) => i !== index);
    setNewTopic({
      ...newTopic,
      resources: updatedResources.length ? updatedResources : [""],
    });
  };

  const handleResourceChange = (index, value) => {
    const updatedResources = [...newTopic.resources];
    updatedResources[index] = value;
    setNewTopic({ ...newTopic, resources: updatedResources });
  };

  if (loading)
    return <div className="container mx-auto p-4 text-center">Loading...</div>;
  if (!plan)
    return (
      <div className="container mx-auto p-4 text-center">Plan not found</div>
    );

  const progress = plan.topics.length
    ? (plan.topics.filter((topic) => topic.completed).length /
        plan.topics.length) *
      100
    : 0;

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{plan.title}</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/edit-learning-plan/${planId}`)}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Edit Plan
          </button>
          <button
            onClick={() => navigate(`/create-progress-update/${planId}`)}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            Progress Updates
          </button>
        </div>
      </div>

      {plan.description && (
        <p className="mb-6 text-gray-700">{plan.description}</p>
      )}

      <div className="mb-6">
        <div className="flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
            <div
              className="bg-green-500 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium">{Math.round(progress)}%</span>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {plan.topics.filter((topic) => topic.completed).length} of{" "}
          {plan.topics.length} topics completed
        </p>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-semibold">Topics</h3>
        </div>

        {plan.topics.length === 0 ? (
          <p className="text-gray-500 py-4">
            No topics added yet. Add your first topic below.
          </p>
        ) : (
          <div className="space-y-4">
            {plan.topics.map((topic) => (
              <div
                key={topic.id}
                className={`p-4 border rounded ${
                  topic.completed ? "bg-green-50 border-green-200" : "bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-medium">{topic.title}</h4>
                  <div className="flex items-center">
                    <label className="inline-flex items-center cursor-pointer mr-4">
                      <input
                        type="checkbox"
                        checked={topic.completed}
                        onChange={() =>
                          handleToggleComplete(topic.id, !topic.completed)
                        }
                        className="mr-2"
                      />
                      <span className="text-sm">
                        {topic.completed ? "Completed" : "Mark complete"}
                      </span>
                    </label>
                    <button
                      onClick={() => handleDeleteTopic(topic.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {topic.description && (
                  <p className="mb-2 text-gray-700">{topic.description}</p>
                )}

                {topic.resources && topic.resources.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium mb-1">Resources:</p>
                    <ul className="list-disc pl-5 text-blue-600">
                      {topic.resources.map((resource, index) => (
                        <li key={index}>
                          <a
                            href={
                              resource.startsWith("http")
                                ? resource
                                : `https://${resource}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {resource}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-6 p-4 border rounded bg-gray-50">
        <h3 className="text-lg font-semibold mb-3">Add New Topic</h3>
        <form onSubmit={handleAddTopic}>
          <div className="mb-3">
            <label className="block mb-1 text-sm font-medium">Title *</label>
            <input
              type="text"
              value={newTopic.title}
              onChange={(e) =>
                setNewTopic({ ...newTopic, title: e.target.value })
              }
              className="w-full p-2 border rounded"
              placeholder="Enter topic title"
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1 text-sm font-medium">
              Description
            </label>
            <input
              type="text"
              value={newTopic.description}
              onChange={(e) =>
                setNewTopic({ ...newTopic, description: e.target.value })
              }
              className="w-full p-2 border rounded"
              placeholder="Enter topic description"
            />
          </div>
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium">Resources</label>
              <button
                type="button"
                onClick={handleAddResource}
                className="text-blue-600 text-sm"
              >
                + Add Resource
              </button>
            </div>
            {newTopic.resources.map((resource, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={resource}
                  onChange={(e) => handleResourceChange(index, e.target.value)}
                  className="flex-1 p-2 border rounded"
                  placeholder="Enter resource URL or description"
                />
                {newTopic.resources.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveResource(index)}
                    className="ml-2 text-red-500"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Add Topic
            </button>
          </div>
        </form>
      </div>

      <div className="mt-4">
        <button
          onClick={() => navigate("/learning-plans")}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
        >
          Back to Learning Plans
        </button>
      </div>
    </div>
  );
};

export default LearningPlanDetails;
