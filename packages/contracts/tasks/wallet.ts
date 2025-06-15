// SPDX-FileCopyrightText: 2021 Toucan Labs
//
// SPDX-License-Identifier: LicenseRef-Proprietary

import fs from 'fs';
import { Buffer } from 'node:buffer';
import { task } from 'hardhat/config';
import { HardhatUserConfig, HttpNetworkUserConfig } from 'hardhat/types';
import * as bip39 from 'bip39';
import { hdkey } from 'ethereumjs-wallet';
import { privateToAddress } from 'ethereumjs-util';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const MNEMONIC = process.env.MNEMONIC;
const MNEMONIC_INITIAL_INDEX = Number(process.env.MNEMONIC_INITIAL_INDEX || 0);
const DERIVATION_PATH = String(process.env.DERIVATION_PATH || "m/44'/60'/0'/0");

task('generate', 'Create a mnemonic for builder deploys', async () => {
  const [address, mnemonic] = await getWallet();
  console.log('🔐 Account Generated as ' + address + ' and set as mnemonic in packages/hardhat');
  console.log("💬 Use 'yarn run account' to get more information about the deployment account.");

  fs.writeFileSync('./' + address + '.txt', mnemonic.toString());
  fs.writeFileSync('./mnemonic.txt', mnemonic.toString());
});

async function getWallet(mnemonic?: string): Promise<[address: string, mnemonic: string]> {
  if (!mnemonic) {
    console.log('Generating new wallet');
    mnemonic = String(bip39.generateMnemonic());
  }
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const hdwallet = hdkey.fromMasterSeed(seed);
  const wallet_hdpath = DERIVATION_PATH;
  const account_index = MNEMONIC_INITIAL_INDEX;
  const fullPath = wallet_hdpath + '/' + account_index;
  console.log('Using full path:', fullPath);
  const wallet = hdwallet.derivePath(fullPath).getWallet();
  const address = '0x' + privateToAddress(wallet.privateKey).toString('hex');
  return [address, mnemonic];
}

// mnemonic.txt used for live deployments
function getMnemonic(): string | undefined {
  if (MNEMONIC) return MNEMONIC;

  try {
    return fs.readFileSync('./mnemonic.txt').toString().trim();
  } catch (e) {
    console.log('mnemonic.txt file not found');
  }
  return undefined;
}

async function loadWalletAddress(): Promise<string> {
  if (!PRIVATE_KEY) {
    console.log('No private key found, trying mnemonic');
    const mnemonic = getMnemonic();
    if (!mnemonic) {
      throw new Error('Neither private key nor mnemonic found. Exiting.');
    }

    const [address] = await getWallet(mnemonic);
    return address;
  }

  console.log('Private key found in environment variables');
  const uniformKey = PRIVATE_KEY.startsWith('0x') ? PRIVATE_KEY.substring(2, 66) : PRIVATE_KEY;
  const buffer = Buffer.from(uniformKey, 'hex');
  return '0x' + privateToAddress(buffer).toString('hex');
}

export const defineAccountTask = (config: HardhatUserConfig) => {
  task('account', 'Get balance informations for the deployment account.', async (_, { ethers }) => {
    const address = await loadWalletAddress();
    console.log('‍📬 Deployer Account is ' + address);
    for (const n in config.networks) {
      // console.log(config.networks[n],n)
      try {
        const provider = new ethers.JsonRpcProvider((<HttpNetworkUserConfig>config.networks[n]).url);
        const balance = await provider.getBalance(address);
        console.log(' -- ' + n + ' --  -- -- 📡 ');
        console.log('   balance: ' + ethers.formatEther(balance));
        console.log('   nonce: ' + (await provider.getTransactionCount(address)));
      } catch (e) {
        console.log(e);
      }
    }
    // qrcode.generate(address);
  });
};
