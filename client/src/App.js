import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import WalletConnect from "./components/WalletConnect";
import "./App.css";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async () => {
    try {
      const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
      await ethProvider.send("eth_requestAccounts", []);
      const signer = ethProvider.getSigner();
      const address = await signer.getAddress();

      const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // your deployed contract address
      const uploadContract = new ethers.Contract(contractAddress, Upload.abi, signer);

      setAccount(address);
      setProvider(ethProvider);
      setContract(uploadContract);
      setIsConnected(true);
      localStorage.setItem("connected", "true");

      window.ethereum.on("chainChanged", () => window.location.reload());
      window.ethereum.on("accountsChanged", () => window.location.reload());
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  const disconnectWallet = () => {
    setAccount("");
    setProvider(null);
    setContract(null);
    setIsConnected(false);
    localStorage.removeItem("connected");
  };

  useEffect(() => {
    if (window.ethereum && localStorage.getItem("connected") === "true") {
      connectWallet();
    }
  }, []);

  return (
    <>
      {modalOpen && (
        <Modal setModalOpen={setModalOpen} contract={contract} />
      )}
      <div className="App">
        <header>
          <div className="overlay">
            <h1>Drive 3.0</h1>
            <h3>Decentralized File Sharing with Blockchain</h3>
            <WalletConnect
              account={account}
              connectWallet={connectWallet}
              disconnectWallet={disconnectWallet}
            />
            {isConnected && (
              <button className="share" onClick={() => setModalOpen(true)}>
                Share
              </button>
            )}
          </div>
        </header>

        {isConnected && (
          <>
            <p style={{ color: "white", margin: "20px 0" }}>
              Account: {account}
            </p>
            <FileUpload
              account={account}
              provider={provider}
              contract={contract}
            />
            <Display contract={contract} account={account} />
          </>
        )}

        {!isConnected && (
          <p style={{ marginTop: "50px", color: "#ccc" }}>
            Please connect your wallet to continue.
          </p>
        )}
      </div>
    </>
  );
}

export default App;
