import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { VscCallIncoming } from "react-icons/vsc";

const MySwal = withReactContent(Swal);

const EditProgressUpdate = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { updateId } = useParams();
  const [content, setContent] = useState("");
  const [templateType, setTemplateType] = useState("COMPLETED_TUTORIAL");
  const [learningPlanId, setLearningPlanId] = useState("");
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;

      try {
        // Fetch progress update
        const updateResponse = await axios.get(
          `http://localhost:8081/api/user/progress-updates/${updateId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setContent(updateResponse.data.content);
        setTemplateType(updateResponse.data.templateType);
        setLearningPlanId(updateResponse.data.learningPlan?.id || "");

        // Fetch learning plans
        const plansResponse = await axios.get(
          "http://localhost:8081/api/user/learning-plans",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setPlans(plansResponse.data);
      } catch (error) {
        MySwal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load data.",
        });
      }
    };
    fetchData();
  }, [currentUser, updateId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      MySwal.fire({
        icon: "error",
        title: "Unauthorized",
        text: "Please log in to update a progress update.",
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
      const response = await axios.put(
        `http://localhost:8081/api/user/progress-updates/${updateId}${
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
        title: "Progress Update Updated",
        text: "Your progress update has been updated!",
        timer: 1500,
      });
      navigate("/progress-updates");
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update progress update.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center mb-4">
        <button
          onClick={() => navigate("/progress-updates")}
          className="mr-2 text-blue-500 hover:text-blue-700"
        >
          <VscCallIncoming size={20} />
        </button>
        <h2 className="text-2xl font-bold">Edit Progress Update</h2>
      </div>
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
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default EditProgressUpdate;
