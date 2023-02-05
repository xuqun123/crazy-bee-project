const { model, Schema } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const assetTypes = ["image", "video", "audio", "document"];
const statuses = ["draft", "published", "archived"];

const TokenDetailsSchema = new Schema({
  contractAddress: { type: String },
  tokenId: { type: String },
  transactionId: { type: String },
  tokenStandard: { type: String },
  chain: { type: String },
  metadata: { type: String },
  pinataUrl: { type: String },
  mintingStatus: { type: String },
});

const AssetSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    nftCollectionId: { type: Schema.Types.ObjectId, ref: "NFTCollection", required: true },
    name: { type: String, required: true, unique: true },
    summary: { type: String },
    description: { type: String },
    assetType: { type: String, enum: assetTypes, required: true, index: true },
    status: { type: String, enum: statuses, required: false, index: true },
    coverImageUrl: { type: String, required: false },
    assetUrl: { type: String, required: false },
    tokenDetails: { type: TokenDetailsSchema, required: false },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    publishedAt: { type: Date },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);
AssetSchema.plugin(uniqueValidator);

const AssetModel = model("Asset", AssetSchema);

module.exports = { AssetModel, AssetSchema, assetTypes, statuses };
