require("dotenv").config();
const express = require("express");
const expect = require("chai").expect;
const sinon = require("sinon");
const request = require("supertest");
const { omit } = require("lodash");
require("../../lib/userAuth");
const { createFakeUser, convertTimestampToString } = require("../../lib/fakeDataHelper");
const userRepo = require("../../repos/User");
const userAuthRoutes = require("../../routes/userAuthRoutes");

const baseUrl = "/auth";
const app = express();
app.use(express.json());
app.use(baseUrl, userAuthRoutes);

describe("userAuthRoutes", function () {
  let existingUser;
  let userRepoStub;
  const fakeUserPayload = createFakeUser();
  const { email, password, username } = fakeUserPayload;

  before(async () => {
    existingUser = await userRepo.create(fakeUserPayload);
  });

  afterEach(function () {
    if (userRepoStub) userRepoStub.restore();
  });

  describe("POST /auth/signup", function () {
    describe("400 response", function () {
      const newUserPayload = convertTimestampToString(createFakeUser());

      it("returns an error message when the user email is already taken", async function () {
        const response = await request(app)
          .post(`${baseUrl}/signup`)
          .send({ email, password, username })
          .set("Accept", "application/json");

        expect(response.statusCode).to.equal(400);
        expect(response.body.message).to.contain("The user email has been taken already");
      });

      it("returns an error message when the payload is missing mandatory attributes", async function () {
        const response = await request(app)
          .post(`${baseUrl}/signup`)
          .send({ email: newUserPayload.email, password: newUserPayload.password })
          .set("Accept", "application/json");

        expect(response.statusCode).to.equal(400);
        expect(response.body.message).to.contain("User validation failed: username");
      });

      it("returns an error message when User.getByEmail call is failed", async function () {
        const error = new Error("getByEmail call is failed");
        userRepoStub = sinon.stub(userRepo, "getByEmail").rejects(error);

        const response = await request(app)
          .post(`${baseUrl}/signup`)
          .send({ email: newUserPayload.email, password: newUserPayload.password })
          .set("Accept", "application/json");

        expect(response.statusCode).to.equal(400);
        expect(response.body.message).to.contain(error.message);
      });
    });

    describe("200 response", function () {
      const newUserPayload = convertTimestampToString(createFakeUser());

      it("returns the newly created user when the payload is valid and the user has not been used yet", async function () {
        const response = await request(app)
          .post(`${baseUrl}/signup`)
          .send(newUserPayload)
          .set("Accept", "application/json");

        expect(response.statusCode).to.equal(200);
        expect(response.body.user).to.deep.include(omit(newUserPayload, ["password"]));
      });
    });
  });

  describe("POST /auth/login", function () {
    describe("400 response", function () {
      it("returns an error message when the user cred is not found", async function () {
        const response = await request(app)
          .post(`${baseUrl}/login`)
          .send({ email, password: "wrong password" })
          .set("Accept", "application/json");

        expect(response.statusCode).to.equal(400);
        expect(response.body.message).to.contain("Incorrect user email or password");
      });

      it("returns an error message when User.getByEmailAndPassword call is failed", async function () {
        const error = new Error("getByEmailAndPassword call is failed");
        userRepoStub = sinon.stub(userRepo, "getByEmailAndPassword").rejects(error);

        const response = await request(app)
          .post(`${baseUrl}/login`)
          .send({ email, password })
          .set("Accept", "application/json");

        expect(response.statusCode).to.equal(400);
        expect(response.body.message).to.contain(error.message);
      });
    });

    describe("200 response", function () {
      it("returns the login user with a JWT token if the user cred is valid", async function () {
        const response = await request(app)
          .post(`${baseUrl}/login`)
          .send({ email, password })
          .set("Accept", "application/json");

        expect(response.statusCode).to.equal(200);
        expect(response.body.user).to.deep.include(
          omit(convertTimestampToString(existingUser.toJSON()), ["password", "_id"])
        );

        expect(response.body.token).to.be.a("string");
      });
    });
  });
});
