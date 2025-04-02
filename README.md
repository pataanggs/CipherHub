# CipherHub

CipherHub is a web-based application for encrypting and decrypting text using various classical ciphers. It provides a user-friendly interface to perform encryption and decryption with ciphers like Vigenère, Playfair, Hill, and more, including support for dark and light themes. Whether you're a cryptography enthusiast or just exploring, CipherHub offers a seamless experience to experiment with secure communication techniques.

## Features

- **Multiple Ciphers**: Supports a variety of classical ciphers:
  - Vigenère Cipher (Standard and Autokey)
  - Extended Vigenère Cipher (Base64)
  - Playfair Cipher
  - Affine Cipher
  - Hill Cipher
  - Super Encryption (combining Vigenère and transposition with Base64 encoding)
- **File Upload**: Upload text files to encrypt or decrypt their contents.
- **Theme Support**: Toggle between light and dark themes, with preferences saved in localStorage.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Error Handling**: Displays clear error messages for invalid inputs or keys.
- **Always-Visible Outputs**: Both encryption and decryption results are always visible with placeholders when no action has been performed.
- **Modern UI**: Built with Tailwind CSS for a sleek, modern look with smooth transitions and hover effects.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/pataanggs/CipherHub.git
   cd CipherHub
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev

   ```bash
   npm run dev
   ```

## Usage

1. Select your desired cipher from the dropdown menu
2. Enter the text you want to encrypt/decrypt
3. Provide the required key for the selected cipher
4. Click "Encrypt" or "Decrypt" button
5. View the result in the output area

For file encryption:

1. Click on the "Upload File" button
2. Select a text file from your computer
3. The file contents will be loaded into the input field
4. Follow steps 1-5 above to process the file content

## Technologies Used

- **React.js**: Frontend library for building user interfaces
- **Tailwind CSS**: Utility-first CSS framework for styling
- **JavaScript**: Core programming language
- **HTML/CSS**: Markup and styling
- **LocalStorage API**: For theme preference persistence

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source.
