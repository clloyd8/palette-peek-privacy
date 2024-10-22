import React from 'react';
import { Download } from 'lucide-react';

interface ExportPanelProps {
  colors: string[];
  fonts: string[];
}

const ExportPanel: React.FC<ExportPanelProps> = ({ colors, fonts }) => {
  const handleExport = () => {
    const colorData = colors.join('\n');
    const fontData = fonts.join('\n');
    const exportData = `Colors:\n${colorData}\n\nFonts:\n${fontData}`;
    
    const blob = new Blob([exportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'palette_peek_export.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleExport}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
      >
        <Download size={18} className="mr-2" />
        Export for Canva/Figma
      </button>
      <p className="text-xs text-slate-500 mt-2">
        Export colors and fonts to use in Canva or Figma. See instructions below on how to import.
      </p>
    </div>
  );
};

export default ExportPanel;