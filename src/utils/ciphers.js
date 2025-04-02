// ciphers.js

// Utility Functions
function encodeBase64(text) {
  try {
    return btoa(text);
  } catch (e) {
    console.error("Encoding to Base64 failed:", e);
    return null;
  }
}

function decodeBase64(base64Text) {
  try {
    while (base64Text.length % 4 !== 0) {
      base64Text += "=";
    }
    return atob(base64Text);
  } catch (e) {
    console.error("Decoding from Base64 failed:", e);
    return null;
  }
}

// Vigenere Cipher
export function vigenereEncrypt(plainText, key) {
  let result = "";
  key = key.toUpperCase().replace(/[^A-Z]/g, "");
  plainText = plainText.toUpperCase();
  for (let i = 0, j = 0; i < plainText.length; i++) {
    const c = plainText.charCodeAt(i);
    if (c >= 65 && c <= 90) {
      result += String.fromCharCode(
        ((c - 65 + (key.charCodeAt(j % key.length) - 65)) % 26) + 65
      );
      j++;
    } else {
      result += plainText[i];
    }
  }
  return result;
}

export function vigenereDecrypt(cipherText, key) {
  let result = "";
  key = key.toUpperCase().replace(/[^A-Z]/g, "");
  cipherText = cipherText.toUpperCase();
  for (let i = 0, j = 0; i < cipherText.length; i++) {
    const c = cipherText.charCodeAt(i);
    if (c >= 65 && c <= 90) {
      result += String.fromCharCode(
        ((c - 65 - (key.charCodeAt(j % key.length) - 65) + 26) % 26) + 65
      );
      j++;
    } else {
      result += cipherText[i];
    }
  }
  return result;
}

// Autokey Vigenere Cipher
export function autokeyVigenereEncrypt(plainText, key) {
  let result = "";
  key = key.toUpperCase().replace(/[^A-Z]/g, "");
  plainText = plainText.toUpperCase();
  let extendedKey = key;
  for (let i = 0, j = 0; i < plainText.length; i++) {
    const plainChar = plainText.charCodeAt(i);
    if (plainChar >= 65 && plainChar <= 90) {
      const keyChar = extendedKey.charCodeAt(j);
      result += String.fromCharCode(((plainChar - 65 + (keyChar - 65)) % 26) + 65);
      extendedKey += result[result.length - 1];
      j++;
    } else {
      result += plainText[i];
    }
  }
  return result;
}

export function autokeyVigenereDecrypt(cipherText, key) {
  let result = "";
  key = key.toUpperCase().replace(/[^A-Z]/g, "");
  cipherText = cipherText.toUpperCase();
  let extendedKey = key;
  for (let i = 0, j = 0; i < cipherText.length; i++) {
    const cipherChar = cipherText.charCodeAt(i);
    if (cipherChar >= 65 && cipherChar <= 90) {
      const keyChar = extendedKey.charCodeAt(j);
      const decryptedChar = String.fromCharCode(
        ((cipherChar - 65 - (keyChar - 65) + 26) % 26) + 65
      );
      result += decryptedChar;
      extendedKey += decryptedChar;
      j++;
    } else {
      result += cipherText[i];
    }
  }
  return result;
}

// Extended Vigenere Cipher
export function extendedVigenereEncrypt(plainText, key) {
  let result = "";
  for (let i = 0; i < plainText.length; i++) {
    const plainChar = plainText.charCodeAt(i);
    const keyChar = key.charCodeAt(i % key.length);
    result += String.fromCharCode((plainChar + keyChar) % 256);
  }
  return encodeBase64(result) || "Error: Base64 encoding failed";
}

export function extendedVigenereDecrypt(cipherText, key) {
  const decodedText = decodeBase64(cipherText);
  if (!decodedText) return "Error: Failed to decode Base64";
  let result = "";
  for (let i = 0; i < decodedText.length; i++) {
    const cipherChar = decodedText.charCodeAt(i);
    const keyChar = key.charCodeAt(i % key.length);
    result += String.fromCharCode((cipherChar - keyChar + 256) % 256);
  }
  return result;
}

