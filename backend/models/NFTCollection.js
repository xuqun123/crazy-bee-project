const { mongoose, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const collectionTypes = ["image", "video", "audio", "document"];
const statuses = ["draft", "published", "archived"];

const NFTCollectionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
    name: { type: String, required: true, unique: true },
    summary: { type: String },
    description: { type: String },
    collectionType: { type: String, enum: collectionTypes, required: false, index: true },
    status: { type: String, enum: statuses, required: false, index: true },
    coverImageUrl: { type: String, required: false },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    publishedAt: { type: Date },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
NFTCollectionSchema.plugin(uniqueValidator);

const NFTCollectionModel = model("NFTCollection", NFTCollectionSchema);

module.exports = { NFTCollectionModel, NFTCollectionSchema, collectionTypes, statuses };
