import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Login from './General/Login';
import ForgotPassword from './General/ForgotPassword';
import SignUp from './General/SignUp';
import Dashboard from './Components_Student/Dashboard';
import QuizPage from './Components_Student/QuizPage';
import QuizzesPage from './Components_Student/QuizzesPage';
import ResultsPage from './Components_Student/ResultsPage';
import Profile from './Components_Student/Profile';
import AdminDashboard from './Components_Admin/AdminDashboard';
import CreateQuiz from './Components_Admin/CreateQuiz';
import EditQuiz from './Components_Admin/EditQuiz';
import QuizResults from './Components_Admin/QuizResults';
import ManageUsers from './Components_Admin/ManageUsers';
import AdminProfile from './Components_Admin/AdminProfile';
import QuizPreview from './Components_Admin/QuizPreview';
import Footer from './General/Footer';
import Contact from './General/Contact';
import TermsOfService from './General/TermsOfService';
import PrivacyPolicy from './General/PrivacyPolicy';
import AboutUs from './General/AboutUs';
import ProtectedRoute from './components/ProtectedRoute';
import Settings from './Components_Student/Settings';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleNavigate = (page) => {
    const routes = {
      'login': '/',
      'forgot': '/forgot-password',
      'signup': '/signup',
      'dashboard': '/dashboard',
      'admin-dashboard': '/admin',
      'create-quiz': '/admin/create-quiz',
      'contact': '/contact',
      'terms': '/terms',
      'privacy': '/privacy'
    };
    navigate(routes[page] || '/');
  };


  const handleLogin = (userData) => {
    setUser(userData);
    navigate(userData.is_admin ? '/admin' : '/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    setUser(null);
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard user={user} /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings user={user} /></ProtectedRoute>} />
          <Route path="/student-dashboard" element={<ProtectedRoute><Dashboard user={user} /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile user={user} /></ProtectedRoute>} />
          <Route path="/quiz/:quizId" element={<ProtectedRoute><QuizPage user={user} /></ProtectedRoute>} />
          <Route path="/quizpage" element={<ProtectedRoute><QuizPage user={user} /></ProtectedRoute>} />
          <Route path="/quizzes" element={<ProtectedRoute><QuizzesPage user={user} /></ProtectedRoute>} />
          <Route path="/results" element={<ProtectedRoute><ResultsPage user={user} /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard user={user} /></ProtectedRoute>} />
          <Route path="/admin/profile" element={<ProtectedRoute requireAdmin><AdminProfile user={user} /></ProtectedRoute>} />
          <Route path="/admin/create-quiz" element={<ProtectedRoute requireAdmin><CreateQuiz /></ProtectedRoute>} />
          <Route path="/admin/edit-quiz/:quizId" element={<ProtectedRoute requireAdmin><EditQuiz /></ProtectedRoute>} />
          <Route path="/admin/results" element={<ProtectedRoute requireAdmin><QuizResults user={user} /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute requireAdmin><ManageUsers user={user} /></ProtectedRoute>} />
          <Route path="/admin/quiz-preview" element={<ProtectedRoute requireAdmin><QuizPreview user={user} /></ProtectedRoute>} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
        </Routes>
      </Box>
      <Footer />
    </Box>
  );
}

export default App
