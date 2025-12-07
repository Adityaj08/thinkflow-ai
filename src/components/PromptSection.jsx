import React, { useState, useRef, useEffect } from 'react';

const MODEL_OPTIONS = [
    { value: 'gemini-2.5-flash-lite', label: 'gemini-2.5-flash-lite' },
    { value: 'gemini-2.5-flash', label: 'gemini-2.5-flash' },
    { value: 'gemini-2.5-pro', label: 'gemini-2.5-pro' },
    { value: 'gemini-flash-latest', label: 'gemini-flash-latest' }
];

export const PromptSection = ({
    prompt,
    setPrompt,
    isLoading,
    isDarkMode,
    generateDiagram,
    selectedModel,
    setSelectedModel
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentModelLabel = MODEL_OPTIONS.find(m => m.value === selectedModel)?.label || 'gemini-2.5-flash-lite';

    return (
        <div className="mb-4">
            <div className="flex flex-col sm:flex-row gap-2">
                {/* Input container with integrated dropdown at bottom-right */}
                <div className={`relative flex-1 rounded-lg transition-all duration-200 ${isDarkMode
                    ? 'bg-white/10 border border-white/10'
                    : 'bg-white border border-gray-200'
                    } ${isLoading && 'opacity-50'}`}>

                    {/* Text Input */}
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
                        className={`w-full p-3 pb-8 bg-transparent outline-none rounded-lg ${isDarkMode
                            ? 'text-white placeholder-white/50'
                            : 'text-gray-900 placeholder-gray-400'
                            } ${isLoading && 'cursor-not-allowed'}`}
                        placeholder="Describe your diagram..."
                    />

                    {/* Model Selector - Bottom Right */}
                    <div ref={dropdownRef} className="absolute bottom-2 right-2">
                        <button
                            type="button"
                            onClick={() => !isLoading && setIsDropdownOpen(!isDropdownOpen)}
                            disabled={isLoading}
                            className={`flex items-center gap-1 px-2 py-1 text-xs font-medium transition-all duration-200 rounded-md ${isDarkMode
                                ? 'text-white/60 hover:text-white/90 bg-white/5 hover:bg-white/10'
                                : 'text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200'
                                } ${isLoading && 'cursor-not-allowed'}`}
                        >
                            <span className="whitespace-nowrap">{currentModelLabel}</span>
                            <svg
                                className={`w-3 h-3 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown Menu - Glassmorphism Style */}
                        {isDropdownOpen && (
                            <div className={`absolute top-full right-0 mt-1 z-[9999] min-w-[180px] rounded-lg overflow-hidden shadow-xl
                                backdrop-blur-xl border
                                ${isDarkMode
                                    ? 'bg-black/70 border-white/20'
                                    : 'bg-white/80 border-gray-200/50'
                                }`}
                                style={{
                                    backdropFilter: 'blur(20px)',
                                    WebkitBackdropFilter: 'blur(20px)'
                                }}
                            >
                                {MODEL_OPTIONS.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            setSelectedModel(option.value);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full px-3 py-2 text-left text-xs transition-all duration-150
                                            ${selectedModel === option.value
                                                ? isDarkMode
                                                    ? 'bg-white/20 text-white font-medium'
                                                    : 'bg-black/10 text-gray-900 font-medium'
                                                : isDarkMode
                                                    ? 'text-white/80 hover:bg-white/10 hover:text-white'
                                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                            }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Generate Button */}
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
