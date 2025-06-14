import type { OnRpcRequestHandler } from '@metamask/snaps-sdk';
import { Box, Text, Bold } from '@metamask/snaps-sdk/jsx';
import nacl from 'tweetnacl';
import hash from 'hash.js';

function sha256(data: Uint8Array): Uint8Array {
  const hashHex = hash.sha256().update(data).digest('hex');
  // Convert hex string to Uint8Array
  const bytes = new Uint8Array(hashHex.match(/.{2}/g)!.map(b => parseInt(b, 16)));
  return bytes;
}

function encodeBase64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes));
}

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  console.log(request, request.method);
  
  switch (request.method) {
    case 'hello':
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: (
            <Box>
              <Text>
                Hello, <Bold>{origin}</Bold>!
              </Text>
              <Text>
                This custom confirmation is just for display purposes.
              </Text>
              <Text>
                But you can edit the snap source code to make it do something,
                if you want to!
              </Text>
            </Box>
          ),
        },
      });

      case 'getSymKey': {
        const { fileHash, walletAddress } = request.params as { fileHash?: string; walletAddress: string };

        let symKey: Uint8Array;
        // TODO: Add validation or output so that unexpected lack of wallet address gives fail or warn
        // rather than nondeterministic key return.

        if (fileHash && walletAddress) {
          const concat = new TextEncoder().encode(fileHash + walletAddress);
          const hashBytes = sha256(concat);
          symKey = hashBytes.slice(0, nacl.secretbox.keyLength);
        } else {
          if (fileHash && !walletAddress) 
            console.log('Warning: generating random symkey even though file hash is known (because no wallet) - this may surprise a user expecting a deterministic sym key.');          
          symKey = nacl.randomBytes(nacl.secretbox.keyLength);
        }
        return { symKey: encodeBase64(symKey) };
      }
  

    default:
      throw new Error('Method nott found.');
  }
};
