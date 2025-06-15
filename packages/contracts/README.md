# Contracts package

Hardhat package for smart contracts and on-chain interactions

## Installation

Please follow the steps in the [root readme file](../../README.md).

## Setting up your local environment

Before running the local environment or deploying, you need to set the corresponding environment variables in an `.env` within the frontend directory. Fill out according to `.env.example`. Best to ask someone from the team to get the data to connect to our Firebase instance.

# 🏃‍♀️ Live deployment of the smart contracts on a public network

## Set up deployer account

If you already have a funded account and the corresponding secret
phrase, paste that phrase into `packages/hardhat/mnemonic.txt` or into `.env`

If not, generate new secret phrase (mnemonic)

    yarn generate

Display the current account (you can check if your accounts are funded with  native tokens like ETH or testnet ETH), fund it if necessary

    yarn account


## Deployment

Deployment of the `testDeployment` module with the `RSAPublicKeyStorage.sol` contract via Hardhat-ignition, here, to the sepolia network:
```
npx hardhat ignition deploy ./ignition/modules/testDeployment.ts --network sepolia
```


## Faucet Links

[Google  Cloud Sepolia Faucet](http://cloud.google.com/application/web3/faucet/ethereum/sepolia) 

For now, you can use this funded testnet mnemonic:
`shoe camera work agent flight market fault blouse energy island glove under`
