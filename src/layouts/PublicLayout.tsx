import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';

const PublicLayout: React.FC = () => {
  const location = useLocation();

  // Don't show header/footer on home page since it has its own header
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gray-50">
      {!isHomePage && (
        <header className="bg-blue-950 border-b-4 border-yellow-500 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-4">
                <img 
                  src="https://res.cloudinary.com/dedcmctqk/image/upload/v1750079276/logome_h9snnx.webp" 
                  alt="MDRRMO" 
                  className="h-12 w-auto"
                />
                <div>
                  <h1 className="font-bold text-yellow-500 text-lg md:text-xl">MDRRMO</h1>
                  <p className="text-yellow-500 text-xs md:text-sm">PIO DURAN, ALBAY</p>
                </div>
              </Link>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-yellow-500 hover:text-yellow-400 transition-colors">Home</Link>
              <Link to="/about" className="text-yellow-500 hover:text-yellow-400 transition-colors">About</Link>
              <Link to="/services" className="text-yellow-500 hover:text-yellow-400 transition-colors">Services</Link>
              <Link to="/news" className="text-yellow-500 hover:text-yellow-400 transition-colors">News</Link>
              <Link to="/gallery" className="text-yellow-500 hover:text-yellow-400 transition-colors">Gallery</Link>
              <Link to="/contact" className="text-yellow-500 hover:text-yellow-400 transition-colors">Contact</Link>
            </nav>
          </div>
        </header>
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