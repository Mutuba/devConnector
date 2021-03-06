const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");
// mongoose.set("useCreateIndex", true);
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log("MonogDB connected....");
  } catch (err) {
    console.error(err.message);
    //exit process with failure
    process.exit(1);
  }
};
module.exports = connectDB;
