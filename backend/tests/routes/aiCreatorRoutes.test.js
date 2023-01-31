require("dotenv").config();
const express = require("express");
const passport = require("passport");
const expect = require("chai").expect;
const axios = require("axios");
const sinon = require("sinon");
const request = require("supertest");
const jwt = require("jsonwebtoken");
require("../../lib/userAuth");
const { createFakeUser, convertTimestampToString } = require("../../lib/fakeDataHelper");
const userRepo = require("../../repos/User");
const aiCreatorRoutes = require("../../routes/aiCreatorRoutes");

const baseUrl = "/api/aiCreator";
const app = express();
app.use(express.json());
app.use(baseUrl, aiCreatorRoutes);

describe("aiCreatorRoutes", function () {
  let existingUser;
  let jwtToken;
  const fakeUserPayload = createFakeUser(false);
  const text = "happy dog";
  const style = "text2img";
  const fakeDeepAIResponse = {
    data: {
      id: "3fd4ef78-b603-4990-8861-b71dfbea2d8b",
      output_url:
        "https://api.deepai.org/job-view-file/3fd4ef78-b603-4990-8861-b71dfbea2d8b/outputs/output.jpg",
    },
  };

  before(async () => {
    existingUser = await userRepo.create(fakeUserPayload);

    jwtToken = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
      process.env.SERVER_JWT_SECRET
    );
  });

  describe("POST /api/aiCreator", function () {
    let axiosStub;

    afterEach(function () {
      if (axiosStub) axiosStub.restore();
    });

    describe("200 response", function () {
      beforeEach(async () => {
        axiosStub = sinon.stub(axios, "post").resolves(fakeDeepAIResponse);
      });

      it("generates an AI art image from DeepAI with 200 response", async function () {
        const response = await request(app)
          .post(baseUrl)
          .send({ text, style })
          .set("Accept", "application/json")
          .set("Authorization", `bearer ${jwtToken}`);

        expect(axiosStub.called).to.equal(true);
        expect(response.statusCode).to.equal(200);
        expect(response.body).to.deep.equal(fakeDeepAIResponse.data);
      });
    });

    describe("400 response", function () {
      const error = new Error(
        "Looks like you're enjoying our API. Want to keep using it? Sign up to get an API Key that's as unique as you are. https://deepai.org/"
      );

      beforeEach(async () => {
        axiosStub = sinon.stub(axios, "post").rejects(error);
      });

      it("failed to generate an AI art image from DeepAI with 400 response", async function () {
        const response = await request(app)
          .post(baseUrl)
          .send({ text, style })
          .set("Accept", "application/json")
          .set("Authorization", `bearer ${jwtToken}`);

        expect(axiosStub.called).to.equal(true);
        expect(response.statusCode).to.equal(400);
        expect(response.body.error).to.equal(error.message);
      });
    });
  });
});
