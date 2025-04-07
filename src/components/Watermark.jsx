import { useState, useEffect } from 'react';

class Watermark {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.logoDataUrl = null;
  }

  /**
   * Preloads the logo image and converts it to a data URL
   */
  preloadLogo = () => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        this.logoDataUrl = canvas.toDataURL('image/png');
        resolve();
      };
      img.src = '/ThinkFlowLogo.png';
    });
  };

  /**
   * Adds watermark to SVG element
   * @param {SVGElement} svg - The SVG element to add watermark to
   * @returns {SVGElement} - SVG element with watermark
   */
  addWatermarkToSvg = (svg) => {
    // Calculate bottom right position
    const watermarkX = this.width - 240; // 20px from right edge
    const watermarkY = this.height - 80; // 20px from bottom edge
    
    // Create watermark container with higher z-index
    const watermarkGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    watermarkGroup.setAttribute('opacity', '0.5');
    watermarkGroup.setAttribute('style', 'z-index: 1000');
    
    // Create glassmorphic background for watermark
    const watermarkBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    watermarkBg.setAttribute('x', watermarkX);
    watermarkBg.setAttribute('y', watermarkY);
    watermarkBg.setAttribute('width', '220');
    watermarkBg.setAttribute('height', '60');
    watermarkBg.setAttribute('rx', '10');
    watermarkBg.setAttribute('fill', 'white');
    watermarkBg.setAttribute('stroke', '#3B82F6');
    watermarkBg.setAttribute('stroke-width', '1');
    watermarkBg.setAttribute('stroke-opacity', '0.2');
    
    // Create an image element for the logo
    const logoImage = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    logoImage.setAttribute('x', watermarkX + 10);
    logoImage.setAttribute('y', watermarkY + 10);
    logoImage.setAttribute('width', '40');
    logoImage.setAttribute('height', '40');
    logoImage.setAttribute('href', this.logoDataUrl || '/ThinkFlowLogo.png');
    
    // Create "Made with" text
    const madeWithText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    madeWithText.setAttribute('x', watermarkX + 60);
    madeWithText.setAttribute('y', watermarkY + 25);
    madeWithText.setAttribute('font-family', 'Montserrat');
    madeWithText.setAttribute('font-size', '12');
    madeWithText.setAttribute('font-weight', '300');
    madeWithText.setAttribute('fill', '#1F2937');
    madeWithText.textContent = 'Made with';
    
    // Create "ThinkFlow" text
    const thinkFlowText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    thinkFlowText.setAttribute('x', watermarkX + 60);
    thinkFlowText.setAttribute('y', watermarkY + 45);
    thinkFlowText.setAttribute('font-family', 'Montserrat');
    thinkFlowText.setAttribute('font-size', '16');
    thinkFlowText.setAttribute('font-weight', '600');
    thinkFlowText.setAttribute('fill', '#3B82F6');
    thinkFlowText.textContent = 'ThinkFlow';
    
    // Add all elements to watermark group
    watermarkGroup.appendChild(watermarkBg);
    watermarkGroup.appendChild(logoImage);
    watermarkGroup.appendChild(madeWithText);
    watermarkGroup.appendChild(thinkFlowText);
    
    // Add watermark to SVG - ensure it's the last child for proper rendering
    svg.appendChild(watermarkGroup);
    
    return svg;
  };

  /**
   * Adds watermark to canvas
   * @param {CanvasRenderingContext2D} ctx - The canvas context
   * @param {Function} callback - Callback to execute after watermark is added
   */
  addWatermarkToCanvas = (ctx, callback) => {
    const watermarkX = this.width - 240;
    const watermarkY = this.height - 80;
    
    // Draw glassmorphic background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(watermarkX, watermarkY, 220, 60, 10);
    ctx.fill();
    ctx.stroke();
    
    // Draw logo
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, watermarkX + 10, watermarkY + 10, 40, 40);
      
      // Draw text
      ctx.font = '300 12px Montserrat';
      ctx.fillStyle = '#1F2937';
      ctx.fillText('Made with', watermarkX + 60, watermarkY + 25);
      
      ctx.font = '600 16px Montserrat';
      ctx.fillStyle = '#3B82F6';
      ctx.fillText('ThinkFlow', watermarkX + 60, watermarkY + 45);
      
      callback();
    };
    img.src = this.logoDataUrl || '/ThinkFlowLogo.png';
  };
}

export default Watermark; 