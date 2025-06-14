- step 2
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"privateKey": "whatever"}' \
  http://localhost:3000/privateEncryptionService
// return { "status": "ok"}

- step 14
curl http://localhost:3000/privateEncryptionService
// return { "publicKey": "" }

- steps 7 to 9
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"symmetricKey": "newKey", "publicKeys": ["pub1"]}' \
  http://localhost:3000/privateEncryptionService/encrypt
// return { "cyphers": [] }

- steps 16 to 18
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"cypher": "cypher1"}' \
  http://localhost:3000/privateEncryptionService/decrypt
// return { "symmetricKey": "sym1" }
