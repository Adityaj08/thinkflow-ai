import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { ApiKeyManager } from './ApiKeyManager';
import { themes } from '../constants/themes';

export const OptionsMenu = ({ isDarkMode, currentTheme, setCurrentTheme, setIsOptionsOpen }) => {
  const { user, logout } = useAuth0();
  const [isApiKeyMenuOpen, setIsApiKeyMenuOpen] = useState(false);
  const isAdmin = user && user['https://thinkflow.ai/roles']?.includes('admin');

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <div className={`absolute top-12 right-0 mt-2 w-72 rounded-lg shadow-lg overflow-hidden backdrop-blur-lg
      ${isDarkMode ? 'bg-black/30 border border-white/10' : 'bg-white/80 border border-gray-200'}
      transition-all duration-200 z-20`}>
      
      {/* User Profile Section */}
      <div className="p-4 border-b border-white/10">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <img 
              src={user?.picture} 
              alt={user?.name} 
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className={`text-sm font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {user?.name}
                </p>
                {isAdmin && (
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                    Admin
                  </span>
                )}
              </div>
              <p className={`text-xs truncate ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className={`w-full px-3 py-2 rounded-md text-left flex items-center space-x-2 
              ${isDarkMode 
                ? 'text-red-400 hover:bg-white/10' 
                : 'text-red-600 hover:bg-gray-100'
              } transition-colors duration-200`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Plan Section */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Current Plan
            </p>
            <p className={`text-xs ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>
              {isAdmin ? 'Admin Plan' : 'Free Plan'}
            </p>
          </div>
          {!isAdmin && (
            <button
              onClick={() => window.location.href = '/pricing'}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors
                ${isDarkMode 
                  ? 'bg-white/10 hover:bg-white/20 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                }`}
            >
              Upgrade
            </button>
          )}
        </div>
      </div>

      {/* Theme Section */}
      <div className="p-4 border-b border-white/10">
        <div className="px-3 py-2 text-sm font-medium text-gray-400">Theme</div>
        <div className="space-y-2">
          {Object.entries(themes).map(([key, theme]) => (
            <button
              key={key}
              onClick={() => setCurrentTheme(key)}
              className={`w-full px-3 py-2 text-left rounded-md flex items-center space-x-2 
                ${currentTheme === key ? 'bg-white/10' : 'hover:bg-white/5'}
                transition-colors duration-200`}
            >
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.color }}></span>
              <span className={isDarkMode ? 'text-white' : 'text-gray-700'}>{theme.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* API Keys Section */}
      <div className="p-4 border-b border-white/10">
        <div className="px-3 py-2 text-sm font-medium text-gray-400">API Keys</div>
        <ApiKeyManager 
          isDarkMode={isDarkMode} 
          setIsOptionsOpen={setIsOptionsOpen} 
        />
      </div>
    </div>
  );
}; 