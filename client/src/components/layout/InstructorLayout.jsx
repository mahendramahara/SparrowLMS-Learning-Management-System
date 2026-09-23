import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import InstructorSidebar from '../instructor/InstructorSidebar';
import InstructorHeader from '../instructor/InstructorHeader';
import InstructorFooter from '../instructor/InstructorFooter';

export default function InstructorLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-subtle)',
        color: 'var(--text-primary)',
      }}
    >
      <InstructorSidebar isMobileOpen={isMobileOpen} onCloseMobile={() => setIsMobileOpen(false)} />

      <div className="flex flex-1 flex-col h-screen overflow-y-auto min-w-0">
        <InstructorHeader onToggleMobile={() => setIsMobileOpen(prev => !prev)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
        <InstructorFooter />
      </div>
    </div>
  );
}
