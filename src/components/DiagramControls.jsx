import { FullscreenIcon, ExitFullscreenIcon } from './icons';

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
  canDecreaseScale
}) => (
  <div className={`absolute top-2 right-0 sm:right-2 flex flex-wrap items-center gap-2 z-10 p-2 mx-1 sm:mx-0 rounded-lg 
    ${isDarkMode ? 'bg-white/10 backdrop-blur-md' : 'bg-black/10 backdrop-blur-md'}`}
  >
    {/* Fullscreen and Orientation Controls */}
    <div className="flex gap-1">
      <button
        onClick={toggleFullscreen}
        className="p-1 rounded hover:bg-white/10 transition-all duration-200"
        title={isFullscreen ? "Exit fullscreen (F)" : "Enter fullscreen (F)"}
      >
        {isFullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
      </button>

      <button
        onClick={() => handleOrientationChange('TD')}
        className={`p-1 rounded transition-all duration-200 ${
          orientation === 'TD' ? 'bg-white/20' : 'hover:bg-white/10'
        }`}
        title="Top to Bottom (T)"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3v18M5 10l7-7 7 7M5 14l7 7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => handleOrientationChange('LR')}
        className={`p-1 rounded transition-all duration-200 ${
          orientation === 'LR' ? 'bg-white/20' : 'hover:bg-white/10'
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
        onClick={() => handleScaleChange(Math.max(0.5, scale - 0.1))}
        disabled={!canDecreaseScale}
        className={`p-1 rounded transition-all duration-200 ${
          !canDecreaseScale 
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
        onClick={() => handleScaleChange(Math.min(2, scale + 0.1))}
        disabled={!canIncreaseScale}
        className={`p-1 rounded transition-all duration-200 ${
          !canIncreaseScale 
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
          className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
            currentTheme === key ? 'border-white' : 'border-transparent'
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
          className={`p-1 rounded transition-all duration-200 ${
            currentSlide === 0 
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
          className={`p-1 rounded transition-all duration-200 ${
            currentSlide === totalSlides - 1 
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