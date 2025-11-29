import React from 'react';

export const CodeEditor = ({
    code,
    setCode,
    isDarkMode,
    saveDiagram
}) => {
    return (
        <>
            <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={`w-full p-4 rounded-lg font-mono mt-6 transition-all duration-200 text-sm sm:text-base ${isDarkMode
                        ? 'bg-white/10 border border-white/10 text-white'
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}
                rows="5"
            />
            <button
                onClick={saveDiagram}
                className={`mt-2 px-4 sm:px-5 py-2 sm:py-3 rounded-lg transition-all duration-200 ${isDarkMode
                        ? 'bg-white/10 hover:bg-white/20'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                title="Save diagram (S)"
            >
                Save
            </button>
        </>
    );
};
