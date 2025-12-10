import Watermark from '../components/Watermark';

export const useDiagramExport = ({ diagramRef, isAdmin, isPro }) => {

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

    const downloadDiagram = async (format, quality = '1080p', background = 'white', returnBlob = false) => {
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

            // Calculate dimensions based on quality
            const originalWidth = svg.getBoundingClientRect().width;
            const originalHeight = svg.getBoundingClientRect().height;
            const aspectRatio = originalWidth / originalHeight;

            let targetHeight;
            switch (quality) {
                case '720p':
                    targetHeight = 720;
                    break;
                case '1080p':
                    targetHeight = 1080;
                    break;
                case '2k':
                    targetHeight = 1440;
                    break;
                case '4k':
                    targetHeight = 2160;
                    break;
                default:
                    targetHeight = 1080;
            }

            // Ensure we don't upscale if the original is smaller (optional, but good for quality)
            // For diagrams, upscaling is usually fine as it's vector data
            const height = targetHeight;
            const width = height * aspectRatio;

            // Set the dimensions and background
            newSvg.setAttribute('width', width);
            newSvg.setAttribute('height', height);

            if (background !== 'transparent') {
                newSvg.style.backgroundColor = background;

                // Create a background rectangle
                const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rect.setAttribute('width', '100%');
                rect.setAttribute('height', '100%');
                rect.setAttribute('fill', background);
                newSvg.insertBefore(rect, newSvg.firstChild);
            } else {
                newSvg.style.backgroundColor = 'transparent';
            }

            // Add watermark only if not admin or pro
            if (!isAdmin && !isPro) {
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

            if (background !== 'transparent') {
                ctx.fillStyle = background;
                ctx.fillRect(0, 0, width, height);
            }

            // Convert SVG to image
            const svgUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(new XMLSerializer().serializeToString(newSvg))));

            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    ctx.drawImage(img, 0, 0, width, height);

                    // Add watermark to canvas only if not admin or pro
                    if (!isAdmin && !isPro) {
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

    const copyToClipboard = async () => {
        try {
            const blob = await downloadDiagram('png', '1080p', 'transparent', true);
            if (blob) {
                await navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob })
                ]);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            throw error;
        }
    };

    return { downloadDiagram, copyToClipboard };
};
