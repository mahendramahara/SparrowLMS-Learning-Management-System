import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function MainLayout() {
  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
