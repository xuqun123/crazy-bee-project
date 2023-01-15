const { sample, filter, omitBy, isNil } = require("lodash");
const { faker } = require("@faker-js/faker");
const { collectionTypes, statuses } = require("../models/NFTCollection");

const sampleImages = [
  faker.image.animals(),
  faker.image.nature(),
  faker.image.business(),
  faker.image.avatar(),
  faker.image.sports(),
  faker.image.fashion(),
  faker.image.food(),
];

const createFakeNFTCollection = (withId = false) =>
  omitBy(
    {
      // userId: faker.datatype.uuid(),
      _id: withId ? faker.database.mongodbObjectId() : null,
      name: faker.lorem.words(6),
      summary: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      collectionType: sample(collectionTypes),
      status: sample(statuses),
      coverImageUrl: sample(sampleImages),
      publishedAt: faker.date.past(),
    },
    isNil
  );

const convertPublishedAtToString = (fakeNFTCollection) => ({
  ...fakeNFTCollection,
  publishedAt: fakeNFTCollection.publishedAt.toISOString(),
});

module.exports = { createFakeNFTCollection, sampleImages, convertPublishedAtToString };
