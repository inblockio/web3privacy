- step 2
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"privateKey": "-----BEGIN PGP PRIVATE KEY BLOCK-----\n\nxVgEaE6dzxYJKwYBBAHaRw8BAQdARJw2MJJXx1AnN4C0fbY8sA/r0pDEarb1\nRv8fLP1WJa8AAQDNMZRIzgoOnBjKTZ880XLBS9V2GugV3+BDZqdeA6VS+w96\nzRtKb24gU21pdGggPGpvbkBleGFtcGxlLmNvbT7CwBMEExYKAIUFgmhOnc8D\nCwkHCZD1AEavLhoFo0UUAAAAAAAcACBzYWx0QG5vdGF0aW9ucy5vcGVucGdw\nanMub3JnLhuzkRH8gXw8+kr4lb9ppAj9x/D/Lp9hNicwLeiaoQMFFQoIDgwE\nFgACAQIZAQKbAwIeARYhBGdcMerXyiCFrBXVvfUARq8uGgWjAAD+jgD+MnpA\nI43Dz5NUxhxN9zZ3dHu3LEBv3cMYSINuiau7l7oA/25NvnYxpF/9PtFctuPM\n55agG/6n1uQC8MLRAamNbR0Gx10EaE6dzxIKKwYBBAGXVQEFAQEHQI3Xh2uT\n/kK65s+qglJihvh1wjQHnHNip/NqxBsJ/YQLAwEIBwAA/1mDCaAQoljEQ/+b\nz26iSkQp57di0OCQut9J+fhKRFawEmzCvgQYFgoAcAWCaE6dzwmQ9QBGry4a\nBaNFFAAAAAAAHAAgc2FsdEBub3RhdGlvbnMub3BlbnBncGpzLm9yZ3g7RKFl\nNUoL23WfZzU3cSz8At3PemkSY9L3F3fGOLKzApsMFiEEZ1wx6tfKIIWsFdW9\n9QBGry4aBaMAAOoLAQCnLZVXI/ZLkVy/8V/PDG/E9AnGHhFvashcEzorPSEv\n3wD9F4Uf8AeaQYsDYIstlWaqpxi050HUwh520l6jxyUq0AY=\n=j6fk\n-----END PGP PRIVATE KEY BLOCK-----\n"}' \
  http://localhost:3000/privateEncryptionService
// return { "status": "ok"}

- step 14
curl http://localhost:3000/privateEncryptionService
// return { "publicKey": "-----BEGIN PGP PUBLIC KEY BLOCK-----\n\nxjMEaE6dzxYJKwYBBAHaRw8BAQdARJw2MJJXx1AnN4C0fbY8sA/r0pDEarb1\nRv8fLP1WJa/NG0pvbiBTbWl0aCA8am9uQGV4YW1wbGUuY29tPsLAEwQTFgoA\nhQWCaE6dzwMLCQcJkPUARq8uGgWjRRQAAAAAABwAIHNhbHRAbm90YXRpb25z\nLm9wZW5wZ3Bqcy5vcmcuG7OREfyBfDz6SviVv2mkCP3H8P8un2E2JzAt6Jqh\nAwUVCggODAQWAAIBAhkBApsDAh4BFiEEZ1wx6tfKIIWsFdW99QBGry4aBaMA\nAP6OAP4yekAjjcPPk1TGHE33Nnd0e7csQG/dwxhIg26Jq7uXugD/bk2+djGk\nX/0+0Vy248znlqAb/qfW5ALwwtEBqY1tHQbOOARoTp3PEgorBgEEAZdVAQUB\nAQdAjdeHa5P+Qrrmz6qCUmKG+HXCNAecc2Kn82rEGwn9hAsDAQgHwr4EGBYK\nAHAFgmhOnc8JkPUARq8uGgWjRRQAAAAAABwAIHNhbHRAbm90YXRpb25zLm9w\nZW5wZ3Bqcy5vcmd4O0ShZTVKC9t1n2c1N3Es/ALdz3ppEmPS9xd3xjiyswKb\nDBYhBGdcMerXyiCFrBXVvfUARq8uGgWjAADqCwEApy2VVyP2S5Fcv/Ffzwxv\nxPQJxh4Rb2rIXBM6Kz0hL98A/ReFH/AHmkGLA2CLLZVmqqcYtOdB1MIedtJe\no8clKtAG\n=qYdy\n-----END PGP PUBLIC KEY BLOCK-----\n" }

