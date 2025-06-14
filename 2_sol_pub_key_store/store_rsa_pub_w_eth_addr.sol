// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RSAPublicKeyStorage {
    // Mapping from Ethereum address to RSA public key (as a string)
    mapping(address => string) public rsaPublicKeys;

    // Event to notify when a public key is stored
    event RSAPublicKeyStored(address indexed user, string publicKey);

    // Function to store RSA public key for a given address
    function storeRSAPublicKey(string memory publicKey) public {
        rsaPublicKeys[msg.sender] = publicKey;  // Store the public key for the sender's address
        emit RSAPublicKeyStored(msg.sender, publicKey);  // Emit event to notify about the public key storage
    }

    // Function to get the RSA public key for a given address
    function getRSAPublicKey(address user) public view returns (string memory) {
        return rsaPublicKeys[user];  // Return the RSA public key for the specified address
    }
}
