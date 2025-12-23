import { Toaster } from "sonner";
import { useDiagramLogic } from "./hooks/useDiagramLogic";
import { Header } from "./components/Header";
import { PromptSection } from "./components/PromptSection";
import { DiagramSection } from "./components/DiagramSection";
import { CodeEditor } from "./components/CodeEditor";
import { ExplanationSection } from "./components/ExplanationSection";
import { HelpMenu } from "./components/HelpMenu";
import ScrollToTop from "./components/ScrollToTop";

import { themes } from "./constants/themes";

// Add Montserrat font import
const fontStyle = document.createElement('style');
fontStyle.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
  * {
    font-family: 'Montserrat', sans-serif;
  }
`;
document.head.appendChild(fontStyle);

export default function App() {
  const {
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
    navigateHistory,
    historyIndex,
    history,
    clearStorage,
    selectedModel,
    setSelectedModel,
    selectedDiagramType,
    setSelectedDiagramType
  } = useDiagramLogic();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      <Toaster
        position="bottom-right"
        theme={isDarkMode ? "dark" : "light"}
        richColors
        toastOptions={{
          style: {
            background: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
            border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
            boxShadow: isDarkMode
              ? '0 8px 32px rgba(0, 0, 0, 0.4)'
              : '0 8px 32px rgba(0, 0, 0, 0.1)',
            fontFamily: "'Montserrat', sans-serif",
          },
          classNames: {
            toast: 'glassmorphism-toast',
            title: 'font-medium',
            description: 'text-sm opacity-80',
          },
        }}
      />
      <ScrollToTop />

      <div className="max-w-5xl mx-auto p-2 sm:p-4">
        <Header
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          isSlideshowMode={isSlideshowMode}
          toggleSlideshowMode={toggleSlideshowMode}
          isExportOpen={isExportOpen}
          setIsExportOpen={setIsExportOpen}
          downloadDiagram={downloadDiagram}
          showToast={showToast}
          isOptionsOpen={isOptionsOpen}
          setIsOptionsOpen={setIsOptionsOpen}
          currentTheme={currentTheme}
          setCurrentTheme={setCurrentTheme}
          diagramRef={diagramRef}
          clearStorage={clearStorage}
        />

        <PromptSection
          prompt={prompt}
          setPrompt={setPrompt}
          isLoading={isLoading}
          isDarkMode={isDarkMode}
          generateDiagram={generateDiagram}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          selectedDiagramType={selectedDiagramType}
          setSelectedDiagramType={setSelectedDiagramType}
        />

        <DiagramSection
          fullscreenRef={fullscreenRef}
          isLoading={isLoading}
          diagramRef={diagramRef}
          isFullscreen={isFullscreen}
          toggleFullscreen={toggleFullscreen}
          isDarkMode={isDarkMode}
          isSlideshowMode={isSlideshowMode}
          diagramParts={diagramParts}
          currentSlide={currentSlide}
          code={code}
          analyzeDiagram={analyzeDiagram}
          expandDiagram={expandDiagram}
          isAnalyzing={isAnalyzing}
          orientation={orientation}
          handleOrientationChange={handleOrientationChange}
          scale={scale}
          handleScaleChange={handleScaleChange}
          currentTheme={currentTheme}
          setCurrentTheme={setCurrentTheme}
          themes={themes}
          setCurrentSlide={setCurrentSlide}
          canIncreaseScale={canIncreaseScale()}
          canDecreaseScale={canDecreaseScale()}
          toggleEditInput={toggleEditInput}
          undo={undo}
          redo={redo}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          isEditInputOpen={isEditInputOpen}
          setIsEditInputOpen={setIsEditInputOpen}
          editInputValue={editInputValue}
          setEditInputValue={setEditInputValue}
          updateDiagram={updateDiagram}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          copyToClipboard={copyToClipboard}
          showToast={showToast}
          history={history}
          historyIndex={historyIndex}
          navigateHistory={navigateHistory}
        />

        <ExplanationSection
          isDarkMode={isDarkMode}
          explanation={explanation}
          isAnalyzing={isAnalyzing}
        />

        <CodeEditor
          code={code}
          setCode={setCode}
          isDarkMode={isDarkMode}
          saveDiagram={saveDiagram}
          showToast={showToast}
        />
      </div>

      <HelpMenu isDarkMode={isDarkMode} />
    </div>
  );
}