- steps 7 to 9
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"symmetricKey": "newKey", "publicKeys": ["-----BEGIN PGP PUBLIC KEY BLOCK-----\n\nxjMEaE6dzxYJKwYBBAHaRw8BAQdARJw2MJJXx1AnN4C0fbY8sA/r0pDEarb1\nRv8fLP1WJa/NG0pvbiBTbWl0aCA8am9uQGV4YW1wbGUuY29tPsLAEwQTFgoA\nhQWCaE6dzwMLCQcJkPUARq8uGgWjRRQAAAAAABwAIHNhbHRAbm90YXRpb25z\nLm9wZW5wZ3Bqcy5vcmcuG7OREfyBfDz6SviVv2mkCP3H8P8un2E2JzAt6Jqh\nAwUVCggODAQWAAIBAhkBApsDAh4BFiEEZ1wx6tfKIIWsFdW99QBGry4aBaMA\nAP6OAP4yekAjjcPPk1TGHE33Nnd0e7csQG/dwxhIg26Jq7uXugD/bk2+djGk\nX/0+0Vy248znlqAb/qfW5ALwwtEBqY1tHQbOOARoTp3PEgorBgEEAZdVAQUB\nAQdAjdeHa5P+Qrrmz6qCUmKG+HXCNAecc2Kn82rEGwn9hAsDAQgHwr4EGBYK\nAHAFgmhOnc8JkPUARq8uGgWjRRQAAAAAABwAIHNhbHRAbm90YXRpb25zLm9w\nZW5wZ3Bqcy5vcmd4O0ShZTVKC9t1n2c1N3Es/ALdz3ppEmPS9xd3xjiyswKb\nDBYhBGdcMerXyiCFrBXVvfUARq8uGgWjAADqCwEApy2VVyP2S5Fcv/Ffzwxv\nxPQJxh4Rb2rIXBM6Kz0hL98A/ReFH/AHmkGLA2CLLZVmqqcYtOdB1MIedtJe\no8clKtAG\n=qYdy\n-----END PGP PUBLIC KEY BLOCK-----\n"]}' \
  http://localhost:3000/privateEncryptionService/encrypt
// return { "cyphers": ["..."] }

- steps 16 to 18
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"cypher": "-----BEGIN PGP MESSAGE-----\n\nwV4DFoUeEGbsdvsSAQdAjXMDTWbZq3R1nY/VvWhCYr01GZSOK+SGMBebAdSB\nPGUwiJEXiDHf1xsoojAIP7R1xxuMOoOGuIf5HA0LD1EgzdprOPe34sr+Tam0\ndx7C/zkB0sBDAYt2bwzHwmQMmI9KdT44mu+NGWejtRrSUtZrSFAMaxp7yb9Q\nIDUcY7uKQPLPoY+BDX3B/HOMleAc/4AbiZxvBOf/7dQ1v8IjRw8E2Zzsf0CN\nf/CWnUxdctrTUWbcphwwjpjHioiZR1A93cunYTRBQ4MHjYhBt2mGLD8bcgm3\nMiv1EBFaGrVIx8CFpKOt+lL64Eef1BWFVfOxf/Hk4cpU08+lUw8ej8dzgYfP\nC+BMUbm8QcN5S+tnn5xnVG7H9Sg9EeCPwy1XwGEPC6w4QqEX/ELbFagkC5ll\n3hzrK4SaJ+TEYq6YMD7ednUTX+DTdkeLk//nNYfu4116q2sJslI5HNFbvA==\n=eM0W\n-----END PGP MESSAGE-----\n"}' \
  http://localhost:3000/privateEncryptionService/decrypt
// return { "symmetricKey": "newKey" }
