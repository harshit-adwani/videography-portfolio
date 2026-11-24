/**
 * Converts an image File to an optimized base64 Data URL.
 * Resizes large dimensions to fit within maxWidth/maxHeight while preserving aspect ratio.
 * Preserves alpha transparency for PNG, SVG, and GIF.
 */
export const fileToOptimizedDataUrl = (
  file: File,
  maxWidth = 512,
  maxHeight = 512,
  quality = 0.88
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Basic file validation
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Selected file is not an image'));
    }

    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Failed to read image file'));

    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) {
        return reject(new Error('Empty file content'));
      }

      // SVGs don't need raster resizing - use Data URL directly
      if (file.type === 'image/svg+xml') {
        return resolve(dataUrl);
      }

      const img = new Image();
      img.onerror = () => resolve(dataUrl); // Fallback to raw dataUrl if decoding fails

      img.onload = () => {
        let { width, height } = img;

        // If image is already smaller than max bounds and under 200KB, return as-is
        if (width <= maxWidth && height <= maxHeight && file.size < 200 * 1024) {
          return resolve(dataUrl);
        }

        // Calculate scaled dimensions preserving aspect ratio
        if (width > maxWidth || height > maxHeight) {
          if (width / maxWidth > height / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(dataUrl);
        }

        // Maintain alpha transparency for PNGs and GIFs
        const isTransparent = file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/webp';
        
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        try {
          const mimeType = isTransparent ? 'image/png' : 'image/jpeg';
          const optimizedDataUrl = canvas.toDataURL(mimeType, quality);
          resolve(optimizedDataUrl);
        } catch (_) {
          resolve(dataUrl);
        }
      };

      img.src = dataUrl;
    };

    reader.readAsDataURL(file);
  });
};
