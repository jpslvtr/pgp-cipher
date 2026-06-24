# pgp-cipher

A minimal, browser-based tool for PGP encryption and decryption. All
cryptography runs locally in your browser — no keys or messages are ever
sent to a server.

## Features

- Encrypt a message with a recipient's PGP public key
- Decrypt a message with your PGP private key (passphrase-protected keys
  supported)
- One-click copy of encrypted/decrypted output

## Usage

Open `index.html` in any modern browser. No build step or install needed.

To serve it locally instead:

```bash
python3 -m http.server
```

Then visit http://localhost:8000.

## Built with

- [OpenPGP.js](https://github.com/openpgpjs/openpgpjs) (loaded via CDN)
- Plain HTML, CSS, and JavaScript

## Security note

Keys and messages stay in your browser tab. Still, only paste a private
key into tools you trust, and prefer running this locally.

## License

© 2025 James Park
