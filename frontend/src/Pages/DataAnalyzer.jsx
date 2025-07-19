import { useState } from 'react';
import { Link } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import DataPreview from '../components/DataPreview';
import StatsTable from '../components/StatsTable';
import ChartView from '../components/ChartView';
import AIInsights from '../components/AIInsights';

const DataAnalyzer = () => {
  const [result, setResult] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`bg-blue-950 text-white fixed w-64 h-full top-0 left-0 p-6 z-40 transform ${
          openMenu ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } transition-transform duration-300 ease-in-out shadow-xl`}
        aria-label="Sidebar Navigation"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold">PROFITLYTICS</h2>
          <button
            className="md:hidden text-white hover:text-gray-400"
            onClick={() => setOpenMenu(false)}
            aria-label="Close Sidebar"
          >
            ✕
          </button>
        </div>
        <nav className="mt-14 flex flex-col space-y-5 text-xl text-left">
          <Link className="hover:bg-blue-900 py-2 px-3 rounded-lg" to="/dashboard">Dashboard</Link>
          <Link className="hover:bg-blue-900 py-2 px-3 rounded-lg" to="/data-cleaning">Data Cleaning</Link>
          <Link className="hover:bg-blue-900 py-2 px-3 rounded-lg" to="/ai-analytics">Data Analytics</Link>
          <Link className="hover:bg-blue-900 py-2 px-3 rounded-lg" to="/cv-creation">CV Creation</Link>
          <Link className="hover:bg-blue-900 py-2 px-3 rounded-lg" to="/job-finder">Job Finder</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Mobile menu button */}
        <button
          className="md:hidden absolute top-4 left-4 text-black p-2 rounded-lg font-bold text-2xl"
          onClick={() => setOpenMenu(true)}
          aria-label="Open Sidebar"
        >
          ☰
        </button>

        <main className="max-w-5xl mx-auto px-4 py-10 w-full">
          <h1 className="text-4xl font-bold text-indigo-600 mb-6">📊 AI Data Analyzer</h1>

          <div className="bg-white shadow-md rounded-xl text-center p-6 border border-gray-200">
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
        </main>
      </div>
    </div>
  );
};

export default DataAnalyzer;