// Playfair Cipher
function createPlayfairTable(key) {
  key = key.toUpperCase().replace(/J/g, "I").replace(/[^A-Z]/g, "");
  let table = "";
  const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
  for (let char of key) if (!table.includes(char)) table += char;
  for (let char of alphabet) if (!table.includes(char)) table += char;
  return Array.from({ length: 5 }, (_, i) => table.slice(i * 5, i * 5 + 5).split(""));
}

function getPosition(table, char) {
  for (let row = 0; row < 5; row++)
    for (let col = 0; col < 5; col++)
      if (table[row][col] === char) return [row, col];
  return null;
}

export function playfairEncrypt(plainText, key) {
  const table = createPlayfairTable(key);
  plainText = plainText.toUpperCase().replace(/J/g, "I").replace(/[^A-Z]/g, "");
  let pairs = [];
  for (let i = 0; i < plainText.length; i += 2) {
    let a = plainText[i];
    let b = plainText[i + 1] || "X";
    if (a === b) {
      pairs.push([a, "X"]);
      i--;
    } else {
      pairs.push([a, b]);
    }
  }
  let result = "";
  for (let [a, b] of pairs) {
    const [rowA, colA] = getPosition(table, a);
    const [rowB, colB] = getPosition(table, b);
    if (rowA === rowB) {
      result += table[rowA][(colA + 1) % 5] + table[rowB][(colB + 1) % 5];
    } else if (colA === colB) {
      result += table[(rowA + 1) % 5][colA] + table[(rowB + 1) % 5][colB];
    } else {
      result += table[rowA][colB] + table[rowB][colA];
    }
  }
  return result;
}

export function playfairDecrypt(cipherText, key) {
  const table = createPlayfairTable(key);
  cipherText = cipherText.toUpperCase().replace(/J/g, "I").replace(/[^A-Z]/g, "");
  let pairs = [];
  for (let i = 0; i < cipherText.length; i += 2) pairs.push([cipherText[i], cipherText[i + 1]]);
  let result = "";
  for (let [a, b] of pairs) {
    const [rowA, colA] = getPosition(table, a);
    const [rowB, colB] = getPosition(table, b);
    if (rowA === rowB) {
      result += table[rowA][(colA + 4) % 5] + table[rowB][(colB + 4) % 5];
    } else if (colA === colB) {
      result += table[(rowA + 4) % 5][colA] + table[(rowB + 4) % 5][colB];
    } else {
      result += table[rowA][colB] + table[rowB][colA];
    }
  }
  return result.replace(/X$/, ""); // Simplified X removal
}

// Affine Cipher
function gcd(a, b) {
  while (b) [a, b] = [b, a % b];
  return a;
}

function modInverse(a, m) {
  if (gcd(a, m) !== 1) throw new Error(`'a' (${a}) must be coprime with ${m}`);
  for (let x = 1; x < m; x++) if ((a * x) % m === 1) return x;
  throw new Error(`No modular inverse for a=${a}, m=${m}`);
}

export function affineEncrypt(plainText, a, b) {
  const m = 26;
  plainText = plainText.toUpperCase();
  let result = "";
  for (let char of plainText) {
    if (char >= "A" && char <= "Z") {
      const x = char.charCodeAt(0) - 65;
      result += String.fromCharCode(((a * x + b) % m) + 65);
    } else {
      result += char;
    }
  }
  return result;
}

export function affineDecrypt(cipherText, a, b) {
  const m = 26;
  const aInv = modInverse(a, m);
  cipherText = cipherText.toUpperCase();
  let result = "";
  for (let char of cipherText) {
    if (char >= "A" && char <= "Z") {
      const y = char.charCodeAt(0) - 65;
      result += String.fromCharCode((aInv * (y - b + m) % m) + 65);
    } else {
      result += char;
    }
  }
  return result;
}

// Hill Cipher
function matrixDeterminant(matrix) {
  const [[a, b], [c, d]] = matrix;
  return (a * d - b * c + 26) % 26;
}

function modInverseMatrix(a, m) {
  a = (a + m) % m; // Ensure positive
  if (gcd(a, m) !== 1) throw new Error(`Determinant (${a}) must be coprime with ${m}`);
  for (let x = 1; x < m; x++) if ((a * x) % m === 1) return x;
  throw new Error(`No modular inverse for ${a} mod ${m}`);
}

