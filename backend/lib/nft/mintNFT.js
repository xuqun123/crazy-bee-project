require("dotenv").config();
const ethers = require("ethers");
const { generateNFTMetadataToPinata } = require("./pinata");
const assetRepo = require("../../repos/Asset");

// the contract ABI is copied from nft-minting-v2/artifacts/contracts/CrazyBeeNFT.sol/CrazyBeeNFT.json,
// which is automatically generated by hardhat while compiling the "CrazyBeeNFT" smart contract
const contract = require("./CrazyBeeNFT-contract.json");

const { ALCHEMY_API_KEY, CONTRACT_ADDRESS } = process.env;
const abi = contract.abi;

const MINTING_STATUSES = {
  not_minted: "not_minted",
  minted: "minted",
  minting: "minting",
};

// build the NFT token metadata details
const buildAssetTokenDetails = (asset, receiverAddress) => {
  const updatedAsset = Object.assign(asset, {
    tokenDetails: {
      contractAddress: process.env.CONTRACT_ADDRESS,
      tokenStandard: "ERC721",
      chain: "Goerli", // ETH testing network
      pinataUrl: receiverAddress ? MINTING_STATUSES.minting : null,
      transactionId: receiverAddress ? MINTING_STATUSES.minting : null,
      mintingStatus: receiverAddress ? MINTING_STATUSES.minting : MINTING_STATUSES.not_minted,
    },
  });

  return updatedAsset;
};

// mint NFT and send to a given receiver wallet address
const mintNFT = async (receiverAddress, tokenURL) => {
  console.log(
    `[NFT Minting] Start to mint a new NFT to blockchain now: {tokenURL: ${tokenURL}, receiverAddress: ${receiverAddress}}`
  );

  // Define an Alchemy Provider
  const provider = new ethers.providers.AlchemyProvider("goerli", ALCHEMY_API_KEY);

  // Create a signer, the signer is always from the "Crazy Bee DApp" wallet account
  const privateKey = process.env.METAMASK_PRIVATE_KEY;
  const signer = new ethers.Wallet(privateKey, provider);

  // Create a contract instance
  const myNftContract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

  // Mint the NFT to a receiver wallet address
  let nftTxn = await myNftContract.mintNFT(receiverAddress, tokenURL);
  await nftTxn.wait();

  console.log(
    `[NFT Minting] A new NFT has been generated successfully! Check it out at: https://goerli.etherscan.io/tx/${nftTxn.hash}.`
  );

  // return the minted NFT transaction object in the end
  return nftTxn;
};

const uploadToPinataAndMintNFT = (asset, assetId, receiverAddress) => {
  console.log(`[NFT Minting] Start the minting process now for asset: ${assetId}`);
  const tokenDetails = asset.tokenDetails;

  generateNFTMetadataToPinata(asset.name, asset.assetUrl, asset.summary)
    .then(async ({ success, message, pinataUrl }) => {
      try {
        let newTokenDetails = {
          ...tokenDetails,
          pinataUrl: success ? pinataUrl : message,
        };

        console.log(
          `[Pinata Upload] The NFT metadata for asset (${assetId}) has been uploaded to Pinata: `,
          newTokenDetails.pinataUrl
        );

        // update asset.tokenDetails.pinataUrl to DB
        await assetRepo.update(assetId, {
          tokenDetails: newTokenDetails,
        });
        console.log(
          `[Pinata Upload] The asset's (${assetId}) pinataUrl metadata has been updated successfully!`
        );

        // finally mint the NFT token with pinata NFT metadata
        if (success) {
          const nftTxn = await mintNFT(receiverAddress, pinataUrl);

          // update asset.tokenDetails.transactionId to DB
          await assetRepo.update(assetId, {
            tokenDetails: {
              ...newTokenDetails,
              transactionId: nftTxn.hash,
              // tokenId: nftTxn.chainId,
              mintingStatus: MINTING_STATUSES.minted,
            },
          });
        }

        console.log(`[NFT Minting] End of the minting process for asset: ${assetId}`);
      } catch (error) {
        console.error(`[NFT Minting] Failed to mint asset (${assetId}) due to: ${error.message}`);

        // update asset.tokenDetails.mintingStatus with errors to DB
        assetRepo.update(assetId, {
          tokenDetails: {
            ...buildAssetTokenDetails(asset, receiverAddress).tokenDetails,
            mintingStatus: error.message,
          },
        });
      }
    })
    .catch((error) => {
      console.error(
        `[Pinata Upload or NFT Minting] Failed to upload asset (${assetId}) metadata to Pinata or mint NFT due to: ${error.message}`
      );

      // update asset.tokenDetails.mintingStatus with errors to DB
      assetRepo.update(assetId, {
        tokenDetails: {
          ...buildAssetTokenDetails(asset, receiverAddress).tokenDetails,
          mintingStatus: error.message,
        },
      });
    });
};

module.exports = { buildAssetTokenDetails, mintNFT, uploadToPinataAndMintNFT, MINTING_STATUSES };
