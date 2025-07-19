const AIInsights = ({ ai_analysis }) => {
  if (!ai_analysis) return null;

  const fields = [
    "summary",
    "issues",
    "trends",
    "insights",
    "recommendations",
    "additional_data_needed"
  ];

  return (
    <div className="my-6 space-y-4">
      <h2 className="text-xl font-semibold">🤖 AI-Powered Insights</h2>
      {fields.map((field) => (
        <div key={field}>
          <h3 className="font-medium capitalize">{field.replace(/_/g, ' ')}</h3>
          <p className="bg-gray-50 p-3 rounded border">{ai_analysis[field]}</p>
        </div>
      ))}
    </div>
  );
};

export default AIInsights;