function invertMatrix(matrix) {
  const det = matrixDeterminant(matrix);
  const detInv = modInverseMatrix(det, 26);
  const [[a, b], [c, d]] = matrix;
  return [
    [((d * detInv) % 26 + 26) % 26, ((-b * detInv + 26) % 26 + 26) % 26],
    [((-c * detInv + 26) % 26 + 26) % 26, ((a * detInv) % 26 + 26) % 26],
  ];
}

export function hillEncrypt(plainText, keyMatrix) {
  plainText = plainText.toUpperCase().replace(/[^A-Z]/g, "");
  if (plainText.length % 2 !== 0) plainText += "X";
  let result = "";
  for (let i = 0; i < plainText.length; i += 2) {
    const vector = [plainText.charCodeAt(i) - 65, plainText.charCodeAt(i + 1) - 65];
    const encrypted = [
      (keyMatrix[0][0] * vector[0] + keyMatrix[0][1] * vector[1]) % 26,
      (keyMatrix[1][0] * vector[0] + keyMatrix[1][1] * vector[1]) % 26,
    ];
    result += String.fromCharCode(encrypted[0] + 65, encrypted[1] + 65);
  }
  return result;
}

export function hillDecrypt(cipherText, keyMatrix) {
  const inverseMatrix = invertMatrix(keyMatrix);
  cipherText = cipherText.toUpperCase().replace(/[^A-Z]/g, "");
  let result = "";
  for (let i = 0; i < cipherText.length; i += 2) {
    const vector = [cipherText.charCodeAt(i) - 65, cipherText.charCodeAt(i + 1) - 65];
    const decrypted = [
      (inverseMatrix[0][0] * vector[0] + inverseMatrix[0][1] * vector[1]) % 26,
      (inverseMatrix[1][0] * vector[0] + inverseMatrix[1][1] * vector[1]) % 26,
    ];
    result += String.fromCharCode(decrypted[0] + 65, decrypted[1] + 65);
  }
  return result.replace(/X$/, ""); // Remove padding
}

// Super Encryption
function extendedVigenereEncryptForSuper(plainText, key) {
  let result = "";
  for (let i = 0; i < plainText.length; i++) {
    const plainChar = plainText.charCodeAt(i);
    const keyChar = key.charCodeAt(i % key.length);
    result += String.fromCharCode((plainChar + keyChar) % 256);
  }
  return result;
}

function extendedVigenereDecryptForSuper(cipherText, key) {
  let result = "";
  for (let i = 0; i < cipherText.length; i++) {
    const cipherChar = cipherText.charCodeAt(i);
    const keyChar = key.charCodeAt(i % key.length);
    result += String.fromCharCode((cipherChar - keyChar + 256) % 256);
  }
  return result;
}

function columnarTransposeEncrypt(text, key) {
  const numCols = key.length;
  const numRows = Math.ceil(text.length / numCols);
  let matrix = Array(numRows).fill().map(() => Array(numCols).fill(""));
  let index = 0;
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols && index < text.length; c++) {
      matrix[r][c] = text[index++];
    }
  }
  const keyOrder = key.split("").map((char, i) => [char, i]).sort();
  let result = "";
  for (let [, col] of keyOrder) {
    for (let row = 0; row < numRows; row++) {
      if (matrix[row][col]) result += matrix[row][col];
    }
  }
  return result;
}

function columnarTransposeDecrypt(cipherText, key) {
  const numCols = key.length;
  const numRows = Math.ceil(cipherText.length / numCols);
  const totalCells = numRows * numCols;
  const keyOrder = key.split("").map((char, i) => [char, i]).sort();
  const colLengths = Array(numCols).fill(numRows);
  const emptyCells = totalCells - cipherText.length;
  for (let i = numCols - emptyCells; i < numCols; i++) colLengths[keyOrder[i][1]]--;
  
  let matrix = Array(numRows).fill().map(() => Array(numCols).fill(""));
  let index = 0;
  for (let [, col] of keyOrder) {
    for (let row = 0; row < colLengths[col]; row++) {
      matrix[row][col] = cipherText[index++];
    }
  }
  let result = "";
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      if (matrix[r][c]) result += matrix[r][c];
    }
  }
  return result;
}

