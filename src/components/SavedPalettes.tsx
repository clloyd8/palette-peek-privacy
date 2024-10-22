import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trash2 } from 'lucide-react';

interface SavedPalette {
  colors: string[];
  fonts: string[];
  url: string;
}

interface SavedPalettesProps {
  onBack: () => void;
}

const SavedPalettes: React.FC<SavedPalettesProps> = ({ onBack }) => {
  const [savedPalettes, setSavedPalettes] = useState<SavedPalette[]>([]);

  useEffect(() => {
    loadSavedPalettes();
  }, []);

  const loadSavedPalettes = () => {
    chrome.storage.sync.get('savedPalettes', (result) => {
      setSavedPalettes(result.savedPalettes || []);
    });
  };

  const handleDelete = (index: number) => {
    const updatedPalettes = savedPalettes.filter((_, i) => i !== index);
    chrome.storage.sync.set({ savedPalettes: updatedPalettes }, () => {
      setSavedPalettes(updatedPalettes);
    });
  };

  return (
    <div>
      <div className="flex items-center mb-4">
        <button onClick={onBack} className="mr-2 text-slate-600 hover:text-slate-800">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold">Saved Palettes</h2>
      </div>
      {savedPalettes.length === 0 ? (
        <p className="text-slate-500">No saved palettes yet.</p>
      ) : (
        <ul className="space-y-4">
          {savedPalettes.map((palette, index) => (
            <li key={index} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium truncate" title={palette.url}>
                  {new URL(palette.url).hostname}
                </span>
                <button
                  onClick={() => handleDelete(index)}
                  className="text-slate-400 hover:text-slate-600"
                  title="Delete Palette"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="flex space-x-2 mb-2">
                {palette.colors.slice(0, 5).map((color, colorIndex) => (
                  <div
                    key={colorIndex}
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: color }}
                    title={color}
                  ></div>
                ))}
              </div>
              <div className="text-xs text-slate-500 truncate">
                Fonts: {palette.fonts.slice(0, 3).join(', ')}
                {palette.fonts.length > 3 && '...'}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SavedPalettes;