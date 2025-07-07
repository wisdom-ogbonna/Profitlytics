import React, { useState, useRef } from "react";
import axios from "axios";
import { FaUpload, FaChartBar, FaRobot } from "react-icons/fa";


import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const ChartSection = ({ chartData }) => {
  const { x_field, y_field, labels, values } = chartData;

  // Format data for Recharts
  const formattedData = labels.map((label, index) => ({
    [x_field]: label,
    [y_field]: values[index],
  }));

  return (
    <section className="mt-6">
      <h2 className="text-xl font-semibold text-blue-700 mb-4">📈 Chart</h2>
      <div className="w-full h-64 bg-white shadow-md p-4 rounded-lg">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData}>
            <CartesianGrid stroke="#e0e0e0" strokeDasharray="3 3" />
            <XAxis dataKey={x_field} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey={y_field}
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

const DataAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setAnalysis(null);
    setError("");
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!file) return setError("Please select a file.");

    const formData = new FormData();
    formData.append("excel_file", file);

    setLoading(true);
    setError("");
    setAnalysis(null);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/analyze",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setAnalysis(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to analyze file.");
    } finally {
      setLoading(false);
    }
  };

  const renderTable = (rows) => {
    if (!Array.isArray(rows) || rows.length === 0)
      return <p className="text-sm">No data available.</p>;

    const columns = Object.keys(rows[0]);
    return (
      <div className="overflow-auto">
        <table className="min-w-full text-sm text-left border border-gray-300 rounded">
          <thead className="bg-blue-100">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="p-2 border border-gray-300 font-semibold"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                {columns.map((col, idx) => (
                  <td key={idx} className="p-2 border border-gray-200">
                    {row[col]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderJSONBlock = (data) => (
    <div className="bg-gray-50 border border-gray-200 p-4 rounded shadow text-xs text-gray-700 overflow-auto whitespace-pre-wrap">
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );

  return (
    <div className="min-h-screen p-6 bg-gray-100 text-gray-800">
      <div className="max-w-6xl mx-auto bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-800">
          📊 Excel Data Analyzer
        </h1>

        {/* File Upload Section */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={handleUploadClick}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <FaUpload /> {file ? "Change File" : "Upload File"}
          </button>

          {file && (
            <span className="text-sm text-gray-700 truncate max-w-xs">
              {file.name}
            </span>
          )}

          <button
            onClick={handleUpload}
            disabled={loading}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        {/* Results Section */}
        {analysis && (
          <div className="space-y-8">
            {/* Column Headers */}
            <section>
              <h2 className="text-xl font-semibold text-blue-700 mb-2">
                🧾 Column Headers
              </h2>
              <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-sm bg-gray-50 p-4 rounded shadow">
                {analysis.columns.map((col, i) => (
                  <li
                    key={i}
                    className="bg-white px-2 py-1 rounded border text-gray-700 text-center"
                  >
                    {col}
                  </li>
                ))}
              </ul>
            </section>

            {/* Data Preview */}
            <section>
              <h2 className="text-xl font-semibold text-blue-700 mb-2">
                🔍 Data Preview
              </h2>
              {renderTable(analysis.preview)}
            </section>

            {/* Stats */}
            <section>
              <section>
                <h2 className="text-xl font-semibold text-blue-700 mb-4">
                  📊 Stats
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead>
                      <tr className="bg-blue-100 text-blue-800">
                        <th className="py-2 px-4 border-b">Year</th>
                        <th className="py-2 px-4 border-b">Count</th>
                        <th className="py-2 px-4 border-b">Mean</th>
                        <th className="py-2 px-4 border-b">Min</th>
                        <th className="py-2 px-4 border-b">Max</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(analysis.stats).map(([year, values]) => (
                        <tr key={year} className="hover:bg-blue-50">
                          <td className="py-2 px-4 border-b font-medium text-gray-700">
                            {year}
                          </td>
                          <td className="py-2 px-4 border-b text-center">
                            {values.count}
                          </td>
                          <td className="py-2 px-4 border-b text-center">
                            {Number(values.mean).toFixed(2)}
                          </td>
                          <td className="py-2 px-4 border-b text-center">
                            {values.min}
                          </td>
                          <td className="py-2 px-4 border-b text-center">
                            {values.max}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </section>

            {/* Chart Data */}
            <section>
              <h2 className="text-xl font-semibold text-blue-700 mb-2">
                📈 Chart Data
              </h2>
              <ChartSection chartData={analysis.chart_data} />
            </section>

            {/* AI Insight */}
            <section>
              <h2 className="text-xl font-semibold text-blue-700 mb-2 flex items-center gap-2">
                <FaRobot /> AI Insight
              </h2>
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded text-sm whitespace-pre-wrap shadow">
                {analysis.insight}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataAnalyzer;
