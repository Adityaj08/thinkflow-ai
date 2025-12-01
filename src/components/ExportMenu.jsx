import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { uploadToCloudinary } from '../utils/cloudinary';
import Watermark from './Watermark';

export const ExportMenu = ({ isDarkMode, downloadDiagram, setIsExportOpen, showToast }) => {
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('');
  const { user } = useAuth0();
  const isAdmin = user && user['https://thinkflow.ai/roles']?.includes('admin');

  const handleShare = async (format) => {
    try {
      showToast('Uploading diagram to cloud...', 'loading');
      newSvg.style.backgroundColor = 'white';

      // Create a white background rectangle
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('width', '100%');
      rect.setAttribute('height', '100%');
      rect.setAttribute('fill', 'white');
      newSvg.insertBefore(rect, newSvg.firstChild);

      // Add watermark
      const watermark = new Watermark(width, height);
      await watermark.preloadLogo();
      watermark.addWatermarkToSvg(newSvg);

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

        // Draw white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);

        // Convert SVG to image
        const svgUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(new XMLSerializer().serializeToString(newSvg))));

        await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, 0, 0, width, height);

            // Add watermark to canvas
            watermark.addWatermarkToCanvas(ctx, () => {
              // Convert to blob
              canvas.toBlob((b) => {
                blob = b;
                resolve();
              }, `image/${format}`, 1.0);
            });
          };
          img.onerror = reject;
          img.src = svgUrl;
        });
      }

      const result = await uploadToCloudinary(blob, format);

      if (result.url) {
        // Check if Web Share API is available (mobile devices)
        if (navigator.share) {
          try {
            await navigator.share({
              title: 'ThinkFlow Diagram',
              text: 'Check out this diagram I created with ThinkFlow',
              url: result.url
            });
          } catch (err) {
            // If user cancels share or share fails, show the permanent toast
            showToast(
              <div className="flex flex-col gap-2">
                <div className="text-sm">Diagram uploaded successfully!</div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={result.url}
                    readOnly
                    className="flex-1 px-2 py-1 text-xs bg-white/10 rounded border border-white/20"
                    onClick={(e) => e.target.select()}
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(result.url);
                      showToast('Link copied to clipboard!', 'success', 3000);
                    }}
                    className="px-2 py-1 text-xs bg-white/20 hover:bg-white/30 rounded transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>,
              'success',
              0
            );
          }
        } else {
          // For desktop, show the permanent toast with copy button
          showToast(
            <div className="flex flex-col gap-2">
              <div className="text-sm">Diagram uploaded successfully!</div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={result.url}
                  readOnly
                  className="flex-1 px-2 py-1 text-xs bg-white/10 rounded border border-white/20"
                  onClick={(e) => e.target.select()}
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(result.url);
                    showToast('Link copied to clipboard!', 'success', 3000);
                  }}
                  className="px-2 py-1 text-xs bg-white/20 hover:bg-white/30 rounded transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>,
            'success',
            0
          );
        }
      } else {
        showToast('Failed to upload diagram', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Failed to share diagram', 'error');
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
        {isAdmin && (
          <div className="px-3 py-2 flex items-center gap-2">
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">Admin</span>
            <span className="text-xs text-gray-400">Watermark-free downloads</span>
          </div>
        )}
        <div className="px-3 py-2 text-sm font-medium text-gray-400">Export</div>
        {['png', 'jpg', 'svg', 'pdf'].map(format => (
          <button
            key={format}
            onClick={() => {
              downloadDiagram(format);
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