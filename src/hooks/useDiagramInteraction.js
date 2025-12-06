import { useRef, useEffect, useState } from 'react';
import mermaid from 'mermaid';
import { themes } from '../constants/themes';

export const useDiagramInteraction = ({
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
}) => {
    const diagramRef = useRef(null);
    const fullscreenRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

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

    const toggleSlideshowMode = () => {
        const newMode = !isSlideshowMode;
        // Logic handled by useEffect or caller? 
        // Best to return the new state or callback. 
        // Here we return parts and mode state updates?
        // Actually, let's keep it simple: caller manages state, we just provide the toggle function logic if we had access to setters.
        // But we have setters.
        // Wait, toggle logic modifies state.

        // This function needs to be returned.
        // And it depends on `splitDiagramIntoParts`.
        // Let's reimplement similar logic.
        return newMode; // Let the caller update the state.
    };

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
                draggable: false, // DISABLED TO FIX RUNTIME ERROR
                orientation: orientation,
                defaultRenderer: 'elk',
                rankSpacing: 50,
                nodeSpacing: 50,
                ranker: 'network-simplex'
            }
        });

        // Update the diagram code with the new orientation
        const updatedCode = code.replace(/graph (TD|LR|BT|RL)/, `graph ${orientation}`);
        if (updatedCode !== code) {
            setCode(updatedCode);
        }

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
                        container.style.height = `${newContainerHeight} px`;

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

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            fullscreenRef.current.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const resetView = () => {
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
    };

    return {
        diagramRef,
        fullscreenRef,
        isFullscreen,
        setIsFullscreen,
        renderDiagram,
        splitDiagramIntoParts,
        toggleSlideshowMode,  // Note: logic moved to main or needs wrapper
        handleOrientationChange,
        handleScaleChange,
        toggleFullscreen,
        resetView
    };
};
