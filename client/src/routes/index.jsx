import { Route, Routes, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import StudentLayout from '../components/layout/StudentLayout';
import HomePage from '../pages/landing/HomePage';
import NotFound from '../pages/NotFound';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPassword from '../pages/auth/ForgotPassword';
import VerifyOtpPage from '../pages/auth/VerifyOtpPage';
import OnboardingPage from '../pages/auth/OnboardingPage';
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
import StudentPurchasesPage from '../pages/user/StudentPurchasesPage';
import StudentCoursePreviewPage from '../pages/user/StudentCoursePreviewPage';
import PaymentSuccessPage from '../pages/payment/PaymentSuccessPage';
import PaymentFailurePage from '../pages/payment/PaymentFailurePage';
import InstructorLayout from '../components/layout/InstructorLayout';
import InstructorDashboard from '../pages/instructor/InstructorDashboard';
import InstructorCoursesPage from '../pages/instructor/InstructorCoursesPage';
import InstructorCreateCoursePage from '../pages/instructor/InstructorCreateCoursePage';
import InstructorEditCoursePage from '../pages/instructor/InstructorEditCoursePage';
import InstructorCoursePreviewPage from '../pages/instructor/InstructorCoursePreviewPage';
import InstructorStudentsPage from '../pages/instructor/InstructorStudentsPage';
import InstructorAssignmentsPage from '../pages/instructor/InstructorAssignmentsPage';
import InstructorEarningsPage from '../pages/instructor/InstructorEarningsPage';
import InstructorSettingsPage from '../pages/instructor/InstructorSettingsPage';
import InstructorNotificationsPage from '../pages/instructor/InstructorNotificationsPage';
import InstructorCalendarPage from '../pages/instructor/InstructorCalendarPage';
import AdminLayout from '../components/layout/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import AdminCoursesPage from '../pages/admin/AdminCoursesPage';
import AdminEnrollmentsPage from '../pages/admin/AdminEnrollmentsPage';
import AdminAssignmentsPage from '../pages/admin/AdminAssignmentsPage';
import AdminReportsPage from '../pages/admin/AdminReportsPage';
import AdminNotificationsPage from '../pages/admin/AdminNotificationsPage';
import AdminSettingsPage from '../pages/admin/AdminSettingsPage';
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
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route element={<StudentLayout />}>
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/courses" element={<StudentCoursesPage />} />
          <Route path="/student/courses/:courseId/preview" element={<StudentCoursePreviewPage />} />
          <Route path="/student/courses/preview/:courseId" element={<StudentCoursePreviewPage />} />
          <Route path="/student/course/:courseId" element={<CourseLearningPage />} />
          <Route path="/student/courses/:courseId" element={<CourseLearningPage />} />
          <Route path="/student/browse" element={<BrowseCoursesPage />} />
          <Route path="/student/assignments" element={<StudentAssignmentsPage />} />
          <Route path="/student/grades" element={<FeatureUnderDevelopmentPage />} />
          <Route path="/student/messages" element={<FeatureUnderDevelopmentPage />} />
          <Route path="/student/notifications" element={<StudentNotificationsPage />} />
          <Route path="/student/calendar" element={<StudentCalendarPage />} />
          <Route path="/student/purchases" element={<StudentPurchasesPage />} />
          <Route path="/student/settings" element={<StudentSettingsPage />} />
          <Route path="/student/profile" element={<StudentProfilePage />} />
        </Route>
        <Route path="/payment/success" element={<PaymentSuccessPage />} />
        <Route path="/payment/failure" element={<PaymentFailurePage />} />
        <Route path="/dashboard" element={<Navigate to="/student" replace />} />
      </Route>

      <Route element={<InstructorRoute />}>
        <Route element={<InstructorLayout />}>
          <Route path="/instructor" element={<InstructorDashboard />} />
          <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
          <Route path="/instructor/courses" element={<InstructorCoursesPage />} />
          <Route path="/instructor/courses/create" element={<InstructorCreateCoursePage />} />
          <Route path="/instructor/courses/:courseId/edit" element={<InstructorEditCoursePage />} />
          <Route path="/instructor/courses/edit/:courseId" element={<InstructorEditCoursePage />} />
          <Route path="/instructor/courses/:courseId/preview" element={<InstructorCoursePreviewPage />} />
          <Route path="/instructor/courses/preview/:courseId" element={<InstructorCoursePreviewPage />} />
          <Route path="/instructor/students" element={<InstructorStudentsPage />} />
          <Route path="/instructor/assignments" element={<InstructorAssignmentsPage />} />
          <Route path="/instructor/quizzes" element={<FeatureUnderDevelopmentPage />} />
          <Route path="/instructor/messages" element={<FeatureUnderDevelopmentPage />} />
          <Route path="/instructor/reviews" element={<FeatureUnderDevelopmentPage />} />
          <Route path="/instructor/earnings" element={<InstructorEarningsPage />} />
          <Route path="/instructor/notifications" element={<InstructorNotificationsPage />} />
          <Route path="/instructor/calendar" element={<InstructorCalendarPage />} />
          <Route path="/instructor/settings" element={<InstructorSettingsPage />} />
        </Route>
      </Route>

      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/users/students" element={<AdminUsersPage initialRole="Student" />} />
          <Route path="/admin/users/instructors" element={<AdminUsersPage initialRole="Instructor" />} />
          <Route path="/admin/users/admins" element={<AdminUsersPage initialRole="Admin" />} />
          <Route path="/admin/courses" element={<AdminCoursesPage />} />
          <Route path="/admin/courses/categories" element={<AdminCoursesPage initialTab="categories" />} />
          <Route path="/admin/courses/requests" element={<AdminCoursesPage initialTab="requests" />} />
          <Route path="/admin/enrollments" element={<AdminEnrollmentsPage />} />
          <Route path="/admin/assignments" element={<AdminAssignmentsPage />} />
          <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
          <Route path="/admin/messages" element={<FeatureUnderDevelopmentPage />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
        </Route>
      </Route>

      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<BrowseCoursesPage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
