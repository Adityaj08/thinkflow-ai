const CLOUDINARY_CLOUD_NAME = 'thinkflow';
const CLOUDINARY_UPLOAD_PRESET = 'thinkflow_unsigned';

/**
 * IMPORTANT: Cloudinary Upload Preset Configuration
 * 
 * You need to create an unsigned upload preset in your Cloudinary dashboard:
 * 1. Log in to Cloudinary dashboard
 * 2. Go to Settings > Upload
 * 3. Scroll to Upload Presets and click "Add upload preset"
 * 4. Set the following:
 *    - Preset name: thinkflow_unsigned
 *    - Signing Mode: Unsigned
 *    - Folder: thinkflow_diagrams
 *    - Unique filename: Yes
 *    - Delivery type: Upload
 * 
 * For automatic optimization and expiration:
 * 1. Under "Image Transformations" add:
 *    - quality: auto
 *    - fetch format: auto
 * 2. Set "Expires After" to 1 day or 86400 seconds
 */

const getTimestampFilename = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  
  return `diagram_${hours}${minutes}${seconds}_${day}${month}${year}`;
};

export const uploadToCloudinary = async (imageBlob, format = 'svg') => {
  try {
    // Create a File from the Blob with proper name and type
    const file = new File([imageBlob], `temp.${format}`, { type: `image/${format}` });
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'thinkflow_diagrams');
    
    // Add timestamp-based public_id (filename) with extension
    const filename = `${getTimestampFilename()}.${format}`;
    formData.append('public_id', filename);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Cloudinary error:', data);
      throw new Error(data.error?.message || 'Upload failed');
    }

    return { url: data.secure_url };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
}; 