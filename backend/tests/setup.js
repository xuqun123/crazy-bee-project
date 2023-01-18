const testDBHandler = require("./helpers/test-db-handler");

before(async () => {
  await testDBHandler.connect();
});

after(async () => {
  await testDBHandler.clearDB();
  await testDBHandler.closeDB();
});
