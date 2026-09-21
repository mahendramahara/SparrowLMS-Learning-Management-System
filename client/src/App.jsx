import { AuthProvider } from './context/AuthContext';
import ThemeToolbox from './components/common/ThemeToolbox';
import AppRoutes from './routes';

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <ThemeToolbox />
    </AuthProvider>
  );
}
