require("dotenv").config();
const app = require("./app");

init();

async function init() {
  try {
    const listener = app.listen(process.env.PORT || 3000, () => {
      console.log(`Listening on port ${listener.address().port}!`);
    });
  } catch (error) {
    console.error(`An error occurred: ${JSON.stringify(error)}`);
    process.exit(1);
  }
}
