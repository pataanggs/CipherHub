import React from "react";
import CopyButton from "./CopyButton";

function OutputDecrypt({ plainText, display }) {
  if (!display) return null; // Don't render if display is false

  return (
    <div className="mt-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 transition-all duration-300 hover:shadow-xl">
      <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 tracking-tight text-center">
        Hasil Dekripsi:
      </h3>
      <div className="relative">
        <textarea
          readOnly
          value={plainText || ""}
          placeholder="Hasil dekripsi akan muncul di sini"
          className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200 resize-none min-h-[120px]"
        />
        {plainText && (
          <div className="absolute top-3 right-3">
            <CopyButton text={plainText} />
          </div>
        )}
      </div>
    </div>
  );
}

export default OutputDecrypt;