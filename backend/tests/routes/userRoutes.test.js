require("dotenv").config();
const express = require("express");
const expect = require("chai").expect;
const request = require("supertest");
const { createFakeUser } = require("../../lib/fakeDataHelper");
const userRoutes = require("../../routes/userRoutes");

const baseUrl = "/api/users";
const app = express();
app.use(express.json());
app.use(baseUrl, userRoutes);

describe("userRoutes", function () {
  const user = createFakeUser(true);

  describe("Get a user's profile", function () {
    describe("200 response", function () {
      it("returns users", async function () {
        const response = await request(app)
          .get(`${baseUrl}/me`)
          .send(user)
          .set("Accept", "application/json");

        expect(response.statusCode).to.equal(200);
        expect(response.body).to.equal("");
      });
    });
  });
});
