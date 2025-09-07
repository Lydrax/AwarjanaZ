import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import MemorialPage from './pages/memorial-page';
import CreateMemorial from './pages/create-memorial';
import MemorialDashboard from './pages/memorial-dashboard';
import MemorialSearch from './pages/memorial-search';

const Routes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <ScrollToTop />
          <RouterRoutes>
            {/* Define your route here */}
            <Route path="/" element={<MemorialSearch />} />
            <Route path="/memorial-page" element={<MemorialPage />} />
            <Route path="/memorial-page/:id" element={<MemorialPage />} />
            <Route path="/create-memorial" element={<CreateMemorial />} />
            <Route path="/memorial-dashboard" element={<MemorialDashboard />} />
            <Route path="/memorial-search" element={<MemorialSearch />} />
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Routes;