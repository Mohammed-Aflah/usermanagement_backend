require("../config/dbconfi");
const mongoose = require("mongoose");
const adminSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  joinedDate: {
    type: Date,
  },
  status: {
    type: Boolean,
    default: true,
  },
});
module.exports=mongoose.model('admin',adminSchema)