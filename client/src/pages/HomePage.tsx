import React from 'react';
import { Link } from 'wouter';

const HomePage: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-2xl font-bold text-blue-700 mb-2">BlockFinaX Platform</h1>
        <p className="text-gray-600">Blockchain-powered trade finance platform</p>
      </div>
      
      {/* TRANSLATION SECTION */}
      <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-blue-700 mb-4">✓ Translation Demo</h2>
        <div className="p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Translation Features</h3>
          <ul className="list-disc pl-5 mb-6 space-y-1">
            <li>Dynamic content translation with OpenAI API</li>
            <li>Support for 6 languages: English, Spanish, Chinese, French, Arabic, Russian</li>
            <li>Smart caching to reduce API calls</li>
            <li>Local dictionary fallback for common phrases</li>
          </ul>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <span className="px-3 py-1 border border-gray-300 rounded">🇺🇸 English</span>
            <span className="px-3 py-1 border border-gray-300 rounded">🇪🇸 Español</span>
            <span className="px-3 py-1 border border-gray-300 rounded">🇨🇳 中文</span>
            <span className="px-3 py-1 border border-gray-300 rounded">🇫🇷 Français</span>
            <span className="px-3 py-1 border border-gray-300 rounded">🇸🇦 العربية</span>
            <span className="px-3 py-1 border border-gray-300 rounded">🇷🇺 Русский</span>
          </div>
          <div className="text-center text-sm text-gray-600 border-t border-blue-100 pt-4 mt-4">
            <p>Switch languages using the language selector in the header (globe icon)</p>
          </div>
        </div>
      </div>
      
      {/* LOGISTICS SECTION */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-blue-700 mb-4">✓ Logistics Management</h2>
        <div className="p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Logistics Features</h3>
          <ul className="list-disc pl-5 mb-6 space-y-1">
            <li>Real-time shipment tracking with interactive dashboards</li>
            <li>Integration with major logistics providers</li>
            <li>Automated documentation and customs preparation</li>
            <li>Risk assessment for shipping routes and delays</li>
          </ul>
          <div className="flex justify-center">
            <Link href="/logistics">
              <div className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">
                Open Logistics Dashboard
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
