import React, { useState, useEffect } from "react";
import {
  useContractWrite,
  usePublicClient,
  usePrepareContractWrite,
  useSendTransaction,
} from "wagmi";
import { getContract } from "wagmi/actions";
import { ethers } from "ethers";
import ConnectWalletButton from "./ConnectWalletButton";

const contractAddress = "0x32b898222777a6415d3dc0f8c79918754e202405";
const contractABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "city",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "coinBalances",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "energyBalances",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "fundCity",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "sendCoins",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "sendEnergy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_city",
        type: "address",
      },
    ],
    name: "setCity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "windfarm",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export function ControlPanel({
  onToggleEnergy,
  onToggleLights,
  isEnergyStopping,
  isLightsStopping,
  isEnergyOn,
  areLightsOn,
  windfarm,
  city,
  isConnected,
  setCity,
}) {
  // Prepare the contract write
  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: contractABI,
    functionName: "sendCoins",
    args: [1],
    maxPriorityFeePerGas: ethers.parseUnits("2", "gwei"),
    maxFeePerGas: ethers.parseUnits("100", "gwei"),
    // gas: ethers.parseUnits("21000", "wei"),
    gas: 1142069n,
    gasLimit: 1142069n,
  });

  // Use the prepared config in contract write
  const { write, isSuccess, isError, data } = useContractWrite(config);

  // Function to execute the contract write
  const handleFundCity = () => {
    if (write) {
      write();
      setCity((prevCity) => ({
        ...prevCity,
        coins: prevCity.coins + 10,
      }));
    }
  };


  const { sendTransaction } = useSendTransaction();

  const fundCity = async () => {
    if (!contractAddress) {
      console.error("Contract address is not defined");
      return;
    }

    try {
      const transaction = await sendTransaction({
        to: contractAddress, // Contract address
        value: ethers.parseEther("10"), // 10 KLAY
        gas: 42069n,
      });

      console.log("Transaction sent:", transaction);

      // Update city's coin balance
      setCity((prevCity) => ({
        ...prevCity,
        coins: prevCity.coins + 10,
      }));
    } catch (error) {
      console.error("Error sending transaction:", error);
    }
  };

  // const { sendTransaction } = useSendTransaction({
  //   request: {
  //     to: contractAddress,
  //     value: ethers.parseEther('10'), // Amount to send (10 KLAY in this case)
  //   },
  // });

  // const fundCity = async () => {
  //   try {
  //     const transaction = await sendTransaction();
  //     console.log('Transaction sent:', transaction);

  //     // Update the city's coin balance in the frontend
  //     setCity(prevCity => ({
  //       ...prevCity,
  //       coins: prevCity.coins + 10
  //     }));
  //   } catch (error) {
  //     console.error('Error sending transaction:', error);
  //   }
  // };

  return (
    <div>
      <div className="panel-box-left">
        <ConnectWalletButton />
      </div>
      <div className="panel-box-right">
        <div className="control-panel">
          <button
            // onClick={fundCity}
            onClick={handleFundCity}
            disabled={!isConnected}
            className={`fund-button ${isConnected ? "active" : ""}`}
          >
            Fund City with KLAY
          </button>
          <button
            onClick={onToggleEnergy}
            disabled={isEnergyStopping}
            className={isEnergyOn ? "active" : ""}
          >
            Toggle Energy
          </button>
          <button
            onClick={onToggleLights}
            disabled={isLightsStopping}
            className={areLightsOn ? "active" : ""}
          >
            Toggle Lights
          </button>
        </div>
        <div className="status-display">
          <p>
            Windfarm: {windfarm.coins.toFixed(2)} KLAY, {windfarm.energyTokens}{" "}
            energy RWA tokens
          </p>
          <p>
            City: {city.coins.toFixed(2)} KLAY, {city.energyTokens.toFixed(2)}{" "}
            energy RWA tokens
          </p>
        </div>
      </div>
    </div>
  );
}
