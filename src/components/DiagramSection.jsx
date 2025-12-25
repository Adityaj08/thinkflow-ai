import React from 'react';
import { DiagramControls } from "./DiagramControls";
import { EditInputBox } from "./EditInputBox";
import { parseDiagramStats } from "../utils/diagramStats";

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
    expandDiagram,
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
    showToast,
    history,
    historyIndex,
    navigateHistory,
    isLocked,
    toggleLock
}) => {
    const [isCopying, setIsCopying] = React.useState(false);

    // Compute diagram stats
    const stats = React.useMemo(() => parseDiagramStats(code), [code]);

    // Fun loading messages
    const loadingMessages = [
        "Generating diagram...",
        "Thinking...",
        "Drawing nodes...",
        "Connecting the dots...",
        "Almost there...",
        "Brewing magic...",
        "Crafting your diagram...",
        "Making it pretty..."
    ];
    const [loadingMessage] = React.useState(
        () => loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
    );

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
                        <span className="text-sm">{loadingMessage}</span>
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
                isLocked={isLocked}
                toggleLock={toggleLock}
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

            {/* Stats overlay - bottom right, above action buttons, hidden on mobile */}
            <div className="absolute bottom-16 right-4 z-10 hidden sm:block">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs backdrop-blur-md ${isDarkMode
                    ? 'bg-black/50 border border-white/20 text-white/80'
                    : 'bg-white/80 border border-gray-200 text-gray-600'
                    }`}>
                    {/* Diagram type badge */}
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${isDarkMode
                        ? 'bg-blue-500/30 text-blue-300'
                        : 'bg-blue-100 text-blue-600'
                        }`}>
                        {stats.diagramType}
                    </span>

                    {/* Node count */}
                    <span className="flex items-center gap-1" title="Nodes">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                            <rect x="3" y="3" width="7" height="7" rx="1" />
                            <rect x="14" y="3" width="7" height="7" rx="1" />
                            <rect x="3" y="14" width="7" height="7" rx="1" />
                            <rect x="14" y="14" width="7" height="7" rx="1" />
                        </svg>
                        {stats.nodeCount}
                    </span>

                    {/* Edge count */}
                    <span className="flex items-center gap-1" title="Edges">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                        {stats.edgeCount}
                    </span>
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
                    disabled={isAnalyzing || isLoading || isLocked}
                    className={`p-2 h-10 w-10 rounded-full transition-all duration-200 flex items-center justify-center
                        ${isDarkMode
                            ? 'bg-blue-500/10 text-white border border-white/20 hover:bg-blue/20'
                            : 'bg-blue-500/10 text-black border border-black/20 hover:bg-blue/20'
                        }
                        ${(isAnalyzing || isLoading || isLocked) && 'opacity-50 cursor-not-allowed'}
                        ${!isAnalyzing && !isLoading && !isLocked && 'hover:scale-105'}
                    `}
                    title={isLocked ? "Unlock diagram to analyze" : "Analyze diagram"}
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

                {/* Expand Diagram Button */}
                <button
                    onClick={expandDiagram}
                    disabled={isLoading || isLocked}
                    className={`p-2 h-10 w-10 rounded-full transition-all duration-200 flex items-center justify-center
                        ${isDarkMode
                            ? 'bg-purple-500/10 text-white border border-white/20 hover:bg-purple-500/20'
                            : 'bg-purple-500/10 text-black border border-black/20 hover:bg-purple-500/20'
                        }
                        ${(isLoading || isLocked) && 'opacity-50 cursor-not-allowed'}
                        ${!isLoading && !isLocked && 'hover:scale-105'}
                    `}
                    title={isLocked ? "Unlock diagram to expand" : "Expand diagram with more context"}
                >
                    {isLoading ? (
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <svg className="w-4 h-4" viewBox="0 0 30 30" fill="currentColor">
                            <path d="M14.217,19.707l-1.112,2.547c-0.427,0.979-1.782,0.979-2.21,0l-1.112-2.547c-0.99-2.267-2.771-4.071-4.993-5.057L1.73,13.292c-0.973-0.432-0.973-1.848,0-2.28l2.965-1.316C6.974,8.684,8.787,6.813,9.76,4.47l1.126-2.714c0.418-1.007,1.81-1.007,2.228,0L14.24,4.47c0.973,2.344,2.786,4.215,5.065,5.226l2.965,1.316c0.973,0.432,0.973,1.848,0,2.28l-3.061,1.359C16.988,15.637,15.206,17.441,14.217,19.707z"></path>
                            <path d="M24.481,27.796l-0.339,0.777c-0.248,0.569-1.036,0.569-1.284,0l-0.339-0.777c-0.604-1.385-1.693-2.488-3.051-3.092l-1.044-0.464c-0.565-0.251-0.565-1.072,0-1.323l0.986-0.438c1.393-0.619,2.501-1.763,3.095-3.195l0.348-0.84c0.243-0.585,1.052-0.585,1.294,0l0.348,0.84c0.594,1.432,1.702,2.576,3.095,3.195l0.986,0.438c0.565,0.251,0.565,1.072,0,1.323l-1.044,0.464C26.174,25.308,25.085,26.411,24.481,27.796z"></path>
                        </svg>
                    )}
                </button>
            </div>

            {/* History overlay - bottom left */}
            {history && history.length > 1 && (
                <div className="absolute bottom-3 left-3 z-10">
                    <div
                        className={`flex gap-1.5 p-1.5 rounded-full backdrop-blur-md overflow-x-auto scrollbar-hide ${isDarkMode
                            ? 'bg-black/50 border border-white/20'
                            : 'bg-white/80 border border-gray-200'
                            }`}
                        style={{ maxWidth: '220px' }}
                    >
                        {history.map((_, idx) => {
                            const isActive = idx === historyIndex;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => navigateHistory(idx)}
                                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-medium transition-all duration-200 ${isActive
                                        ? 'ring-2 ring-blue-500 bg-blue-500/30 text-blue-400'
                                        : isDarkMode
                                            ? 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
                                        } hover:scale-105`}
                                    title={`Version ${idx + 1}`}
                                >
                                    v{idx + 1}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

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
