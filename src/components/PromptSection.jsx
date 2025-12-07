import React from 'react';
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
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && prompt.trim() && !isLoading) {
            generateDiagram();
        }
    };

    return (
        <div className="mb-4">
            {/* Input container with integrated bottom-right controls */}
            <div className={`relative rounded-lg transition-all duration-200 ${isDarkMode
                ? 'bg-white/10 border border-white/10'
                : 'bg-white border border-gray-200'
                } ${isLoading && 'opacity-50'}`}>

                {/* Text Input */}
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    className={`w-full p-3 pb-10 bg-transparent outline-none rounded-lg ${isDarkMode
                        ? 'text-white placeholder-white/50'
                        : 'text-gray-900 placeholder-gray-400'
                        } ${isLoading && 'cursor-not-allowed'}`}
                    placeholder="Describe your diagram..."
                />

                {/* Model Selector & Send - Bottom Right */}
                <div className="absolute bottom-2 right-2">
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
