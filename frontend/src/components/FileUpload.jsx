import React, { useState } from 'react';

const UploadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="inline-block w-5 h-5 mr-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
  </svg>
);

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
    <form onSubmit={handleSubmit} className="p-4 border grid grid-cols-2 items-center rounded shadow-sm bg-white w-full max-w-md mx-auto mt-4">
      <label className="flex items-center cursor-pointer">
        <div>
          <UploadIcon />
          <input
            type="file"
            accept=".csv,.xls,.xlsx"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />
          <span className="ml-2">{file ? file.name : "Upload a file"}</span>
        </div>
      </label>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center">
        Analyze File
      </button>
    </form>
  );
};

export default FileUpload;