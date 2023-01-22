const { sample, omitBy, isNil, sampleSize } = require("lodash");
const { faker } = require("@faker-js/faker");
const { collectionTypes, statuses: nftCollectionStatuses } = require("../models/NFTCollection");
const { assetTypes, statuses: assetStatuses } = require("../models/Asset");

const sampleImages = [
  faker.image.animals(),
  faker.image.nature(),
  faker.image.business(),
  faker.image.avatar(),
  faker.image.sports(),
  faker.image.fashion(),
  faker.image.food(),
];

const createFakeAsset = (withId = false, userId, nftCollectionId) =>
  omitBy(
    {
      _id: withId ? faker.database.mongodbObjectId() : null,
      userId,
      nftCollectionId,
      name: faker.lorem.words(6),
      summary: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      assetType: sample(collectionTypes),
      status: sample(assetStatuses),
      coverImageUrl: sample(sampleImages),
      assetUrl: sample(sampleImages),
      publishedAt: faker.date.past(),
      tokenDetails: {
        contractAdress: faker.datatype.uuid(),
        tokenId: faker.datatype.uuid(),
        tokenStandard: sample(["ERC-1155", "ERC-1156"]),
        chain: sample(["Ethereum", "Polygon"]),
        metadata: sample(["Centralized", "Decentralized"]),
      },
    },
    isNil
  );

const createFakeNFTCollection = (withId = false, userId = null) =>
  omitBy(
    {
      userId,
      _id: withId ? faker.database.mongodbObjectId() : null,
      name: faker.lorem.words(6),
      summary: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      collectionTypes: sampleSize(collectionTypes, 3),
      status: sample(nftCollectionStatuses),
      coverImageUrl: sample(sampleImages),
      bannerImageUrl: faker.image.nature(1024, 200),
      publishedAt: faker.date.past(),
    },
    isNil
  );

const createFakeUser = (withId = false) =>
  omitBy(
    {
      _id: withId ? faker.database.mongodbObjectId() : null,
      email: faker.internet.email(),
      password: faker.internet.password(),
      username: faker.internet.userName(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      dob: faker.date.between("1980-01-01", "2023-01-01"),
      bio: faker.lorem.paragraph(6),
      walletAddresses: [faker.datatype.uuid()],
      avatarUrl: faker.image.avatar(500, 500),
      bannerImageUrl: faker.image.nature(1024, 200),
    },
    isNil
  );

const convertTimestampToString = (entity) => {
  const result = Object.assign({}, entity);

  Object.keys(result).forEach((key) => {
    if (result[key] instanceof Date) result[key] = result[key].toISOString();
  });

  return result;
};

module.exports = {
  createFakeAsset,
  createFakeNFTCollection,
  createFakeUser,
  sampleImages,
  convertTimestampToString,
};
