import React, { useState } from "react";

const CIPHER_DESCRIPTIONS = {
  vigenere: "A polyalphabetic substitution cipher using a keyword",
  autokey: "A Vigenere variant that uses the plaintext as part of the key",
  extended: "Extended Vigenere that can handle any character using Base64",
  playfair: "A digraphic substitution cipher using a 5x5 matrix",
  affine: "A monoalphabetic substitution cipher using a mathematical function",
  hill: "A polygraphic substitution cipher using matrix multiplication",
  super: "Combines Vigenere and Transposition ciphers with Base64 encoding",
  caesar: "A simple shift cipher that moves each letter by a fixed number",
  railfence: "A transposition cipher that writes text in a zigzag pattern",
  atbash: "A simple substitution cipher that reverses the alphabet",
  morse: "Converts text to Morse code using dots and dashes",
  rot13: "A simple letter rotation cipher that shifts by 13 positions",
  baconian: "A binary encoding method using two different typefaces"
};

function CipherForm({
  onCipherChange,
  onKeyChange,
  onAffineKeyChange,
  onHillKeyChange,
  onAction,
  onVigenereKeyChange,
  onTranspositionKeyChange,
  onRailFenceKeyChange,
}) {
  const [isAffine, setIsAffine] = useState(false);
  const [isHill, setIsHill] = useState(false);
  const [isSuper, setIsSuper] = useState(false);
  const [isCaesar, setIsCaesar] = useState(false);
  const [isRailFence, setIsRailFence] = useState(false);
  const [selectedCipher, setSelectedCipher] = useState("vigenere");
  const [showDescription, setShowDescription] = useState(false);
  
  // Define ciphers that don't need keys
  const noKeyRequired = ["atbash", "rot13"];

  const handleCipherChange = (e) => {
    const cipher = e.target.value;
    setSelectedCipher(cipher);
    setIsAffine(cipher === "affine");
    setIsHill(cipher === "hill");
    setIsSuper(cipher === "super");
    setIsCaesar(cipher === "caesar");
    setIsRailFence(cipher === "railfence");
    onCipherChange(cipher);
  };

  const needsKeyInput = () => {
    return !isAffine && !isHill && !isSuper && !isRailFence && !noKeyRequired.includes(selectedCipher);
  };

  return (
    <div className="space-y-6">
      {/* Cipher Selection */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Cipher Type
        </label>
        <div className="relative">
          <select
            onChange={handleCipherChange}
            onMouseEnter={() => setShowDescription(true)}
            onMouseLeave={() => setShowDescription(false)}
            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
          >
            <option value="vigenere">Vigenere Cipher (Standard)</option>
            <option value="autokey">Vigenere Cipher (Autokey)</option>
            <option value="extended">Extended Vigenere Cipher</option>
            <option value="playfair">Playfair Cipher</option>
            <option value="affine">Affine Cipher</option>
            <option value="hill">Hill Cipher</option>
            <option value="super">Super Encryption</option>
            <option value="caesar">Caesar Cipher</option>
            <option value="railfence">Rail Fence Cipher</option>
            <option value="atbash">Atbash Cipher</option>
            <option value="morse">Morse Code</option>
            <option value="rot13">ROT13 Cipher</option>
            <option value="baconian">Baconian Cipher</option>
          </select>
          {showDescription && (
            <div className="absolute z-10 mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300">
              {CIPHER_DESCRIPTIONS[selectedCipher]}
            </div>
          )}
        </div>
      </div>

      {/* Key Inputs */}
      <div className="space-y-4">
        {isSuper && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Vigenere Key
              </label>
              <input
                type="text"
                placeholder="Enter Vigenere key"
                onChange={(e) => onVigenereKeyChange(e.target.value)}
                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Transposition Key
              </label>
              <input
                type="text"
                placeholder="Enter Transposition key"
                onChange={(e) => onTranspositionKeyChange(e.target.value)}
                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        )}

        {needsKeyInput() && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {isCaesar ? "Shift Value" : "Key"}
            </label>
            <input
              type="text"
              placeholder={isCaesar ? "Enter shift value (e.g., 3)" : "Enter key"}
              onChange={(e) => onKeyChange(e.target.value)}
              className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200 animate-fade-in"
            />
          </div>
        )}

        {isAffine && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Value a (must be coprime with 26)
              </label>
              <input
                type="number"
                placeholder="Enter value a"
                onChange={(e) => onAffineKeyChange("a", parseInt(e.target.value))}
                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Value b
              </label>
              <input
                type="number"
                placeholder="Enter value b"
                onChange={(e) => onAffineKeyChange("b", parseInt(e.target.value))}
                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        )}

        {isHill && (
          <div className="space-y-4 animate-fade-in">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              2x2 Key Matrix
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="[0][0]"
                onChange={(e) => onHillKeyChange(0, 0, parseInt(e.target.value))}
                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
              />
              <input
                type="number"
                placeholder="[0][1]"
                onChange={(e) => onHillKeyChange(0, 1, parseInt(e.target.value))}
                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
              />
              <input
                type="number"
                placeholder="[1][0]"
                onChange={(e) => onHillKeyChange(1, 0, parseInt(e.target.value))}
                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
              />
              <input
                type="number"
                placeholder="[1][1]"
                onChange={(e) => onHillKeyChange(1, 1, parseInt(e.target.value))}
                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        )}

        {isRailFence && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Number of Rails
            </label>
            <input
              type="number"
              placeholder="Enter number of rails"
              onChange={(e) => onRailFenceKeyChange(parseInt(e.target.value))}
              className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200 animate-fade-in"
            />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4 pt-4">
        <button
          onClick={() => onAction("encrypt")}
          className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-500 dark:to-purple-700 text-white rounded-lg font-medium hover:from-purple-700 hover:to-purple-900 dark:hover:from-purple-600 dark:hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 transform hover:scale-105"
        >
          Encrypt
        </button>
        <button
          onClick={() => onAction("decrypt")}
          className="flex-1 py-3 px-6 bg-gradient-to-r from-green-600 to-green-800 dark:from-green-500 dark:to-green-700 text-white rounded-lg font-medium hover:from-green-700 hover:to-green-900 dark:hover:from-green-600 dark:hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 transform hover:scale-105"
        >
          Decrypt
        </button>
      </div>
    </div>
  );
}

export default CipherForm;