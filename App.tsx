
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ChatPage from './pages/ChatPage';
import StudentDashboard from './pages/StudentDashboard';
import CounselorDashboard from './pages/CounselorDashboard';
import AboutPage from './pages/AboutPage';
import FeaturesPage from './pages/FeaturesPage';
import CounselorsPage from './pages/CounselorsPage';
import StudentSignIn from './pages/StudentSignIn';
import CounselorSignIn from './pages/CounselorSignIn';
import StudentProfile from './pages/StudentProfile';
import JournalPage from './pages/JournalPage';
import ResourcesPage from './pages/ResourcesPage';
import BookAppointmentPage from './pages/BookAppointmentPage';
import CounselorStudentChatView from './pages/CounselorStudentChatView';
import CounselorStudentJournalView from './pages/CounselorStudentJournalView';
import { supabase } from './services/supabaseClient';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const user = session.user;
        let userRole = user.user_metadata.role;

        // On first sign-in, assign the role from localStorage
        if (!userRole) {
          const intendedRole = localStorage.getItem('lumyn_role');
          if (intendedRole === 'student' || intendedRole === 'counselor') {
            const { data: updatedUserData, error: updateUserError } = await supabase.auth.updateUser({
              data: { role: intendedRole }
            });
            if (updateUserError) {
              console.error("Error updating user role:", updateUserError);
            } else if (updatedUserData.user) {
              // Use the freshly updated user object to get the role
              userRole = updatedUserData.user.user_metadata.role;
            }
            localStorage.removeItem('lumyn_role');
          }
        }
        
        // On EVERY sign-in, ensure the public profile is up-to-date.
        // This syncs name/avatar changes and creates the profile if it's missing.
        if (userRole) {
          const { error: upsertError } = await supabase.from('profiles').upsert({
            id: user.id,
            full_name: user.user_metadata.full_name || 'New User',
            role: userRole,
            avatar_url: user.user_metadata.avatar_url,
          });
          if (upsertError) {
            console.error("Error syncing user profile:", upsertError);
          }
        }
        
        // Finally, redirect user to their dashboard after all setup is complete
        if (userRole === 'student') {
          // Use a small timeout to ensure the redirect happens smoothly after OAuth processing
          setTimeout(() => window.location.hash = '/student-dashboard', 100);
        } else if (userRole === 'counselor') {
          setTimeout(() => window.location.hash = '/counselor-dashboard', 100);
        }

      } else if (event === "SIGNED_OUT") {
        // On sign out, redirect to landing page
        window.location.hash = '/';
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);


  return (
    <HashRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/counselors" element={<CounselorsPage />} />
        <Route path="/student-signin" element={<StudentSignIn />} />
        <Route path="/counselor-signin" element={<CounselorSignIn />} />
        <Route path="/resources" element={<ResourcesPage />} />

        {/* Protected Student Routes */}
        <Route path="/chat" element={<ProtectedRoute requiredRole="student"><ChatPage /></ProtectedRoute>} />
        <Route path="/student-dashboard" element={<ProtectedRoute requiredRole="student"><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student-profile" element={<ProtectedRoute requiredRole="student"><StudentProfile /></ProtectedRoute>} />
        <Route path="/journal" element={<ProtectedRoute requiredRole="student"><JournalPage /></ProtectedRoute>} />
        <Route path="/book-appointment" element={<ProtectedRoute requiredRole="student"><BookAppointmentPage /></ProtectedRoute>} />
        
        {/* Protected Counselor Routes */}
        <Route path="/counselor-dashboard" element={<ProtectedRoute requiredRole="counselor" redirectTo="/counselor-signin"><CounselorDashboard /></ProtectedRoute>} />
        <Route path="/counselor/student-chat/:studentId" element={<ProtectedRoute requiredRole="counselor" redirectTo="/counselor-signin"><CounselorStudentChatView /></ProtectedRoute>} />
        <Route path="/counselor/student-journal/:studentId" element={<ProtectedRoute requiredRole="counselor" redirectTo="/counselor-signin"><CounselorStudentJournalView /></ProtectedRoute>} />
      </Routes>
    </HashRouter>
  );
};

export default App;
