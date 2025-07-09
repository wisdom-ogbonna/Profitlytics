import React, { useState } from 'react';

const FileUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('excel_file', file);

    const response = await fetch('http://127.0.0.1:8000/api/analyze', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    onUpload(result);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-white w-full max-w-md mx-auto mt-4">
      <input type="file" accept=".csv,.xls,.xlsx" onChange={(e) => setFile(e.target.files[0])} className="mb-3" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Analyze File
      </button>
    </form>
  );
};

export default FileUpload;
