import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LINKS } from '../constants/links';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center bg-gray-900/50 backdrop-blur-lg rounded-2xl p-4 border border-white/5">
            <div className="flex-1 flex items-center">
              <div className="hidden md:flex items-center space-x-6">
                <a href="#features" className="text-white/80 hover:text-white transition-colors">Features</a>
                <Link to="/pricing" className="text-white/80 hover:text-white transition-colors">Pricing</Link>
                <a href="#docs" className="text-white/80 hover:text-white transition-colors">Docs</a>
              </div>
            </div>

            {/* Centered Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img src="/ThinkFlowLogo.png" alt="ThinkFlow" className="h-8 sm:h-12" />
              <span className="text-xl sm:text-2xl font-bold text-white">ThinkFlow</span>
            </Link>

            {/* Desktop menu */}
            <div className="flex-1 flex items-center justify-end space-x-6">
              <div className="hidden md:flex items-center space-x-6">
                <a
                  href={LINKS.TWITTER}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a
                  href={LINKS.GITHUB}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <Link
                  to={LINKS.APP}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all duration-200 text-sm sm:text-base"
                >
                  Try for Free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu button fixed to bottom right */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-4 bg-gray-900/90 backdrop-blur-lg rounded-full hover:bg-gray-900/70 transition-all duration-200 shadow-lg border border-white/10"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Fullscreen mobile menu */}
      <div className={`md:hidden fixed inset-0 bg-gray-900/95 backdrop-blur-lg transition-all duration-300 z-40 ${
        isMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
      }`}>
        <div className="h-full flex flex-col justify-end pb-24">
          {/* Links just above the close button */}
          <div className="flex flex-col items-end px-6 space-y-6 mb-6">
            <a 
              href={LINKS.FEATURES} 
              className="text-2xl text-white/80 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href={LINKS.GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl text-white/80 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Star on GitHub
            </a>
            <Link 
              to={LINKS.PRICING} 
              className="text-2xl text-white/80 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <a 
              href={LINKS.DOCS} 
              className="text-2xl text-white/80 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Docs
            </a>
            <Link
              to={LINKS.APP}
              className="text-2xl text-white/80 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Try for Free
            </Link>
          </div>
        </div>
      </div>
    </>
  );
} 