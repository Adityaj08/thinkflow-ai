import { useState, useRef, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'sonner';
import { useDiagramGen } from './useDiagramGen';
import { useDiagramInteraction } from './useDiagramInteraction';
import { useDiagramExport } from './useDiagramExport';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';

export const useDiagramLogic = () => {
    const { user } = useAuth0();
    // Core State
    const [code, setCode] = useState(localStorage.getItem("diagram") || `graph TD\nA[Start] --> B{Decision}`);
    const [prompt, setPrompt] = useState("");
    const [isSlideshowMode, setIsSlideshowMode] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [diagramParts, setDiagramParts] = useState([]);

    // UI State
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [currentTheme, setCurrentTheme] = useState('default');
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const [orientation, setOrientation] = useState('TD');
    const [scale, setScale] = useState(1);
    const [logoDataUrl, setLogoDataUrl] = useState('');
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [isEditInputOpen, setIsEditInputOpen] = useState(false);
    const [editInputValue, setEditInputValue] = useState("");
    const [history, setHistory] = useState([localStorage.getItem("diagram") || `graph TD\nA[Start] --> B{Decision}`]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [selectedModel, setSelectedModel] = useState("gemini-2.5-flash-lite");
    const [selectedDiagramType, setSelectedDiagramType] = useState("flowchart");

    const isProcessingRef = useRef(false);

    // Check if user is admin or pro
    const isAdmin = user && user['https://thinkflow.ai/roles']?.includes('admin');
    const isPro = user && user['https://thinkflow.ai/roles']?.includes('pro');

    const showToast = (message, type = 'success', duration = 3000) => {
        const options = {
            duration: duration === 0 ? Infinity : duration,
        };

        switch (type) {
            case 'success':
                toast.success(message, options);
                break;
            case 'error':
                toast.error(message, options);
                break;
            case 'loading':
                toast.loading(message, options);
                break;
            default:
                toast(message, options);
        }
    };

    // --- Interaction Hook ---
    const {
        diagramRef,
        fullscreenRef,
        isFullscreen,
        setIsFullscreen,
        renderDiagram,
        splitDiagramIntoParts,
        // toggleSlideshowMode: toggleSlideshowInteraction, // We'll wrap this
        handleOrientationChange,
        handleScaleChange,
        toggleFullscreen,
        resetView
    } = useDiagramInteraction({
        code,
        diagramParts,
        isSlideshowMode,
        currentSlide,
        setCurrentSlide,
        setDiagramParts,
        scale,
        setScale,
        orientation,
        setOrientation,
        currentTheme,
        setCode
    });

    // --- Generation Hook ---
    const {
        isLoading,
        setIsLoading,
        isAnalyzing,
        setIsAnalyzing,
        explanation,
        setExplanation,
        generateDiagram: generateDiagramGen,
        updateDiagram: updateDiagramGen,
        analyzeDiagram: analyzeDiagramGen,
        expandDiagram: expandDiagramGen
    } = useDiagramGen({
        code,
        setCode,
        setHistory,
        setHistoryIndex,
        history,
        orientation,
        resetView,
        showToast,
        setIsEditInputOpen,
        setEditInputValue,
        historyIndex,
        selectedModel,
        selectedDiagramType
    });

    // --- Export Hook ---
    const { downloadDiagram, copyToClipboard } = useDiagramExport({
        diagramRef,
        isAdmin,
        isPro
    });

    // --- Wrappers & Orchestration ---

    const generateDiagram = () => generateDiagramGen(prompt, isProcessingRef);
    const updateDiagram = (updatePrompt) => updateDiagramGen(updatePrompt, isProcessingRef);
    const analyzeDiagram = () => analyzeDiagramGen(isProcessingRef);
    const expandDiagram = () => expandDiagramGen(isProcessingRef);

    const toggleSlideshowMode = () => {
        const newMode = !isSlideshowMode;
        if (newMode) {
            const parts = splitDiagramIntoParts(code);
            setDiagramParts(parts);
            setCurrentSlide(0);
        }
        setIsSlideshowMode(newMode);
    };

    // Preload logo
    useEffect(() => {
        const loadLogo = async () => {
            try {
                const img = new Image();
                img.crossOrigin = 'Anonymous';
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    const dataUrl = canvas.toDataURL('image/png');
                    setLogoDataUrl(dataUrl);
                };
                img.src = '/ThinkFlowLogo.png';
            } catch (error) {
                console.error('Error loading logo:', error);
            }
        };
        loadLogo();
    }, []);

    // Other handlers
    const toggleDarkMode = () => setIsDarkMode(prev => !prev);
    const canIncreaseScale = () => scale < 5;
    const canDecreaseScale = () => scale > 0.5;

    const undo = async () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            const newCode = history[newIndex];
            setCode(newCode);
            await resetView(newCode);
        }
    };

    const redo = async () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            const newCode = history[newIndex];
            setCode(newCode);
            await resetView(newCode);
        }
    };

    const clearStorage = async () => {
        localStorage.removeItem("diagram");
        const defaultCode = `graph TD\nA[Start] --> B{Decision}`;
        setCode(defaultCode);
        setHistory([defaultCode]);
        setHistoryIndex(0);
        await resetView(defaultCode);
        showToast("Local storage cleared", "success");
    };

    const toggleEditInput = () => {
        setIsEditInputOpen(prev => !prev);
        if (!isEditInputOpen) {
            setEditInputValue("");
        }
    };

    const saveDiagram = () => {
        localStorage.setItem("diagram", code);
        alert("Diagram saved!");
    };

    // Render diagram loops (handled in Interaction hook, but need to ensure effects run)
    // The useDiagramInteraction hook includes the useEffects for rendering.

    // Note: one effect "Render diagram when mode, slide, or code changes" in original logic.
    // It's in the interaction hook.

    // --- Keyboard Shortcuts ---
    useKeyboardShortcuts({
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
        prompt
    });

    return {
        code, setCode,
        prompt, setPrompt,
        explanation, setExplanation,
        isLoading, setIsLoading,
        isAnalyzing, setIsAnalyzing,
        isFullscreen, setIsFullscreen,
        isSlideshowMode, setIsSlideshowMode,
        currentSlide, setCurrentSlide,
        diagramParts, setDiagramParts,
        diagramRef,
        fullscreenRef,
        isDarkMode, setIsDarkMode,
        currentTheme, setCurrentTheme,
        isOptionsOpen, setIsOptionsOpen,
        orientation, setOrientation,
        scale, setScale,
        logoDataUrl, setLogoDataUrl,
        isExportOpen, setIsExportOpen,
        toggleSlideshowMode,
        renderDiagram,
        saveDiagram,
        generateDiagram,
        analyzeDiagram,
        expandDiagram,
        downloadDiagram,
        copyToClipboard,
        toggleFullscreen,
        toggleDarkMode,
        handleOrientationChange,
        handleScaleChange,
        canIncreaseScale,
        canDecreaseScale,
        showToast,
        isEditInputOpen,
        setIsEditInputOpen,
        editInputValue,
        setEditInputValue,
        updateDiagram,
        toggleEditInput,
        undo,
        redo,
        historyIndex,
        history,
        clearStorage,
        selectedModel,
        setSelectedModel,
        selectedDiagramType,
        setSelectedDiagramType
    };
};
