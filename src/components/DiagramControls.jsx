import { FullscreenIcon, ExitFullscreenIcon, EditIcon } from './icons';

export const DiagramControls = ({
  isDarkMode,
  isFullscreen,
  toggleFullscreen,
  orientation,
  handleOrientationChange,
  scale,
  handleScaleChange,
  currentTheme,
  setCurrentTheme,
  themes,
  isSlideshowMode,
  currentSlide,
  totalSlides,
  onPrevSlide,
  onNextSlide,
  canIncreaseScale,
  canDecreaseScale,
  toggleEditInput,
  undo,
  redo,
  canUndo,
  canRedo,
  isLocked,
  toggleLock
}) => (
  <div className={`absolute top-2 right-0 sm:right-2 flex flex-wrap items-center gap-2 z-10 p-2 mx-1 sm:mx-0 rounded-lg 
    ${isDarkMode ? 'bg-white/10 backdrop-blur-md' : 'bg-black/10 backdrop-blur-md'}`}
  >
    {/* Fullscreen and Orientation Controls */}
    <div className="flex gap-1">
      {/* Lock/Unlock Button */}
      <button
        onClick={toggleLock}
        className={`p-1 rounded transition-all duration-200 ${isLocked
            ? 'bg-amber-500/30 text-amber-400'
            : 'hover:bg-white/10'
          }`}
        title={isLocked ? "Unlock diagram (enable editing)" : "Lock diagram (prevent accidental edits)"}
      >
        {isLocked ? (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
          </svg>
        )}
      </button>

      <button
        onClick={toggleEditInput}
        disabled={isLocked}
        className={`p-1 rounded transition-all duration-200 ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'}`}
        title={isLocked ? "Unlock diagram to edit" : "Edit Diagram"}
      >
        <EditIcon />
      </button>

      <button
        onClick={undo}
        disabled={!canUndo || isLocked}
        className={`p-1 rounded transition-all duration-200 ${(!canUndo || isLocked) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'}`}
        title={isLocked ? "Unlock diagram to undo" : "Undo"}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 14L4 9l5-5" />
          <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11" />
        </svg>
      </button>

      <button
        onClick={redo}
        disabled={!canRedo || isLocked}
        className={`p-1 rounded transition-all duration-200 ${(!canRedo || isLocked) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'}`}
        title={isLocked ? "Unlock diagram to redo" : "Redo"}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 14l5-5-5-5" />
          <path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13" />
        </svg>
      </button>

      <button
        onClick={toggleFullscreen}
        className="p-1 rounded hover:bg-white/10 transition-all duration-200"
        title={isFullscreen ? "Exit fullscreen (F)" : "Enter fullscreen (F)"}
      >
        {isFullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
      </button>

      <button
        onClick={() => handleOrientationChange('TD')}
        className={`p-1 rounded transition-all duration-200 ${orientation === 'TD' ? 'bg-white/20' : 'hover:bg-white/10'
          }`}
        title="Top to Bottom (T)"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3v18M5 10l7-7 7 7M5 14l7 7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => handleOrientationChange('LR')}
        className={`p-1 rounded transition-all duration-200 ${orientation === 'LR' ? 'bg-white/20' : 'hover:bg-white/10'
          }`}
        title="Left to Right (T)"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12h18M10 5l7 7-7 7M14 5l-7 7 7 7" />
        </svg>
      </button>
    </div>

    {/* Scale Controls */}
    <div className="flex items-center gap-1">
      <button
        onClick={() => handleScaleChange(scale - 0.1)}
        disabled={!canDecreaseScale}
        className={`p-1 rounded transition-all duration-200 ${!canDecreaseScale
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:bg-white/10'
          }`}
        title={!canDecreaseScale
          ? "Cannot decrease scale further"
          : "Zoom out (- or _)"
        }
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14" />
        </svg>
      </button>
      <span
        className="text-xs sm:text-sm min-w-[3rem] text-center"
        title="Current zoom level (0 to reset)"
      >
        {Math.round(scale * 100)}%
      </span>
      <button
        onClick={() => handleScaleChange(scale + 0.1)}
        disabled={!canIncreaseScale}
        className={`p-1 rounded transition-all duration-200 ${!canIncreaseScale
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:bg-white/10'
          }`}
        title={!canIncreaseScale
          ? "Cannot increase scale due to diagram overflow"
          : "Zoom in (+ or =)"
        }
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </div>

    {/* Theme Selector - Hidden on mobile */}
    <div className="hidden sm:flex gap-1">
      {Object.entries(themes).map(([key, theme]) => (
        <button
          key={key}
          onClick={() => setCurrentTheme(key)}
          className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${currentTheme === key ? 'border-white' : 'border-transparent'
            }`}
          style={{ backgroundColor: theme.color }}
          title={`Switch to ${theme.name} theme`}
        />
      ))}
    </div>

    {/* Slideshow Navigation */}
    {isSlideshowMode && (
      <div className="flex items-center gap-1 ml-1">
        <button
          onClick={onPrevSlide}
          disabled={currentSlide === 0}
          className={`p-1 rounded transition-all duration-200 ${currentSlide === 0
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-white/10'
            }`}
          title="Previous slide (Left Arrow or J)"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span className="text-xs sm:text-sm min-w-[3rem] text-center">
          {currentSlide + 1}/{totalSlides}
        </span>
        <button
          onClick={onNextSlide}
          disabled={currentSlide === totalSlides - 1}
          className={`p-1 rounded transition-all duration-200 ${currentSlide === totalSlides - 1
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-white/10'
            }`}
          title="Next slide (Right Arrow or L)"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    )}
  </div>
);