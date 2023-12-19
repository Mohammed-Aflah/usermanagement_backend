const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/usermodel");
const bcrypt = require("bcrypt");
async function SignupPost(req, res) {
  try {
    console.log("api called");
    let profile = "";
    if (req.file) {
      console.log(req.file.filename, "file name");
      //localhost:5001/profileimages/1702731407517-iphone2.jpg
      profile = `${process.env.BASE_URL}/profileimages/${req.file.filename}`;
    }
    let { username, email, password } = req.body;
    console.log(req.body);
    password = await bcrypt.hash(password, 10);
    const userDataCheckWithMail = await User.findOne({ email: email });
    if (userDataCheckWithMail) {
      throw new Error("Email already Exists");
    }
    const userDataCheckwithUsername = await User.findOne({
      username: username,
    });
    if (userDataCheckwithUsername) {
      throw new Error("Username already taken");
    }
    const newUser = new User({
      username,
      email,
      password,
      profileImage: profile,
      joinedDate: Date.now(),
    });
    await newUser.save();
    const token = jwt.sign(
      { userId: newUser._id, username, email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.cookie("token", token, { httpOnly: true });
    // res.cookie("token", token, { httpOnly: true, path: '/' });
    console.log(token);
    res.json({ status: true, userDetails: newUser });
  } catch (err) {
    res.json({ err: err.message }).status(500);
  }
}
async function LoginPost(req, res) {
  try {
    console.log("login api");
    const { email, password } = req.body;
    const userData = await User.findOne({ email: email });
    if (!userData) {
      throw new Error("User not found");
    }
    const passComparison = await bcrypt.compare(password, userData.password);
    if (!passComparison) {
      throw new Error("Incorrect password");
    }
    const token = jwt.sign(
      { userId: userData._id, email, username: userData.username },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.cookie("token", token, { httpOnly: true });
    res.json({
      status: true,
      message: "Login Successfull!!",
      userDetails: userData,
    });
  } catch (err) {
    res.json({ err: err.message }).status(500);
  }
}
function checkUserAuth(req, res) {
  try {
    console.log("api called ____");
    let token;
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else {
      throw new Error("Session expired");
    }
    console.log(token);
    const verification = jwt.verify(
      token,
      process.env.JWT_SECRET,
      async (err, decoded) => {
        if (err) throw err;
        console.log(`decoded ${JSON.stringify(decoded)}  `);
        const userData = await User.findOne({ _id: decoded.userId });
        res.json({ status: true, message: "success", userData });
      }
    );
  } catch (err) {
    console.log(err.message);
    res.json({ err: err.message, status: false }).status(500);
  }
}
function logoutUser(req, res) {
  try {
    res.clearCookie("token");
    res.json({ status: true, message: "Cookie cleared" }).status(201);
  } catch (error) {
    console.log(`error when logout ${error}`);
    res.json({ err: error.message, status: false }).status(500);
  }
}
async function getUserProfile(req, res) {
  try {
    const id = req.params.id;
    const userData = await User.findOne({ _id: id });
    res.json({ status: true, userData });
  } catch (err) {
    res.json({ err: err.message, status: false }).status(500);
  }
}
async function updateUserProfile(req,res){
    try{
        console.log('api called');
        const id=req.params.id
        console.log(id);
        const {username,email}=req.body
        let profile = "";
        if (req.file) {
          console.log(req.file.filename, "file name");
          //localhost:5001/profileimages/1702731407517-iphone2.jpg
          profile = `${process.env.BASE_URL}/profileimages/${req.file.filename}`;
        }
        console.log(profile);
        await User.updateOne({_id:id},{
            $set:{
                username:username,
                email:email,
                profileImage:profile
            }
        })
        const userData=await User.findOne({_id:id})
        res.json({status:true,userData})
    }catch(err){
        res.json({status:false,err:err.message}).status(500)
    }
}
module.exports = {
  SignupPost,
  LoginPost,
  checkUserAuth,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};
