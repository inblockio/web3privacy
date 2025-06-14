var express = require('express');
var router = express.Router();
var createError = require('http-errors');

// TODO temporary db
var PRIVATE_KEY;

function computePublicKey(privateKey) {
  return "TODO";
}

function encrypt(privateKey, symmetricKey, publicKeys) {
  return ["TODO"];
}

function decrypt(privateKey, cypher) {
  return "TODO";
}

router.post('/', function(req, res, next) {
  PRIVATE_KEY = req.body.privateKey;
  return res.send({ status: "ok" });
})

router.get('/', function(req, res, next) {
  if (!PRIVATE_KEY) return next(createError(404));

  var publicKey = computePublicKey(PRIVATE_KEY);
  return res.send({ publicKey });
});


router.post('/encrypt', function(req, res, next) {
  if (!PRIVATE_KEY) return next(createError(404));

  const { symmetricKey, publicKeys } = req.body;
  var cyphers = encrypt(PRIVATE_KEY, symmetricKey, publicKeys); // TODO use PRIVATE_KEY to encrypt symmetricKey against each publicKeys using PRIVATE_KEY
  return res.send({ cyphers });
})

router.post('/decrypt', function(req, res, next) {
  if (!PRIVATE_KEY) return next(createError(404));

  const { cypher } = req.body;
  var symmetricKey = decrypt(PRIVATE_KEY, cypher); // TODO use PRIVATE_KEY to decrypt cypher for symmetricKey
  return res.send({ symmetricKey });
})

module.exports = router;
