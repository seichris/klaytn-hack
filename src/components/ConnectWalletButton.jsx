import React, { useEffect } from 'react';
import { useAccount, useConnect, useBalance, useNetwork, useSwitchNetwork } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

const ConnectWalletButton = () => {
  const klaytnTestnetChainId = 1001; // Klaytn Testnet Chain ID
  const { isConnected, address } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const { data: balanceData, isError, isLoading } = useBalance({
    addressOrName: address,
    chainId: klaytnTestnetChainId,
    watch: isConnected,
  });

  useEffect(() => {
    console.log('Address:', address);
    console.log('Chain ID:', chain?.id);
    console.log('Balance Data:', balanceData);
    console.log('Is Error:', isError);
    console.log('Is Loading:', isLoading);
  }, [address, chain, balanceData, isError, isLoading]);

  useEffect(() => {
    if (isConnected && chain?.id !== klaytnTestnetChainId && switchNetwork) {
      switchNetwork(klaytnTestnetChainId);
    }
  }, [isConnected, chain, switchNetwork]);

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  return (
    <div className="control-panel">
      <button onClick={handleConnect}>
        {isConnected ? (address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : 'Connected') : 'Connect Wallet'}
      </button>
      {isConnected && balanceData && (
        <div>
          <p>Balance: {balanceData.formatted} KLAY</p>
        </div>
      )}
    </div>
  );
};

export default ConnectWalletButton;
