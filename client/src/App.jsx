import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/public/Home";
import Dashboard from "./pages/private/Dashboard";
import Feed from "./pages/private/Feed";
// import PostDetails from "./pages/private/PostDetails";
import OAuth2RedirectHandler from "./components/OAuth2RedirectHandler";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import DashboardLayout from "./components/DashboardLayout";
import Login from "./pages/public/Login";
import Header from "./components/common/Header";
import Profile from "./pages/private/Profile";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
          
          <Route
            path="/dashboard/*"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="feed" element={<Feed />} />
                    <Route path="profile" element={<Profile />} />
                    {/* <Route path="post/:id" element={<PostDetails />} /> */}
                  </Routes>
                </DashboardLayout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
