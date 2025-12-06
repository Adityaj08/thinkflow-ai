import React, { useRef, useEffect } from 'react';
import { MoonIcon, SunIcon, OptionsIcon, SlideshowIcon, FullViewIcon } from "./icons";
import { OptionsMenu } from "./OptionsMenu";
import { ExportMenu } from "./ExportMenu";

export const Header = ({
    isDarkMode,
    toggleDarkMode,
    showApiKeyMenu,
    setShowApiKeyMenu,
    useApiKey1,
    selectApiKey,
    isSlideshowMode,
    toggleSlideshowMode,
    isExportOpen,
    setIsExportOpen,
    downloadDiagram,
    showToast,
    isOptionsOpen,
    setIsOptionsOpen,
    currentTheme,
    setCurrentTheme,
    diagramRef,
    clearStorage
}) => {
    const apiKeyMenuRef = useRef(null);
    const optionsMenuRef = useRef(null);
    const exportMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showApiKeyMenu && apiKeyMenuRef.current && !apiKeyMenuRef.current.contains(event.target)) {
                setShowApiKeyMenu(false);
            }
            if (isOptionsOpen && optionsMenuRef.current && !optionsMenuRef.current.contains(event.target)) {
                setIsOptionsOpen(false);
            }
            if (isExportOpen && exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
                setIsExportOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showApiKeyMenu, isOptionsOpen, isExportOpen, setShowApiKeyMenu, setIsOptionsOpen, setIsExportOpen]);

    const handleApiKeySelect = (isKey1) => {
        selectApiKey(isKey1);
        setShowApiKeyMenu(false);
    };

    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <h1 className="text-2xl sm:text-4xl font-bold relative">
                ThinkFlow
                <span className="absolute -right-12 top-0 bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-md">BETA</span>
            </h1>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                    onClick={toggleDarkMode}
                    className={`p-2 rounded-full transition-all duration-200 ${isDarkMode
                        ? 'bg-white/10 hover:bg-white/20'
                        : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                    title="Toggle dark mode (D)"
                >
                    {isDarkMode ? <SunIcon /> : <MoonIcon />}
                </button>
                <div className="relative" ref={apiKeyMenuRef}>
                    <button
                        onClick={() => setShowApiKeyMenu(!showApiKeyMenu)}
                        className={`p-2 rounded-full transition-all duration-200 flex items-center gap-2 ${isDarkMode
                            ? 'bg-white/10 hover:bg-white/20'
                            : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                        title="Select API Key"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                        </svg>
                        <span className="text-sm">{useApiKey1 ? 'API Key 1' : 'API Key 2'}</span>
                    </button>
                    {showApiKeyMenu && (
                        <div className={`absolute top-12 right-0 mt-2 w-48 rounded-lg shadow-lg overflow-hidden backdrop-blur-lg
              ${isDarkMode ? 'bg-black/30 border border-white/10' : 'bg-white/80 border border-gray-200'}
              transition-all duration-200 z-20`}>
                            <div className="p-2 space-y-2">
                                <div className="px-3 py-2 text-sm font-medium text-gray-400">API Key</div>
                                <button
                                    onClick={() => handleApiKeySelect(true)}
                                    className={`w-full px-3 py-2 text-left rounded-md flex items-center space-x-2 
                    ${useApiKey1 ? 'bg-white/10' : 'hover:bg-white/5'}
                    transition-colors duration-200`}
                                >
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: useApiKey1 ? '#3B82F6' : 'transparent' }}></span>
                                    <span className={isDarkMode ? 'text-white' : 'text-gray-700'}>API Key 1</span>
                                </button>
                                <button
                                    onClick={() => handleApiKeySelect(false)}
                                    className={`w-full px-3 py-2 text-left rounded-md flex items-center space-x-2 
                    ${!useApiKey1 ? 'bg-white/10' : 'hover:bg-white/5'}
                    transition-colors duration-200`}
                                >
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: !useApiKey1 ? '#3B82F6' : 'transparent' }}></span>
                                    <span className={isDarkMode ? 'text-white' : 'text-gray-700'}>API Key 2</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <button
                    onClick={toggleSlideshowMode}
                    className={`p-2 rounded-full transition-all duration-200 ${isDarkMode
                        ? 'bg-white/10 hover:bg-white/20'
                        : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                    title="Toggle slideshow mode (Space)"
                >
                    {isSlideshowMode ? <FullViewIcon /> : <SlideshowIcon />}
                </button>
                <div className="relative" ref={exportMenuRef}>
                    <button
                        onClick={() => setIsExportOpen(!isExportOpen)}
                        className={`p-2 rounded-full transition-all duration-200 ${isDarkMode
                            ? 'bg-white/10 hover:bg-white/20'
                            : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                        title="Export"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                    </button>
                    {isExportOpen && (
                        <ExportMenu
                            isDarkMode={isDarkMode}
                            downloadDiagram={downloadDiagram}
                            setIsExportOpen={setIsExportOpen}
                            showToast={showToast}
                            diagramRef={diagramRef}
                        />
                    )}
                </div>
                <div className="relative" ref={optionsMenuRef}>
                    <button
                        onClick={() => setIsOptionsOpen(!isOptionsOpen)}
                        className={`p-2 rounded-full transition-all duration-200 ${isDarkMode
                            ? 'bg-white/10 hover:bg-white/20'
                            : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                        title="Options menu"
                    >
                        <OptionsIcon />
                    </button>
                    {isOptionsOpen && (
                        <OptionsMenu
                            isDarkMode={isDarkMode}
                            currentTheme={currentTheme}
                            setCurrentTheme={setCurrentTheme}
                            setIsOptionsOpen={setIsOptionsOpen}
                            clearStorage={clearStorage}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
