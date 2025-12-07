import React, { useState, useRef, useEffect } from 'react';

const MODEL_OPTIONS = [
    { value: 'gemini-2.5-flash-lite', label: 'gemini-2.5-flash-lite' },
    { value: 'gemini-2.5-flash', label: 'gemini-2.5-flash' },
    { value: 'gemini-flash-latest', label: 'gemini-flash-latest' }
];

export const ModelSelector = ({
    selectedModel,
    setSelectedModel,
    onSubmit,
    isLoading,
    isDarkMode,
    disabled
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
        <div ref={dropdownRef} className="flex items-center gap-2">
            {/* Model Selector Button */}
            <button
                type="button"
                onClick={() => !isLoading && setIsDropdownOpen(!isDropdownOpen)}
                disabled={isLoading}
                className={`flex items-center gap-1 p-2 text-xs font-medium transition-all duration-200 rounded-md ${isDarkMode
                    ? 'text-white/60 hover:text-white/90 bg-white/10 hover:bg-white/20'
                    : 'text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200'
                    } ${isLoading && 'cursor-not-allowed opacity-50'}`}
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

            {/* Send Button */}
            <button
                type="button"
                onClick={onSubmit}
                disabled={isLoading || disabled}
                className={`p-1.5 rounded-full transition-all duration-200 ${isDarkMode
                    ? 'text-white/60 hover:text-white hover:bg-white/10'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                    } ${(isLoading || disabled) && 'cursor-not-allowed opacity-50'}`}
            >
                {isLoading ? (
                    <svg className="animate-spin w-7 h-7" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                ) : (
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.0693 8.50867L9.50929 4.22867C3.75929 1.34867 1.39929 3.70867 4.27929 9.45867L5.14929 11.1987C5.39929 11.7087 5.39929 12.2987 5.14929 12.8087L4.27929 14.5387C1.39929 20.2887 3.74929 22.6487 9.50929 19.7687L18.0693 15.4887C21.9093 13.5687 21.9093 10.4287 18.0693 8.50867ZM14.8393 12.7487H9.43929C9.02929 12.7487 8.68929 12.4087 8.68929 11.9987C8.68929 11.5887 9.02929 11.2487 9.43929 11.2487H14.8393C15.2493 11.2487 15.5893 11.5887 15.5893 11.9987C15.5893 12.4087 15.2493 12.7487 14.8393 12.7487Z" />
                    </svg>
                )}
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <div
                    className={`absolute top-full right-0 mb-2 min-w-[180px] rounded-lg shadow-xl border
                        ${isDarkMode
                            ? 'bg-black/95 border-white/20'
                            : 'bg-white border-gray-200'
                        }`}
                    style={{ zIndex: 999 }}
                >
                    {MODEL_OPTIONS.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => {
                                setSelectedModel(option.value);
                                setIsDropdownOpen(false);
                            }}
                            className={`w-full p-2 text-left text-xs transition-all duration-150
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
    );
};
