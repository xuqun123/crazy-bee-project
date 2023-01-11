require("dotenv").config();
let express = require("express");
const expect = require("chai").expect;
const request = require("request");
const { faker } = require("@faker-js/faker");

const baseUrl = `http://localhost:${process.env.PORT}/api/nftCollections`;

describe("nftCollectionsRoutes", function () {
  describe("Get nftCollections", function () {
    it("returns status 200 to check if api works", function (done) {
      request(baseUrl, function (error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });

    it("returns the result as a collection of multiple nftCollections with the exepected object keys", function (done) {
      request(baseUrl, function (error, response, body) {
        body = JSON.parse(body);

        expect(body.error).to.be.undefined;
        expect(body.data).to.be.a("array");
        expect(body.data.length).to.greaterThan(0);

        const nftCollection = body.data[0];
        expect(nftCollection).to.be.a("object");
        expect(nftCollection).to.contain.keys(["_id", "name", "summary"]);
        done();
      });
    });
  });

  describe("Create a nftCollection", function () {
    it("returns status 200 with the newly created project result if payload is valid", function (done) {
      const payload = {
        nftCollection: {
          // userId: faker.datatype.uuid(),
          name: faker.lorem.words(6),
          summary: faker.lorem.sentence(),
          description: faker.lorem.paragraph(),
          collectionType: "image",
          status: "draft",
          publishedAt: faker.date.past(),
        },
      };

      request(
        {
          url: baseUrl,
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: payload,
          json: true,
        },
        function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          expect(body.data).to.be.a("object");

          const nftCollection = body.data;
          expect(nftCollection).to.contain.keys(["_id", "name", "summary"]);
          expect(nftCollection.name).to.equal(payload.nftCollection.name);
          expect(nftCollection.summary).to.equal(payload.nftCollection.summary);
          expect(nftCollection.status).to.equal(payload.nftCollection.status);
          done();
        }
      );
    });

    it("returns 400 if payload is invalid", function (done) {
      const payload = { name: faker.lorem.words(6) };

      request(
        {
          url: baseUrl,
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: payload,
          json: true,
        },
        function (error, response, body) {
          expect(response.statusCode).to.equal(400);
          expect(body.data).to.be.undefined;
          expect(body.error).to.be.equal("missing nftCollection params");

          done();
        }
      );
    });
  });
});
