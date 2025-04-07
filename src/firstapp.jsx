import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { Skeleton } from "./components/Skeleton";

export default function App() {
  const [code, setCode] = useState(localStorage.getItem("diagram") || `graph TD\nA[Start] --> B{Decision}`);
  const [prompt, setPrompt] = useState("");
  const [explanation, setExplanation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const diagramRef = useRef(null);
  const fullscreenRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentTheme, setCurrentTheme] = useState('default');
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [orientation, setOrientation] = useState('TD');
  const [scale, setScale] = useState(1);

  const themes = {
    default: {
      color: '#3B82F6',
      name: 'Default Blue',
      background: '#EBF5FF',
      border: '#3B82F6',
      text: '#1E40AF'
    },
    emerald: {
      color: '#10B981',
      name: 'Emerald',
      background: '#ECFDF5',
      border: '#10B981',
      text: '#065F46'
    },
    violet: {
      color: '#8B5CF6',
      name: 'Violet',
      background: '#F5F3FF',
      border: '#8B5CF6',
      text: '#5B21B6'
    },
    rose: {
      color: '#F43F5E',
      name: 'Rose',
      background: '#FFF1F2',
      border: '#F43F5E',
      text: '#BE123C'
    },
    amber: {
      color: '#F59E0B',
      name: 'Amber',
      background: '#FFFBEB',
      border: '#F59E0B',
      text: '#B45309'
    }
  };

  // Separate function to render diagram
  const renderDiagram = () => {
    if (diagramRef.current) {
      diagramRef.current.innerHTML = `<div class="mermaid">${code}</div>`;
      mermaid.contentLoaded();
    }
  };

  // Initialize mermaid on mount and when code changes
  useEffect(() => {
    const theme = themes[currentTheme];
    
    mermaid.initialize({ 
      startOnLoad: true,
      securityLevel: 'loose',
      htmlLabels: true,
      theme: 'base',
      themeVariables: {
        'primaryColor': theme.background,
        'primaryBorderColor': theme.border,
        'primaryTextColor': theme.text,
        'lineColor': theme.border,
        'secondaryColor': theme.background,
        'tertiaryColor': theme.background,
        'mainBkg': theme.background,
        'nodeBorder': theme.border,
        'clusterBkg': theme.background,
        'titleColor': theme.text,
        'edgeLabelBackground': theme.background,
        'textColor': theme.text,
        'fontSize': '16px',
        'labelBackground': theme.background,
        'labelBorder': theme.border,
        'labelTextColor': theme.text,
        'background-color': '#ffffff',
        'nodeTextAlignment': 'center',
        'nodeTextVerticalAlignment': 'middle',
        'nodeTextPadding': '8px',
        'nodeTextLineHeight': '1.2',
      },
      flowchart: {
        htmlLabels: true,
        curve: 'basis',
        useMaxWidth: true,
        draggable: true,
        orientation: orientation,
        defaultRenderer: 'elk',
        rankSpacing: 50,
        nodeSpacing: 50,
        ranker: 'network-simplex'
      }
    });

    // Update the diagram code with the new orientation
    const updatedCode = code.replace(/graph (TD|LR|BT|RL)/, `graph ${orientation}`);
    setCode(updatedCode);

    // Enable dragging functionality after rendering
    const renderDiagramWithDragging = async () => {
      if (diagramRef.current) {
        diagramRef.current.innerHTML = `<div class="mermaid">${code}</div>`;
        await mermaid.contentLoaded();

        // Get the SVG element
        const svg = diagramRef.current.querySelector('svg');
        if (svg) {
          // Set basic SVG attributes
          svg.setAttribute('width', '100%');
          svg.setAttribute('height', '100%');
          svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

          // Center text in nodes
          const nodes = svg.querySelectorAll('.node');
          nodes.forEach(node => {
            const text = node.querySelector('text');
            if (text) {
              const nodeRect = node.getBBox();
              
              // Calculate center position in SVG coordinates
              const centerX = nodeRect.x + nodeRect.width / 2;
              const centerY = nodeRect.y + nodeRect.height / 2;
              
              // Position text at center
              text.setAttribute('x', centerX);
              text.setAttribute('y', centerY);
              text.setAttribute('text-anchor', 'middle');
              text.setAttribute('dominant-baseline', 'middle');
              text.setAttribute('dy', '0');
            }
          });

          // Center edge labels
          const edgeLabels = svg.querySelectorAll('.edgeLabel');
          edgeLabels.forEach(label => {
            const text = label.querySelector('text');
            if (text) {
              const labelRect = label.getBBox();
              
              // Calculate center position in SVG coordinates
              const centerX = labelRect.x + labelRect.width / 2;
              const centerY = labelRect.y + labelRect.height / 2;
              
              // Position text at center
              text.setAttribute('x', centerX);
              text.setAttribute('y', centerY);
              text.setAttribute('text-anchor', 'middle');
              text.setAttribute('dominant-baseline', 'middle');
              text.setAttribute('dy', '0');
            }
          });

          // Center all other text elements
          const allTexts = svg.querySelectorAll('text');
          allTexts.forEach(text => {
            if (!text.closest('.node') && !text.closest('.edgeLabel')) {
              const textRect = text.getBBox();
              
              // Calculate center position in SVG coordinates
              const centerX = textRect.x + textRect.width / 2;
              const centerY = textRect.y + textRect.height / 2;
              
              // Position text at center
              text.setAttribute('x', centerX);
              text.setAttribute('y', centerY);
              text.setAttribute('text-anchor', 'middle');
              text.setAttribute('dominant-baseline', 'middle');
              text.setAttribute('dy', '0');
            }
          });
        }

        // Add dragging functionality to nodes
        const nodes = diagramRef.current.querySelectorAll('.node');
        nodes.forEach(node => {
          let pos = { x: 0, y: 0 };
          let dragging = false;

          node.style.cursor = 'move';
          node.style.position = 'relative';

          const onMouseDown = (e) => {
            dragging = true;
            pos.x = e.clientX - node.offsetLeft;
            pos.y = e.clientY - node.offsetTop;
            
            const onMouseMove = (e) => {
              if (dragging) {
                node.style.left = (e.clientX - pos.x) + 'px';
                node.style.top = (e.clientY - pos.y) + 'px';
              }
            };

            const onMouseUp = () => {
              dragging = false;
              document.removeEventListener('mousemove', onMouseMove);
              document.removeEventListener('mouseup', onMouseUp);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
          };

          node.addEventListener('mousedown', onMouseDown);
        });
      }
    };

    renderDiagramWithDragging();
  }, [code, currentTheme, orientation]);

  const saveDiagram = () => {
    localStorage.setItem("diagram", code);
    alert("Diagram saved!");
  };

  const generateDiagram = async () => {
    try {
      setIsLoading(true);
      const diagramRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY1}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ 
              parts: [{ 
                text: `Generate only Mermaid.js code without any explanation or markdown formatting for this diagram: ${prompt}. 
                       Do not include \`\`\`mermaid or any other markdown. Only output the actual mermaid code.
                       The diagram should use ${orientation} orientation.` 
              }] 
            }],
          }),
        }
      );
      const diagramData = await diagramRes.json();
      const generated = diagramData?.candidates?.[0]?.content?.parts?.[0]?.text || "graph TD\nA --> B";
      // Ensure the generated code has the correct orientation
      const cleanCode = generated.replace(/```(?:mermaid)?\n?|\n?```/g, '').trim();
      const codeWithOrientation = cleanCode.replace(/graph (TD|LR|BT|RL)/, `graph ${orientation}`);
      setCode(codeWithOrientation);
      
      // Force a re-render of the diagram with the current scale
      if (diagramRef.current) {
        diagramRef.current.innerHTML = `<div class="mermaid">${codeWithOrientation}</div>`;
        await mermaid.contentLoaded();
        
        const svg = diagramRef.current.querySelector('svg');
        if (svg) {
          svg.style.transform = `scale(1)`;
          svg.style.transformOrigin = 'center center';
          svg.style.transition = 'transform 0.2s ease-in-out';
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeDiagram = async () => {
    try {
      setIsAnalyzing(true);
      const explainRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY1}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ 
              parts: [{ 
                text: `Analyze this Mermaid diagram: ${code}
                       Format the response starting directly with:

                       1. Overview:
                       A brief summary of the diagram's purpose and what it represents.

                       2. Key Components:
                       List and describe the main elements and nodes in the diagram.

                       3. Flow Description:
                       Explain the relationships and flow between components, detailing how the process unfolds.

                       4. Purpose:
                       Describe the main purpose and use case of this diagram, and how it can be applied in real-world scenarios.` 
              }] 
            }],
        }),
      }
    );
      const explainData = await explainRes.json();
      setExplanation(explainData?.candidates?.[0]?.content?.parts?.[0]?.text || "");
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadDiagram = async (format) => {
    const svg = diagramRef.current.querySelector('svg');
    if (!svg) return;

    if (format === 'svg') {
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
      const url = URL.createObjectURL(svgBlob);
      downloadURL(url, 'diagram.svg');
    } else {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const url = canvas.toDataURL(`image/${format}`);
        downloadURL(url, `diagram.${format}`);
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  const downloadURL = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const ExplanationSkeleton = () => (
    <div className="space-y-4">
      {/* Section 1 */}
      <div>
        <Skeleton className="w-32 h-6 mb-3" />
        <Skeleton className="w-full h-4 mb-2" />
        <Skeleton className="w-3/4 h-4" />
      </div>
      {/* Section 2 */}
      <div>
        <Skeleton className="w-40 h-6 mb-3" />
        <div className="space-y-2">
          <Skeleton className="w-5/6 h-4" />
          <Skeleton className="w-3/4 h-4" />
          <Skeleton className="w-4/5 h-4" />
        </div>
      </div>
      {/* Section 3 */}
      <div>
        <Skeleton className="w-36 h-6 mb-3" />
        <Skeleton className="w-full h-4 mb-2" />
        <Skeleton className="w-5/6 h-4" />
      </div>
      {/* Section 4 */}
      <div>
        <Skeleton className="w-28 h-6 mb-3" />
        <Skeleton className="w-3/4 h-4" />
      </div>
    </div>
  );

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      fullscreenRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (isFullscreen) {
      const handleResize = () => {
        mermaid.contentLoaded();
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [isFullscreen]);

  const OptionsMenu = () => (
    <div className={`absolute top-12 right-0 mt-2 w-48 rounded-lg shadow-lg overflow-hidden backdrop-blur-lg
      ${isDarkMode ? 'bg-black/30 border border-white/10' : 'bg-white/80 border border-gray-200'}
      transition-all duration-200 z-20`}>
      <div className="p-2 space-y-2">
        <div className="px-3 py-2 text-sm font-medium text-gray-400">Theme</div>
        {Object.entries(themes).map(([key, theme]) => (
          <button
            key={key}
            onClick={() => setCurrentTheme(key)}
            className={`w-full px-3 py-2 text-left rounded-md flex items-center space-x-2 
              ${currentTheme === key ? 'bg-white/10' : 'hover:bg-white/5'}
              transition-colors duration-200`}
          >
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.color }}></span>
            <span className={isDarkMode ? 'text-white' : 'text-gray-700'}>{theme.name}</span>
          </button>
        ))}
        <div className="border-t border-white/10 my-2"></div>
        <div className="px-3 py-2 text-sm font-medium text-gray-400">Export</div>
        {['png', 'jpg', 'svg'].map(format => (
          <button
            key={format}
            onClick={() => {
              downloadDiagram(format);
              setIsOptionsOpen(false);
            }}
            className="w-full px-3 py-2 text-left hover:bg-white/5 rounded-md transition-colors duration-200"
          >
            <span className={isDarkMode ? 'text-white' : 'text-gray-700'}>
              Export as {format.toUpperCase()}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  // Toggle dark mode function
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleOrientationChange = (newOrientation) => {
    setOrientation(newOrientation);
    const updatedCode = code.replace(/graph (TD|LR|BT|RL)/, `graph ${newOrientation}`);
    setCode(updatedCode);
  };

  const handleScaleChange = (newScale) => {
    setScale(newScale);
    if (diagramRef.current) {
      const svg = diagramRef.current.querySelector('svg');
      if (svg) {
        svg.style.transform = `scale(${newScale})`;
        svg.style.transformOrigin = 'center center';
        svg.style.transition = 'transform 0.2s ease-in-out';
      }
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-200 ${
      isDarkMode ? 'bg-black text-white' : 'bg-gray-100 text-gray-900'
    }`}>
      <div className="max-w-5xl mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold">ThinkFlow</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-white/10 hover:bg-white/20' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
              title="Toggle dark mode"
            >
              {isDarkMode ? <SunIcon /> : <MoonIcon />}
            </button>
            <div className="relative">
              <button
                onClick={() => setIsOptionsOpen(!isOptionsOpen)}
                className={`p-2 rounded-full transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-white/10 hover:bg-white/20' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
                title="Options"
              >
                <OptionsIcon />
              </button>
              {isOptionsOpen && <OptionsMenu />}
            </div>
          </div>
        </div>

        <div className="mb-4">
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
            className={`w-full p-2 rounded-lg transition-all duration-200 ${
              isDarkMode 
                ? 'bg-white/10 border border-white/10 text-white placeholder-white/50' 
                : 'bg-white border border-gray-200 text-gray-900 placeholder-gray-400'
            } ${isLoading && 'opacity-50 cursor-not-allowed'}`}
            placeholder="Describe your diagram..."
      />
      <button
            onClick={generateDiagram}
            disabled={!prompt.trim() || isLoading}
            className={`mt-2 px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2
              ${isDarkMode
                ? 'bg-white text-black hover:bg-white/90'
                : 'bg-black text-white hover:bg-black/90'
              }
              ${(!prompt.trim() || isLoading) && 'opacity-50 cursor-not-allowed'}
              ${prompt.trim() && !isLoading && 'hover:scale-105'}
            `}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              'Generate Diagram'
            )}
          </button>
        </div>

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
          <div 
            className={`absolute top-2 right-2 flex gap-2 z-10 p-2 rounded-lg 
              ${isDarkMode ? 'bg-white/10 backdrop-blur-md' : 'bg-black/10 backdrop-blur-md'}`}
          >
            <button
              onClick={toggleFullscreen}
              className="p-1 rounded hover:bg-white/10 transition-all duration-200"
            >
              {isFullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
            </button>

            {/* Orientation Controls */}
            <div className="flex gap-1">
              <button
                onClick={() => handleOrientationChange('TD')}
                className={`p-1 rounded transition-all duration-200 ${
                  orientation === 'TD' ? 'bg-white/20' : 'hover:bg-white/10'
                }`}
                title="Top to Bottom"
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
                title="Left to Right"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12h18M10 5l7 7-7 7M14 5l-7 7 7 7" />
                </svg>
              </button>
            </div>

            {/* Scale Controls */}
            <div className="flex items-center gap-2 ml-2">
              <button
                onClick={() => handleScaleChange(Math.max(0.5, scale - 0.1))}
                className="p-1 rounded hover:bg-white/10 transition-all duration-200"
                title="Zoom Out"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14" />
                </svg>
              </button>
              <span className="text-sm">{Math.round(scale * 100)}%</span>
              <button
                onClick={() => handleScaleChange(Math.min(2, scale + 0.1))}
                className="p-1 rounded hover:bg-white/10 transition-all duration-200"
                title="Zoom In"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            </div>

            {/* Theme Selector */}
            {Object.entries(themes).map(([key, theme]) => (
              <button
                key={key}
                onClick={() => setCurrentTheme(key)}
                className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                  currentTheme === key ? 'border-white' : 'border-transparent'
                }`}
                style={{ backgroundColor: theme.color }}
                title={theme.name}
              />
            ))}
          </div>
          
          <div 
            ref={diagramRef} 
            className={`rounded-lg transition-all duration-200 flex items-center justify-center ${
              isFullscreen 
                ? 'fixed inset-0 w-screen h-screen p-8' 
                : 'min-h-[600px] w-full'
            } ${
              isDarkMode 
                ? 'bg-white/10 backdrop-blur-lg border border-white/10' 
                : 'bg-white/80 backdrop-blur-lg border border-gray-200'
            }`}
          >
            <div 
              className="bg-white rounded-lg w-full h-full flex items-center justify-center p-8"
              style={{
                width: '100%',
                height: '100%'
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
                  {code}
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 z-10">
            <button
              onClick={analyzeDiagram}
              disabled={isAnalyzing || isLoading}
              className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2
                ${isDarkMode
                  ? 'bg-white text-black hover:bg-white/90'
                  : 'bg-black text-white hover:bg-black/90'
                }
                ${(isAnalyzing || isLoading) && 'opacity-50 cursor-not-allowed'}
                ${!isAnalyzing && !isLoading && 'hover:scale-105'}
              `}
            >
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Analyze Diagram
                </>
              )}
            </button>
          </div>
        </div>

        {/* Explanation Section */}
        {(explanation || isAnalyzing) && (
          <div className={`mt-6 rounded-lg transition-all duration-200 ${
            isDarkMode 
              ? 'bg-white/10 backdrop-blur-lg border border-white/10' 
              : 'bg-white/80 backdrop-blur-lg border border-gray-200'
          }`}>
            <div className="p-6">
              <h2 className={`text-2xl font-bold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Diagram Analysis
              </h2>
              {isAnalyzing ? (
                <div className="flex flex-col gap-4 animate-pulse">
                  <div className="h-4 bg-gray-300/20 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300/20 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300/20 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-300/20 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-300/20 rounded w-3/4"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {explanation.split('\n').map((line, index) => {
                    // Section headers (e.g., "1. Overview:")
                    if (line.match(/^\d+\./)) {
                      return (
                        <h3 key={index} className={`font-bold text-xl mt-6 ${
                          isDarkMode ? 'text-white/90' : 'text-gray-800'
                        }`}>
                          {line}
                        </h3>
                      );
                    }
                    // Bullet points with bolded components
                    else if (line.trim().startsWith('*')) {
                      return (
                        <div key={index} className="ml-8">
                          <p className={`flex items-start ${
                            isDarkMode ? 'text-white/80' : 'text-gray-700'
                          }`}>
                            <span className="mr-2">•</span>
                            <span className="text-lg">
                              {line.replace('*', '').trim().split(':').map((part, i) => {
                                if (i === 0 && line.includes(':')) {
                                  return (
                                    <strong key={i} className={
                                      isDarkMode ? 'text-white' : 'text-gray-900'
                                    }>
                                      {part}:
                                    </strong>
                                  );
                                }
                                return part;
                              })}
                            </span>
                          </p>
                        </div>
                      );
                    }
                    // Regular paragraphs
                    else if (line.trim()) {
                      return (
                        <p key={index} className={`text-lg ${
                          isDarkMode ? 'text-white/80' : 'text-gray-700'
                        }`}>
                          {line}
                        </p>
                      );
                    }
                    return null;
                  })}
                </div>
              )}
            </div>
          </div>
        )}

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
          className={`w-full p-2 rounded-lg font-mono mt-6 transition-all duration-200 ${
            isDarkMode 
              ? 'bg-white/10 border border-white/10 text-white' 
              : 'bg-white border border-gray-200 text-gray-900'
          }`}
          rows="5"
        />
        <button 
          onClick={saveDiagram}
          className={`mt-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            isDarkMode
              ? 'bg-white/10 hover:bg-white/20'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Save
        </button>
      </div>
    </div>
  );
}

// Simple icon components
const FullscreenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
  </svg>
);

const ExitFullscreenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
  </svg>
);

// Icon components
const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

// Additional icon component
const OptionsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);
