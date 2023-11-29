// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract EnergyTradingDEX is AccessControl, Pausable, Initializable {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    struct EnergyToken {
        uint256 price; // Price per unit in stablecoin
        uint256 availableEnergy; // Available energy units for trading
    }

    IERC20 public stablecoin; // Stablecoin used for transactions
    mapping(address => EnergyToken) public energyTokens; // Energy tokens by provider
    mapping(address => uint256) public energyBalances; // User energy balances
    mapping(address => uint256) public coinBalances; // User coin balances

    event EnergyPurchased(address indexed buyer, address indexed provider, uint256 amount, uint256 totalCost);
    event EnergySold(address indexed seller, address indexed provider, uint256 amount, uint256 totalCost);

    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "Only admin can perform this action");
        _;
    }

    modifier onlyOperator() {
        require(hasRole(OPERATOR_ROLE, msg.sender), "Only operator can perform this action");
        _;
    }

    constructor(address _stablecoinAddress) {
        _setupRole(ADMIN_ROLE, msg.sender);
        _setRoleAdmin(OPERATOR_ROLE, ADMIN_ROLE);
        stablecoin = IERC20(_stablecoinAddress);
    }

    function initialize(address _stablecoinAddress) external initializer {
        stablecoin = IERC20(_stablecoinAddress);
    }

    function registerEnergyProvider(address provider, uint256 pricePerUnit) external onlyAdmin {
        energyTokens[provider] = EnergyToken({
            price: pricePerUnit,
            availableEnergy: 0
        });
        _setupRole(OPERATOR_ROLE, provider);
    }

    function updateEnergyAvailability(address provider, uint256 amount) external onlyOperator {
        EnergyToken storage token = energyTokens[provider];
        token.availableEnergy += amount;
    }

    function buyEnergy(address provider, uint256 amount) external whenNotPaused {
        EnergyToken storage token = energyTokens[provider];
        require(token.availableEnergy >= amount, "Insufficient energy available");
        uint256 totalCost = amount * token.price;
        require(stablecoin.transferFrom(msg.sender, provider, totalCost), "Payment failed");
e
        energyBalancs[msg.sender] += amount;
        token.availableEnergy -= amount;

        emit EnergyPurchased(msg.sender, provider, amount, totalCost);
    }

    function sellEnergy(address provider, uint256 amount) external whenNotPaused {
        require(energyBalances[msg.sender] >= amount, "Insufficient energy to sell");
        EnergyToken storage token = energyTokens[provider];
        uint256 totalCost = amount * token.price;
        
        require(stablecoin.transferFrom(provider, msg.sender, totalCost), "Payment failed");

        energyBalances[msg.sender] -= amount;
        token.availableEnergy += amount;

        emit EnergySold(msg.sender, provider, amount, totalCost);
    }