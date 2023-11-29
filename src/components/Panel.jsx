import React, { useState, useEffect } from "react";
import ConnectWalletButton from './ConnectWalletButton';

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

  const fundCity = () => {
    setCity(prevCity => ({
      ...prevCity,
      coins: prevCity.coins + 10
    }));
  };

  return (
    <div>
      <div className="panel-box-left">
        <ConnectWalletButton />
      </div>
      <div className="panel-box-right">
        <div className="control-panel">
          <button
            onClick={fundCity}
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
          <p>Windfarm: {windfarm.coins.toFixed(2)} KLAY, {windfarm.energyTokens} energy RWA tokens</p>
          <p>City: {city.coins.toFixed(2)} KLAY, {city.energyTokens.toFixed(2)} energy RWA tokens</p>
        </div>
      </div>
    </div>
  );
}
