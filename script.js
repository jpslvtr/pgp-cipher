async function encryptMessage() {
    const publicKeyText = document.getElementById('recipientPublicKey').value.trim();
    const messageText = document.getElementById('messageToEncrypt').value.trim();

    if (!publicKeyText || !messageText) {
        document.getElementById('encryptStatus').innerHTML = '<div class="error">Please enter both public key and message</div>';
        return;
    }

    if (!publicKeyText.includes('BEGIN PGP PUBLIC KEY')) {
        document.getElementById('encryptStatus').innerHTML = '<div class="error">Invalid PGP public key format</div>';
        return;
    }

    try {
        const publicKey = await openpgp.readKey({ armoredKey: publicKeyText });
        const encrypted = await openpgp.encrypt({
            message: await openpgp.createMessage({ text: messageText }),
            encryptionKeys: publicKey
        });

        document.getElementById('encryptedOutput').value = encrypted;
        document.getElementById('encryptStatus').innerHTML = '<div class="success">Message encrypted successfully!</div>';

    } catch (error) {
        console.error('Encryption error:', error);
        document.getElementById('encryptStatus').innerHTML = `<div class="error">Encryption failed: ${error.message}</div>`;
    }
}

async function decryptMessage() {
    const privateKeyText = document.getElementById('yourPrivateKey').value.trim();
    const passphrase = document.getElementById('privateKeyPassphrase').value;
    const encryptedText = document.getElementById('encryptedInput').value.trim();

    if (!privateKeyText || !encryptedText) {
        document.getElementById('decryptStatus').innerHTML = '<div class="error">Please enter both private key and encrypted message</div>';
        return;
    }

    if (!privateKeyText.includes('BEGIN PGP PRIVATE KEY')) {
        document.getElementById('decryptStatus').innerHTML = '<div class="error">Invalid PGP private key format</div>';
        return;
    }

    try {
        const parsedPrivateKey = await openpgp.readPrivateKey({ armoredKey: privateKeyText });

        let decryptedPrivateKey;
        if (parsedPrivateKey.isDecrypted()) {
            // Key has no passphrase protection
            if (passphrase && passphrase.trim() !== '') {
                document.getElementById('decryptStatus').innerHTML = '<div class="error">This private key has no passphrase protection. Leave passphrase field empty.</div>';
                return;
            }
            decryptedPrivateKey = parsedPrivateKey;
        } else {
            // Key requires passphrase
            if (!passphrase || passphrase.trim() === '') {
                document.getElementById('decryptStatus').innerHTML = '<div class="error">This private key requires a passphrase. Please enter it.</div>';
                return;
            }
            decryptedPrivateKey = await openpgp.decryptKey({
                privateKey: parsedPrivateKey,
                passphrase: passphrase
            });
        }

        const encryptedMessage = await openpgp.readMessage({ armoredMessage: encryptedText });
        const { data: decrypted } = await openpgp.decrypt({
            message: encryptedMessage,
            decryptionKeys: decryptedPrivateKey
        });

        document.getElementById('decryptedOutput').value = decrypted;
        document.getElementById('decryptStatus').innerHTML = '<div class="success">Message decrypted successfully!</div>';

    } catch (error) {
        console.error('Decryption error:', error);
        document.getElementById('decryptStatus').innerHTML = `<div class="error">Decryption failed: ${error.message}. Check your private key and passphrase.</div>`;
    }
}

// Add copy functionality
document.addEventListener('DOMContentLoaded', function () {
    // Add copy buttons to output areas
    addCopyButton('encryptedOutput');
    addCopyButton('decryptedOutput');
});

function addCopyButton(textareaId) {
    const textarea = document.getElementById(textareaId);
    const button = document.createElement('button');
    button.textContent = 'Copy';
    button.className = 'copy-button';
    button.onclick = () => {
        textarea.select();
        document.execCommand('copy');
        button.textContent = 'Copied!';
        setTimeout(() => button.textContent = 'Copy', 2000);
    };
    textarea.parentNode.insertBefore(button, textarea.nextSibling);
}