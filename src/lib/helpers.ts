/**
 * Helper functions for handling multilingual content and other app utilities
 */

/**
 * Extracts text in the specified language from a multilingual object
 * Falls back to English if the requested language is not available
 */
export function getLocalizedText(
  textObj: string | Record<string, string> | undefined, 
  language: string = 'en'
): string {
  // If it's a string, return it directly
  if (typeof textObj === 'string' || textObj === undefined) {
    return textObj as string || '';
  }
  
  // If it's an object with language keys
  if (textObj[language]) {
    return textObj[language];
  }
  
  // Fallback to English
  if (textObj.en) {
    return textObj.en;
  }
  
  // Last resort: return the first available translation
  const firstAvailableLanguage = Object.keys(textObj)[0];
  if (firstAvailableLanguage) {
    return textObj[firstAvailableLanguage];
  }
  
  // If all else fails, return empty string
  return '';
}

/**
 * Check if a value is a multilingual object
 */
export function isMultilingualText(value: any): boolean {
  return (
    typeof value === 'object' && 
    value !== null && 
    !Array.isArray(value) &&
    Object.keys(value).some(key => ['en', 'hi', 'ta', 'gu'].includes(key))
  );
}