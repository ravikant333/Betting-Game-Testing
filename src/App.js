import logo from './logo.svg';
import './App.css';
import idl from "./idl.json";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import {
	Program,
	Provider,
	web3,
	utils,
	BN,
} from "@project-serum/anchor";
import { WalletConnectProvider } from './components/WalletConnection';
import CreateCampaign from './components/CreateCampaign';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import '@solana/wallet-adapter-react-ui/styles.css'




function App() {

  return (
    <div className="App">
    <WalletConnectProvider>
      <WalletMultiButton/>
      <CreateCampaign/>
    </WalletConnectProvider>
    </div>
  );
}

export default App;
