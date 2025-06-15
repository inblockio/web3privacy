import { HardhatUserConfig } from "hardhat/config";
import { defineAccountTask } from './tasks/wallet';
import "@nomicfoundation/hardhat-toolbox";
import fs from 'fs';
import * as dotenv from "dotenv";
const defaultNetwork = 'localhost';


dotenv.config();

const {
  PRIVATE_KEY,
  NODE_PROVIDER_MATIC_RPC_URL,
  NODE_PROVIDER_SEPOLIA_RPC_URL,
  POLYGONSCAN_API_KEY,
  SEPOLIASCAN_API_KEY
} = process.env;

const MNEMONIC = process.env.MNEMONIC ? process.env.MNEMONIC : mnemonic();
const MNEMONIC_INITIAL_INDEX = Number(process.env.MNEMONIC_INITIAL_INDEX || 0);
const DERIVATION_PATH = String(process.env.DERIVATION_PATH || "m/44'/60'/0'/0");

const GAS_MULTIPLIER = Number(process.env.GAS_MULTIPLIER || 1.1);
const GAS_PRICE = process.env.GAS_PRICE ? Number(process.env.GAS_PRICE) : 'auto';
const GAS_LIMIT = process.env.GAS_LIMIT ? Number(process.env.GAS_LIMIT) : 'auto';

const sharedNetworkConfig: NetworkUserConfig = {
  gas: GAS_LIMIT,
  gasMultiplier: GAS_MULTIPLIER,
  gasPrice: GAS_PRICE,
};

// Order of priority for account/signer generation:
// 1) .env/PRIVATE_KEY
// 2) .env/MNEMONIC
// 3) ./mnemonic.txt
if (PRIVATE_KEY) {
  sharedNetworkConfig.accounts = [String(PRIVATE_KEY)];
  console.log(`HARDHAT: PRIVATE_KEY FOUND!`);
  console.log(PRIVATE_KEY);
} else if (MNEMONIC) {
  console.log(`HARDHAT: MNEMONIC FOUND!`);
  sharedNetworkConfig.accounts = {
    mnemonic: MNEMONIC,
    initialIndex: MNEMONIC_INITIAL_INDEX,
    path: DERIVATION_PATH,
  };
} else {
  console.log('HARDHAT: NO PRIVATE KEY OR MNEMONIC FOUND!');
}

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      ...sharedNetworkConfig,
      url: String(NODE_PROVIDER_SEPOLIA_RPC_URL),
    },
    matic: {
      ...sharedNetworkConfig,
      url: String(NODE_PROVIDER_MATIC_RPC_URL),
    },
  },
  etherscan: {
    apiKey: {
      sepolia: SEPOLIASCAN_API_KEY || 'undefined',
      matic: POLYGONSCAN_API_KEY || 'undefined',
    },
  }
};

export default config;


// mnemonic.txt used for live deployments
// If no mnemonic in text file is found, return empty string to inform sharedNetworkConfig
function mnemonic(): string {
  try {
    return fs.readFileSync('./mnemonic.txt').toString().trim();
  } catch (e) {
    if (defaultNetwork !== 'localhost') {
      console.log(
        '☢️ WARNING: No mnemonic file created for a deploy account. Try `yarn run generate` and then `yarn run account`.'
      );
    }
  }
  return '';
}

defineAccountTask(config);

