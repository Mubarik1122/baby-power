export function productHasAttributes(sizes: string[], colors: string[]): boolean {
  return sizes.length > 0 || colors.length > 0;
}

export function isAttributeSelectionValid(
  sizes: string[],
  colors: string[],
  selectedSize: string,
  selectedColor: string,
): boolean {
  if (sizes.length > 0 && !selectedSize) return false;
  if (colors.length > 0 && !selectedColor) return false;
  return true;
}

export function formatSelectionLabel(selectedSize: string, selectedColor: string): string {
  return [selectedSize, selectedColor].filter(Boolean).join(' / ');
}
