async function main() {
  // Grab the contract factory
  const CrazyBeeNFT = await ethers.getContractFactory("CrazyBeeNFT");

  // Start deployment, returning a promise that resolves to a contract object
  const crazyBeeNFT = await CrazyBeeNFT.deploy(); // Instance of the contract
  console.log("Contract deployed to address:", crazyBeeNFT.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
