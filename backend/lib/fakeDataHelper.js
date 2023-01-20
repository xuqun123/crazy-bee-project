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

const createFakeNFTCollection = (withId = false, userId = null) =>
  omitBy(
    {
      userId,
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
  createFakeNFTCollection,
  createFakeUser,
  sampleImages,
  convertTimestampToString,
};
