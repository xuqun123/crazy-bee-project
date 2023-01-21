require("dotenv").config();
const express = require("express");
const passport = require("passport");
const expect = require("chai").expect;
const sinon = require("sinon");
const request = require("supertest");
const { omit } = require("lodash");
const jwt = require("jsonwebtoken");
require("../../lib/userAuth");
const { createFakeUser, convertTimestampToString } = require("../../lib/fakeDataHelper");
const userRepo = require("../../repos/User");
const userRoutes = require("../../routes/userRoutes");

const baseUrl = "/api/users";
const app = express();
app.use(express.json());
app.use(baseUrl, userRoutes);

describe("userRoutes", function () {
  let existingUser;
  let jwtToken;
  const fakeUserPayload = createFakeUser(true);

  before(async () => {
    existingUser = await userRepo.create(fakeUserPayload);
    jwtToken = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
      process.env.SERVER_JWT_SECRET
    );
  });

  describe("GET /api/users/me", function () {
    describe("200 response", function () {
      it("returns users", async function () {
        const response = await request(app)
          .get(`${baseUrl}/me`)
          .set("Accept", "application/json")
          .set("Authorization", `bearer ${jwtToken}`);

        // expect(response.statusCode).to.equal(200);
        expect(response.body).to.deep.include(
          omit(convertTimestampToString(existingUser.toJSON()), ["password", "_id"])
        );
      });
    });

    describe("400 response", function () {
      let userRepoStub;

      afterEach(function () {
        if (userRepoStub) userRepoStub.restore();
      });

      it("returns an error message when User.getByEmailAndPassword call is failed", async function () {
        const error = new Error("getById call is failed");
        userRepoStub = sinon.stub(userRepo, "getById").rejects(error);

        const response = await request(app)
          .get(`${baseUrl}/me`)
          .set("Accept", "application/json")
          .set("Authorization", `bearer ${jwtToken}`);

        expect(response.statusCode).to.equal(500);
      });
    });
  });

  describe("GET /api/users/:id", function () {
    describe("200 response", function () {
      it("returns single user's data", async function () {
        const response = await request(app)
          .get(`${baseUrl}/${existingUser._id}`)
          .set("Accept", "application/json");

        expect(response.statusCode).to.equal(200);
        expect(response.body.data).to.deep.include(
          omit(convertTimestampToString(existingUser.toJSON()), ["password", "_id"])
        );
      });
    });

    describe("400 response", function () {
      let userRepoStub;

      afterEach(function () {
        if (userRepoStub) userRepoStub.restore();
      });

      it("returns an error message when User.getByEmailAndPassword call is failed", async function () {
        const error = new Error("getById call is failed");
        userRepoStub = sinon.stub(userRepo, "getById").rejects(error);

        const response = await request(app)
          .get(`${baseUrl}/${existingUser._id}`)
          .set("Accept", "application/json");

        expect(response.statusCode).to.equal(400);
      });
    });
  });

  describe("PATCH /api/users/:id", function () {
    const payload = { user: { username: "new username", bio: "new bio" } };

    describe("200 response", function () {
      it("returns users", async function () {
        const response = await request(app)
          .patch(`${baseUrl}/${existingUser._id}`)
          .send(payload)
          .set("Accept", "application/json")
          .set("Authorization", `bearer ${jwtToken}`);

        expect(response.statusCode).to.equal(200);
        expect(response.body.data).to.deep.include(
          omit(convertTimestampToString({ ...existingUser.toJSON(), ...payload.user }), [
            "password",
            "_id",
            "updatedAt",
          ])
        );
        expect(response.body.data.updatedAt).not.to.equal(existingUser.toJSON().updatedAt);
      });
    });

    describe("400 response", function () {
      let userRepoStub;

      afterEach(function () {
        if (userRepoStub) userRepoStub.restore();
      });

      it("returns an error message when User.update call is failed", async function () {
        const error = new Error("update call is failed");
        userRepoStub = sinon.stub(userRepo, "update").rejects(error);

        const response = await request(app)
          .patch(`${baseUrl}/${existingUser._id}`)
          .send(payload)
          .set("Accept", "application/json")
          .set("Authorization", `bearer ${jwtToken}`);

        expect(response.statusCode).to.equal(400);
      });
    });

    it("returns an error message jwt token user.id is not equal to the request param user id", async function () {
      const response = await request(app)
        .patch(`${baseUrl}/${existingUser._id}-123`)
        .send(payload)
        .set("Accept", "application/json")
        .set("Authorization", `bearer ${jwtToken}`);

      expect(response.statusCode).to.equal(401);
      expect(response.body.error).to.equal("you cannot update other users");
    });

    it("returns an error message if user payload is not provided", async function () {
      const response = await request(app)
        .patch(`${baseUrl}/${existingUser._id}`)
        .send({ username: "123abc" })
        .set("Accept", "application/json")
        .set("Authorization", `bearer ${jwtToken}`);

      expect(response.statusCode).to.equal(400);
      expect(response.body.error).to.equal("missing user params");
    });
  });
});
