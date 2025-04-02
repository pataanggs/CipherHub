import React, { useState, useEffect } from "react";
import UploadForm from "./components/UploadForm";
import CipherForm from "./components/CipherForm";
import OutputDecrypt from "./components/OutputDecrypt";
import OutputEncrypt from "./components/OutputEncrypt";
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <header className="flex justify-between items-center w-full max-w-3xl mx-auto px-8 pt-8">
        <h1
          onClick={() => window.location.reload()}
          className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 cursor-pointer hover:from-indigo-500 hover:to-purple-500 transition-all duration-200"
        >
          CipherHub
        </h1>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </header>
      <main className="flex-1 w-full max-w-3xl mx-auto px-8 py-8 space-y-8">
        <UploadForm
          onUpload={setPlainText}
          onTextChange={(text) => {
            setPlainText(text);
            resetDisplay();
          }}
        />
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
        
        {/* Only show regular output components if not using Rail Fence cipher */}
        {cipherType !== "railfence" && (
          <>
            <OutputEncrypt cipherText={cipherText} display={displayEncrypted} />
            <OutputDecrypt plainText={plainText} display={displayDecrypted} />
          </>
        )}

        {/* Rail Fence Pattern Visualization */}
        {railFencePattern && (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 transition-all duration-300">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">Rail Fence Pattern:</h3>
            <pre className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg overflow-auto text-gray-800 dark:text-gray-100 font-mono">
              {railFencePattern}
            </pre>
          </div>
        )}

        {/* Show Rail Fence results in a specific format when using Rail Fence cipher */}
        {cipherType === "railfence" && (displayEncrypted || displayDecrypted) && (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 transition-all duration-300">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">
              {displayEncrypted ? "Encrypted Text:" : "Decrypted Text:"}
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-gray-800 dark:text-gray-100 break-words">
              {displayEncrypted ? cipherText : plainText}
            </div>
          </div>
        )}

        {errorMessage && (
          <p className="text-red-600 dark:text-red-400 mt-6 text-center font-medium bg-red-50 dark:bg-red-900/30 py-3 px-6 rounded-lg shadow-md">
            {errorMessage}
          </p>
        )}
      </main>
      <footer className="py-6 w-full bg-gray-800 dark:bg-gray-950 text-gray-200 dark:text-gray-300 text-center">
        <p className="text-sm">
          Created by{" "}
          <a
            href="https://github.com/pataanggs"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
          >
            Pataangg
          </a>{" "}
          | CipherHub © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}

export default App;