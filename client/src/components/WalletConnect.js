// src/components/WalletConnect.js
import React from "react";
import "./WalletConnect.css";

const WalletConnect = ({ account, connectWallet, disconnectWallet }) => {
  return (
    <div className="wallet-controls">
      {!account ? (
        <button className="connect-btn" onClick={connectWallet}>
          Connect Wallet
        </button>
      ) : (
        <button className="disconnect-btn" onClick={disconnectWallet}>
          Disconnect
        </button>
      )}
    </div>
  );
};

export default WalletConnect;
