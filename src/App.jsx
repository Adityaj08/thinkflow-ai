import { useDiagramLogic } from "./hooks/useDiagramLogic";
import { Header } from "./components/Header";
import { PromptSection } from "./components/PromptSection";
import { DiagramSection } from "./components/DiagramSection";
import { CodeEditor } from "./components/CodeEditor";
import { ExplanationSection } from "./components/ExplanationSection";
import { HelpMenu } from "./components/HelpMenu";
import ScrollToTop from "./components/ScrollToTop";
import { Toast } from "./components/Toast";
import { EditInputBox } from "./components/EditInputBox";
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
    useApiKey1, setUseApiKey1,
    showApiKeyMenu, setShowApiKeyMenu,
    logoDataUrl, setLogoDataUrl,
    isExportOpen, setIsExportOpen,
    toast, setToast,
    copyToast, setCopyToast,
    toggleSlideshowMode,
    renderDiagram,
    saveDiagram,
    generateDiagram,
    analyzeDiagram,
    downloadDiagram,
    toggleFullscreen,
    toggleDarkMode,
    handleOrientationChange,
    handleScaleChange,
    canIncreaseScale,
    canDecreaseScale,
    selectApiKey,
    showToast,
    handleToastClose,
    isEditInputOpen,
    setIsEditInputOpen,
    editInputValue,
    setEditInputValue,
    updateDiagram,
    toggleEditInput
  } = useDiagramLogic();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      <ScrollToTop />
      <div className="max-w-5xl mx-auto p-2 sm:p-4">
        <Header
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          showApiKeyMenu={showApiKeyMenu}
          setShowApiKeyMenu={setShowApiKeyMenu}
          useApiKey1={useApiKey1}
          selectApiKey={selectApiKey}
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
        />
      </div>

      <HelpMenu isDarkMode={isDarkMode} />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={handleToastClose}
        />
      )}
      {copyToast && (
        <Toast
          message={copyToast.message}
          type={copyToast.type}
          duration={copyToast.duration}
        />
      )}

      <EditInputBox
        isOpen={isEditInputOpen}
        onClose={() => setIsEditInputOpen(false)}
        onSubmit={updateDiagram}
        value={editInputValue}
        setValue={setEditInputValue}
        isLoading={isLoading}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
