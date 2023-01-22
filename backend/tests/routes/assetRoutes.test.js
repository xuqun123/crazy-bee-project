require("dotenv").config();
const express = require("express");
const passport = require("passport");
const expect = require("chai").expect;
const sinon = require("sinon");
const request = require("supertest");
const { omit } = require("lodash");
const jwt = require("jsonwebtoken");
require("../../lib/userAuth");
const {
  createFakeUser,
  createFakeNFTCollection,
  createFakeAsset,
  convertTimestampToString,
} = require("../../lib/fakeDataHelper");
const userRepo = require("../../repos/User");
const assetRepo = require("../../repos/Asset");
const nftCollectionRepo = require("../../repos/NFTCollection");
const assetRoutes = require("../../routes/assetRoutes");

const baseUrl = "/api/assets";
const app = express();
app.use(express.json());
app.use(baseUrl, assetRoutes);

describe("assetRoutes", function () {
  let existingUser, existingNFTCollection, existingAsset;
  let jwtToken;
  const fakeUserPayload = createFakeUser(false);
  let fakeNFTCollectionPayload, fakeAssetPayload;

  before(async () => {
    existingUser = await userRepo.create(fakeUserPayload);

    fakeNFTCollectionPayload = createFakeNFTCollection(false, existingUser._id);
    existingNFTCollection = await nftCollectionRepo.create(fakeNFTCollectionPayload);

    fakeAssetPayload = createFakeAsset(false, existingUser._id, existingNFTCollection._id);
    existingAsset = await assetRepo.create(fakeAssetPayload);

    jwtToken = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
      process.env.SERVER_JWT_SECRET
    );
  });

  describe("GET /api/assets", function () {
    describe("200 response", function () {
      it("returns assets", async function () {
        const response = await request(app)
          .get(
            `${baseUrl}?userId=${existingUser._id}&nftCollectionId=${existingNFTCollection._id}&limit=10&offset=0`
          )
          .set("Accept", "application/json");

        expect(response.statusCode).to.equal(200);
        expect(response.body.data[0]).to.deep.include(
          omit(
            convertTimestampToString(existingAsset.toJSON()),
            "_id",
            "userId",
            "nftCollectionId",
            "tokenDetails"
          )
        );
      });
    });

    describe("400 response", function () {
      let assetRepoStub;

      afterEach(function () {
        if (assetRepoStub) assetRepoStub.restore();
      });

      it("returns an error message when Asset.getMany call is failed", async function () {
        const error = new Error("Asset.getMany call is failed");
        assetRepoStub = sinon.stub(assetRepo, "getMany").rejects(error);

        const response = await request(app)
          .get(`${baseUrl}?userId=${existingUser._id}&nftCollectionId=${existingNFTCollection._id}`)
          .set("Accept", "application/json");

        expect(response.statusCode).to.equal(400);
      });
    });
  });

  describe("GET /api/assets/:id", function () {
    describe("200 response", function () {
      it("returns single asset's data", async function () {
        const response = await request(app)
          .get(`${baseUrl}/${existingAsset._id}`)
          .set("Accept", "application/json");

        expect(response.statusCode).to.equal(200);
        expect(response.body.data).to.deep.include(
          omit(
            convertTimestampToString(existingAsset.toJSON()),
            "_id",
            "userId",
            "nftCollectionId",
            "tokenDetails"
          )
        );
      });
    });

    describe("400 response", function () {
      let assetRepoStub;

      afterEach(function () {
        if (assetRepoStub) assetRepoStub.restore();
      });

      it("returns an error message when Asset.getOne call is failed", async function () {
        const error = new Error("Asset.getOne call is failed");
        assetRepoStub = sinon.stub(assetRepo, "getOne").rejects(error);

        const response = await request(app)
          .get(`${baseUrl}/${existingAsset._id}`)
          .set("Accept", "application/json");

        expect(response.statusCode).to.equal(400);
      });
    });
  });
});
