import React from 'react';
import { DiagramControls } from "./DiagramControls";
import { EditInputBox } from "./EditInputBox";

export const DiagramSection = ({
    fullscreenRef,
    isLoading,
    diagramRef,
    isFullscreen,
    toggleFullscreen,
    isDarkMode,
    isSlideshowMode,
    diagramParts,
    currentSlide,
    code,
    analyzeDiagram,
    isAnalyzing,
    orientation,
    handleOrientationChange,
    scale,
    handleScaleChange,
    currentTheme = { currentTheme },
    setCurrentTheme,
    themes,
    setCurrentSlide,
    canIncreaseScale,
    canDecreaseScale,
    toggleEditInput,
    undo,
    redo,
    canUndo,
    canRedo,
    isEditInputOpen,
    setIsEditInputOpen,
    editInputValue,
    setEditInputValue,
    updateDiagram,
    selectedModel,
    setSelectedModel,
    copyToClipboard,
    showToast
}) => {
    const [isCopying, setIsCopying] = React.useState(false);

    const handleCopyToClipboard = async () => {
        setIsCopying(true);
        try {
            await copyToClipboard();
            showToast('Diagram copied to clipboard!', 'success');
        } catch (error) {
            showToast('Failed to copy diagram', 'error');
        } finally {
            setIsCopying(false);
        }
    };
    return (
        <div className="relative mb-4" ref={fullscreenRef}>
            {isLoading && (
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                    <div className="flex flex-col items-center gap-2">
                        <svg className="animate-spin h-8 w-8" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-sm">Generating diagram...</span>
                    </div>
                </div>
            )}

            <DiagramControls
                isDarkMode={isDarkMode}
                isFullscreen={isFullscreen}
                toggleFullscreen={toggleFullscreen}
                orientation={orientation}
                handleOrientationChange={handleOrientationChange}
                scale={scale}
                handleScaleChange={handleScaleChange}
                currentTheme={currentTheme}
                setCurrentTheme={setCurrentTheme}
                themes={themes}
                isSlideshowMode={isSlideshowMode}
                currentSlide={currentSlide}
                totalSlides={diagramParts.length}
                onPrevSlide={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
                onNextSlide={() => setCurrentSlide(prev => Math.min(diagramParts.length - 1, prev + 1))}
                canIncreaseScale={canIncreaseScale}
                canDecreaseScale={canDecreaseScale}
                toggleEditInput={toggleEditInput}
                undo={undo}
                redo={redo}
                canUndo={canUndo}
                canRedo={canRedo}
            />

            <div
                ref={diagramRef}
                className={`rounded-lg transition-all duration-200 flex items-center justify-center ${isFullscreen
                    ? 'fixed inset-0 w-screen h-screen p-4 sm:p-8 overflow-auto'
                    : 'w-full overflow-hidden'
                    } ${isDarkMode
                        ? 'bg-white/10 backdrop-blur-lg border border-white/10'
                        : 'bg-white/80 backdrop-blur-lg border border-gray-200'
                    }`}
                style={{
                    minHeight: isFullscreen ? '100vh' : '500px',
                    height: isFullscreen ? '100vh' : '500px'
                }}
            >
                <div
                    className="bg-white rounded-lg w-full h-full flex items-center justify-center p-8"
                    style={{
                        width: '100%',
                        height: '100%',
                        minHeight: '500px',
                        position: isFullscreen ? 'relative' : 'static',
                        overflow: isFullscreen ? 'auto' : 'hidden'
                    }}
                >
                    <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                            minHeight: '500px',
                            transition: 'all 0.2s ease-in-out',
                            overflow: 'hidden'
                        }}
                    >
                        <div className="mermaid w-full h-full">
                            {isSlideshowMode && diagramParts.length > 0 ? diagramParts[currentSlide] : code}
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-4 right-4 z-10 flex gap-2">
                {/* Copy to Clipboard Button */}
                <button
                    onClick={handleCopyToClipboard}
                    disabled={isCopying || isLoading}
                    className={`p-2 h-10 w-10 rounded-full transition-all duration-200 flex items-center justify-center
                        ${isDarkMode
                            ? 'bg-white/10 text-white border border-white/20 hover:bg-white/30'
                            : 'bg-black/10 text-black border border-black/20 hover:bg-black/30'
                        }
                        ${(isCopying || isLoading) && 'opacity-50 cursor-not-allowed'}
                        ${!isCopying && !isLoading && 'hover:scale-105'}
                    `}
                    title="Copy diagram to clipboard"
                >
                    {isCopying ? (
                        <>
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                        </>
                    )}
                </button>

                {/* Analyze Diagram Button */}
                <button
                    onClick={analyzeDiagram}
                    disabled={isAnalyzing || isLoading}
                    className={`p-2 h-10 w-10 rounded-full transition-all duration-200 flex items-center justify-center
                        ${isDarkMode
                            ? 'bg-blue-500/10 text-white border border-white/20 hover:bg-blue/20'
                            : 'bg-blue-500/10 text-black border border-black/20 hover:bg-blue/20'
                        }
                        ${(isAnalyzing || isLoading) && 'opacity-50 cursor-not-allowed'}
                        ${!isAnalyzing && !isLoading && 'hover:scale-105'}
                    `}
                    title="Analyze diagram"
                >
                    {isAnalyzing ? (
                        <>
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </>
                    )}
                </button>
            </div>

            <EditInputBox
                isOpen={isEditInputOpen}
                onClose={() => setIsEditInputOpen(false)}
                onSubmit={updateDiagram}
                value={editInputValue}
                setValue={setEditInputValue}
                isLoading={isLoading}
                isDarkMode={isDarkMode}
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
            />
        </div>
    );
};
