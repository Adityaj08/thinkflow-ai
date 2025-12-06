import { useEffect } from 'react';

export const useKeyboardShortcuts = ({
    isSlideshowMode,
    diagramParts,
    setCurrentSlide,
    toggleSlideshowMode,
    toggleFullscreen,
    toggleDarkMode,
    saveDiagram,
    orientation,
    handleOrientationChange,
    toggleEditInput,
    undo,
    redo,
    handleScaleChange,
    scale,
    resetView,
    code,
    isEditInputOpen,
    isOptionsOpen,
    isExportOpen,
    prompt  // To check if focused ?? actually simpler to check document.activeElement
}) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ignore shortcuts if user is typing in an input or textarea
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
                // Allow Ctrl+Enter or Esc in inputs if needed, but for now generally ignore
                // Maybe allow Esc to close things?
                if (e.key === 'Escape') {
                    // Let specific components handle their own escape (like closing modals)
                    // But we can have global escape behavior here if needed.
                    // For now, let's allow Esc to trigger globally if it's for fullscreen
                    if (document.fullscreenElement) {
                        // Default browser behavior handles this usually, but toggleFullscreen logic might need sync
                    }
                }
                // Special case: Ctrl+E to toggle edit input? Maybe not if inside an input.
                // If inside the prompt input, we might want to allow some shortcuts?
                // Safest is to return early for most chars.
                return;
            }

            // Slideshow Navigation
            if (isSlideshowMode) {
                if (e.key === 'ArrowLeft' || e.key === 'j') {
                    setCurrentSlide(prev => Math.max(0, prev - 1));
                } else if (e.key === 'ArrowRight' || e.key === 'l') {
                    setCurrentSlide(prev => Math.min(diagramParts.length - 1, prev + 1));
                }
            }

            // Toggle Slideshow
            if (e.key === ' ') {
                e.preventDefault(); // Prevent scrolling
                toggleSlideshowMode();
            }

            // Fullscreen
            if (e.key.toLowerCase() === 'f') {
                toggleFullscreen();
            }
            // Esc is usually handled by browser for fullscreen exit, but we can listen for local state sync or if custom UI
            if (e.key === 'Escape') {
                if (document.fullscreenElement) {
                    // toggleFullscreen(); // Browser handles the actual exit, listener in hook syncs state
                }
            }

            // Zoom
            if (e.key === '+' || e.key === '=') {
                e.preventDefault(); // Prevent browser zoom sometimes
                handleScaleChange(scale + 0.1);
            } else if (e.key === '-' || e.key === '_') {
                e.preventDefault();
                handleScaleChange(scale - 0.1);
            } else if (e.key === '0') {
                resetView(code);
            }

            // Dark Mode
            if (e.key.toLowerCase() === 'd') {
                toggleDarkMode();
            }

            // Save
            if (e.key.toLowerCase() === 's') {
                saveDiagram();
            }

            // Orientation
            if (e.key.toLowerCase() === 't') {
                const newOrientation = orientation === 'TD' ? 'LR' : 'TD';
                handleOrientationChange(newOrientation);
            }

            // Toggle Edit Input
            if (e.ctrlKey && e.key.toLowerCase() === 'e') {
                e.preventDefault();
                toggleEditInput();
            }

            // Undo / Redo
            if (e.ctrlKey && e.key.toLowerCase() === 'z') {
                e.preventDefault();
                undo();
            }
            if (e.ctrlKey && e.key.toLowerCase() === 'y') {
                e.preventDefault();
                redo();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [
        isSlideshowMode,
        diagramParts,
        setCurrentSlide,
        toggleSlideshowMode,
        toggleFullscreen,
        toggleDarkMode,
        saveDiagram,
        orientation,
        handleOrientationChange,
        toggleEditInput,
        undo,
        redo,
        handleScaleChange,
        scale,
        resetView,
        code
    ]);
};
