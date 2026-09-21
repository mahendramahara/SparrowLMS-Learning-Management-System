import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import HeroComponent from '../../components/landing/home/HeroComponent';
import CategoriesComponent from '../../components/landing/home/CategoriesComponent';
import CoursesComponent from '../../components/landing/home/CoursesComponent';

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    const targetPath =
      user?.role === 'admin' ? '/admin' : user?.role === 'instructor' ? '/instructor' : '/student';
    return <Navigate to={targetPath} replace />;
  }

  return (
    <>
      <HeroComponent />
      <CategoriesComponent />
      <CoursesComponent />
    </>
  );
}
