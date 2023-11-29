import React from 'react';
import Scene from "./components/scene";
import { WagmiConfig } from "wagmi";
import config from "./lib/wagmiConfig";

function App() {

  return (
    <WagmiConfig config={config}>
      <div>
        <Scene />
      </div>
    </WagmiConfig>
  );
}

export default App;
