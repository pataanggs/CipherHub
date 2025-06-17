import React from "react";
import CopyButton from "./CopyButton";

function OutputEncrypt({ cipherText, display }) {
  if (!display) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Encrypted Text
        </h3>
        <CopyButton text={cipherText} />
      </div>
      <div className="relative">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-gray-800 dark:text-gray-200 break-words font-mono text-sm">
          {cipherText}
        </div>
        <div className="absolute top-2 right-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Encrypted
          </span>
        </div>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        The text has been encrypted using your selected cipher method.
      </div>
    </div>
  );
}

export default OutputEncrypt;