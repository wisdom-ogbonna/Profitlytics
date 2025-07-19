const DataPreview = ({ preview }) => {
  if (!preview?.length) return null;

  const columns = Object.keys(preview[0]);

  return (
    <div className="overflow-x-auto my-6">
      <h2 className="text-xl font-semibold mb-2">📊 Data Preview</h2>
      <table className="table-auto border-collapse w-full">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col} className="border px-4 py-2 bg-gray-100">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {preview.map((row, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td key={col} className="border px-4 py-2">{row[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataPreview;