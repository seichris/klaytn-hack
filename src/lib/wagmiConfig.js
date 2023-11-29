import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
// import { ethers } from 'ethers';
import { createPublicClient, http } from "viem";
import { klaytn } from 'wagmi/chains'
// import { WalletConnectConnector } from 'wagmi/connectors/WalletConnectConnector';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'

const klaytnChain = {
  id: 1001, // Replace with Klaytn's network ID
  name: "Klaytn",
  network: "klaytn",
  nativeCurrency: {
    name: "Klay",
    symbol: "KLAY",
    decimals: 18,
  },
  rpcUrls: {
    // default: 'https://public-en-baobab.klaytn.net',
    public: {
      http: ["https://public-en-baobab.klaytn.net"],
    },
  },
  blockExplorers: {
    default: { name: "Klaytnscope", url: "https://scope.klaytn.com/" },
  },
  testnet: true,
};

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [klaytnChain],
  [
    publicProvider(),
    // You can add more providers if needed
  ]
);

const config = createConfig({
  autoConnect: true,
  connectors: [
    // new WalletConnectConnector({
    //   chains,
    //   // options: {
    //   //   projectId: 'your-project-id',
    //   //   // Additional configuration options if needed
    //   // },
    // }),
    new MetaMaskConnector({
      chains,
    }),
    // ... other connectors
  ],
  // provider,
  publicClient: createPublicClient({
    chain: klaytn,
    transport: http(),
  }),
  // webSocketProvider: () => new ethers.providers.WebSocketProvider(klaytnChain.rpcUrls.default),
});

export default config;
