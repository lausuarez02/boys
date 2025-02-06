export const BoysABI = [
  // Add the relevant ABI functions here
  // Example:
  {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
    "name": "tokensOfOwner",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  // ... other functions
] as const; 