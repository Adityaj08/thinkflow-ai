import { useState, useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import mermaid from 'mermaid';
import { themes } from '../constants/themes';
import Watermark from '../components/Watermark';

export const useDiagramLogic = () => {
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
    const [isEditInputOpen, setIsEditInputOpen] = useState(false);
    const [editInputValue, setEditInputValue] = useState("");

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
            const apiKey = useApiKey1 ? import.meta.env.VITE_GEMINI_API_KEY1 : import.meta.env.VITE_GEMINI_API_KEY2;
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

    const toggleEditInput = () => {
        setIsEditInputOpen(prev => !prev);
        if (!isEditInputOpen) {
            setEditInputValue("");
        }
    };

    const updateDiagram = async (updatePrompt) => {
        // Close input box immediately
        setIsEditInputOpen(false);
        setEditInputValue("");

        try {
            setIsLoading(true);
            const apiKey = useApiKey1 ? import.meta.env.VITE_GEMINI_API_KEY1 : import.meta.env.VITE_GEMINI_API_KEY2;
            const diagramRes = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: `Update this Mermaid.js diagram based on the following request: "${updatePrompt}".
                                
                                Current Diagram Code:
                                ${code}

                                Return ONLY the updated Mermaid.js code without any explanation or markdown formatting.
                                Do not include \`\`\`mermaid or any other markdown. Only output the actual mermaid code.
                                The diagram should use ${orientation} orientation.`
                            }]
                        }],
                    }),
                }
            );
            const diagramData = await diagramRes.json();
            const generated = diagramData?.candidates?.[0]?.content?.parts?.[0]?.text || code;

            const cleanCode = generated.replace(/```(?:mermaid)?\n?|\n?```/g, '').trim();
            const codeWithOrientation = cleanCode.replace(/graph (TD|LR|BT|RL)/, `graph ${orientation}`);
            setCode(codeWithOrientation);

            // Reset controls
            setScale(1);
            if (diagramRef.current) {
                const svg = diagramRef.current.querySelector('svg');
                const container = diagramRef.current;
                if (svg) {
                    svg.style.transform = 'scale(1)';
                    svg.style.transformOrigin = 'center center';
                    container.style.transition = 'none';
                    container.style.height = '500px';
                }
            }

            // Force re-render
            if (diagramRef.current) {
                diagramRef.current.innerHTML = `<div class="mermaid">${codeWithOrientation}</div>`;
                await mermaid.contentLoaded();
            }
        } catch (error) {
            console.error('Error updating diagram:', error);
            showToast("Failed to update diagram", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const analyzeDiagram = async () => {
        try {
            setIsAnalyzing(true);
            const apiKey = useApiKey1 ? import.meta.env.VITE_GEMINI_API_KEY1 : import.meta.env.VITE_GEMINI_API_KEY2;
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

            // Remove any transforms from the clone to prevent double scaling/cropping
            newSvg.style.transform = 'none';
            newSvg.style.transformOrigin = 'center center';

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
        if (newScale >= 0.5 && newScale <= 5) {
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
        return scale < 5;
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
                    handleScaleChange(scale + 0.1);
                    break;
                case '-':
                case '_':
                    e.preventDefault();
                    handleScaleChange(scale - 0.1);
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
                case 'e':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        toggleEditInput();
                    }
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
        useApiKey1, setUseApiKey1,
        showApiKeyMenu, setShowApiKeyMenu,
        logoDataUrl, setLogoDataUrl,
        isExportOpen, setIsExportOpen,
        toast, setToast,
        copyToast, setCopyToast,
        toggleSlideshowMode,
        renderDiagram,
        toggleSlideshowMode,
        renderDiagram,
        saveDiagram,
        isEditInputOpen, setIsEditInputOpen,
        editInputValue, setEditInputValue,
        toggleEditInput,
        updateDiagram,
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
        handleToastClose
    };
};
