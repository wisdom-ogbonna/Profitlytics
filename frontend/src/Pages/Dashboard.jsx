import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaBars, FaSearch, FaTimes } from "react-icons/fa";

const Dashboard = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const searchInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const colorClasses = {
  red: "bg-red-500",
  green: "bg-green-500",
  blue: "bg-blue-500",
  yellow: "bg-yellow-500",
};


  // Focus shortcut for desktop
  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  
  // file selection handler
  const handleFileChange = (e) => {
    if (!e.target.files.length) return;
    const file = e.target.files[0];

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setFileError("Error: Only .csv files are accepted.");
      setSelectedFile(null);
    } else {
      setFileError("");
      setSelectedFile(file);
    }
  };

  // file upload button
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // analyze action
  const handleAnalyze = () => {
    if (!selectedFile) {
      alert("Please upload a file first.");
      return;
    }
    alert(`Analyzing ${selectedFile.name}...`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 p-6 text-gray-800 relative">

      {/* Search Modal for Mobile */}
      {isSearchModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          aria-modal="true"
          role="dialog"
        >
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-sm shadow-lg relative">
            <button
              onClick={() => setIsSearchModalOpen(false)}
              aria-label="Close Search"
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
            <h2 className="text-lg font-bold mb-4">Search</h2>
            <input
              ref={searchInputRef}
              type="search"
              placeholder="Search here..."
              className="w-full border border-black rounded-3xl px-3 py-2 focus:outline-none focus:ring"
              aria-label="Search input"
            />
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside
        className={`bg-blue-950 text-white fixed w-64 h-full top-0 left-0 p-6 z-40 transform ${
          openMenu ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out shadow-xl`}
        aria-label="Sidebar Navigation"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold">PROFITLYTICS</h2>
          <button
            className="text-white hover:text-gray-400"
            onClick={() => setOpenMenu(false)}
            aria-label="Close Sidebar"
          >
            ✕
          </button>
        </div>
        <div className="mt-14 flex flex-col space-y-5 text-xl text-left">
            <p className="hover:bg-blue-900 py-2 px-1 rounded-lg"><Link to="/dashboard">Dashboard</Link></p>
            <p className="hover:bg-blue-900 py-2 px-1 rounded-lg"><Link to="/data-cleaning">Data Cleaning</Link></p>
            <p className="hover:bg-blue-900 py-2 px-1 rounded-lg"><Link to="/ai-analytics">Data Analytics</Link></p>
            <p className="hover:bg-blue-900 py-2 px-1 rounded-lg"><Link to="/cv-creation">CV Creation</Link></p>
            <p className="hover:bg-blue-900 py-2 px-1 rounded-lg"><Link to="/job-finder">Job Finder</Link></p>
          </div>
      </aside>

      {/* Header */}
      <header className="flex justify-between items-center w-full mb-6">
        <div className="flex items-center space-x-4">
          <button
            className="text-xl hover:scale-110"
            onClick={() => setOpenMenu(!openMenu)}
            aria-label="Open Menu"
          >
            <FaBars />
          </button>
          <img
            src="/bytemark-primary-bg.jpg"
            alt="Bytemark Logo"
            className="h-10 rounded-xl select-none"
          />
          <h1 className="text-xl md:text-2xl font-bold">PROFITLYTICS</h1>
        </div>

        {/* Desktop search */}
        <div className="hidden md:flex items-center space-x-3">
          <input
            ref={searchInputRef}
            type="search"
            placeholder="Search (Ctrl/Cmd + K)"
            className="px-3 py-1 w-48 rounded-3xl border border-black"
            aria-label="Search"
          />
          <button
            className="p-2 border rounded-full hover:scale-110"
            aria-label="User Profile"
          >
            <FaUser />
          </button>
        </div>

        {/* Mobile search */}
        <div className="flex md:hidden items-center space-x-3">
          <button
            className="p-2 border rounded-full hover:scale-110"
            aria-label="Open Search"
            onClick={() => setIsSearchModalOpen(true)}
          >
            <FaSearch />
          </button>
          <button
            className="p-2 border rounded-full hover:scale-110"
            aria-label="User Profile"
          >
            <FaUser />
          </button>
        </div>
      </header>

      {/* Upload + Analyze */}
      <div className="flex flex-col md:flex-row items-center mb-7 space-y-3 md:space-y-0 md:space-x-4 w-full max-w-xl mx-auto">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
          aria-hidden="true"
        />
        <button
          onClick={handleUploadClick}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring w-full md:w-auto"
        >
          {selectedFile ? "Change File" : "Upload File"}
        </button>
        {selectedFile && (
          <div className="flex-1 truncate text-sm text-gray-700 text-center md:text-left">
            {selectedFile.name}
          </div>
        )}
        <button
          onClick={handleAnalyze}
          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring w-full md:w-auto"
        >
          Analyze
        </button>
        {fileError && (
          <div className="w-full text-center mt-2 text-red-600 text-sm">
            {fileError}
          </div>
        )}
      </div>

      {/* Overview Cards */}
      <section aria-labelledby="overview-heading" className="mb-6">
        <h2 id="overview-heading" className="text-xl font-bold mb-5">Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: "Total Records", value: "222,360", color: "red" },
            { title: "Unique Users", value: "12,360", color: "green" },
            { title: "Average Value", value: "$12M", color: "blue" },
            { title: "Anomalies", value: "17", color: "yellow" },
          ].map((card, i) => (
            <div
              key={i}
              className={`bg-${card.color}-500 p-4 text-white rounded-lg shadow flex flex-col justify-center`}
            >
              <h3 className="text-lg font-semibold">{card.title}</h3>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Charts Section */}
      <section aria-labelledby="charts-heading" className="mb-10">
        <h2 id="charts-heading" className="text-2xl font-semibold mb-5">VIsualization</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["Line Graph", "Bar Graph", "Pie Chart"].map((label, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow h-40 flex items-center justify-center">
              <span className="text-gray-600">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* History Section */}
      <section aria-labelledby="history-heading">
        <h2 id="history-heading" className="text-2xl font-bold mb-4">AI INSIGHT</h2>
        <ul className="grid gap-2 text-sm">
          <li className="grid grid-cols-2 font-semibold bg-gray-200 p-2 rounded">
            <span className="ml-4 text-left font-bold text-lg">Title</span>
            <span className="text-right mr-9 font-bold text-lg">Date</span>
          </li>
          {[
            { title: "Rate of Malaria In Nigeria", date: "23-04-2025" },
            { title: "Rate of Malaria In USA", date: "24-04-2025" },
            { title: "Rate of Malaria In UK", date: "25-04-2025" },
            { title: "Rate of Malaria In France", date: "26-04-2025" },
            { title: "Rate of Malaria In China", date: "27-04-2025" },
            { title: "Rate of Malaria In Russia", date: "28-04-2025" },
          ].map((item, i) => (
            <li
              key={i}
              className={`p-2 rounded grid grid-cols-2 ${i % 2 === 0 ? "bg-gray-300" : "bg-gray-400"}`}
            >
              <Link className="ml-4 text-left">{item.title}</Link>
              <span className="text-right mr-4">{item.date}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Footer */}
      <footer className="mt-10 text-sm text-gray-500 text-center">
        <div className="mb-1">Health | Sports | Finance | Trades | Analysis | Utilities</div>
        <div className="mb-1">Aug-2023 | 2024 | 2025 | Variance</div>
        <div>&copy; BYTEMARK PROFITLYTICS. All Rights Reserved</div>
      </footer>
    </div>
  );
};

export default Dashboard;
