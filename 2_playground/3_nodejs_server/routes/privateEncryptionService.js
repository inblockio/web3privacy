var express = require('express');
var router = express.Router();
var createError = require('http-errors');
var openpgp = require('openpgp');

// TODO temporary db
var PRIVATE_KEY;

async function computePublicKey(armoredKey) {
  const privateKey = await openpgp.readKey({ armoredKey });
  return privateKey.toPublic().armor();
}

async function encrypt(armoredKey, message, publicKeyArmored) {
  const privateKey = await openpgp.readKey({ armoredKey });
  const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
  const readableStream = new ReadableStream({
    start(controller) {
      controller.enqueue(message);
      controller.close();
    }
  });
  const encrypted = await openpgp.encrypt({
    message: await openpgp.createMessage({ text: readableStream }), // input as Message object
    encryptionKeys: publicKey,
    signingKeys: privateKey // optional
  });
  const chunks = [];
  for await (const chunk of encrypted) {
    chunks.push(chunk);
  }
  const plaintext = chunks.join('');
  console.log(plaintext);
  return plaintext;
}

async function decrypt(armoredKey, cypher) {
  const privateKey = await openpgp.readKey({ armoredKey });
  const message = await openpgp.readMessage({
    armoredMessage: cypher // parse armored message
  });
  const decrypted = await openpgp.decrypt({
      message,
      // optional verificationKeys: publicKey,
      decryptionKeys: privateKey
  });
  const chunks = [];
  for await (const chunk of decrypted.data) {
      chunks.push(chunk);
  }
  const plaintext = chunks.join('');
  return plaintext;
}

async function generateKey() {
  const { privateKey, publicKey, revocationCertificate } = await openpgp.generateKey({
    type: 'ecc', // Type of the key, defaults to ECC
    curve: 'curve25519', // ECC curve name, defaults to curve25519
    userIDs: [{ name: 'Jon Smith', email: 'jon@example.com' }], // you can pass multiple user IDs
    passphrase: undefined, // protects the private key
    format: 'armored' // output key format, defaults to 'armored' (other options: 'binary' or 'object')
  });
  console.log(privateKey);
  console.log(publicKey);
  return privateKey;
}

router.post('/', async function(req, res, next) {
  PRIVATE_KEY = req.body.privateKey;
  
  return res.send({ status: "ok" });
})

router.get('/', async function(req, res, next) {
  if (!PRIVATE_KEY) {
    PRIVATE_KEY = await generateKey(); // return next(createError(404));
  }

  var publicKey = await computePublicKey(PRIVATE_KEY);
  return res.send({ publicKey });
});


router.post('/encrypt', async function(req, res, next) {
  if (!PRIVATE_KEY) return next(createError(404));

  const { symmetricKey, publicKeys } = req.body;
  var cyphers = await Promise.all(publicKeys.map(publicKey => encrypt(PRIVATE_KEY, symmetricKey, publicKey))); // use PRIVATE_KEY to encrypt symmetricKey against each publicKeys using PRIVATE_KEY
  return res.send({ cyphers });
})

router.post('/decrypt', async function(req, res, next) {
  if (!PRIVATE_KEY) return next(createError(404));

  const { cypher } = req.body;
  var symmetricKey = await decrypt(PRIVATE_KEY, cypher); // use PRIVATE_KEY to decrypt cypher for symmetricKey
  return res.send({ symmetricKey });
})

module.exports = router;
