import React from 'react';
// import { useAccount } from 'wagmi';
import Scene from "./components/scene";
import { WagmiConfig } from "wagmi";
import config from "./lib/wagmiConfig";

function App() {
  // const { isConnected } = useAccount();

  return (
    <WagmiConfig config={config}>
      <div>
        {/* Pass isConnected to Scene */}
        {/* <Scene isConnected={isConnected} /> */}
        <Scene />
      </div>
    </WagmiConfig>
  );
}

export default App;
