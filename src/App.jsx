import Scene from "./components/scene";
// import ConnectWalletButton from './components/ConnectWalletButton';
import { WagmiConfig } from "wagmi";
import config from "./lib/wagmiConfig";

function App() {
  return (
    <WagmiConfig config={config}>
      <div>
        {/* <ConnectWalletButton /> */}
        <Scene />
      </div>
    </WagmiConfig>
  );
}

export default App;
