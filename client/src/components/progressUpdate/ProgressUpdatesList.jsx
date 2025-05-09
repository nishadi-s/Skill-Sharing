import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const ProgressUpdatesList = () => {
  const { planId } = useParams();
  const { currentUser, setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [planTitle, setPlanTitle] = useState("");

  useEffect(() => {
    const fetchUpdates = async () => {
      if (!currentUser) {
        MySwal.fire({
          icon: "error",
          title: "Unauthorized",
          text: "Please log in to view progress updates.",
        });
        navigate("/login");
        setLoading(false);
        return;
      }

      try {
        // If we have a planId, fetch the plan title first
        if (planId) {
          try {
            const planResponse = await axios.get(
              `http://localhost:8081/api/user/learning-plans/${planId}`,
              {
                headers: {
                  Authorization: `Bearer ${currentUser.token}`,
                },
              }
            );
            setPlanTitle(planResponse.data.title);
          } catch (error) {
            console.error("Failed to fetch plan title", error);
          }
        }

        const url = planId
          ? `http://localhost:8081/api/user/progress-updates/learning-plan/${planId}`
          : "http://localhost:8081/api/user/progress-updates";

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        });

        setUpdates(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          MySwal.fire({
            icon: "error",
            title: "Session Expired",
            text: "Your session has expired. Please log in again.",
          });
          setToken(null);
          navigate("/login");
        } else {
          MySwal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to load progress updates.",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();
  }, [planId, currentUser, navigate, setToken]);

  const handleDelete = async (updateId) => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `http://localhost:8081/api/user/progress-updates/${updateId}`,
          {
            headers: { Authorization: `Bearer ${currentUser.token}` },
          }
        );

        setUpdates(updates.filter((update) => update.id !== updateId));

        MySwal.fire({
          icon: "success",
          title: "Deleted",
          text: "Progress update deleted successfully.",
          timer: 1500,
        });
      } catch (error) {
        if (error.response && error.response.status === 401) {
          MySwal.fire({
            icon: "error",
            title: "Session Expired",
            text: "Your session has expired. Please log in again.",
          });
          setToken(null);
          navigate("/login");
        } else {
          MySwal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to delete progress update.",
          });
        }
      }
    }
  };

  const handleEdit = (updateId) => {
    navigate(`/edit-progress-update/${updateId}`);
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getBackLink = () => {
    if (planId) {
      return `/learning-plan/${planId}`;
    }
    return "/feed";
  };

  if (loading)
    return (
      <div className="container mx-auto p-4 max-w-3xl text-center">
        <div className="py-8">Loading...</div>
      </div>
    );

  return (
    <div className="container mx-auto px-4 max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {planId
            ? `Progress Updates for "${planTitle}"`
            : "My Progress Updates"}
        </h2>
        <button
          onClick={() => navigate(getBackLink())}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
        >
          {planId ? "Back to Plan" : "Back to Dashboard"}
        </button>
      </div>

      <div className="mb-6">
        <button
          onClick={() =>
            navigate(
              planId
                ? `/create-progress-update/${planId}`
                : "/create-progress-update"
            )
          }
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create New Update
        </button>
      </div>

      {updates.length === 0 ? (
        <div className="bg-gray-50 border rounded-lg p-8 text-center">
          <p className="text-gray-600">No progress updates found.</p>
          <p className="mt-2 text-sm text-gray-500">
            Start tracking your progress by creating your first update.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {updates.map((update) => (
            <div
              key={update.id}
              className="bg-white p-5 border rounded-lg shadow-sm hover:shadow transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {update.templateType || "Standard Update"}
                </span>
                <span className="text-sm text-gray-500">
                  {formatDate(update.createdAt)}
                </span>
              </div>

              <div className="my-3 text-gray-700 whitespace-pre-wrap">
                {update.content}
              </div>

              {update.learningPlan && !planId && (
                <div className="mb-3 text-sm">
                  <span className="text-gray-600">Plan: </span>
                  <span
                    className="cursor-pointer text-blue-600 hover:text-blue-800 hover:underline"
                    onClick={() =>
                      navigate(`/learning-plan/${update.learningPlan.id}`)
                    }
                  >
                    {update.learningPlan.title}
                  </span>
                </div>
              )}

              <div className="flex space-x-2 mt-3">
                <button
                  onClick={() => handleEdit(update.id)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(update.id)}
                  className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgressUpdatesList;