export function superEncrypt(plainText, vigenereKey, transpositionKey) {
  const vigenereEncrypted = extendedVigenereEncryptForSuper(plainText, vigenereKey);
  const base64Encoded = encodeBase64(vigenereEncrypted);
  if (!base64Encoded) return "Error: Base64 encoding failed";
  const transposed = columnarTransposeEncrypt(base64Encoded, transpositionKey);
  return transposed;
}

export function superDecrypt(cipherText, vigenereKey, transpositionKey) {
  const transposedDecrypted = columnarTransposeDecrypt(cipherText, transpositionKey);
  const base64Decoded = decodeBase64(transposedDecrypted);
  if (!base64Decoded) return "Error: Failed to decode Base64";
  const decryptedText = extendedVigenereDecryptForSuper(base64Decoded, vigenereKey);
  return decryptedText;
}

// Caesar Cipher
export const caesarEncrypt = (text, shift) => {
  return text
    .split("")
    .map((char) => {
      if (char.match(/[a-z]/i)) {
        const charCode = char.charCodeAt(0);
        const base = charCode >= 65 && charCode <= 90 ? 65 : 97;
        return String.fromCharCode(((charCode - base + shift) % 26) + base);
      }
      return char;
    })
    .join("");
};

export const caesarDecrypt = (text, shift) => {
  return caesarEncrypt(text, 26 - (shift % 26));
};

/**
 * Encodes a given string using the Rail Fence Cipher.
 * @param text - The input text to encode.
 * @param rails - The number of rails to use.
 * @returns The encoded string.
 */
export function encodeRailFenceCipher(text, rails) {
  if (!Number.isInteger(rails) || rails < 1) {
    throw new Error("Invalid number of rails. It must be an integer greater than or equal to 1.");
  }
  if (rails === 1) return text;

  const fence = Array.from({ length: rails }, () => []);
  let rail = 0;
  let direction = 1;

  for (const char of text) {
    fence[rail].push(char);
    rail += direction;
    if (rail === 0 || rail === rails - 1) direction *= -1;
  }

  return fence.flat().join('');
}

/**
 * Decodes a given string encoded with the Rail Fence Cipher.
 * @param cipherText - The encoded text to decode.
 * @param rails - The number of rails used during encoding.
 * @returns The decoded string.
 */
export function decodeRailFenceCipher(cipherText, rails) {
  if (!Number.isInteger(rails) || rails < 1) {
    throw new Error("Invalid number of rails. It must be an integer greater than or equal to 1.");
  }
  if (rails === 1) return cipherText;

  const fence = Array.from({ length: rails }, () => Array(cipherText.length).fill(false));
  let rail = 0;
  let direction = 1;

  // Mark the positions on the fence
  for (let i = 0; i < cipherText.length; i++) {
    fence[rail][i] = true;
    rail += direction;
    if (rail === 0 || rail === rails - 1) direction *= -1;
  }

  // Fill the fence with the cipher text
  let index = 0;
  for (let r = 0; r < rails; r++) {
    for (let c = 0; c < cipherText.length; c++) {
      if (fence[r][c]) {
        fence[r][c] = cipherText[index++];
      }
    }
  }

  // Read the fence to decode
  const result = [];
  rail = 0;
  direction = 1;
  for (let i = 0; i < cipherText.length; i++) {
    result.push(fence[rail][i]);
    rail += direction;
    if (rail === 0 || rail === rails - 1) direction *= -1;
  }

  return result.join('');
}

/**
 * Visualizes how text is arranged in the Rail Fence Cipher pattern.
 * @param text - The input text.
 * @param rails - The number of rails to use.
 * @returns A string representation of the Rail Fence pattern.
 */
export function visualizeRailFenceCipher(text, rails) {
  if (!Number.isInteger(rails) || rails < 1) {
    throw new Error("Invalid number of rails. It must be an integer greater than or equal to 1.");
  }
  if (rails === 1 || text.length === 0) return text;

  const fence = Array.from({ length: rails }, () => Array(text.length).fill(' '));
  let rail = 0;
  let direction = 1;

  // Fill the pattern with characters
  for (let i = 0; i < text.length; i++) {
    fence[rail][i] = text[i];
    rail += direction;
    if (rail === 0 || rail === rails - 1) direction *= -1;
  }

  // Convert the 2D array to a string representation
  return fence.map(row => row.join('')).join('\n');
}

