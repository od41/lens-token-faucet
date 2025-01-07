"use client";

import styles from "./page.module.css";
import { useState } from "react";
import { ethers } from "ethers";

export default function Home() {
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const requestTokens = async () => {
    const addressInput = (document.getElementById('addressInput') as HTMLInputElement).value;
    setIsLoading(true);
    setTxHash("");
    setError("");
    try {
      // Validate address format
      if (!ethers.utils.isAddress(addressInput)) {
        throw new Error("Invalid Ethereum address format");
      }

      const response = await fetch('/api/request-tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: addressInput }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to request tokens");
      }

      setTxHash(data.transactionHash);
    } catch (err) {
      console.error(err);
      setError(`❌ Error: ${(err as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <h1>F$ (F Dollars) Faucet</h1>
      <div className="container">
        <h2>Get 5000 F$ to play around with <a href="https://fitfi.vercel.app">FitFi</a> on Lens Sepolia</h2>
        <input
          type="text"
          id="addressInput"
          placeholder="Enter your wallet address (0x...)"
          disabled={isLoading}
          style={{
            marginTop: '10px',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            width: '100%',
            boxSizing: 'border-box',
          }}
        />
        <br />
        <button
          onClick={requestTokens}
          disabled={isLoading}
          style={{
            backgroundColor: isLoading ? 'gray' : 'purple',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
            marginTop: '10px',
          }}
        >
          {isLoading ? 'Processing...' : 'Request Tokens'}
        </button>
      </div>
      <div id="output">
        {isLoading && <div className={styles.loading}>Processing request...</div>}
        {txHash && <div className={styles.success}>✅ Success! 5000 F$ has been sent. <a href={`https://block-explorer.testnet.lens.dev/tx/${txHash}`} target="_blank" rel="noopener noreferrer">View Transaction</a></div>}
        {error && <div className={styles.error}>{error}</div>}
      </div>
    </div>
  );
}
