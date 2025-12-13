import React, { useRef, useEffect } from 'react';
import { MoonIcon, SunIcon, OptionsIcon, SlideshowIcon, FullViewIcon } from "./icons";
import { OptionsMenu } from "./OptionsMenu";
import { ExportMenu } from "./ExportMenu";

export const Header = ({
    isDarkMode,
    toggleDarkMode,
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
    const optionsMenuRef = useRef(null);
    const exportMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
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
    }, [isOptionsOpen, isExportOpen, setIsOptionsOpen, setIsExportOpen]);

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
