import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/public/Home";
// import Dashboard from "./pages/private/Dashboard";
import Feed from "./pages/private/Feed";
// import PostDetails from "./pages/private/PostDetails";
import OAuth2RedirectHandler from "./components/OAuth2RedirectHandler";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import DashboardLayout from "./components/DashboardLayout";
import Login from "./pages/public/Login";
import Header from "./components/common/Header";
import CreatePost from "./components/Posts/Createpost";
import PostDetails from "./components/Posts/PostDetails";
import EditPost from "./components/Posts/EditPost";
// import LearningPlan from "./pages/private/LearningPlan";
import LearningPlansList from "./components/learningPlan/LearningPlansList";
import LearningPlanDetails from "./components/learningPlan/LearningPlanDetails";
import CreateLearningPlan from "./components/learningPlan/CreateLearningPlan";
import EditLearningPlan from "./components/learningPlan/EditLearningPlan";
import CreateProgressUpdate from "./components/progressUpdate/CreateProgressUpdate";
import ProgressUpdatesList from "./components/progressUpdate/ProgressUpdatesList";
import EditProgressUpdate from "./components/progressUpdate/EditProgressUpdate";
import EditProfile from "./components/profile/EditProfile";
import ProfilePage from "./pages/private/Profile";
import NetworkPage from "./pages/private/Network";
import Register from "./pages/public/Register";
import Footer from "./components/common/Footer";
import ABC from "./pages/private/ABC.JSX";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

          <Route
            path="/*"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Routes>
                    {/* <Route path="/" element={<Dashboard />} /> */}
                    <Route path="/feed" element={<Feed />} />

                    <Route path="/abc" element={<ABC />} />

                    {/* User routes */}
                    <Route path="/edit-profile" element={<EditProfile />} />
                    <Route path="/profile/:userId" element={<ProfilePage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/friends" element={<NetworkPage />} />

                    {/* posts Routes */}
                    <Route path="/post/new" element={<CreatePost />} />
                    <Route path="/post/:postId" element={<PostDetails />} />
                    <Route path="/edit-post/:postId" element={<EditPost />} />

                    {/* Learning Plans Routes */}
                    <Route
                      path="/learning-plans"
                      element={<LearningPlansList />}
                    />
                    <Route
                      path="/learning-plan/:planId"
                      element={<LearningPlanDetails />}
                    />
                    <Route
                      path="/create-learning-plan"
                      element={<CreateLearningPlan />}
                    />
                    <Route
                      path="/edit-learning-plan/:planId"
                      element={<EditLearningPlan />}
                    />

                    {/* Progress Update Routes */}
                    <Route
                      path="/create-progress-update"
                      element={<CreateProgressUpdate />}
                    />
                    <Route
                      path="/create-progress-update/:id"
                      element={<CreateProgressUpdate />}
                    />
                    <Route
                      path="/progress-updates"
                      element={<ProgressUpdatesList />}
                    />
                    <Route
                      path="/progress-updates/plan/:planId"
                      element={<ProgressUpdatesList />}
                    />
                    <Route
                      path="/edit-progress-update/:updateId"
                      element={<EditProgressUpdate />}
                    />
                  </Routes>
                </DashboardLayout>
              </PrivateRoute>
            }
          />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
