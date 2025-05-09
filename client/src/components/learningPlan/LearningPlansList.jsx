import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const LearningPlansList = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      if (!currentUser) {
        MySwal.fire({
          icon: "error",
          title: "Unauthorized",
          text: "Please log in to view learning plans.",
        });
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(
          "http://localhost:8081/api/user/learning-plans",
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
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [currentUser]);

  const handleDelete = async (planId) => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      try {
        await axios.delete(
          `http://localhost:8081/api/user/learning-plans/${planId}`,
          {
            headers: { Authorization: `Bearer ${currentUser.token}` },
          }
        );
        setPlans(plans.filter((plan) => plan.id !== planId));
        MySwal.fire({
          icon: "success",
          title: "Deleted",
          text: "Learning plan deleted.",
          timer: 1500,
        });
      } catch (error) {
        MySwal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete learning plan.",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">My Learning Plans</h1>
        <button
          onClick={() => navigate("/create-learning-plan")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create New Plan
        </button>
      </header>

      {plans.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No learning plans found. Create your first plan to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white p-4 border rounded shadow-sm hover:shadow"
            >
              <div className="flex justify-between">
                <h3
                  className="text-xl font-semibold cursor-pointer hover:text-blue-600"
                  onClick={() => navigate(`/learning-plan/${plan.id}`)}
                >
                  {plan.title}
                </h3>
                <div className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {plan.completed ? "Completed" : "In Progress"}
                </div>
              </div>

              <p className="text-gray-600 mt-1 mb-2">{plan.description}</p>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Topics: {plan.topics.length}
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => navigate(`/learning-plan/${plan.id}`)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm"
                  >
                    View
                  </button>
                  <button
                    onClick={() => navigate(`/edit-learning-plan/${plan.id}`)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(plan.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LearningPlansList;
