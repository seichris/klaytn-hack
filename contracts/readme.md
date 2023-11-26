## Decentralized Exchange for Real World Assets

How the contract works

- The contract has two main entities: windfarm and city.
- The windfarm's address is set to the contract deployer, and it has an initial balance of energy tokens.
- The city's address and initial coin balance are set separately.
- Functions sendEnergy and sendCoins facilitate the transfer of energy tokens and coins between the windfarm and the city.
- Checks are in place to ensure only the right entity can make a transfer and that it has sufficient balance.