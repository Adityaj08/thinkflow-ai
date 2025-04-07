import { useState } from 'react';

export const ApiKeyManager = ({ isDarkMode, setIsOptionsOpen }) => {
  const [apiKey1, setApiKey1] = useState(localStorage.getItem('GEMINI_API_KEY1') || process.env.GEMINI_API_KEY1 || '');
  const [apiKey2, setApiKey2] = useState(localStorage.getItem('GEMINI_API_KEY2') || process.env.GEMINI_API_KEY2 || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    localStorage.setItem('GEMINI_API_KEY1', apiKey1);
    localStorage.setItem('GEMINI_API_KEY2', apiKey2);
    setIsEditing(false);
    setIsOptionsOpen(false);
    // Reload the page to apply the new API keys
    window.location.reload();
  };

  return (
    <div className="p-2 space-y-2">
      <div className="px-3 py-2 text-sm font-medium text-gray-400">API Keys</div>
      <div className="space-y-2">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Primary API Key</label>
          <input
            type="password"
            value={apiKey1}
            onChange={(e) => setApiKey1(e.target.value)}
            disabled={!isEditing}
            className={`w-full p-2 rounded-md text-sm ${
              isDarkMode 
                ? 'bg-white/10 border border-white/10 text-white' 
                : 'bg-white border border-gray-200 text-gray-900'
            }`}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Backup API Key</label>
          <input
            type="password"
            value={apiKey2}
            onChange={(e) => setApiKey2(e.target.value)}
            disabled={!isEditing}
            className={`w-full p-2 rounded-md text-sm ${
              isDarkMode 
                ? 'bg-white/10 border border-white/10 text-white' 
                : 'bg-white border border-gray-200 text-gray-900'
            }`}
          />
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className={`px-3 py-2 rounded-md text-sm ${
                isDarkMode 
                  ? 'bg-white/10 hover:bg-white/20 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
            >
              Edit Keys
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className={`px-3 py-2 rounded-md text-sm ${
                  isDarkMode 
                    ? 'bg-white/10 hover:bg-white/20 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                }`}
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setApiKey1(localStorage.getItem('GEMINI_API_KEY1') || process.env.GEMINI_API_KEY1 || '');
                  setApiKey2(localStorage.getItem('GEMINI_API_KEY2') || process.env.GEMINI_API_KEY2 || '');
                }}
                className={`px-3 py-2 rounded-md text-sm ${
                  isDarkMode 
                    ? 'bg-white/10 hover:bg-white/20 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                }`}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}; 