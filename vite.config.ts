import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

const createPalettePeekIcon = (size: number) => {
  // Read the SVG file content
  const svgContent = readFileSync(resolve(__dirname, `src/assets/palette-peek-icon.svg`), 'utf-8');
  
  // Replace the size in the SVG content
  const resizedSvg = svgContent
    .replace(/width="(\d+)"/, `width="${size}"`)
    .replace(/height="(\d+)"/, `height="${size}"`);

  return resizedSvg;
};

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'create-palette-peek-icons',
      writeBundle() {
        // Create icons directory if it doesn't exist
        const iconsDir = resolve(__dirname, 'dist/icons');
        if (!existsSync(iconsDir)) {
          mkdirSync(iconsDir, { recursive: true });
        }

        // Write manifest with updated paths
        writeFileSync('dist/manifest.json', JSON.stringify({
          manifest_version: 3,
          name: "Palette Peek",
          version: "1.0",
          description: "Instantly extract color palettes and fonts from any website",
          permissions: ["activeTab", "storage"],
          action: {
            default_popup: "index.html",
            default_icon: {
              "16": "icons/icon16.png",
              "32": "icons/icon32.png",
              "48": "icons/icon48.png",
              "128": "icons/icon128.png"
            }
          },
          icons: {
            "16": "icons/icon16.png",
            "32": "icons/icon32.png",
            "48": "icons/icon48.png",
            "128": "icons/icon128.png"
          },
          content_scripts: [
            {
              matches: ["<all_urls>"],
              js: ["content-script.js"]
            }
          ]
        }, null, 2));

        // Generate icons in different sizes
        [16, 32, 48, 128].forEach(size => {
          writeFileSync(`dist/icons/icon${size}.png`, createPalettePeekIcon(size));
        });
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'content-script': resolve(__dirname, 'src/content-script.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === 'content-script' ? 'content-script.js' : '[name]-[hash].js';
        },
      },
    },
  },
});