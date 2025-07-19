import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import DataPreview from '../components/DataPreview';
import StatsTable from '../components/StatsTable';
import ChartView from '../components/ChartView';
import AIInsights from '../components/AIInsights';

const DataAnalyzer = () => {
  const [result, setResult] = useState(null);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-indigo-600 mb-6">📊 AI Data Analyzer</h1>

      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
        <FileUpload onUpload={setResult} />
      </div>

      {result && (
        <div className="mt-8 space-y-8">
          <DataPreview preview={result.preview} />
          <StatsTable stats={result.stats} />
          <ChartView charts={result.charts} />
          <AIInsights ai_analysis={result.ai_analysis} />
        </div>
      )}
    </div>
  );
};

export default DataAnalyzer;
