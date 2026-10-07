import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { PlayScreen } from './pages/PlayScreen';

// Lazy-loaded routes to minimize initial bundle size on mobile devices (100+ concurrent users)
const IntroConcepts = lazy(() =>
  import('./pages/IntroConcepts').then((m) => ({ default: m.IntroConcepts }))
);
const EducationalSummary = lazy(() =>
  import('./pages/EducationalSummary').then((m) => ({ default: m.EducationalSummary }))
);
const WomenInTech = lazy(() =>
  import('./pages/WomenInTech').then((m) => ({ default: m.WomenInTech }))
);
const PresenterDashboard = lazy(() =>
  import('./pages/PresenterDashboard').then((m) => ({ default: m.PresenterDashboard }))
);
const AdminPage = lazy(() =>
  import('./pages/admin/AdminPage').then((m) => ({ default: m.AdminPage }))
);
const HelpScreen = lazy(() =>
  import('./pages/HelpScreen').then((m) => ({ default: m.HelpScreen }))
);

// Minimalist fast loading fallback
const PageLoader: React.FC = () => (
  <div className="min-h-screen bg-pastel-pink flex items-center justify-center p-4">
    <div className="w-8 h-8 rounded-full border-3 border-[#E86F88] border-t-transparent animate-spin"></div>
  </div>
);

export const App: React.FC = () => {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/join/:code" element={<Home />} />
          <Route path="/intro" element={<IntroConcepts />} />
          <Route path="/play" element={<PlayScreen />} />
          <Route path="/summary" element={<EducationalSummary />} />
          <Route path="/women-in-tech" element={<WomenInTech />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/presenter" element={<PresenterDashboard />} />
          <Route path="/presenter" element={<PresenterDashboard />} />
          <Route path="/help" element={<HelpScreen />} />
          {/* Fallback to Home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
