import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const ChartView = ({ chartData }) => {
  const { x_field, y_field, labels, values } = chartData || {};

  if (!labels?.length || !values?.length) return null;

  const data = labels.map((label, i) => ({
    [x_field]: label,
    [y_field]: values[i],
  }));

  return (
    <div className="my-6">
      <h2 className="text-xl font-semibold mb-2">📊 {y_field} vs {x_field}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey={x_field} />
          <YAxis />
          <Tooltip />
          <Bar dataKey={y_field} fill="#4F46E5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartView;
