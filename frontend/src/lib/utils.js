const generateWalletAddress = (address) =>
  String(address).substring(0, 12) + '...' + String(address).substring(38)

export { generateWalletAddress }
