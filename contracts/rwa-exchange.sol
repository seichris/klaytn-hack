// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EnergyTrading {
    address public windfarm;
    address public city;

    mapping(address => uint256) public energyBalances;
    mapping(address => uint256) public coinBalances;

    constructor() {
        windfarm = msg.sender; // The contract deployer is considered the windfarm
        energyBalances[windfarm] = 1000; // Initial energy tokens for the windfarm
        coinBalances[city] = 1000; // Initial coins for the city
    }

    function setCity(address _city) external {
        require(msg.sender == windfarm, "Only the windfarm can set the city");
        city = _city;
        energyBalances[city] = 100; // Initial energy tokens for the city
    }

    function sendEnergy(uint256 amount) external {
        require(msg.sender == windfarm, "Only the windfarm can send energy");
        require(energyBalances[windfarm] >= amount, "Insufficient energy tokens");
        energyBalances[windfarm] -= amount;
        energyBalances[city] += amount;
    }

    function sendCoins(uint256 amount) external {
        require(msg.sender == city, "Only the city can send coins");
        require(coinBalances[city] >= amount, "Insufficient coins");
        coinBalances[city] -= amount;
        coinBalances[windfarm] += amount;
    }
}
