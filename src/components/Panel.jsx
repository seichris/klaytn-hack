import React, { useState, useEffect } from "react";
import { useContractWrite, usePublicClient, usePrepareContractWrite  } from "wagmi";
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
    args: [10], // Example args
    overrides: {
      maxPriorityFeePerGas: ethers.parseUnits("2", "gwei"), // Adjust based on current network conditions
      maxFeePerGas: ethers.parseUnits("100", "gwei"), // Adjust based on current network conditions
    },
  });

  // Use the prepared config in contract write
  const { write, isSuccess, isError, data } = useContractWrite(config);

  // Function to execute the contract write
  const handleFundCity = () => {
    if (write) {
      write();
      // Additional logic if needed
    }
  };

  // const { write: fundCityWrite } = useContractWrite({
  //   address: contractAddress,
  //   abi: contractABI,
  //   functionName: 'fundCity',
  //   args: [10], // Example args
  //   overrides: {
  //     maxPriorityFeePerGas: ethers.utils.parseUnits('2', 'gwei'), // Adjust based on current network conditions
  //     maxFeePerGas: ethers.utils.parseUnits('100', 'gwei'), // Adjust based on current network conditions
  //   },
  // });

  // const handleFundCity = async () => {
  //   if (!isConnected) return;
  //   try {
  //     await fundCityWrite();
  //   } catch (error) {
  //     console.error('Error funding city:', error);
  //   }
  // };

  // const fundCity = () => {
  //   setCity(prevCity => ({
  //     ...prevCity,
  //     coins: prevCity.coins + 10
  //   }));
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