// Atbash Cipher
export function atbashEncrypt(plainText) {
  let result = "";
  plainText = plainText.toUpperCase();
  for (let i = 0; i < plainText.length; i++) {
    const c = plainText.charCodeAt(i);
    if (c >= 65 && c <= 90) {
      // A=65, Z=90 in ASCII
      result += String.fromCharCode(155 - c); // 155 = 65 + 90
    } else {
      result += plainText[i];
    }
  }
  return result;
}

export function atbashDecrypt(cipherText) {
  // Atbash is its own inverse - the encryption method is the same as decryption
  return atbashEncrypt(cipherText);
}

// Morse Code
const morseCodeMap = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....', 
  'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 
  'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 
  'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', 
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', '.': '.-.-.-', ',': '--..--',
  '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...',
  ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.',
  '$': '...-..-', '@': '.--.-.'
};

const reverseMorseCodeMap = Object.fromEntries(
  Object.entries(morseCodeMap).map(([key, value]) => [value, key])
);

export function morseEncode(plainText) {
  let result = [];
  plainText = plainText.toUpperCase();
  for (let i = 0; i < plainText.length; i++) {
    const char = plainText[i];
    if (morseCodeMap[char]) {
      result.push(morseCodeMap[char]);
    } else if (char === ' ') {
      // Use '/' to represent word separators
      result.push('/');
    }
  }
  return result.join(' ');
}

export function morseDecode(cipherText) {
  // Split by spaces to get morse characters
  const words = cipherText.split(' ');
  let result = "";
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (word === '/') {
      result += ' ';
    } else if (reverseMorseCodeMap[word]) {
      result += reverseMorseCodeMap[word];
    }
  }
  return result;
}

// ROT13 Cipher
export function rot13Encrypt(plainText) {
  return plainText
    .split("")
    .map((char) => {
      const code = char.charCodeAt(0);
      // Uppercase letters
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + 13) % 26) + 65);
      }
      // Lowercase letters
      else if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 + 13) % 26) + 97);
      }
      // Other characters remain unchanged
      return char;
    })
    .join("");
}

export function rot13Decrypt(cipherText) {
  // ROT13 is its own inverse - applying it twice returns the original text
  return rot13Encrypt(cipherText);
}

// Baconian Cipher
const baconianMap = {
  'A': 'aaaaa', 'B': 'aaaab', 'C': 'aaaba', 'D': 'aaabb', 'E': 'aabaa',
  'F': 'aabab', 'G': 'aabba', 'H': 'aabbb', 'I': 'abaaa', 'J': 'abaab',
  'K': 'ababa', 'L': 'ababb', 'M': 'abbaa', 'N': 'abbab', 'O': 'abbba',
  'P': 'abbbb', 'Q': 'baaaa', 'R': 'baaab', 'S': 'baaba', 'T': 'baabb',
  'U': 'babaa', 'V': 'babab', 'W': 'babba', 'X': 'babbb', 'Y': 'bbaaa',
  'Z': 'bbaab'
};

const reverseBaconianMap = Object.fromEntries(
  Object.entries(baconianMap).map(([key, value]) => [value, key])
);

export function baconianEncrypt(plainText) {
  let result = "";
  plainText = plainText.toUpperCase().replace(/[^A-Z]/g, "");
  for (let i = 0; i < plainText.length; i++) {
    if (baconianMap[plainText[i]]) {
      result += baconianMap[plainText[i]] + " ";
    }
  }
  return result.trim();
}

export function baconianDecrypt(cipherText) {
  // Remove any characters that aren't 'A', 'B', 'a', or 'b'
  cipherText = cipherText.toLowerCase().replace(/[^ab]/g, "");
  let result = "";
  // Process in groups of 5 characters
  for (let i = 0; i < cipherText.length; i += 5) {
    const chunk = cipherText.substr(i, 5);
    if (chunk.length === 5 && reverseBaconianMap[chunk]) {
      result += reverseBaconianMap[chunk];
    }
  }
  return result;
}