const { model, Schema } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const collectionTypes = ["image", "video", "audio", "document"];
const statuses = ["draft", "published", "archived"];

const NFTCollectionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
    name: { type: String, required: true, unique: true },
    summary: { type: String },
    description: { type: String },
    collectionTypes: { type: [String], enum: collectionTypes, required: false, index: true },
    status: { type: String, enum: statuses, required: false, index: true },
    coverImageUrl: { type: String, required: false },
    bannerImageUrl: { type: String, required: false },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    publishedAt: { type: Date },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);
NFTCollectionSchema.plugin(uniqueValidator);

const NFTCollectionModel = model("NFTCollection", NFTCollectionSchema);

module.exports = { NFTCollectionModel, NFTCollectionSchema, collectionTypes, statuses };
