import React, { useEffect, useRef } from 'react';
import SlideUp from './animations/SlideUp';
import { ModelSelector } from './ModelSelector';

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

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSubmit(value);
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

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
                            className={`w-full h-24 p-3 pb-10 text-lg resize-none outline-none bg-transparent rounded-lg ${isDarkMode
                                ? 'text-white placeholder-white/50'
                                : 'text-gray-900 placeholder-gray-400'
                                }`}
                            disabled={isLoading}
                        />

                        {/* Model Selector & Send - Bottom Right */}
                        <div className="absolute bottom-4 right-4">
                            <ModelSelector
                                selectedModel={selectedModel}
                                setSelectedModel={setSelectedModel}
                                onSubmit={() => onSubmit(value)}
                                isLoading={isLoading}
                                isDarkMode={isDarkMode}
                                disabled={!value.trim()}
                            />
                        </div>
                    </div>
                </SlideUp>
            </div>
        </div>
    );
};
