import React, { useState, useEffect, useRef } from 'react';
import SlideUp from './animations/SlideUp';

const MODEL_OPTIONS = [
    { value: 'gemini-2.5-flash-lite', label: 'gemini-2.5-flash-lite' },
    { value: 'gemini-2.5-flash', label: 'gemini-2.5-flash' },
    { value: 'gemini-2.5-pro', label: 'gemini-2.5-pro' },
    { value: 'gemini-flash-latest', label: 'gemini-flash-latest' }
];

export const EditInputBox = ({
    isOpen,
    onClose,
    onSubmit,
    value,
    setValue,
    isLoading,
    isDarkMode,
    selectedModel,
    setSelectedModel
}) => {
    const inputRef = useRef(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSubmit(value);
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    const currentModelLabel = MODEL_OPTIONS.find(m => m.value === selectedModel)?.label || 'gemini-2.5-flash-lite';

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative z-50 w-full max-w-2xl px-4">
                <SlideUp distance={5} direction="vertical" delay={0} config={{ tension: 400, friction: 20 }}>
                    <div className={`
                        relative w-full rounded-xl shadow-2xl p-4
                        ${isDarkMode ? 'bg-black/80 backdrop-blur-xl border border-white/20' : 'bg-white/90 backdrop-blur-xl border border-gray-200'}
                    `}
                        style={{
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)'
                        }}>
                        {/* Textarea */}
                        <textarea
                            ref={inputRef}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Describe Edits"
                            className={`w-full h-24 p-3 pb-8 text-lg resize-none outline-none bg-transparent rounded-lg ${isDarkMode
                                ? 'text-white placeholder-white/50'
                                : 'text-gray-900 placeholder-gray-400'
                                }`}
                            disabled={isLoading}
                        />

                        {/* Model Selector - Bottom Right */}
                        <div ref={dropdownRef} className="absolute bottom-4 right-4">
                            <button
                                type="button"
                                onClick={() => !isLoading && setIsDropdownOpen(!isDropdownOpen)}
                                disabled={isLoading}
                                className={`flex items-center gap-1 px-2 py-1 text-xs font-medium transition-all duration-200 rounded-md ${isDarkMode
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

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div
                                    className={`fixed min-w-[180px] rounded-lg shadow-xl border
                                        ${isDarkMode
                                            ? 'bg-black/95 border-white/20'
                                            : 'bg-white border-gray-200'
                                        }`}
                                    style={{
                                        zIndex: 99999,
                                        marginTop: '4px'
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
                </SlideUp>
            </div>
        </div>
    );
};
