import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';

const PublicLayout: React.FC = () => {
  const location = useLocation();

  // Don't show header/footer on home page since it has its own header
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gray-50">
      {!isHomePage && (
        <Navigation />
      )}
      
      <main>
        <Outlet />
      </main>
      
      <Footer />
      <BackToTop />
    </div>
  );
};

export default PublicLayout;