import React, { useState } from 'react';
import {
  BarChart, Bar,
  LineChart, Line,
  ScatterChart, Scatter,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#4F46E5', '#6366F1', '#818CF8', '#A5B4FC', '#C7D2FE', '#E0E7FF'];

const ChartTypeSelector = ({ chartType, setChartType }) => {
  const types = ['bar', 'line', 'scatter', 'pie'];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {types.map(type => (
        <button
          key={type}
          onClick={() => setChartType(type)}
          className={`px-4 py-2 rounded-full transition font-medium border shadow-sm ${
            chartType === type
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
          }`}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </button>
      ))}
    </div>
  );
};

const ChartCard = ({ chart, chartType }) => {
  const { x_field, y_field, data } = chart;
  if (!data?.length) return null;

  const pieData = data.map((d) => ({
    name: d.x,
    value: d.y,
  }));

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <LineChart data={data}>
            <XAxis dataKey="x" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="y"
              stroke="#4F46E5"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        );
      case 'scatter':
        return (
          <ScatterChart>
            <XAxis dataKey="x" />
            <YAxis dataKey="y" />
            <Tooltip />
            <Scatter data={data} fill="#4F46E5" />
          </ScatterChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Tooltip />
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              label
            >
              {pieData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        );
      default:
        return (
          <BarChart data={data}>
            <XAxis dataKey="x" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="y" fill="#4F46E5" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 transition hover:shadow-xl mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        {chartType === 'pie'
          ? `${y_field} distribution by ${x_field}`
          : `${y_field} vs ${x_field}`}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

const ChartView = ({ charts }) => {
  const [chartType, setChartType] = useState('bar');

  if (!charts?.length) return null;

  return (
    <section className="my-10">
      <h2 className="text-3xl font-bold text-indigo-700 mb-2">📊 Visual Insights</h2>
      <p className="text-gray-500 mb-6">Switch between chart types to explore different perspectives.</p>
      <ChartTypeSelector chartType={chartType} setChartType={setChartType} />

      <div className="grid gap-6 lg:grid-cols-2">
        {charts.map((chart, idx) => (
          <ChartCard key={idx} chart={chart} chartType={chartType} />
        ))}
      </div>
    </section>
  );
};

export default ChartView;
