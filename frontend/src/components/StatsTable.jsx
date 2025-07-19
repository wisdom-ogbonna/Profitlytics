const StatsTable = ({ stats }) => {
  if (!stats || Object.keys(stats).length === 0) return null;

  return (
    <div className="my-6">
      <h2 className="text-xl font-semibold mb-2">📈 Column Statistics</h2>
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2">Column</th>
            <th className="border px-4 py-2">Count</th>
            <th className="border px-4 py-2">Mean</th>
            <th className="border px-4 py-2">Min</th>
            <th className="border px-4 py-2">Max</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(stats).map(([col, stat]) => (
            <tr key={col}>
              <td className="border px-4 py-2">{col}</td>
              <td className="border px-4 py-2">{stat.count}</td>
              <td className="border px-4 py-2">{stat.mean}</td>
              <td className="border px-4 py-2">{stat.min}</td>
              <td className="border px-4 py-2">{stat.max}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StatsTable;