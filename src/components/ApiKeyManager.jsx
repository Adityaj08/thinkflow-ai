import { useState, useEffect } from 'react';

const API_KEY_LINKS = {
  gemini: 'https://aistudio.google.com/apikey',
  openrouter: 'https://openrouter.ai/settings/keys'
};

export const ApiKeyManager = ({ isDarkMode }) => {
  const [geminiKey, setGeminiKey] = useState('');
  const [openrouterKey, setOpenrouterKey] = useState('');
  const [savedKeys, setSavedKeys] = useState({ gemini: '', openrouter: '' });
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showOpenrouterKey, setShowOpenrouterKey] = useState(false);
  const [useCustomKeys, setUseCustomKeys] = useState(false);

  // Load saved keys from localStorage on mount
  useEffect(() => {
    const storedKeys = localStorage.getItem('apiKeys');
    const storedUseCustom = localStorage.getItem('useCustomApiKeys');
    if (storedKeys) {
      const parsed = JSON.parse(storedKeys);
      setSavedKeys(parsed);
      setGeminiKey(parsed.gemini || '');
      setOpenrouterKey(parsed.openrouter || '');
    }
    if (storedUseCustom) {
      setUseCustomKeys(JSON.parse(storedUseCustom));
    }
  }, []);

  const handleToggleCustomKeys = () => {
    const newValue = !useCustomKeys;
    setUseCustomKeys(newValue);
    localStorage.setItem('useCustomApiKeys', JSON.stringify(newValue));
  };

  const handleSaveKeys = () => {
    const newKeys = {
      gemini: geminiKey.trim(),
      openrouter: openrouterKey.trim()
    };
    setSavedKeys(newKeys);
    localStorage.setItem('apiKeys', JSON.stringify(newKeys));
  };

  const handleClearKeys = () => {
    setSavedKeys({ gemini: '', openrouter: '' });
    setGeminiKey('');
    setOpenrouterKey('');
    localStorage.removeItem('apiKeys');
  };

  const inputBaseClass = `w-full px-3 py-2 rounded-md text-sm backdrop-blur-lg transition-colors duration-200
    ${isDarkMode
      ? 'bg-black/30 text-white border border-white/10 hover:bg-black/40 placeholder-white/40'
      : 'bg-white/80 text-gray-900 border border-gray-200 hover:bg-white/90 placeholder-gray-400'
    } ${!useCustomKeys ? 'opacity-50 cursor-not-allowed' : ''}`;

  const linkClass = `text-xs hover:underline transition-colors ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`;

  return (
    <div className="space-y-4">
      {/* Toggle for custom keys */}
      <div className="flex items-center justify-between">
        <p className={`text-sm ${isDarkMode ? 'text-white/80' : 'text-gray-600'}`}>
          Use custom API keys
        </p>
        <button
          onClick={handleToggleCustomKeys}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200
            ${useCustomKeys
              ? 'bg-emerald-500'
              : isDarkMode
                ? 'bg-white/10'
                : 'bg-gray-200'
            }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200
              ${useCustomKeys ? 'translate-x-6' : 'translate-x-1'}`}
          />
        </button>
      </div>

      {/* Gemini API Key */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
            Gemini API Key
          </label>
          <a
            href={API_KEY_LINKS.gemini}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            Get free key →
          </a>
        </div>
        <div className="relative">
          <input
            type={showGeminiKey ? 'text' : 'password'}
            value={geminiKey}
            onChange={(e) => setGeminiKey(e.target.value)}
            placeholder="Enter your Gemini API key"
            disabled={!useCustomKeys}
            className={inputBaseClass}
          />
          <button
            type="button"
            onClick={() => setShowGeminiKey(!showGeminiKey)}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded ${isDarkMode ? 'text-white/60 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {showGeminiKey ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        {savedKeys.gemini && (
          <p className={`text-xs ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
            ✓ Key saved: {savedKeys.gemini.substring(0, 6)}...{savedKeys.gemini.substring(savedKeys.gemini.length - 4)}
          </p>
        )}
      </div>

      {/* OpenRouter API Key */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
            OpenRouter API Key
          </label>
          <a
            href={API_KEY_LINKS.openrouter}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            Get free key →
          </a>
        </div>
        <div className="relative">
          <input
            type={showOpenrouterKey ? 'text' : 'password'}
            value={openrouterKey}
            onChange={(e) => setOpenrouterKey(e.target.value)}
            placeholder="Enter your OpenRouter API key"
            disabled={!useCustomKeys}
            className={inputBaseClass}
          />
          <button
            type="button"
            onClick={() => setShowOpenrouterKey(!showOpenrouterKey)}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded ${isDarkMode ? 'text-white/60 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {showOpenrouterKey ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        {savedKeys.openrouter && (
          <p className={`text-xs ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
            ✓ Key saved: {savedKeys.openrouter.substring(0, 6)}...{savedKeys.openrouter.substring(savedKeys.openrouter.length - 4)}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2 pt-2">
        <button
          onClick={handleSaveKeys}
          className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
            ${isDarkMode
              ? 'bg-emerald-500/80 hover:bg-emerald-500 text-white'
              : 'bg-emerald-500 hover:bg-emerald-600 text-white'
            }`}
        >
          Save Keys
        </button>
        <button
          onClick={handleClearKeys}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
            ${isDarkMode
              ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
              : 'bg-red-100 hover:bg-red-200 text-red-600'
            }`}
        >
          Clear
        </button>
      </div>

      {/* Info Note */}
      <p className={`text-xs ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>
        Your API keys are stored locally in your browser and never sent to our servers.
      </p>
    </div>
  );
}; 