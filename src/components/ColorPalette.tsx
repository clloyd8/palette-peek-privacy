import React from 'react';
import { Check, Copy } from 'lucide-react';

interface ColorPaletteProps {
  colors: string[];
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ colors }) => {
  const [copiedColor, setCopiedColor] = React.useState<string | null>(null);

  const handleCopyColor = (color: string) => {
    navigator.clipboard.writeText(color).then(() => {
      setCopiedColor(color);
      setTimeout(() => setCopiedColor(null), 2000);
    });
  };

  return (
    <div className="grid grid-cols-4 gap-2">
      {colors.map((color, index) => (
        <div key={index} className="flex flex-col items-center">
          <button
            onClick={() => handleCopyColor(color)}
            className="w-12 h-12 rounded-lg shadow-md transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 relative group"
            style={{ backgroundColor: color }}
          >
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-lg transition-opacity">
              {copiedColor === color ? (
                <Check className="text-white" size={20} />
              ) : (
                <Copy className="text-white opacity-0 group-hover:opacity-100" size={20} />
              )}
            </div>
          </button>
          <span className="text-xs mt-1 font-medium">{color}</span>
          <span className="text-xs text-slate-500">#{index + 1}</span>
        </div>
      ))}
    </div>
  );
};

export default ColorPalette;