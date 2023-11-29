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
}) {
  return (
    <div>
      <div className="panel-box-left">
        <ConnectWalletButton />
      </div>
      <div className="panel-box-right">
        <div className="control-panel">
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
          <p>Windfarm: {windfarm.coins.toFixed(2)} coins, {windfarm.energyTokens} energy tokens</p>
          <p>City: {city.coins.toFixed(2)} coins, {city.energyTokens.toFixed(2)} energy tokens</p>
        </div>
      </div>
    </div>
  );
}
