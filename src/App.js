import React, { useState, useEffect } from "react";
import UploadForm from "./components/UploadForm";
import CipherForm from "./components/CipherForm";
import OutputDecrypt from "./components/OutputDecrypt";
import OutputEncrypt from "./components/OutputEncrypt";
import ScrambleText from "./components/ScrambleText";
import CopyButton from "./components/CopyButton";
import {
  vigenereEncrypt,
  vigenereDecrypt,
  autokeyVigenereEncrypt,
  autokeyVigenereDecrypt,
  extendedVigenereEncrypt,
  extendedVigenereDecrypt,
  playfairDecrypt,
  playfairEncrypt,
  affineDecrypt,
  affineEncrypt,
  hillEncrypt,
  hillDecrypt,
  superDecrypt,
  superEncrypt,
  caesarEncrypt,
  caesarDecrypt,
  encodeRailFenceCipher,
  decodeRailFenceCipher,
  visualizeRailFenceCipher,
  atbashEncrypt,
  atbashDecrypt,
  morseEncode,
  morseDecode,
  rot13Encrypt,
  rot13Decrypt,
  baconianEncrypt,
  baconianDecrypt,
} from "./utils/ciphers";

function App() {
  const [plainText, setPlainText] = useState("");
  const [cipherText, setCipherText] = useState("");
  const [cipherType, setCipherType] = useState("vigenere");
  const [key, setKey] = useState("");
  const [a, setA] = useState(1);
  const [b, setB] = useState(0);
  const [hillKey, setHillKey] = useState([
    [1, 0],
    [0, 1],
  ]);
  const [railFenceKey, setRailFenceKey] = useState(2); // Default to 2 rails
  const [displayEncrypted, setDisplayEncrypted] = useState(false);
  const [displayDecrypted, setDisplayDecrypted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [vigenereKey, setVigenereKey] = useState("");
  const [transpositionKey, setTranspositionKey] = useState("");
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [railFencePattern, setRailFencePattern] = useState("");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const handleKeyChange = (type, value) => {
    if (type === "a") setA(value);
    if (type === "b") setB(value);
  };

  const handleHillKeyChange = (row, col, value) => {
    setHillKey((prev) => {
      const updatedKey = [...prev];
      updatedKey[row][col] = value;
      return updatedKey;
    });
  };

  const handleRailFenceKeyChange = (key) => {
    setRailFenceKey(key);
    console.log("Rail Fence Key:", key); // Optional: For debugging
  };

  const resetDisplay = () => {
    setDisplayEncrypted(false);
    setDisplayDecrypted(false);
  };

  const processCipher = (action) => {
    resetDisplay();
    setErrorMessage("");
    setRailFencePattern(""); // Clear any previous pattern

    try {
      const cipherFunctions = {
        vigenere: action === "encrypt" ? vigenereEncrypt : vigenereDecrypt,
        autokey: action === "encrypt" ? autokeyVigenereEncrypt : autokeyVigenereDecrypt,
        extended: action === "encrypt" ? extendedVigenereEncrypt : extendedVigenereDecrypt,
        playfair: action === "encrypt" ? playfairEncrypt : playfairDecrypt,
        affine: action === "encrypt" ? affineEncrypt : affineDecrypt,
        hill: action === "encrypt" ? hillEncrypt : hillDecrypt,
        super: action === "encrypt" ? superEncrypt : superDecrypt,
        caesar: action === "encrypt" ? caesarEncrypt : caesarDecrypt,
        railfence: action === "encrypt" ? encodeRailFenceCipher : decodeRailFenceCipher,
        atbash: action === "encrypt" ? atbashEncrypt : atbashDecrypt,
        morse: action === "encrypt" ? morseEncode : morseDecode,
        rot13: action === "encrypt" ? rot13Encrypt : rot13Decrypt,
        baconian: action === "encrypt" ? baconianEncrypt : baconianDecrypt,
      };

      const text = action === "encrypt" ? plainText : cipherText;
      const result =
        cipherType === "affine"
          ? cipherFunctions[cipherType](text, a, b)
          : cipherType === "hill"
          ? cipherFunctions[cipherType](text, hillKey)
          : cipherType === "super"
          ? cipherFunctions[cipherType](text, vigenereKey, transpositionKey)
          : cipherType === "caesar"
          ? cipherFunctions[cipherType](text, parseInt(key))
          : cipherType === "railfence"
          ? cipherFunctions[cipherType](text, railFenceKey) // Use railFenceKey instead of parseInt(key)
          : cipherFunctions[cipherType](text, key);

      // Generate Rail Fence visualization if applicable
      if (cipherType === "railfence" && action === "encrypt") {
        const pattern = visualizeRailFenceCipher(plainText, railFenceKey);
        setRailFencePattern(pattern);
      }

      if (action === "encrypt") {
        setCipherText(result);
        setDisplayEncrypted(true);
      } else {
        setPlainText(result);
        setDisplayDecrypted(true);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Navigation Bar */}
      <nav className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1
                onClick={() => window.location.reload()}
                className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight cursor-pointer transition-all duration-200"
              >
                <ScrambleText 
                  text="CipherHub"
                  className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 hover:from-indigo-500 hover:to-purple-500"
                />
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {theme === "light" ? "🌙 Dark" : "☀️ Light"}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Input */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Input Text</h2>
              <UploadForm
                onUpload={setPlainText}
                onTextChange={(text) => {
                  setPlainText(text);
                  resetDisplay();
                }}
              />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Cipher Settings</h2>
              <CipherForm
                onCipherChange={(cipher) => {
                  setCipherType(cipher);
                  resetDisplay();
                }}
                onKeyChange={(key) => {
                  setKey(key);
                  resetDisplay();
                }}
                onVigenereKeyChange={(key) => {
                  setVigenereKey(key);
                  resetDisplay();
                }}
                onTranspositionKeyChange={(key) => {
                  setTranspositionKey(key);
                  resetDisplay();
                }}
                onAffineKeyChange={(type, value) => {
                  handleKeyChange(type, value);
                  resetDisplay();
                }}
                onHillKeyChange={(row, col, value) => {
                  handleHillKeyChange(row, col, value);
                  resetDisplay();
                }}
                onRailFenceKeyChange={handleRailFenceKeyChange}
                onAction={processCipher}
              />
            </div>
          </div>

          {/* Right Column - Output */}
          <div className="space-y-6">
            {cipherType !== "railfence" && (
              <>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300">
                  <OutputEncrypt cipherText={cipherText} display={displayEncrypted} />
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300">
                  <OutputDecrypt plainText={plainText} display={displayDecrypted} />
                </div>
              </>
            )}

            {railFencePattern && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Rail Fence Pattern:</h3>
                  <CopyButton text={railFencePattern} />
                </div>
                <pre className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg overflow-auto text-gray-800 dark:text-gray-100 font-mono">
                  {railFencePattern}
                </pre>
              </div>
            )}

            {cipherType === "railfence" && (displayEncrypted || displayDecrypted) && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                    {displayEncrypted ? "Encrypted Text:" : "Decrypted Text:"}
                  </h3>
                  <CopyButton text={displayEncrypted ? cipherText : plainText} />
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-gray-800 dark:text-gray-100 break-words">
                  {displayEncrypted ? cipherText : plainText}
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="bg-red-50 dark:bg-red-900/30 rounded-xl p-4 shadow-lg">
                <p className="text-red-600 dark:text-red-400 text-center font-medium">
                  {errorMessage}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-950 text-gray-200 dark:text-gray-300 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <p className="text-sm">
              Created by{" "}
              <a
                href="https://github.com/pataanggs"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
              >
                Pataangg
              </a>
            </p>
            <p className="text-xs text-gray-400">
              A modern cipher encryption/decryption tool
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;