import React, { useState, useEffect, useContext, ChangeEvent } from 'react';
import type { FunctionComponent, ReactNode } from 'react';
import styled from 'styled-components';

import nacl from "tweetnacl";
import { encodeBase64, decodeUTF8 } from "tweetnacl-util";

import { Footer, Header } from './components';
import { GlobalStyle } from './config/theme';
import { ToggleThemeContext } from './Root';

const snapId = 'local:http://localhost:8080';


// Styled components
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  max-width: 100vw;
  padding: 2rem;
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const Button = styled.button`
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  border-radius: 4px;
  background: #2e2e2e;
  color: #fff;
  border: none;
  cursor: pointer;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  &:disabled {
    background: #888;
    cursor: not-allowed;
  }
`;

const Pre = styled.pre`
  background: #f6f6f6;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 0.95rem;
`;

const Label = styled.label`
  font-weight: 500;
`;

const Input = styled.input`
  margin-top: 0.5rem;
  margin-bottom: 1rem;
`;

export type AppProps = {
  children: ReactNode;
};

export const App: FunctionComponent<AppProps> = ({ children }) => {
  const toggleTheme = useContext(ToggleThemeContext);

  // TODO: remove
  const [secretKey, setSecretKey] = useState<Uint8Array>(() => nacl.randomBytes(nacl.secretbox.keyLength));

  const [snapConnected, setSnapConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<CryptoKey | null>(null);
  const [privateKey, setPrivateKey] = useState<CryptoKey | null>(null);
  const [publicKeyJwk, setPublicKeyJwk] = useState<string>('');
  const [privateKeyJwk, setPrivateKeyJwk] = useState<string>('');
  const [encryptedBase64Data, setEncryptedBase64Data] = useState<string>('');
  const [decryptedText, setDecryptedText] = useState<string>('');
  const [encrypting, setEncrypting] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [decrypting, setDecrypting] = useState<boolean>(false);

  // <HELPERS>
  // --- Cookie helpers ---
  function setCookie(name: string, value: string, days: number) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
  }
  function getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      if (c) {
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }
    return null;
  }

  // --- ArrayBuffer <-> Base64 helpers ---
  function arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i] as number);
    }
    return window.btoa(binary);
  }
  function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = window.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  // Will not be used
  async function hashFileSHA256(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', arrayBuffer);
    // Convert ArrayBuffer to hex string
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  // </HELPERS>

  const checkSnap = async () => {
    const snaps = await window.ethereum.request({ method: 'wallet_getSnaps' }) as Record<string, any>;
    const snap = snaps[snapId];
    setSnapConnected(!!(snap && snap.enabled));    
  };


  // <CRYPTO>

  // --- Key generation ---
  const generateRSAKeyPair = async () => {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"]
    );
    setPrivateKey(keyPair.privateKey);
    setPublicKey(keyPair.publicKey);

    const publicJwk = await window.crypto.subtle.exportKey("jwk", keyPair.publicKey);
    const privateJwk = await window.crypto.subtle.exportKey("jwk", keyPair.privateKey);

    setPublicKeyJwk(JSON.stringify(publicJwk, null, 2));
    setPrivateKeyJwk(JSON.stringify(privateJwk, null, 2));
    setCookie("publicKey", JSON.stringify(publicJwk), 7);
    setCookie("privateKey", JSON.stringify(privateJwk), 7);
  };

  // --- Encryption ---
  const handleEncrypt = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const form = (event.target as HTMLButtonElement).form as any;
    const fileInput = form?.file as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (!publicKey) {
      alert("RSA public key is not available. Please generate it first.");
      return;
    }
    if (!file) {
      alert("Please select a file first.");
      return;
    }
    setEncrypting(true);
    try {
      // Export & import public key as in original code
      const exportedPublicKey = await window.crypto.subtle.exportKey("spki", publicKey);
      const importedPublicKey = await window.crypto.subtle.importKey(
        "spki",
        exportedPublicKey,
        { name: "RSA-OAEP", hash: "SHA-256" },
        false,
        ["encrypt"]
      );
      const fileData = await file.arrayBuffer();
      const encryptedData = await window.crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        importedPublicKey,
        fileData
      );
      // Convert to base64
      const base64 = arrayBufferToBase64(encryptedData);
      setEncryptedBase64Data(base64);
      alert("File encrypted successfully! You can now upload the encrypted file.");
    } catch (error: any) {
      alert("Encryption failed: " + error.message);
    }
    setEncrypting(false);
  };


  // --- Decryption ---
  const handleDecrypt = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const form = (event.target as HTMLButtonElement).form as any;
    const fileInput = form?.encryptedFileInput as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (!privateKey) {
      alert("RSA private key is not available. Please generate it first.");
      return;
    }
    if (!file) {
      alert("Please select the encrypted file first.");
      return;
    }
    setDecrypting(true);
    try {
      // Export & import private key as in original code
      const exportedPrivateKey = await window.crypto.subtle.exportKey("pkcs8", privateKey);
      const importedPrivateKey = await window.crypto.subtle.importKey(
        "pkcs8",
        exportedPrivateKey,
        { name: "RSA-OAEP", hash: "SHA-256" },
        false,
        ["decrypt"]
      );
      const fileData = await file.arrayBuffer();
      // The uploaded file is base64 text, so decode it first
      const text = new TextDecoder().decode(fileData);
      const encryptedData = base64ToArrayBuffer(text.trim());
      const decrypted = await window.crypto.subtle.decrypt(
        { name: "RSA-OAEP" },
        importedPrivateKey,
        encryptedData
      );
      const resultText = new TextDecoder().decode(decrypted);
      setDecryptedText(resultText);
      alert("File decrypted successfully!");
    } catch (error: any) {
      alert("Decryption failed: " + error.message);
    }
    setDecrypting(false);
  };


  // </CRYPTO>


  // --- Upload ---
  const handleUpload = async () => {
    if (!encryptedBase64Data) {
      alert("No file has been encrypted yet.");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", new Blob([encryptedBase64Data], { type: "text/plain" }), "encryptedFile.txt");
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      if (response.ok) {
        alert('Encrypted file uploaded successfully');
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error: any) {
      alert('Failed to upload encrypted file.');
    }
    setUploading(false);
  };


  // --- Load keys from cookies on mount ---
  useEffect(() => {

    // Check Snap status on mount and after Snap connect
    checkSnap();

    const pub = getCookie('publicKey');
    const priv = getCookie('privateKey');
    if (pub && priv) {
      setPublicKeyJwk(pub);
      setPrivateKeyJwk(priv);
      // Try to import keys for use
      (async () => {
        try {
          const importedPub = await window.crypto.subtle.importKey(
            'jwk',
            JSON.parse(pub),
            { name: 'RSA-OAEP', hash: 'SHA-256' },
            true,
            ['encrypt']
          );
          setPublicKey(importedPub);
          const importedPriv = await window.crypto.subtle.importKey(
            'jwk',
            JSON.parse(priv),
            { name: 'RSA-OAEP', hash: 'SHA-256' },
            true,
            ['decrypt']
          );
          setPrivateKey(importedPriv);
        } catch (e) {
          setPublicKey(null);
          setPrivateKey(null);
        }
      })();
    }
  }, []);


  console.log(`SECRET KEY=${secretKey}`);

  // --- Render ---
  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <Header handleToggleClick={toggleTheme} />
        <h1>RSA Key Generation and File Encryption/Decryption</h1>

        <Section>
          <h2>1. Generate RSA Key Pair</h2>
          <Button onClick={generateRSAKeyPair}>Generate RSA Key Pair</Button>
          <h3>Public Key:</h3>
          <Pre>{publicKeyJwk}</Pre>
          <h3>Private Key:</h3>
          <Pre>{privateKeyJwk}</Pre>
        </Section>

        <form>
          <Section>
            <h2>2. Encrypt a File</h2>
            <Label htmlFor="file">Select file to encrypt:</Label>
            <br />
            <Input type="file" id="file" name="file" required />
            <br />
            <Button type="button" onClick={handleEncrypt} disabled={encrypting}>Encrypt File</Button>
          </Section>

          <Section>
            <h2>3. Upload the Encrypted File</h2>
            <Button type="button" onClick={handleUpload} disabled={!encryptedBase64Data || uploading}>
              Upload Encrypted File
            </Button>
          </Section>

          <Section>
            <h2>4. Decrypt Encrypted File</h2>
            <Input type="file" id="encryptedFileInput" name="encryptedFileInput" accept=".txt" />
            <br />
            <Button type="button" onClick={handleDecrypt} disabled={decrypting}>Decrypt File</Button>
            <h3>Decrypted File:</h3>
            <Pre>{decryptedText}</Pre>
          </Section>
        </form>

        <Footer />
      </Wrapper>
    </>
  );
};
