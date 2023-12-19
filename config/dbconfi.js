const mongoose = require("mongoose");
require("dotenv");
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(" database connected ");
  })
  .catch((err) => {
    console.log("Error in mongodb connection ", err);
  });
