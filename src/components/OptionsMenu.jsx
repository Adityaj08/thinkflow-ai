import { themes } from '../constants/themes';

export const OptionsMenu = ({ isDarkMode, currentTheme, setCurrentTheme, setIsOptionsOpen }) => (
  <div className={`absolute top-12 right-0 mt-2 w-48 rounded-lg shadow-lg overflow-hidden backdrop-blur-lg
    ${isDarkMode ? 'bg-black/30 border border-white/10' : 'bg-white/80 border border-gray-200'}
    transition-all duration-200 z-20`}>
    <div className="p-2 space-y-2">
      <div className="px-3 py-2 text-sm font-medium text-gray-400">Theme</div>
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
); 