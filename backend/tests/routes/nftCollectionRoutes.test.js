require("dotenv").config();
const express = require("express");
const expect = require("chai").expect;
const sinon = require("sinon");
const request = require("supertest");
const { faker } = require("@faker-js/faker");
const { createFakeNFTCollection, convertTimestampToString } = require("../../lib/fakeDataHelper");
const nftCollectionRoutes = require("../../routes/nftCollectionRoutes");
const nftCollectionRepo = require("../../repos/NFTCollection");

const baseUrl = "/api/nftCollections";
const app = express();
app.use(express.json());
app.use(baseUrl, nftCollectionRoutes);

describe("nftCollectionsRoutes", function () {
  const nftCollections = Array.from({ length: 1 }, (_) => createFakeNFTCollection(true));
  let nftCollectionRepoStub;

  afterEach(function () {
    if (nftCollectionRepoStub) nftCollectionRepoStub.restore();
  });

  describe("GET /api/nftCollections", function () {
    describe("200 response", function () {
      beforeEach(function () {
        nftCollectionRepoStub = sinon
          .stub(nftCollectionRepo, "getMany")
          .resolves([nftCollections, nftCollections.length, 0, false]);
      });

      it("returns nftCollections", async function () {
        const response = await request(app)
          .get(
            `${baseUrl}?&limit=10&offset=0&name=${nftCollections[0].name}&userId=${nftCollections[0].userId}`
          )
          .set("Accept", "application/json");

        expect(nftCollectionRepoStub.called).to.equal(true);
        expect(response.statusCode).to.equal(200);
        expect(response.body.data).to.deep.equal(
          nftCollections.map((nftCollection) => convertTimestampToString(nftCollection))
        );
      });
    });

    describe("400 response", function () {
      const error = new Error("unexpected error");

      beforeEach(function () {
        nftCollectionRepoStub = sinon.stub(nftCollectionRepo, "getMany").rejects(error);
      });

      it("returns an error message if there's a request error", async function () {
        const response = await request(app).get(baseUrl).set("Accept", "application/json");

        expect(nftCollectionRepoStub.calledWith({})).to.equal(true);
        expect(response.statusCode).to.equal(400);
        expect(response.body.data).to.be.undefined;
        expect(response.body.error).to.equal(error.message);
      });
    });
  });

  describe("GET /api/nftCollections/:id", function () {
    describe("200 response", function () {
      beforeEach(function () {
        nftCollectionRepoStub = sinon.stub(nftCollectionRepo, "getOne").resolves(nftCollections[0]);
      });

      it("returns nftCollections", async function () {
        const response = await request(app)
          .get(`${baseUrl}/${nftCollections[0]._id}`)
          .set("Accept", "application/json");

        expect(
          nftCollectionRepoStub.calledWith({ _id: nftCollections[0]._id, name: undefined })
        ).to.equal(true);
        expect(response.statusCode).to.equal(200);
        expect(response.body.data).to.deep.equal(convertTimestampToString(nftCollections[0]));
      });
    });

    describe("400 response", function () {
      const error = new Error("unexpected error");

      beforeEach(function () {
        nftCollectionRepoStub = sinon.stub(nftCollectionRepo, "getOne").rejects(error);
      });

      it("returns an error message if there's a request error", async function () {
        const response = await request(app)
          .get(`${baseUrl}/${nftCollections[0]._id}`)
          .set("Accept", "application/json");

        expect(
          nftCollectionRepoStub.calledWith({ _id: nftCollections[0]._id, name: undefined })
        ).to.equal(true);
        expect(response.statusCode).to.equal(400);
        expect(response.body.data).to.be.undefined;
        expect(response.body.error).to.equal(error.message);
      });
    });
  });

  describe("POST /api/nftCollections", function () {
    const nftCollection = createFakeNFTCollection();

    describe("200 response", function () {
      beforeEach(function () {
        nftCollectionRepoStub = sinon.stub(nftCollectionRepo, "create").resolves(nftCollection);
      });

      it("creates a nftCollection", async function () {
        const payload = { nftCollection };
        const response = await request(app)
          .post(baseUrl)
          .send(payload)
          .set("Content-Type", "application/json")
          .set("Accept", "application/json");

        expect(nftCollectionRepoStub.calledWith(convertTimestampToString(nftCollection))).to.equal(
          true
        );
        expect(response.statusCode).to.equal(200);
        expect(response.body.data).to.deep.equal(convertTimestampToString(nftCollection));
      });
    });

    describe("400 response", function () {
      const error = new Error("unexpected error");

      beforeEach(function () {
        nftCollectionRepoStub = sinon.stub(nftCollectionRepo, "create").rejects(error);
      });

      it("returns an error message if 'nftCollection' payload is not provided", async function () {
        const payload = { invalid: "payload" };
        const response = await request(app)
          .post(baseUrl)
          .send(payload)
          .set("Content-Type", "application/json")
          .set("Accept", "application/json");

        expect(nftCollectionRepoStub.called).to.equal(false);
        expect(response.statusCode).to.equal(400);
        expect(response.body.data).to.be.undefined;
        expect(response.body.error).to.equal("missing nftCollection params");
      });

      it("returns an error message if there's a request error", async function () {
        const payload = { nftCollection };
        const response = await request(app)
          .post(baseUrl)
          .send(payload)
          .set("Content-Type", "application/json")
          .set("Accept", "application/json");

        expect(nftCollectionRepoStub.called).to.equal(true);
        expect(response.statusCode).to.equal(400);
        expect(response.body.data).to.be.undefined;
        expect(response.body.error).to.equal(error.message);
      });
    });
  });

  describe("PATCH /api/nftCollections/:id", function () {
    const nftCollection = createFakeNFTCollection(true);

    describe("200 response", function () {
      beforeEach(function () {
        nftCollectionRepoStub = sinon.stub(nftCollectionRepo, "update").resolves(nftCollection);
      });

      it("updates a nftCollection", async function () {
        const payload = { nftCollection };
        const response = await request(app)
          .patch(`${baseUrl}/${nftCollection._id}`)
          .send(payload)
          .set("Content-Type", "application/json")
          .set("Accept", "application/json");

        expect(
          nftCollectionRepoStub.calledWith(
            nftCollection._id,
            convertTimestampToString(nftCollection)
          )
        ).to.equal(true);
        expect(response.statusCode).to.equal(200);
        expect(response.body.data).to.deep.equal(convertTimestampToString(nftCollection));
      });
    });

    describe("400 response", function () {
      const error = new Error("unexpected error");

      beforeEach(function () {
        nftCollectionRepoStub = sinon.stub(nftCollectionRepo, "update").rejects(error);
      });

      it("returns an error message if 'nftCollection' payload is not provided", async function () {
        const payload = { invalid: "payload" };
        const response = await request(app)
          .patch(`${baseUrl}/${nftCollection._id}`)
          .send(payload)
          .set("Content-Type", "application/json")
          .set("Accept", "application/json");

        expect(nftCollectionRepoStub.called).to.equal(false);
        expect(response.statusCode).to.equal(400);
        expect(response.body.data).to.be.undefined;
        expect(response.body.error).to.equal("missing nftCollection params");
      });

      it("returns an error message if there's a request error", async function () {
        const payload = { nftCollection };
        const response = await request(app)
          .patch(`${baseUrl}/${nftCollection._id}`)
          .send(payload)
          .set("Content-Type", "application/json")
          .set("Accept", "application/json");

        expect(nftCollectionRepoStub.called).to.equal(true);
        expect(response.statusCode).to.equal(400);
        expect(response.body.data).to.be.undefined;
        expect(response.body.error).to.equal(error.message);
      });
    });
  });

  describe("DELETE /api/nftCollections/:id", function () {
    const nftCollection = createFakeNFTCollection(true);

    describe("200 response", function () {
      beforeEach(function () {
        nftCollectionRepoStub = sinon.stub(nftCollectionRepo, "delete").resolves(nftCollection);
      });

      it("deletes a nftCollection", async function () {
        const payload = { nftCollection };
        const response = await request(app)
          .delete(`${baseUrl}/${nftCollection._id}`)
          .set("Content-Type", "application/json")
          .set("Accept", "application/json");

        expect(nftCollectionRepoStub.calledWith(nftCollection._id)).to.equal(true);
        expect(response.statusCode).to.equal(200);
        expect(response.body.data).to.deep.equal(convertTimestampToString(nftCollection));
      });
    });

    describe("400 response", function () {
      const error = new Error("unexpected error");

      beforeEach(function () {
        nftCollectionRepoStub = sinon.stub(nftCollectionRepo, "delete").rejects(error);
      });

      it("returns an error message if there's a request error", async function () {
        const response = await request(app)
          .delete(`${baseUrl}/${nftCollection._id}`)
          .set("Content-Type", "application/json")
          .set("Accept", "application/json");

        expect(nftCollectionRepoStub.calledWith(nftCollection._id)).to.equal(true);
        expect(response.statusCode).to.equal(400);
        expect(response.body.data).to.be.undefined;
        expect(response.body.error).to.equal(error.message);
      });
    });
  });
});
