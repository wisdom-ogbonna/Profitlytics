import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import DataPreview from '../components/DataPreview';
import StatsTable from '../components/StatsTable';
import ChartView from '../components/ChartView';
import AIInsights from '../components/AIInsights';

const DataAnalyzer = () => {
  const [result, setResult] = useState(null);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">📁 AI Data Analyzer</h1>
      <FileUpload onUpload={setResult} />
      {result && (
        <>
          <DataPreview preview={result.preview} />
          <StatsTable stats={result.stats} />
          <ChartView chartData={result.chart_data} />
          <AIInsights ai_analysis={result.ai_analysis} />
        </>
      )}
    </div>
  );
};

export default DataAnalyzer;
