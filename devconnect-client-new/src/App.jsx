import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import NotificationPopup from './components/NotificationPopup';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfileSetup from './pages/ProfileSetup';
import ProfileViewEnhanced from './pages/ProfileViewEnhanced';
import DevelopersEnhanced from './pages/DevelopersEnhanced';
import AllProjects from './pages/AllProjects';
import MyProjects from './pages/MyProjects';
import CreateProject from './pages/CreateProject';
import ProjectRequests from './pages/ProjectRequests';
import EditProject from './pages/EditProject';
import AllJoinRequests from './pages/AllJoinRequests';
import ChatPage from './pages/ChatPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <>
      <Navbar />
      <NotificationPopup />
      <Routes>
        <Route path="/" element={<Navigate to="/developers" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfileViewEnhanced />} />
          <Route path="/profile/:userId" element={<ProfileViewEnhanced />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/developers" element={<DevelopersEnhanced />} />
          <Route path="/projects" element={<AllProjects />} />
          <Route path="/my-projects" element={<MyProjects />} />
          <Route path="/create-project" element={<CreateProject />} />
          <Route path="/projects/:id/requests" element={<ProjectRequests />} />
          <Route path="/join-requests" element={<AllJoinRequests />} />
          <Route path="/projects/:id/edit" element={<EditProject />} />
          <Route path="/chat/:userId" element={<ChatPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
