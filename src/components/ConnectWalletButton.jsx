import React, { useEffect } from 'react';
import { useAccount, useConnect, useBalance, useNetwork, useSwitchNetwork } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

const ConnectWalletButton = () => {
  const { isConnected, address } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { data: balanceData, isError, isLoading, error } = useBalance({
    addressOrName: address,
    watch: isConnected, // Update balance when the connection status changes
  });
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  // Klaytn testnet chain ID (replace with the actual ID)
  const klaytnTestnetChainId = 1001;

  useEffect(() => {
    if (isConnected && chain?.id !== klaytnTestnetChainId) {
      switchNetwork?.(klaytnTestnetChainId);
    }
  }, [isConnected, chain, switchNetwork]);

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  useEffect(() => {
    console.log('Balance Data:', balanceData);
    console.log('Is Error:', isError);
    console.log('Is Loading:', isLoading);
    if (error) {
      console.error('Balance Fetch Error:', error);
    }
  }, [balanceData, isError, isLoading, error]);

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
