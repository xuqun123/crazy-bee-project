const expect = require("chai").expect;
const {
  createFakeNFTCollection,
  convertTimestampToString,
  createFakeUser,
} = require("../../lib/fakeDataHelper");
const nftCollectionRepo = require("../../repos/NFTCollection");
const userRepo = require("../../repos/User");

describe("NFTCollection", function () {
  let existingNftCollection;

  before(async () => {
    existingNftCollection = await nftCollectionRepo.create(createFakeNFTCollection());
  });

  describe("getOne", function () {
    it("retrieves one nftCollection from DB", async function () {
      const nftCollection = await nftCollectionRepo.getOne({
        name: existingNftCollection.name,
        _id: existingNftCollection._id,
      });

      expect(nftCollection).to.be.exist;
      expect(nftCollection._id.toString()).to.eq(existingNftCollection._id.toString());
      expect(nftCollection.name).to.eq(existingNftCollection.name);
    });
  });

  describe("getMany", function () {
    let user, existingNftCollectionWithUserId;
    beforeEach(async () => {
      user = await userRepo.create(createFakeUser());
      existingNftCollectionWithUserId = await nftCollectionRepo.create({
        ...createFakeNFTCollection(),
        userId: user._id,
      });
    });

    it("retrieves multipe nftCollections from DB", async function () {
      const [nftCollections, totalCount, offset, loadMore] = await nftCollectionRepo.getMany({
        name: existingNftCollectionWithUserId.name,
        userId: user._id,
        limit: 1,
      });

      expect(nftCollections).to.be.a("array");
      expect(nftCollections.length).to.equal(1);
      expect(totalCount).to.eq(1);
      expect(offset).to.eq(0);
      expect(loadMore).to.eq(false);

      expect(nftCollections[0]._id.toString()).to.eq(
        existingNftCollectionWithUserId._id.toString()
      );
      expect(nftCollections[0].name).to.eq(existingNftCollectionWithUserId.name);
    });
  });

  describe("create", function () {
    const fakeNFTCollectionPayload = createFakeNFTCollection();

    it("inserts a new nftCollection into DB", async function () {
      const nftCollection = await nftCollectionRepo.create(fakeNFTCollectionPayload);

      expect(nftCollection).to.be.exist;
      expect(nftCollection._id).to.be.a("object");
      expect(nftCollection.createdAt).to.be.a("date");
      expect(nftCollection.updatedAt).to.be.a("date");
      expect(nftCollection).to.deep.include(fakeNFTCollectionPayload);
    });
  });

  describe("update", function () {
    it("updates an existing nftCollection into DB", async function () {
      const updatePayload = { name: "new name here", summary: "new summary here" };
      const nftCollection = await nftCollectionRepo.update(
        existingNftCollection._id,
        updatePayload
      );

      expect(nftCollection).to.be.exist;
      expect(nftCollection.name).to.equal(updatePayload.name);
      expect(nftCollection.summary).to.equal(updatePayload.summary);
    });
  });

  describe("delete", function () {
    it("deletes an existing nftCollection from DB", async function () {
      const nftCollectionBeforeDelete = await nftCollectionRepo.getOne({
        _id: existingNftCollection._id,
      });
      expect(nftCollectionBeforeDelete).not.to.be.null;

      const nftCollection = await nftCollectionRepo.delete(existingNftCollection._id);

      expect(nftCollection).to.be.exist;
      expect(nftCollection._id.toString()).to.eq(existingNftCollection._id.toString());

      const nftCollectionAfterDelete = await nftCollectionRepo.getOne({
        _id: existingNftCollection._id,
      });
      expect(nftCollectionAfterDelete).to.be.null;
    });
  });
});
