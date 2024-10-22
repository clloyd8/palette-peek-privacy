chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractInfo") {
    const colors = extractColors();
    const fonts = extractFonts();
    sendResponse({ colors, fonts });
  }
  return true;
});

function extractColors(): string[] {
  const elements = document.querySelectorAll('*');
  const colorMap = new Map<string, number>();
  let index = 0;

  elements.forEach((el) => {
    const styles = window.getComputedStyle(el);
    const color = styles.color;
    const backgroundColor = styles.backgroundColor;

    if (color !== 'rgba(0, 0, 0, 0)') {
      const hexColor = rgbToHex(color);
      if (!colorMap.has(hexColor)) {
        colorMap.set(hexColor, index++);
      }
    }
    if (backgroundColor !== 'rgba(0, 0, 0, 0)') {
      const hexColor = rgbToHex(backgroundColor);
      if (!colorMap.has(hexColor)) {
        colorMap.set(hexColor, index++);
      }
    }
  });

  return Array.from(colorMap.entries())
    .sort((a, b) => a[1] - b[1])
    .map(([color]) => color);
}

function extractFonts(): string[] {
  const elements = document.querySelectorAll('*');
  const fontSet = new Set<string>();

  elements.forEach((el) => {
    const fontFamily = window.getComputedStyle(el).fontFamily;
    fontSet.add(fontFamily.split(',')[0].replace(/['"]+/g, ''));
  });

  return Array.from(fontSet);
}

function rgbToHex(rgb: string): string {
  const [r, g, b] = rgb.match(/\d+/g)!.map(Number);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

console.log('Palette Peek: Content script initialized.');