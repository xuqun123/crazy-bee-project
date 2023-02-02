require("dotenv").config();
const express = require("express");
const expect = require("chai").expect;
const sinon = require("sinon");
const request = require("supertest");
const { faker } = require("@faker-js/faker");
const { omit } = require("lodash");
const {
  createFakeNFTCollection,
  convertTimestampToString,
  createFakeUser,
  createFakeAsset,
} = require("../../lib/fakeDataHelper");
const assetRoutes = require("../../routes/assetRoutes");
const assetRepo = require("../../repos/Asset");
const nftCollectionRepo = require("../../repos/NFTCollection");
const userRepo = require("../../repos/User");

const baseUrl = "/api/assets";
const app = express();
app.use(express.json());
app.use(baseUrl, assetRoutes);

describe("assetsRoutes", function () {
  let existingNftCollection, existingUser, existingAsset, assets;
  let assetRepoStub;

  before(async () => {
    existingUser = await userRepo.create(createFakeUser());
    existingNftCollection = await nftCollectionRepo.create({
      ...createFakeNFTCollection(),
      userId: existingUser._id,
    });
    existingAsset = await assetRepo.create({
      ...createFakeAsset(),
      userId: existingUser._id,
      nftCollectionId: existingNftCollection._id,
    });
    assets = [existingAsset.toJSON()];
  });

  afterEach(function () {
    if (assetRepoStub) assetRepoStub.restore();
  });

  describe("GET /api/assets", function () {
    describe("200 response", function () {
      it("returns assets", async function () {
        const response = await request(app).get(
          `${baseUrl}?&limit=10&offset=0&nftCollectionId=${existingNftCollection._id}&userId=${existingAsset.userId}`
        );

        expect(response.statusCode).to.equal(200);
        expect(response.body.data[0]).to.deep.include(
          omit(convertTimestampToString(assets[0]), [
            "_id",
            "userId",
            "nftCollectionId",
            "tokenDetails",
          ])
        );
      });
    });

    describe("400 response", function () {
      const error = new Error("unexpected error");

      beforeEach(function () {
        assetRepoStub = sinon.stub(assetRepo, "getMany").rejects(error);
      });

      it("returns an error message if there's a request error", async function () {
        const response = await request(app).get(baseUrl).set("Accept", "application/json");

        expect(response.statusCode).to.equal(400);
        expect(response.body.data).to.be.undefined;
        expect(response.body.error).to.equal(error.message);
      });
    });
  });

  describe("GET /api/assets/:id", function () {
    describe("200 response", function () {
      it("returns assets", async function () {
        const response = await request(app)
          .get(`${baseUrl}/${assets[0]._id}`)
          .set("Accept", "application/json");

        expect(response.statusCode).to.equal(200);
        expect(response.body.data).to.deep.include(
          omit(convertTimestampToString(assets[0]), [
            "_id",
            "userId",
            "nftCollectionId",
            "tokenDetails",
          ])
        );
      });
    });

    describe("400 response", function () {
      const error = new Error("unexpected error");
      beforeEach(function () {
        assetRepoStub = sinon.stub(assetRepo, "getOne").rejects(error);
      });

      it("returns an error message if there's a request error", async function () {
        const response = await request(app)
          .get(`${baseUrl}/${assets[0]._id}`)
          .set("Accept", "application/json");

        expect(response.statusCode).to.equal(400);
        expect(response.body.data).to.be.undefined;
        expect(response.body.error).to.equal(error.message);
      });
    });
  });

  describe("POST /api/assets", function () {
    const asset = createFakeAsset();

    describe("200 response", function () {
      it("creates a asset", async function () {
        const payload = {
          asset: { ...asset, userId: existingUser._id, nftCollectionId: existingNftCollection._id },
        };
        const response = await request(app)
          .post(baseUrl)
          .send(payload)
          .set("Content-Type", "application/json")
          .set("Accept", "application/json");

        expect(response.statusCode).to.equal(200);
        expect(response.body.data).to.deep.include(
          omit(convertTimestampToString(asset), ["tokenDetails"])
        );
      });
    });

    describe("400 response", function () {
      const error = new Error("unexpected error");

      beforeEach(function () {
        assetRepoStub = sinon.stub(assetRepo, "create").rejects(error);
      });

      it("returns an error message if 'asset' payload is not provided", async function () {
        const payload = { invalid: "payload" };
        const response = await request(app)
          .post(baseUrl)
          .send(payload)
          .set("Content-Type", "application/json")
          .set("Accept", "application/json");

        expect(response.statusCode).to.equal(400);
        expect(response.body.data).to.be.undefined;
        expect(response.body.error).to.equal("missing asset params");
      });

      it("returns an error message if there's a request error", async function () {
        const payload = { asset };
        const response = await request(app)
          .post(baseUrl)
          .send(payload)
          .set("Content-Type", "application/json")
          .set("Accept", "application/json");

        expect(response.statusCode).to.equal(400);
        expect(response.body.data).to.be.undefined;
        expect(response.body.error).to.equal(error.message);
      });
    });
  });

  describe("PATCH /api/assets/:id", function () {
    describe("200 response", function () {
      it("updates a asset", async function () {
        const newData = { name: "new name", summary: "new summary" };
        const payload = { asset: newData };

        const response = await request(app)
          .patch(`${baseUrl}/${assets[0]._id}`)
          .send(payload)
          .set("Content-Type", "application/json")
          .set("Accept", "application/json");

        expect(response.statusCode).to.equal(200);
        expect(response.body.data).to.deep.include(newData);
      });
    });

    describe("400 response", function () {
      const error = new Error("unexpected error");

      beforeEach(function () {
        assetRepoStub = sinon.stub(assetRepo, "update").rejects(error);
      });

      it("returns an error message if 'asset' payload is not provided", async function () {
        const payload = { invalid: "payload" };
        const response = await request(app)
          .patch(`${baseUrl}/${assets[0]._id}`)
          .send(payload)
          .set("Content-Type", "application/json")
          .set("Accept", "application/json");

        expect(response.statusCode).to.equal(400);
        expect(response.body.data).to.be.undefined;
        expect(response.body.error).to.equal("missing asset params");
      });

      it("returns an error message if there's a request error", async function () {
        const payload = { asset: { name: "new name" } };
        const response = await request(app)
          .patch(`${baseUrl}/${assets[0]._id}`)
          .send(payload)
          .set("Content-Type", "application/json")
          .set("Accept", "application/json");

        expect(assetRepoStub.called).to.equal(true);
        expect(response.statusCode).to.equal(400);
        expect(response.body.data).to.be.undefined;
        expect(response.body.error).to.equal(error.message);
      });
    });
  });

  describe("DELETE /api/assets/:id", function () {
    let newAsset;

    beforeEach(async () => {
      newAsset = await assetRepo.create({
        ...createFakeAsset(),
        userId: existingUser._id,
        nftCollectionId: existingNftCollection._id,
      });
    });

    describe("200 response", function () {
      it("deletes a asset", async function () {
        const response = await request(app)
          .delete(`${baseUrl}/${newAsset._id}`)
          .set("Content-Type", "application/json")
          .set("Accept", "application/json");

        expect(response.statusCode).to.equal(200);
        expect(response.body.data).to.deep.include(
          omit(convertTimestampToString(newAsset.toJSON()), [
            "_id",
            "userId",
            "nftCollectionId",
            "tokenDetails",
          ])
        );
      });
    });

    describe("400 response", function () {
      const error = new Error("unexpected error");

      beforeEach(function () {
        assetRepoStub = sinon.stub(assetRepo, "delete").rejects(error);
      });

      it("returns an error message if there's a request error", async function () {
        const response = await request(app)
          .delete(`${baseUrl}/${assets[0]._id}`)
          .set("Content-Type", "application/json")
          .set("Accept", "application/json");

        expect(response.statusCode).to.equal(400);
        expect(response.body.data).to.be.undefined;
        expect(response.body.error).to.equal(error.message);
      });
    });
  });
});
