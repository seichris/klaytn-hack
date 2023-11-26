import React, { useState } from "react";

export function ControlPanel({ onToggleEnergy, onToggleLights }) {
  const [isEnergyOn, setIsEnergyOn] = useState(false);
  const [areLightsOn, setAreLightsOn] = useState(false);

  const toggleEnergy = () => {
    setIsEnergyOn(prevIsEnergyOn => {
      const newIsEnergyOn = !prevIsEnergyOn;
      onToggleEnergy(newIsEnergyOn);
      return newIsEnergyOn;
    });
  };
  

  const toggleLights = () => {
    setAreLightsOn(!areLightsOn);
    onToggleLights(!areLightsOn);
  };

  return (
    <div
      className="control-panel"
      style={{ position: "absolute", top: "10px", right: "10px" }}
    >
      <button onClick={toggleEnergy}>
        {isEnergyOn ? "Stop Energy" : "Start Energy"}
      </button>
      <button onClick={toggleLights}>
        {areLightsOn ? "Turn On Lights" : "Turn Off Lights"}
      </button>
    </div>
  );
}
