import React from "react";

function UploadForm({ onUpload, onTextChange }) {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      onUpload(reader.result);
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 space-y-6 transition-all duration-300 hover:shadow-xl">
      <input
        type="file"
        onChange={handleFileUpload}
        className="block w-full text-sm text-gray-700 dark:text-gray-300
                   file:mr-4 file:py-2 file:px-6
                   file:rounded-lg file:border-0
                   file:text-sm file:font-medium
                   file:bg-gradient-to-r file:from-indigo-500 file:to-indigo-600
                   file:text-white
                   hover:file:from-indigo-600 hover:file:to-indigo-700
                   transition-all duration-200"
      />
      <textarea
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="Ketik pesan di sini..."
        className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200 resize-y min-h-[100px]"
      ></textarea>
    </div>
  );
}

export default UploadForm;