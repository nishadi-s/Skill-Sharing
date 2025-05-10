import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const CreateProgressUpdate = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [templateType, setTemplateType] = useState("COMPLETED_TUTORIAL");
  const [learningPlanId, setLearningPlanId] = useState("");
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      if (!currentUser) return;
      try {
        const response = await axios.get(
          "http://localhost:8080/api/user/learning-plans",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setPlans(response.data);
      } catch (error) {
        MySwal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load learning plans.",
        });
      }
    };
    fetchPlans();
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      MySwal.fire({
        icon: "error",
        title: "Unauthorized",
        text: "Please log in to create a progress update.",
      });
      return;
    }
    if (!content.trim()) {
      MySwal.fire({
        icon: "error",
        title: "Missing Field",
        text: "Content is required.",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:8081/api/user/progress-updates${
          learningPlanId ? `?learningPlanId=${learningPlanId}` : ""
        }`,
        { content, templateType },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      MySwal.fire({
        icon: "success",
        title: "Progress Update Created",
        text: "Your progress update has been created!",
        timer: 1500,
      });
      navigate("/progress-updates");
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to create progress update.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">Create Progress Update</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Template Type</label>
          <select
            value={templateType}
            onChange={(e) => setTemplateType(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={loading}
          >
            <option value="COMPLETED_TUTORIAL">Completed Tutorial</option>
            <option value="NEW_SKILL">New Skill Learned</option>
            <option value="MILESTONE">Milestone Achieved</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded"
            rows="4"
            placeholder="Describe your progress..."
            disabled={loading}
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Link to Learning Plan (Optional)</label>
          <select
            value={learningPlanId}
            onChange={(e) => setLearningPlanId(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={loading}
          >
            <option value="">None</option>
            {plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.title}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Update"}
        </button>
      </form>
    </div>
  );
};

export default CreateProgressUpdate;
