import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'sonner';
import { uploadToCloudinary } from '../utils/cloudinary';
import Watermark from './Watermark';

export const ExportMenu = ({ isDarkMode, downloadDiagram, setIsExportOpen, showToast, diagramRef }) => {
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('');
  const [quality, setQuality] = useState('1080p');
  const [background, setBackground] = useState('white');
  const { user } = useAuth0();
  const isAdmin = user && user['https://thinkflow.ai/roles']?.includes('admin');
  const isPro = user && user['https://thinkflow.ai/roles']?.includes('pro');

  const handleShare = async (format) => {
    try {
      setIsSharing(true);

      // Get the mermaid container and SVG
      const mermaidContainer = diagramRef.current.querySelector('.mermaid');
      const svgElement = mermaidContainer.querySelector('svg');

      if (!svgElement) {
        throw new Error('No SVG element found');
      }

      // Create a new SVG
      const newSvg = svgElement.cloneNode(true);

      // Remove any transforms from the clone to prevent double scaling/cropping
      newSvg.style.transform = 'none';
      newSvg.style.transformOrigin = 'center center';

      // Calculate dimensions based on quality
      const originalWidth = svgElement.getBoundingClientRect().width;
      const originalHeight = svgElement.getBoundingClientRect().height;
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

      // Add watermark
      if (!isAdmin && !isPro) {
        const watermark = new Watermark(width, height);
        await watermark.preloadLogo();
        watermark.addWatermarkToSvg(newSvg);
      }

      let blob;
      if (format === 'svg') {
        // For SVG, directly create blob
        const svgData = new XMLSerializer().serializeToString(newSvg);
        blob = new Blob([svgData], { type: 'image/svg+xml' });
      } else {
        // For PNG/JPG, render to canvas first
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

        await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, 0, 0, width, height);

            // Add watermark to canvas
            if (!isAdmin && !isPro) {
              const watermark = new Watermark(width, height);
              watermark.addWatermarkToCanvas(ctx, () => {
                // Convert to blob
                canvas.toBlob((b) => {
                  blob = b;
                  resolve();
                }, `image/${format}`, 1.0);
              });
            } else {
              canvas.toBlob((b) => {
                blob = b;
                resolve();
              }, `image/${format}`, 1.0);
            }
          };
          img.onerror = reject;
          img.src = svgUrl;
        });
      }

      const uploadPromise = uploadToCloudinary(blob, format);

      toast.promise(uploadPromise, {
        loading: 'Uploading diagram to cloud...',
        success: (result) => {
          if (result.url) {
            // Check if Web Share API is available (mobile devices)
            if (navigator.share) {
              navigator.share({
                title: 'ThinkFlow Diagram',
                text: 'Check out this diagram I created with ThinkFlow',
                url: result.url
              }).catch(() => {
                // If user cancels share, copy to clipboard
                navigator.clipboard.writeText(result.url);
              });
            } else {
              // For desktop, copy to clipboard
              navigator.clipboard.writeText(result.url);
            }
            return 'Diagram uploaded! Link copied to clipboard.';
          }
          throw new Error('Failed to get URL');
        },
        error: 'Failed to upload diagram',
      });
    } catch (err) {
      toast.error(err.message || 'Failed to share diagram');
    } finally {
      setIsSharing(false);
    }
  };

  const showCloudinaryHelp = () => {
    if (error && (error.includes('Cloudinary') || error.includes('upload preset'))) {
      return (
        <div className="px-3 py-2 text-xs text-blue-400 mt-1">
          <p>To resolve:</p>
          <ol className="list-decimal pl-4 mt-1 space-y-1">
            <li>Log in to Cloudinary dashboard</li>
            <li>Go to Settings {'->'} Upload</li>
            <li>Create upload preset: "thinkflow_unsigned"</li>
            <li>Set it to "Unsigned" mode</li>
          </ol>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`absolute top-12 right-0 mt-2 w-64 rounded-lg shadow-lg overflow-hidden backdrop-blur-lg
      ${isDarkMode ? 'bg-black/30 border border-white/10' : 'bg-white/80 border border-gray-200'}
      transition-all duration-200 z-20`}>
      <div className="p-2 space-y-2">
        {(isAdmin || isPro) && (
          <div className="px-3 py-2 flex items-center gap-2">
            <span className={`px-2 py-0.5 text-xs rounded-full ${isAdmin ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
              {isAdmin ? 'Admin' : 'Pro'}
            </span>
            <span className="text-xs text-gray-400">Watermark-free downloads</span>
          </div>
        )}

        {/* Quality Selection */}
        <div className="px-3 py-1">
          <label className="text-xs text-gray-400 block mb-1">Quality</label>
          <div className="grid grid-cols-2 gap-1">
            {['720p', '1080p'].map(q => (
              <button
                key={q}
                onClick={() => setQuality(q)}
                className={`px-2 py-1 text-xs rounded border transition-colors ${quality === q
                  ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                  : 'border-transparent hover:bg-white/5 text-gray-400'
                  }`}
              >
                {q}
              </button>
            ))}
            {['2k', '4k'].map(q => (
              <button
                key={q}
                onClick={() => (isAdmin || isPro) ? setQuality(q) : null}
                disabled={!isAdmin && !isPro}
                className={`px-2 py-1 text-xs rounded border transition-colors ${quality === q
                  ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                  : (!isAdmin && !isPro)
                    ? 'opacity-50 cursor-not-allowed border-transparent text-gray-500'
                    : 'border-transparent hover:bg-white/5 text-gray-400'
                  }`}
                title={(!isAdmin && !isPro) ? "Upgrade to Pro for 2K/4K export" : ""}
              >
                {q} {(!isAdmin && !isPro) && '🔒'}
              </button>
            ))}
          </div>
        </div>

        {/* Background Selection */}
        <div className="px-3 py-1">
          <label className="text-xs text-gray-400 block mb-1">Background</label>
          <div className="flex gap-1">
            {[
              { id: 'white', label: 'White' },
              { id: 'black', label: 'Black' },
              { id: 'transparent', label: 'Transparent' }
            ].map(bg => (
              <button
                key={bg.id}
                onClick={() => setBackground(bg.id)}
                className={`flex-1 px-2 py-1 text-xs rounded border transition-colors ${background === bg.id
                  ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                  : 'border-transparent hover:bg-white/5 text-gray-400'
                  }`}
              >
                {bg.label}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 my-2"></div>

        <div className="px-3 py-2 text-sm font-medium text-gray-400">Export</div>
        {['png', 'jpg', 'svg', 'pdf'].map(format => (
          <button
            key={format}
            onClick={() => {
              downloadDiagram(format, quality, background);
              setIsExportOpen(false);
            }}
            className="w-full px-3 py-2 text-left hover:bg-white/5 rounded-md transition-colors duration-200"
          >
            <span className={isDarkMode ? 'text-white' : 'text-gray-700'}>
              Export as {format.toUpperCase()}
            </span>
          </button>
        ))}
        <div className="border-t border-white/10 my-2"></div>
        <div className="px-3 py-2 text-sm font-medium text-gray-400">Share (24h link)</div>
        {['png', 'jpg'].map(format => (
          <button
            key={`share-${format}`}
            onClick={() => handleShare(format)}
            disabled={isSharing}
            className={`w-full px-3 py-2 text-left hover:bg-white/5 rounded-md transition-colors duration-200 flex items-center justify-between
              ${isSharing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className={isDarkMode ? 'text-white' : 'text-gray-700'}>
              Share as {format.toUpperCase()}
            </span>
            {isSharing && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
          </button>
        ))}
        {status && (
          <div className="px-3 py-2 text-sm text-blue-400">
            {status}
          </div>
        )}
        {error && (
          <div className="px-3 py-2 text-sm text-red-500">
            {error}
            {showCloudinaryHelp()}
          </div>
        )}
      </div>
    </div>
  );
};