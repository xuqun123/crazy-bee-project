require("dotenv").config();
const ethers = require("ethers");

// Get Alchemy API Key
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

// Define an Alchemy Provider
const provider = new ethers.providers.AlchemyProvider(
  "goerli",
  ALCHEMY_API_KEY
);

const contract = require("../artifacts/contracts/CrazyBeeNFT.sol/CrazyBeeNFT.json");

console.log("The contract ABI is: ", JSON.stringify(contract.abi));

// Create a signer
const privateKey = process.env.METAMASK_PRIVATE_KEY;
const signer = new ethers.Wallet(privateKey, provider);

// Get contract ABI and address
const abi = contract.abi;
const contractAddress = process.env.CONTRACT_ADDRESS;

// Create a contract instance
const myNftContract = new ethers.Contract(contractAddress, abi, signer);

// Get the NFT Metadata IPFS URL
const tokenUri =
  "https://gateway.pinata.cloud/ipfs/QmSLKSvWrc9Ma3119LsRxA8Pcj9Sm2jcMn7QWnAxfpVBqe"; // this is the json data from the first test nft image uploaded to Pinata before ("bubble bee")

// Call mintNFT function
const mintNFT = async () => {
  let nftTxn = await myNftContract.mintNFT(signer.address, tokenUri);
  await nftTxn.wait();
  console.log(
    `NFT Minted! Check it out at: https://goerli.etherscan.io/tx/${nftTxn.hash}`
  );
};

mintNFT()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
