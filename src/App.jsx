import { useEffect, useRef, useState } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import mermaid from "mermaid";
import { Skeleton } from "./components/Skeleton";
import { themes } from "./constants/themes";
import { MoonIcon, SunIcon, OptionsIcon, SlideshowIcon, FullViewIcon } from "./components/icons";
import { OptionsMenu } from "./components/OptionsMenu";
import { ExportMenu } from "./components/ExportMenu";
import { DiagramControls } from "./components/DiagramControls";
import { ExplanationSection } from "./components/ExplanationSection";
import { HelpMenu } from "./components/HelpMenu";
import Watermark from "./components/Watermark";
import ScrollToTop from "./components/ScrollToTop";
import { Toast } from "./components/Toast";

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
  const { user } = useAuth0();
  const [code, setCode] = useState(localStorage.getItem("diagram") || `graph TD\nA[Start] --> B{Decision}`);
  const [prompt, setPrompt] = useState("");
  const [explanation, setExplanation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSlideshowMode, setIsSlideshowMode] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [diagramParts, setDiagramParts] = useState([]);
  const diagramRef = useRef(null);
  const fullscreenRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentTheme, setCurrentTheme] = useState('default');
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [orientation, setOrientation] = useState('TD');
  const [scale, setScale] = useState(1);
  const [useApiKey1, setUseApiKey1] = useState(true);
  const [showApiKeyMenu, setShowApiKeyMenu] = useState(false);
  const [logoDataUrl, setLogoDataUrl] = useState('');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [copyToast, setCopyToast] = useState(null);

  // Check if user is admin
  const isAdmin = user && user['https://thinkflow.ai/roles']?.includes('admin');

  // Preload logo image for exports
  useEffect(() => {
    const loadLogo = async () => {
      try {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
          // Create canvas to convert to data URL
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

  // Function to split diagram into parts
  const splitDiagramIntoParts = (diagramCode) => {
    try {
      const parts = [];
      const lines = diagramCode.split('\n');
      let currentPart = [];
      let inSubgraph = false;
      let subgraphContent = [];
      let graphDeclaration = '';

      // Extract the graph declaration
      for (const line of lines) {
        if (line.trim().startsWith('graph')) {
          graphDeclaration = line;
          break;
        }
      }

      // If no graph declaration found, use default
      if (!graphDeclaration) {
        graphDeclaration = `graph ${orientation}`;
      }

      for (const line of lines) {
        if (line.trim().startsWith('subgraph')) {
          if (currentPart.length > 0) {
            parts.push(`${graphDeclaration}\n${currentPart.join('\n')}`);
            currentPart = [];
          }
          inSubgraph = true;
          subgraphContent = [line];
        } else if (inSubgraph && line.trim() === 'end') {
          subgraphContent.push(line);
          parts.push(`${graphDeclaration}\n${subgraphContent.join('\n')}`);
          inSubgraph = false;
        } else if (inSubgraph) {
          subgraphContent.push(line);
        } else if (line.trim() && !line.trim().startsWith('graph')) {
          currentPart.push(line);
          if (line.includes('-->') || line.includes('---')) {
            parts.push(`${graphDeclaration}\n${currentPart.join('\n')}`);
            currentPart = [];
          }
        }
      }

      if (currentPart.length > 0) {
        parts.push(`${graphDeclaration}\n${currentPart.join('\n')}`);
      }

      // If no parts were found, return the full diagram
      if (parts.length === 0) {
        parts.push(diagramCode);
      }

      return parts;
    } catch (error) {
      console.error('Error splitting diagram:', error);
      return [diagramCode];
    }
  };

  // Toggle slideshow mode
  const toggleSlideshowMode = () => {
    const newMode = !isSlideshowMode;
    if (newMode) {
      const parts = splitDiagramIntoParts(code);
      setDiagramParts(parts);
      setCurrentSlide(0);
    }
    setIsSlideshowMode(newMode);
  };

  // Separate function to render diagram
  const renderDiagram = () => {
    if (diagramRef.current) {
      try {
        let diagramToRender = code;
        if (isSlideshowMode && diagramParts.length > 0) {
          diagramToRender = diagramParts[currentSlide];
        }
        diagramRef.current.innerHTML = `<div class="mermaid">${diagramToRender}</div>`;
        mermaid.contentLoaded();

        // Apply current scale after rendering
        const svg = diagramRef.current.querySelector('svg');
        if (svg) {
          const container = diagramRef.current;
          
          // Apply scale
          svg.style.transform = `scale(${scale})`;
          svg.style.transformOrigin = 'center center';
          
          // Calculate and set container height
          const originalHeight = svg.getBoundingClientRect().height / scale;
          const newHeight = Math.max(500, originalHeight * scale);
          container.style.height = `${newHeight}px`;
        }
      } catch (error) {
        console.error('Error rendering diagram:', error);
      }
    }
  };

  // Update diagram parts when entering slideshow mode
  useEffect(() => {
    if (isSlideshowMode) {
      const parts = splitDiagramIntoParts(code);
      setDiagramParts(parts);
      setCurrentSlide(0);
    }
  }, [isSlideshowMode]);

  // Render diagram when mode, slide, or code changes
  useEffect(() => {
    renderDiagram();
  }, [isSlideshowMode, currentSlide, code, diagramParts]);

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
      const apiKey = useApiKey1 ? process.env.GEMINI_API_KEY1 : process.env.GEMINI_API_KEY2;
      const diagramRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
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
      
      // Reset controls to default values
      setScale(1);
      if (diagramRef.current) {
        const svg = diagramRef.current.querySelector('svg');
        const container = diagramRef.current;
        if (svg) {
          // Reset scale
          svg.style.transform = 'scale(1)';
          svg.style.transformOrigin = 'center center';
          
          // Reset container height
          container.style.transition = 'none';
          container.style.height = '500px';
        }
      }
      
      // Force a re-render of the diagram
      if (diagramRef.current) {
        diagramRef.current.innerHTML = `<div class="mermaid">${codeWithOrientation}</div>`;
        await mermaid.contentLoaded();
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
      const apiKey = useApiKey1 ? process.env.GEMINI_API_KEY1 : process.env.GEMINI_API_KEY2;
      const explainRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
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

  const downloadDiagram = async (format, returnBlob = false) => {
    try {
      // Get the mermaid container and SVG
      const mermaidContainer = diagramRef.current.querySelector('.mermaid');
      const svg = mermaidContainer.querySelector('svg');
      
      if (!svg) {
        console.error('No SVG element found');
        return;
      }

      // Create a new SVG with white background
      const newSvg = svg.cloneNode(true);
      const width = Math.max(svg.getBoundingClientRect().width, 800);
      const height = Math.max(svg.getBoundingClientRect().height, 600);

      // Set the dimensions and background
      newSvg.setAttribute('width', width);
      newSvg.setAttribute('height', height);
      newSvg.style.backgroundColor = 'white';

      // Create a white background rectangle
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('width', '100%');
      rect.setAttribute('height', '100%');
      rect.setAttribute('fill', 'white');
      newSvg.insertBefore(rect, newSvg.firstChild);

      // Add watermark only if not admin
      if (!isAdmin) {
        const watermark = new Watermark(width, height);
        await watermark.preloadLogo();
        watermark.addWatermarkToSvg(newSvg);
      }

      if (format === 'svg') {
        // For SVG, directly create blob
        const svgData = new XMLSerializer().serializeToString(newSvg);
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        if (returnBlob) return blob;
        const url = URL.createObjectURL(blob);
        downloadURL(url, 'diagram.svg');
        return;
      }
      
      // For PNG/JPG, render to canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const pixelRatio = window.devicePixelRatio || 1;
      
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      
      // Scale canvas for high DPI displays
      ctx.scale(pixelRatio, pixelRatio);
      
      // Draw white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, width, height);
      
      // Convert SVG to image
      const svgUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(new XMLSerializer().serializeToString(newSvg))));
      
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, width, height);
          
          // Add watermark to canvas only if not admin
          if (!isAdmin) {
            const watermark = new Watermark(width, height);
            watermark.addWatermarkToCanvas(ctx, () => {
              // Convert to blob
              canvas.toBlob((blob) => {
                if (returnBlob) {
                  resolve(blob);
                } else {
                  const url = URL.createObjectURL(blob);
                  downloadURL(url, `diagram.${format}`);
                  resolve();
                }
              }, `image/${format}`, 1.0);
            });
          } else {
            // For admin, skip watermark
            canvas.toBlob((blob) => {
              if (returnBlob) {
                resolve(blob);
              } else {
                const url = URL.createObjectURL(blob);
                downloadURL(url, `diagram.${format}`);
                resolve();
              }
            }, `image/${format}`, 1.0);
          }
        };
        img.onerror = reject;
        img.src = svgUrl;
      });
    } catch (error) {
      console.error('Error during diagram export:', error);
      throw error;
    }
  };

  const downloadURL = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  };

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

  // Toggle dark mode function
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleOrientationChange = (newOrientation) => {
    setOrientation(newOrientation);
    const updatedCode = code.replace(/graph (TD|LR|BT|RL)/, `graph ${newOrientation}`);
    setCode(updatedCode);

    // Reset container dimensions
    if (diagramRef.current) {
      const svg = diagramRef.current.querySelector('svg');
      const container = diagramRef.current;
      if (svg) {
        // Remove transitions temporarily
        container.style.transition = 'none';
        svg.style.transition = 'none';
        
        // Reset container to default height
        container.style.height = '500px';
        
        // Maintain current scale
        svg.style.transform = `scale(${scale})`;
        svg.style.transformOrigin = 'center center';
        
        // Re-enable transitions after a brief delay
        setTimeout(() => {
          container.style.transition = 'height 0.3s ease-in-out';
          svg.style.transition = 'transform 0.3s ease-in-out';
          
          // Recalculate container height with current scale
          const originalHeight = svg.getBoundingClientRect().height / scale;
          const newHeight = Math.max(500, originalHeight * scale);
          container.style.height = `${newHeight}px`;
        }, 50);
      }
    }

    // Update orientation in slideshow parts if active
    if (isSlideshowMode && diagramParts.length > 0) {
      const updatedParts = diagramParts.map(part => 
        part.replace(/graph (TD|LR|BT|RL)/, `graph ${newOrientation}`)
      );
      setDiagramParts(updatedParts);
    }
  };

  const handleScaleChange = (newScale) => {
    // Apply the new scale if it's within bounds
    if (newScale >= 0.5 && newScale <= 2) {
      setScale(newScale);
      if (diagramRef.current) {
        const svg = diagramRef.current.querySelector('svg');
        if (svg) {
          // Cache the container reference
          const container = diagramRef.current;
          
          // Use requestAnimationFrame for smoother animations
          requestAnimationFrame(() => {
            // Get the original dimensions of the SVG
            const originalHeight = svg.getBoundingClientRect().height / scale;
            
            // Calculate new dimensions based on scale
            const newHeight = originalHeight * newScale;
            
            // Apply the new scale with smooth transition
            svg.style.transform = `scale(${newScale})`;
            svg.style.transformOrigin = 'center center';
            
            // Set up transitions
            container.style.transition = 'height 0.3s ease-in-out';
            svg.style.transition = 'transform 0.3s ease-in-out';
            
            // Adjust container height with smooth transition
            const minHeight = 500; // Minimum height in pixels
            const newContainerHeight = Math.max(minHeight, newHeight);
            container.style.height = `${newContainerHeight}px`;
            
            // Clean up transitions after animation completes
            const cleanup = () => {
              container.style.transition = 'none';
              svg.style.transition = 'none';
            };
            
            // Use a single timeout for cleanup
            setTimeout(cleanup, 300);
          });
        }
      }
    }
  };

  const canIncreaseScale = () => {
    return scale < 2;
  };

  const canDecreaseScale = () => {
    return scale > 0.5;
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Don't trigger shortcuts if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          toggleSlideshowMode();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'arrowleft':
        case 'j':
          if (isSlideshowMode) {
            setCurrentSlide(prev => Math.max(0, prev - 1));
          }
          break;
        case 'arrowright':
        case 'l':
          if (isSlideshowMode) {
            setCurrentSlide(prev => Math.min(diagramParts.length - 1, prev + 1));
          }
          break;
        case '=':
        case '+':
          e.preventDefault();
          handleScaleChange(Math.min(2, scale + 0.1));
          break;
        case '-':
        case '_':
          e.preventDefault();
          handleScaleChange(Math.max(0.5, scale - 0.1));
          break;
        case '0':
          e.preventDefault();
          handleScaleChange(1);
          break;
        case 'd':
          toggleDarkMode();
          break;
        case 's':
          e.preventDefault();
          saveDiagram();
          break;
        case 't':
          handleOrientationChange(orientation === 'TD' ? 'LR' : 'TD');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isSlideshowMode, scale, orientation, diagramParts.length, currentSlide]);

  // Add a function to handle API key selection
  const selectApiKey = (useKey1) => {
    setUseApiKey1(useKey1);
    setShowApiKeyMenu(false);
  };

  // Function to show a toast notification
  const showToast = (message, type = 'success', duration = 3000) => {
    if (duration === 0) {
      // Permanent toast (for the link)
      setToast({ message, type, duration });
    } else {
      // Temporary toast (for copy confirmation)
      setCopyToast({ message, type, duration });
      // Auto-clear the copy toast after duration
      setTimeout(() => {
        setCopyToast(null);
      }, duration);
    }
  };

  // Function to handle toast close
  const handleToastClose = () => {
    setToast(null);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      <ScrollToTop />
      <div className="max-w-5xl mx-auto p-2 sm:p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h1 className="text-2xl sm:text-4xl font-bold relative">
            ThinkFlow
            <span className="absolute -right-12 top-0 bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-md">BETA</span>
          </h1>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-white/10 hover:bg-white/20' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
              title="Toggle dark mode (D)"
            >
              {isDarkMode ? <SunIcon /> : <MoonIcon />}
            </button>
            <div className="relative">
              <button
                onClick={() => setShowApiKeyMenu(!showApiKeyMenu)}
                className={`p-2 rounded-full transition-all duration-200 flex items-center gap-2 ${
                  isDarkMode 
                    ? 'bg-white/10 hover:bg-white/20' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
                title="Select API Key"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                </svg>
                <span className="text-sm">{useApiKey1 ? 'API Key 1' : 'API Key 2'}</span>
              </button>
              {showApiKeyMenu && (
                <div className={`absolute top-12 right-0 mt-2 w-48 rounded-lg shadow-lg overflow-hidden backdrop-blur-lg
                  ${isDarkMode ? 'bg-black/30 border border-white/10' : 'bg-white/80 border border-gray-200'}
                  transition-all duration-200 z-20`}>
                  <div className="p-2 space-y-2">
                    <div className="px-3 py-2 text-sm font-medium text-gray-400">API Key</div>
                    <button
                      onClick={() => selectApiKey(true)}
                      className={`w-full px-3 py-2 text-left rounded-md flex items-center space-x-2 
                        ${useApiKey1 ? 'bg-white/10' : 'hover:bg-white/5'}
                        transition-colors duration-200`}
                    >
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: useApiKey1 ? '#3B82F6' : 'transparent' }}></span>
                      <span className={isDarkMode ? 'text-white' : 'text-gray-700'}>API Key 1</span>
                    </button>
                    <button
                      onClick={() => selectApiKey(false)}
                      className={`w-full px-3 py-2 text-left rounded-md flex items-center space-x-2 
                        ${!useApiKey1 ? 'bg-white/10' : 'hover:bg-white/5'}
                        transition-colors duration-200`}
                    >
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: !useApiKey1 ? '#3B82F6' : 'transparent' }}></span>
                      <span className={isDarkMode ? 'text-white' : 'text-gray-700'}>API Key 2</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={toggleSlideshowMode}
              className={`p-2 rounded-full transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-white/10 hover:bg-white/20' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
              title="Toggle slideshow mode (Space)"
            >
              {isSlideshowMode ? <FullViewIcon /> : <SlideshowIcon />}
            </button>
            <div className="relative">
              <button
                onClick={() => setIsExportOpen(!isExportOpen)}
                className={`p-2 rounded-full transition-all duration-200 ${
                  isDarkMode 
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
                />
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => setIsOptionsOpen(!isOptionsOpen)}
                className={`p-2 rounded-full transition-all duration-200 ${
                  isDarkMode 
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
                />
              )}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex flex-col sm:flex-row gap-2">
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
              className={`px-4 py-2 sm:px-5 sm:py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap
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
                  <span className="hidden sm:inline">Generating...</span>
                </>
              ) : (
                <>Generate<span className="hidden sm:inline"> Diagram</span></>
              )}
            </button>
          </div>
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
            canIncreaseScale={canIncreaseScale()}
            canDecreaseScale={canDecreaseScale()}
          />
          
          <div 
            ref={diagramRef} 
            className={`rounded-lg transition-all duration-200 flex items-center justify-center ${
              isFullscreen 
                ? 'fixed inset-0 w-screen h-screen p-4 sm:p-8 overflow-auto' 
                : 'w-full overflow-hidden'
            } ${
              isDarkMode 
                ? 'bg-white/10 backdrop-blur-lg border border-white/10' 
                : 'bg-white/80 backdrop-blur-lg border border-gray-200'
            }`}
            style={{
              minHeight: isFullscreen ? '100vh' : '300px',
              height: isFullscreen ? '100vh' : 'auto'
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

        <ExplanationSection
          isDarkMode={isDarkMode}
          explanation={explanation}
          isAnalyzing={isAnalyzing}
        />

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className={`w-full p-4 rounded-lg font-mono mt-6 transition-all duration-200 text-sm sm:text-base ${
            isDarkMode 
              ? 'bg-white/10 border border-white/10 text-white' 
              : 'bg-white border border-gray-200 text-gray-900'
          }`}
          rows="5"
        />
        <button 
          onClick={saveDiagram}
          className={`mt-2 px-4 sm:px-5 py-2 sm:py-3 rounded-lg transition-all duration-200 ${
            isDarkMode
              ? 'bg-white/10 hover:bg-white/20'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
          title="Save diagram (S)"
        >
          Save
        </button>
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
    </div>
  );
}
