import React, { useState, useEffect } from "react";

export function ControlPanel({ onToggleEnergy, onToggleLights, isEnergyStopping, isLightsStopping, isEnergyOn, areLightsOn }) {
    return (
      <div className="control-panel" style={{ position: "absolute", top: "10px", right: "10px" }}>
        <button onClick={onToggleEnergy} disabled={isEnergyStopping} className={isEnergyOn ? "active" : ""}>
          Toggle Energy
        </button>
        <button onClick={onToggleLights} disabled={isLightsStopping} className={areLightsOn ? "active" : ""}>
          Toggle Lights
        </button>
      </div>
    );
  }

// export function ControlPanel({ onToggleEnergy, onToggleLights }) {
//     const [isEnergyOn, setIsEnergyOn] = useState(false);
//     const [areLightsOn, setAreLightsOn] = useState(false);
  
//     const toggleEnergy = () => {
//       setIsEnergyOn(prevIsEnergyOn => {
//         onToggleEnergy(!prevIsEnergyOn); // Trigger parent's handler
//         return !prevIsEnergyOn;
//       });
//     };
    
//     const toggleLights = () => {
//       setAreLightsOn(prevAreLightsOn => {
//         onToggleLights(!prevAreLightsOn); // Trigger parent's handler
//         return !prevAreLightsOn;
//       });
//     };  
  
//     return (
//       <div
//         className="control-panel"
//         style={{ position: "absolute", top: "10px", right: "10px" }}
//       >
//         <button onClick={toggleEnergy}>
//           {isEnergyOn ? "Stop Energy" : "Start Energy"}
//         </button>
//         <button onClick={toggleLights}>
//           {areLightsOn ? "Turn On Lights" : "Turn Off Lights"}
//         </button>
//       </div>
//     );
//   }
  