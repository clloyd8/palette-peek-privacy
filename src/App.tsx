import React, { useState, useEffect } from 'react';
import { Palette, Type, Info } from 'lucide-react';
import ColorPalette from './components/ColorPalette';
import FontList from './components/FontList';
import RetroHeader from './components/PixelatedHeader';
import ExportPanel from './components/ExportPanel';

interface WebsiteData {
  colors: string[];
  fonts: string[];
  url: string;
}

// Mock data for development
const mockData: WebsiteData = {
  colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FED766', '#2AB7CA', '#F0B67F', '#FE4A49'],
  fonts: ['Arial', 'Helvetica', 'Roboto', 'Open Sans'],
  url: 'https://example.com'
};

function App() {
  const [websiteData, setWebsiteData] = useState<WebsiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // Check if we're in development mode (Chrome API not available)
    if (typeof chrome === 'undefined' || !chrome.tabs) {
      setWebsiteData(mockData);
      setLoading(false);
      return;
    }

    // We're in the actual extension environment
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab.id && activeTab.url) {
        chrome.tabs.sendMessage(activeTab.id, { action: "extractInfo" }, (response) => {
          if (chrome.runtime.lastError) {
            setError('Error communicating with the page. Please refresh and try again.');
            setLoading(false);
          } else if (response) {
            setWebsiteData({
              colors: response.colors,
              fonts: response.fonts,
              url: activeTab.url
            });
            setLoading(false);
          }
        });
      }
    });
  }, []);

  if (loading) {
    return <div className="w-96 h-64 flex items-center justify-center bg-gradient-to-r from-slate-800 to-slate-700 text-white">Loading...</div>;
  }

  if (error) {
    return <div className="w-96 h-64 flex items-center justify-center bg-gradient-to-r from-slate-800 to-slate-700 text-white">{error}</div>;
  }

  return (
    <div className="w-96 bg-slate-100 text-slate-800">
      <RetroHeader />
      <div className="p-4 space-y-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold flex items-center text-slate-700 mb-2">
            <Palette className="mr-2" /> Color Palette
          </h2>
          <p className="text-xs text-slate-500 mb-3">Click to copy a color.</p>
          <ColorPalette colors={websiteData?.colors || []} />
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold flex items-center text-slate-700 mb-2">
            <Type className="mr-2" /> Fonts Used
          </h2>
          <p className="text-xs text-slate-500 mb-3">Click to copy the font name</p>
          <FontList fonts={websiteData?.fonts || []} />
        </div>
        <ExportPanel colors={websiteData?.colors || []} fonts={websiteData?.fonts || []} />
        <div className="mt-4">
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
          >
            <Info size={16} className="mr-1" />
            {showInstructions ? 'Hide' : 'Show'} Import Instructions
          </button>
          {showInstructions && (
            <div className="mt-2 text-sm text-slate-600">
              <h3 className="font-semibold">Canva:</h3>
              <ol className="list-decimal list-inside">
                <li>Open your Canva project</li>
                <li>Click on the "Brand Kit" tab</li>
                <li>In "Brand colors", click "+" to add new colors</li>
                <li>Paste each color code from the exported file</li>
                <li>For fonts, go to "Text" and click "Upload font"</li>
              </ol>
              <h3 className="font-semibold mt-2">Figma:</h3>
              <ol className="list-decimal list-inside">
                <li>Open your Figma project</li>
                <li>Go to the "Assets" panel</li>
                <li>Click "+" next to "Colors" to add new colors</li>
                <li>Paste each color code from the exported file</li>
                <li>For fonts, go to "Text" properties and add custom fonts</li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;