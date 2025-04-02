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
  const [, setDisplayEncrypted] = useState(false);
  const [, setDisplayDecrypted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [vigenereKey, setVigenereKey] = useState("");
  const [transpositionKey, setTranspositionKey] = useState("");
  const [theme, setTheme] = useState(() => {
    // Load theme from localStorage or default to light
    return localStorage.getItem("theme") || "light";
  });

  // Persist theme to localStorage and update document class
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleAffineKeyChange = (type, value) => {
    if (type === "a") setA(value);
    if (type === "b") setB(value);
  };

  const handleHillKeyChange = (row, col, value) => {
    const updatedKey = [...hillKey];
    updatedKey[row][col] = value;
    setHillKey(updatedKey);
  };

  const handleEncrypt = () => {
    setDisplayDecrypted(false);
    setErrorMessage("");
    try {
      let encryptedText;
      switch (cipherType) {
        case "vigenere":
          encryptedText = vigenereEncrypt(plainText, key);
          break;
        case "autokey":
          encryptedText = autokeyVigenereEncrypt(plainText, key);
          break;
        case "extended":
          encryptedText = extendedVigenereEncrypt(plainText, key);
          break;
        case "playfair":
          encryptedText = playfairEncrypt(plainText, key);
          break;
        case "affine":
          encryptedText = affineEncrypt(plainText, a, b);
          break;
        case "hill":
          encryptedText = hillEncrypt(plainText, hillKey);
          break;
        case "super":
          encryptedText = superEncrypt(
            plainText,
            vigenereKey,
            transpositionKey
          );
          break;
        default:
          encryptedText = "Cipher tidak ditemukan";
      }
      setCipherText(encryptedText);
      setDisplayEncrypted(true);
      setDisplayDecrypted(false);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleDecrypt = () => {
    setDisplayEncrypted(false);
    setErrorMessage("");
    try {
      let decryptedText;
      switch (cipherType) {
        case "vigenere":
          decryptedText = vigenereDecrypt(cipherText, key);
          break;
        case "autokey":
          decryptedText = autokeyVigenereDecrypt(cipherText, key);
          break;
        case "extended":
          decryptedText = extendedVigenereDecrypt(cipherText, key);
          break;
        case "playfair":
          decryptedText = playfairDecrypt(cipherText, key);
          break;
        case "affine":
          decryptedText = affineDecrypt(cipherText, a, b);
          break;
        case "hill":
          decryptedText = hillDecrypt(cipherText, hillKey);
          break;
        case "super":
          decryptedText = superDecrypt(
            cipherText,
            vigenereKey,
            transpositionKey
          );
          break;
        default:
          decryptedText = "Cipher tidak ditemukan";
      }
      setPlainText(decryptedText);
      setDisplayDecrypted(true);
      setDisplayEncrypted(false);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleInputChange = () => {
    setDisplayEncrypted(false);
    setDisplayDecrypted(false);
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen flex flex-col items-center transition-colors duration-300">
      <div className="flex justify-between items-center w-full max-w-3xl mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
          CipherHub
        </h1>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>
      <div className="max-w-3xl w-full mx-auto space-y-8 flex-1">
        <UploadForm
          onUpload={setPlainText}
          onTextChange={(text) => {
            setPlainText(text);
            handleInputChange();
          }}
        />
        <CipherForm
          onCipherChange={(cipher) => {
            setCipherType(cipher);
            handleInputChange();
          }}
          onKeyChange={(key) => {
            setKey(key);
            handleInputChange();
          }}
          onVigenereKeyChange={(key) => {
            setVigenereKey(key);
            handleInputChange();
          }}
          onTranspositionKeyChange={(key) => {
            setTranspositionKey(key);
            handleInputChange();
          }}
          onAffineKeyChange={(type, value) => {
            handleAffineKeyChange(type, value);
            handleInputChange();
          }}
          onHillKeyChange={(row, col, value) => {
            handleHillKeyChange(row, col, value);
            handleInputChange();
          }}
          onAction={(action) =>
            action === "encrypt" ? handleEncrypt() : handleDecrypt()
          }
        />
        <OutputEncrypt cipherText={cipherText} plainText={plainText} />
        <OutputDecrypt cipherText={cipherText} plainText={plainText} />
        {errorMessage && (
          <p className="text-red-600 dark:text-red-400 mt-6 text-center font-medium bg-red-50 dark:bg-red-900/30 py-3 px-6 rounded-lg shadow-md">
            {errorMessage}
          </p>
        )}
      </div>
      <footer className="mt-12 py-6 w-full bg-gray-800 dark:bg-gray-950 text-gray-200 dark:text-gray-300 text-center">
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