import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { GlowWalletAdapter, PhantomWalletAdapter, SlopeWalletAdapter } from '@solana/wallet-adapter-wallets';

import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";

export const WalletConnectProvider = ({children}) => {
  const network = WalletAdapterNetwork.Devnet

  const endpoint = useMemo(() => {
    if(network === WalletAdapterNetwork.Devnet) {
      return 'https://evocative-tame-river.solana-devnet.discover.quiknode.pro/65be9c4ea7786f2195f0864719c60d27a1575bc3/'
    }

    return clusterApiUrl(network)
  }, [network])

  const wallets = useMemo(() => [new PhantomWalletAdapter(), new GlowWalletAdapter(), new SlopeWalletAdapter], [network])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}