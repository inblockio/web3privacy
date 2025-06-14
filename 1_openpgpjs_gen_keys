const express = require('express');
const openpgp = require('openpgp');
const path = require('path');

const app = express();
const port = 3000;

// Serve the index.html content directly as the response
app.get('/', (req, res) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OpenPGP Example - Generate keys</title>
    </head>
    <body>
      <h1>OpenPGP.js Generate keys</h1>
      <button id="generate">Generate Keypair</button>
      <h3>Public Key:</h3>
      <pre id="publicKey"></pre>
      <h3>Private Key:</h3>
      <pre id="privateKey"></pre>
      <h3>Revocation Certificate:</h3>
      <pre id="revocationCertificate"></pre>

      <script src="https://unpkg.com/openpgp@6.1.1/dist/openpgp.min.js"></script>
      <script>
        document.getElementById('generate').addEventListener('click', async () => {
          try {
            // Generate key pair
            const { privateKey, publicKey, revocationCertificate } = await openpgp.generateKey({
                type: 'ecc',  // Type of the key
                curve: 'curve25519', // ECC curve name
                userIDs: [{ name: 'Jon Smith', email: 'jon@example.com' }],  // User information
                passphrase: 'super long and hard to guess secret',  // Protects the private key
                format: 'armored'  // Output key format
            });

            // Display the keys on the page
            document.getElementById('publicKey').textContent = publicKey;
            document.getElementById('privateKey').textContent = privateKey;
            document.getElementById('revocationCertificate').textContent = revocationCertificate;

          } catch (error) {
            console.error('Error generating keypair:', error);
            alert('Error generating keypair: ' + error.message);
          }
        });
      </script>
    </body>
    </html>
  `;

  res.send(htmlContent);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
