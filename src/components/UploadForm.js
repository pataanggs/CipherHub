import React, { useState } from "react";

function UploadForm({ onUpload, onTextChange }) {
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      onUpload(reader.result);
      setFileName(file.name);
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('text/')) {
      handleFileUpload(file);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="space-y-4">
      {/* File Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 transition-all duration-200 cursor-pointer
          ${isDragging 
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500'
          }`}
      >
        <input
          type="file"
          onChange={handleFileInput}
          accept=".txt,.md,.json,.csv"
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {isDragging
                ? "Drop the file here..."
                : "Drag and drop a file here, or click to select"}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
              Supported formats: TXT, MD, JSON, CSV
            </p>
            {fileName && (
              <p className="mt-2 text-sm text-indigo-600 dark:text-indigo-400">
                Selected file: {fileName}
              </p>
            )}
          </div>
        </label>
      </div>

      {/* Text Input Area */}
      <div className="relative">
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Or type your message here
        </label>
        <textarea
          id="message"
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Type your message here..."
          className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200 resize-y min-h-[150px]"
        />
        <div className="absolute bottom-3 right-3 text-xs text-gray-400 dark:text-gray-500">
          Press Enter for new line
        </div>
      </div>
    </div>
  );
}

export default UploadForm;