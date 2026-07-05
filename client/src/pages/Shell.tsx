import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function Shell() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleSidebar = () => setDrawerOpen((v) => !v);

  return (
    <div className="h-full flex items-stretch justify-center p-0 md:p-4">
      <div className="w-full max-w-6xl h-full md:h-[92vh] flex rounded-none md:rounded-2xl overflow-hidden border border-white/5 shadow-2xl bg-ink relative">
        {/* Desktop sidebar */}
        <div className="hidden md:flex">
          <Sidebar />
        </div>

        {/* Mobile drawer */}
        {drawerOpen && (
          <div className="md:hidden fixed inset-0 z-30 flex">
            <div className="w-72 h-full">
              <Sidebar onNavigate={() => setDrawerOpen(false)} />
            </div>
            <button
              type="button"
              aria-label="Close sidebar"
              onClick={() => setDrawerOpen(false)}
              className="flex-1 bg-black/50 backdrop-blur-sm"
            />
          </div>
        )}

        <Outlet context={{ toggleSidebar }} />
      </div>
    </div>
  );
}
