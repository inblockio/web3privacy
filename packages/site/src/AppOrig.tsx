import type { FunctionComponent, ReactNode } from 'react';
import { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';

import nacl from "tweetnacl";
import { encodeBase64, decodeUTF8 } from "tweetnacl-util";

import { Footer, Header, FileUploader } from './components';
import { GlobalStyle } from './config/theme';
import { ToggleThemeContext } from './Root';

const snapId = 'local:http://localhost:8080';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  max-width: 100vw;
`;

export type AppProps = {
  children: ReactNode;
};

export const App: FunctionComponent<AppProps> = ({ children }) => {
  const toggleTheme = useContext(ToggleThemeContext);
  const [secretKey, setSecretKey] = useState<Uint8Array>(() => nacl.randomBytes(nacl.secretbox.keyLength));
  const [snapConnected, setSnapConnected] = useState(false);

  console.log(`SECRET KEY=${secretKey}`);
  
  const checkSnap = async () => {
    const snaps = await window.ethereum.request({ method: 'wallet_getSnaps' }) as Record<string, any>;
    const snap = snaps[snapId];
    setSnapConnected(!!(snap && snap.enabled));    
  };

  async function hashFileSHA256(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', arrayBuffer);
    // Convert ArrayBuffer to hex string
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  // Check Snap status on mount and after Snap connect
  useEffect(() => {
    checkSnap();
  }, []);

  const handleFiles = async (files: File[]) => {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[] | undefined | null;
    const [walletAddress] = accounts ?? [];

    const file = files[0];
    if (!file)
      return;
    const arrayBuffer = await file.arrayBuffer();
    const fileUint8 = new Uint8Array(arrayBuffer);
    const fileHash = hashFileSHA256(file);
    const result : any = await window.ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId,
        request: {
          method: 'getSymKey',
          params: {
            fileHash, 
            walletAddress
          },
        },
      },
    });
    console.log(result.symKey);

    // // Generate a random nonce for this encryption
    const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);

    // Encrypt the file
    const encrypted = nacl.secretbox(fileUint8, nonce, secretKey);

    // For storage or transmission, encode nonce and encrypted data as base64
    const encryptedBase64 = encodeBase64(encrypted);
    const nonceBase64 = encodeBase64(nonce);

    // Example: Save or send { encryptedBase64, nonceBase64 }
    console.log({ encryptedBase64, nonceBase64 });
  };

 


  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <Header handleToggleClick={toggleTheme} />
        { }
        <h2>Upload Your File</h2>
        <FileUploader 
          onFilesSelected={handleFiles} 
          snapConnected={snapConnected}
        />
        Secret key: {secretKey}
        {children}
        <Footer />
      </Wrapper>
    </>
  );
};
