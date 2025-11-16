/**
 * Placeholder Image Utility
 * Provides placeholder images using a reliable service (placehold.co)
 * Fallback to data URI if external service fails
 */

export const getPlaceholderImage = (
  width: number = 400,
  height: number = 300,
  text: string = 'Image',
  backgroundColor: string = 'CCCCCC',
  textColor: string = '333333'
): string => {
  // Use placehold.co which is more reliable than via.placeholder.com
  return `https://placehold.co/${width}x${height}/${backgroundColor}/${textColor}?text=${encodeURIComponent(text)}`;
};

/**
 * Get a data URI placeholder image as fallback
 */
export const getDataURIPlaceholder = (
  width: number = 400,
  height: number = 300,
  text: string = 'No Image'
): string => {
  // Create a simple SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f0f0"/>
      <text 
        x="50%" 
        y="50%" 
        font-family="Arial, sans-serif" 
        font-size="16" 
        fill="#999" 
        text-anchor="middle" 
        dominant-baseline="middle"
      >${text}</text>
    </svg>
  `.trim();
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * Get placeholder image with automatic fallback
 */
export const getPlaceholderWithFallback = (
  width: number = 400,
  height: number = 300,
  text: string = 'Image'
): string => {
  // Try placehold.co first, with data URI as fallback in onError handler
  return getPlaceholderImage(width, height, text);
};

/**
 * Common placeholder sizes
 */
export const PLACEHOLDER_SIZES = {
  thumbnail: { width: 100, height: 100 },
  small: { width: 200, height: 200 },
  medium: { width: 400, height: 300 },
  large: { width: 800, height: 600 },
  banner: { width: 1200, height: 400 },
  hero: { width: 1920, height: 600 },
} as const;

/**
 * Get a placeholder for a specific use case
 */
export const getPlaceholderByType = (
  type: keyof typeof PLACEHOLDER_SIZES,
  text?: string
): string => {
  const { width, height } = PLACEHOLDER_SIZES[type];
  return getPlaceholderImage(width, height, text || type);
};

