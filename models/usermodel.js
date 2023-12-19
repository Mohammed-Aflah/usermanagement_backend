require("../config/dbconfi");
const mongoose = require("mongoose");
const schema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique:true,
  },
  email: {
    type: String,
    required: true,
    unique:true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  joinedDate: {
    type: Date,
  },
  profileImage:{
    type:String
  }
});
module.exports=mongoose.model('User',schema)