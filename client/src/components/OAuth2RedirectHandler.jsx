import React, { useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const OAuth2RedirectHandler = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getUrlParameter = (name) => {
      name = name.replace(/[[]/, "\\[").replace(/[\]]/, "\\]");
      const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
      const results = regex.exec(location.search);
      return results === null
        ? ""
        : decodeURIComponent(results[1].replace(/\+/g, " "));
    };

    const token = getUrlParameter("token");

    if (token) {
      login(token);
      navigate("/dashboard/profile");
    } else {
      navigate("/");
    }
  }, [login, navigate, location]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl font-semibold">Processing authentication...</div>
    </div>
  );
};

export default OAuth2RedirectHandler;
