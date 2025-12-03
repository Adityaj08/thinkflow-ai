import React from 'react';

export const PromptSection = ({
    prompt,
    setPrompt,
    isLoading,
    isDarkMode,
    generateDiagram
}) => {
    return (
        <div className="mb-4">
            <div className="flex flex-col sm:flex-row gap-2">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && prompt.trim() && !isLoading) {
                            generateDiagram();
                        }
                    }}
                    disabled={isLoading}
                    className={`w-full p-2 rounded-lg transition-all duration-200 ${isDarkMode
                        ? 'bg-white/10 border border-white/10 text-white placeholder-white/50'
                        : 'bg-white border border-gray-200 text-gray-900 placeholder-gray-400'
                        } ${isLoading && 'opacity-50 cursor-not-allowed'}`}
                    placeholder="Describe your diagram..."
                />
                <button
                    onClick={generateDiagram}
                    disabled={!prompt.trim() || isLoading}
                    className={`px-4 py-2 sm:px-5 sm:py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap
            ${isDarkMode
                            ? 'bg-white text-black hover:bg-white/90'
                            : 'bg-black text-white hover:bg-black/90'
                        }
            ${(!prompt.trim() || isLoading) && 'opacity-50 cursor-not-allowed'}
            ${prompt.trim() && !isLoading && 'hover:scale-105'}
          `}
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="hidden sm:inline">Generating...</span>
                        </>
                    ) : (
                        <>Generate<span className="hidden sm:inline"> Diagram</span></>
                    )}
                </button>
            </div>
        </div>
    );
};
