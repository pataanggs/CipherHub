import React, { useState } from "react";

function CipherForm({
  onCipherChange,
  onKeyChange,
  onAffineKeyChange,
  onHillKeyChange,
  onAction,
  onVigenereKeyChange,
  onTranspositionKeyChange,
}) {
  const [isAffine, setIsAffine] = useState(false);
  const [isHill, setIsHill] = useState(false);
  const [isSuper, setIsSuper] = useState(false);

  const handleCipherChange = (e) => {
    const selectedCipher = e.target.value;
    setIsAffine(selectedCipher === "affine");
    setIsHill(selectedCipher === "hill");
    setIsSuper(selectedCipher === "super");
    onCipherChange(selectedCipher);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 space-y-6 transition-all duration-300 hover:shadow-xl">
      <select
        onChange={handleCipherChange}
        className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
      >
        <option value="vigenere">Vigenere Cipher Standard</option>
        <option value="autokey">Vigenere Cipher Autokey</option>
        <option value="extended">Extended Vigenere Cipher (Base64)</option>
        <option value="playfair">Playfair Cipher</option>
        <option value="affine">Affine Cipher</option>
        <option value="hill">Hill Cipher</option>
        <option value="super">Super Enkripsi (Base64)</option>
      </select>

      {isSuper && (
        <div className="space-y-4 animate-fade-in">
          <input
            type="text"
            placeholder="Masukkan Vigenere Key"
            onChange={(e) => onVigenereKeyChange(e.target.value)}
            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
          />
          <input
            type="text"
            placeholder="Masukkan Transposition Key"
            onChange={(e) => onTranspositionKeyChange(e.target.value)}
            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
          />
        </div>
      )}

      {!isAffine && !isHill && !isSuper && (
        <input
          type="text"
          placeholder="Masukkan kunci"
          onChange={(e) => onKeyChange(e.target.value)}
          className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200 animate-fade-in"
        />
      )}

      {isAffine && (
        <div className="space-y-4 animate-fade-in">
          <input
            type="number"
            placeholder="Masukkan a (relatif prima dengan 26)"
            onChange={(e) => onAffineKeyChange("a", parseInt(e.target.value))}
            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
          />
          <input
            type="number"
            placeholder="Masukkan b"
            onChange={(e) => onAffineKeyChange("b", parseInt(e.target.value))}
            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
          />
        </div>
      )}

      {isHill && (
        <div className="grid grid-cols-2 gap-4 animate-fade-in">
          <input
            type="number"
            placeholder="Key matrix [0][0]"
            onChange={(e) => onHillKeyChange(0, 0, parseInt(e.target.value))}
            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
          />
          <input
            type="number"
            placeholder="Key matrix [0][1]"
            onChange={(e) => onHillKeyChange(0, 1, parseInt(e.target.value))}
            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
          />
          <input
            type="number"
            placeholder="Key matrix [1][0]"
            onChange={(e) => onHillKeyChange(1, 0, parseInt(e.target.value))}
            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
          />
          <input
            type="number"
            placeholder="Key matrix [1][1]"
            onChange={(e) => onHillKeyChange(1, 1, parseInt(e.target.value))}
            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
          />
        </div>
      )}

      <div className="flex space-x-4">
        <button
          onClick={() => onAction("encrypt")}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-500 dark:to-purple-700 text-white rounded-lg font-medium hover:from-purple-700 hover:to-purple-900 dark:hover:from-purple-600 dark:hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
        >
          Enkripsi
        </button>
        <button
          onClick={() => onAction("decrypt")}
          className="w-full py-3 bg-gradient-to-r from-green-600 to-green-800 dark:from-green-500 dark:to-green-700 text-white rounded-lg font-medium hover:from-green-700 hover:to-green-900 dark:hover:from-green-600 dark:hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
        >
          Dekripsi
        </button>
      </div>
    </div>
  );
}

export default CipherForm;