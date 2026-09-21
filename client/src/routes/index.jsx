import { Route, Routes, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import StudentLayout from '../components/layout/StudentLayout';
import HomePage from '../pages/landing/HomePage';
import NotFound from '../pages/NotFound';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPassword from '../pages/auth/ForgotPassword';
import VerifyOtpPage from '../pages/auth/VerifyOtpPage';
import StudentDashboard from '../pages/user/StudentDashboard';
import StudentCoursesPage from '../pages/user/StudentCoursesPage';
import BrowseCoursesPage from '../pages/user/BrowseCoursesPage';
import CourseLearningPage from '../pages/user/CourseLearningPage';
import StudentAssignmentsPage from '../pages/user/StudentAssignmentsPage';
import FeatureUnderDevelopmentPage from '../pages/user/FeatureUnderDevelopmentPage';
import StudentNotificationsPage from '../pages/user/StudentNotificationsPage';
import StudentCalendarPage from '../pages/user/StudentCalendarPage';
import StudentSettingsPage from '../pages/user/StudentSettingsPage';
import StudentProfilePage from '../pages/user/StudentProfilePage';
import InstructorDashboard from '../pages/instructor/InstructorDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';
import PrivateRoute from './PrivateRoute';
import InstructorRoute from './InstructorRoute';
import AdminRoute from './AdminRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />

      <Route element={<PrivateRoute />}>
        <Route element={<StudentLayout />}>
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/courses" element={<StudentCoursesPage />} />
          <Route path="/student/course/:courseId" element={<CourseLearningPage />} />
          <Route path="/student/courses/:courseId" element={<CourseLearningPage />} />
          <Route path="/student/browse" element={<BrowseCoursesPage />} />
          <Route path="/student/assignments" element={<StudentAssignmentsPage />} />
          <Route path="/student/grades" element={<FeatureUnderDevelopmentPage />} />
          <Route path="/student/messages" element={<FeatureUnderDevelopmentPage />} />
          <Route path="/student/notifications" element={<StudentNotificationsPage />} />
          <Route path="/student/calendar" element={<StudentCalendarPage />} />
          <Route path="/student/settings" element={<StudentSettingsPage />} />
          <Route path="/student/profile" element={<StudentProfilePage />} />
        </Route>
        <Route path="/dashboard" element={<Navigate to="/student" replace />} />
      </Route>

      <Route element={<InstructorRoute />}>
        <Route path="/instructor" element={<InstructorDashboard />} />
      </Route>

      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<BrowseCoursesPage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
