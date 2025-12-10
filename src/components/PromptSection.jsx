import React, { useRef, useEffect } from 'react';
import { ModelSelector } from './ModelSelector';

export const PromptSection = ({
    prompt,
    setPrompt,
    isLoading,
    isDarkMode,
    generateDiagram,
    selectedModel,
    setSelectedModel
}) => {
    const textareaRef = useRef(null);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey && prompt.trim() && !isLoading) {
            e.preventDefault();
            generateDiagram();
        }
    };

    // Auto-resize textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            const lineHeight = 26;
            const maxRows = 7;
            const maxHeight = lineHeight * maxRows;
            const newHeight = Math.min(textarea.scrollHeight, maxHeight);
            textarea.style.height = `${newHeight}px`;
        }
    }, [prompt]);

    return (
        <div className="mb-4">
            <div className={`rounded-lg transition-all duration-200 ${isDarkMode
                ? 'bg-white/10 border border-white/10'
                : 'bg-white border border-gray-200'
                } ${isLoading && 'opacity-50'}`}>

                {/* Upper Part - Textarea */}
                <textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    rows={1}
                    className={`w-full p-3 bg-transparent outline-none rounded-t-lg resize-none overflow-y-auto ${isDarkMode
                        ? 'text-white placeholder-white/50'
                        : 'text-gray-900 placeholder-gray-400'
                        } ${isLoading && 'cursor-not-allowed'}`}
                    placeholder="Ask ThinkFlow"
                    style={{ minHeight: '24px' }}
                />

                <div className={`flex items-center justify-end px-2 py-2 ${isDarkMode
                    ? 'border-white/10'
                    : 'border-gray-200'
                    }`}>
                    <ModelSelector
                        selectedModel={selectedModel}
                        setSelectedModel={setSelectedModel}
                        onSubmit={generateDiagram}
                        isLoading={isLoading}
                        isDarkMode={isDarkMode}
                        disabled={!prompt.trim()}
                    />
                </div>
            </div>
        </div>
    );
};
