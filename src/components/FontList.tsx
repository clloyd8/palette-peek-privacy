import React from 'react';
import { Check } from 'lucide-react';

interface FontListProps {
  fonts: string[];
}

const FontList: React.FC<FontListProps> = ({ fonts }) => {
  const [copiedFont, setCopiedFont] = React.useState<string | null>(null);

  const handleCopyFont = (font: string) => {
    navigator.clipboard.writeText(font).then(() => {
      setCopiedFont(font);
      setTimeout(() => setCopiedFont(null), 2000);
    });
  };

  return (
    <ul className="space-y-2">
      {fonts.map((font, index) => (
        <li key={index} className="flex items-center justify-between">
          <span className="text-sm font-medium" style={{ fontFamily: font }}>{font}</span>
          <button
            onClick={() => handleCopyFont(font)}
            className="ml-2 p-1 text-slate-600 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 rounded"
          >
            {copiedFont === font ? <Check size={18} /> : 'Copy'}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default FontList;