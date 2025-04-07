import { useState } from 'react';

const shortcuts = [
  { key: 'Left Arrow / J', description: 'Previous slide' },
  { key: 'Right Arrow / L', description: 'Next slide' },
  { key: 'Space', description: 'Toggle slideshow mode' },
  { key: 'F', description: 'Toggle fullscreen' },
  { key: 'Esc', description: 'Exit fullscreen' },
  { key: '+ / =', description: 'Zoom in' },
  { key: '- / _', description: 'Zoom out' },
  { key: '0', description: 'Reset zoom' },
  { key: 'D', description: 'Toggle dark mode' },
  { key: 'S', description: 'Save diagram' },
  { key: 'T', description: 'Switch orientation (TD/LR)' },
];

export const HelpMenu = ({ isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50 hidden sm:block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-full transition-all duration-200 ${
          isDarkMode 
            ? 'bg-white/10 hover:bg-white/20' 
            : 'bg-gray-200 hover:bg-gray-300'
        }`}
        title="Keyboard shortcuts"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      </button>

      {isOpen && (
        <div 
          className={`absolute bottom-12 right-0 p-4 rounded-lg shadow-lg w-80
            ${isDarkMode 
              ? 'bg-gray-900 border border-white/10' 
              : 'bg-white border border-gray-200'
            }`}
        >
          <h3 className="text-lg font-semibold mb-4">Keyboard Shortcuts</h3>
          <div className="space-y-2">
            {shortcuts.map(({ key, description }) => (
              <div key={key} className="flex justify-between items-center">
                <kbd className={`px-2 py-1 rounded text-sm ${
                  isDarkMode 
                    ? 'bg-white/10' 
                    : 'bg-gray-100'
                  }`}
                >
                  {key}
                </kbd>
                <span className="text-sm">{description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 