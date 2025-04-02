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