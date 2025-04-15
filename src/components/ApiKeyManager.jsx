import { useState, useEffect } from 'react';

export const ApiKeyManager = ({ isDarkMode }) => {
  const [provider, setProvider] = useState('openai');
  const [apiKey, setApiKey] = useState('');
  const [savedKeys, setSavedKeys] = useState({});
  const [isCustomProvider, setIsCustomProvider] = useState(false);

  // Load saved keys from localStorage on mount
  useEffect(() => {
    const storedKeys = localStorage.getItem('apiKeys');
    if (storedKeys) {
      setSavedKeys(JSON.parse(storedKeys));
    }
  }, []);

  // Save keys to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('apiKeys', JSON.stringify(savedKeys));
  }, [savedKeys]);

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      setSavedKeys(prev => ({
        ...prev,
        [provider]: apiKey.trim()
      }));
      setApiKey('');
    }
  };

  const handleDeleteKey = (providerToDelete) => {
    setSavedKeys(prev => {
      const newKeys = { ...prev };
      delete newKeys[providerToDelete];
      return newKeys;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="flex-1 flex space-x-2">
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            disabled={!isCustomProvider}
            className={`flex-1 px-3 py-2 rounded-md text-sm backdrop-blur-lg
              ${isDarkMode 
                ? 'bg-black/30 text-white border border-white/10 hover:bg-black/40' 
                : 'bg-white/80 text-gray-900 border border-gray-200 hover:bg-white/90'
              } transition-colors duration-200
              ${!isCustomProvider ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
            <option value="google">Google</option>
          </select>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter API Key"
            disabled={!isCustomProvider}
            className={`flex-1 px-3 py-2 rounded-md text-sm backdrop-blur-lg
              ${isDarkMode 
                ? 'bg-black/30 text-white border border-white/10 hover:bg-black/40' 
                : 'bg-white/80 text-gray-900 border border-gray-200 hover:bg-white/90'
              } transition-colors duration-200
              ${!isCustomProvider ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
        </div>
        <button
          onClick={handleSaveKey}
          disabled={!isCustomProvider}
          className={`px-3 py-2 rounded-md text-sm font-medium backdrop-blur-lg
            ${isDarkMode 
              ? 'bg-emerald-500/80 hover:bg-emerald-500 text-white' 
              : 'bg-emerald-500/80 hover:bg-emerald-500 text-white'
            } transition-colors duration-200
            ${!isCustomProvider ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Save
        </button>
      </div>

      <div className="flex items-center justify-between">
        <p className={`text-sm ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>
          Use custom API keys
        </p>
        <button
          onClick={() => setIsCustomProvider(!isCustomProvider)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200
            ${isCustomProvider 
              ? 'bg-emerald-500' 
              : isDarkMode 
                ? 'bg-white/10' 
                : 'bg-gray-200'
            }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200
              ${isCustomProvider ? 'translate-x-6' : 'translate-x-1'}`}
          />
        </button>
      </div>

      {Object.entries(savedKeys).length > 0 && (
        <div className="space-y-2">
          <p className={`text-sm font-medium ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>
            Saved API Keys
          </p>
          {Object.entries(savedKeys).map(([keyProvider, key]) => (
            <div 
              key={keyProvider}
              className={`flex items-center justify-between p-2 rounded-md backdrop-blur-lg
                ${isDarkMode 
                  ? 'bg-black/30 border border-white/10 hover:bg-black/40' 
                  : 'bg-white/80 border border-gray-200 hover:bg-white/90'
                } transition-colors duration-200`}
            >
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {keyProvider.charAt(0).toUpperCase() + keyProvider.slice(1)}
                </span>
                <span className={`text-xs ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>
                  {key.substring(0, 4)}...{key.substring(key.length - 4)}
                </span>
              </div>
              <button
                onClick={() => handleDeleteKey(keyProvider)}
                className={`p-1 rounded-md backdrop-blur-lg
                  ${isDarkMode 
                    ? 'text-red-400 hover:bg-black/40' 
                    : 'text-red-500 hover:bg-white/90'
                  } transition-colors duration-200`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 