const bcrypt = require("bcrypt");
const Admin = require("../models/adminModel");
const User = require("../models/usermodel");
require("dotenv").config();
const jwt = require("jsonwebtoken");
module.exports = {
  adminLogin: async (req, res) => {
    try {
      let { email, password } = req.body;
      console.log(req.body);
      //<----------------------- first timeinsertion start----------------->
    //   password = bcrypt.hashSync(password, 10);
    //   const newAdmin = new Admin({
    //     email: email,
    //     password: password,
    //   });
    //   await newAdmin.save();
      console.log('ye');
      //<-------------------------insertion end------------------>
      const adminData = await Admin.findOne({ email: email });
      if (!adminData) {
          throw new Error("Invalid credential ");
        }
        console.log('ye2');
        const passMatch = bcrypt.compareSync(password, adminData.password);
        if (!passMatch) {
            throw new Error("Incorrect passwrod");
        }
        console.log('ye3');
      const adminToken = jwt.sign(
        { id: adminData._id, email },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      res.cookie("jwtadmin", adminToken, { httpOnly: true });
      res.clearCookie("token")
      res.json({ status: true, message: "success!!!",adminData });
    } catch (err) {
      res.json({ status: false, err: err.message }).status(500);
    }
  },
  getAllUsers: async (req, res) => {
    try {
        console.log('called getuser');
      const usersList = await User.find().sort({joinedDate:-1});
      res.json({ status: true, usersList });
    } catch (err) {
      res.json({ status: false, err: err.message }).status(500);
    }
  },
  createUser: async (req, res) => {
    try {
        console.log('create api');
        let { email, username, password } = req.body;
        const userExist=await User.findOne({email:email})
        
        if(userExist){
        throw new Error('user alread exist')
      }
      let profile = "";
      if (req.file) {
        console.log(req.file.filename, "file name");
        //localhost:5001/profileimages/1702731407517-iphone2.jpg
        profile = `${process.env.BASE_URL}/profileimages/${req.file.filename}`;
    }
    console.log('create api fin');
    password=bcrypt.hashSync(password,10)
    const newUser=new User({
        email:email,
        username:username,
        password:password,
        profileImage:profile,
        joinedDate:Date.now()
    })
    await newUser.save().then(()=>console.log('saved '))
    console.log('create api fin');
      const userData=await User.find()
      res.json({status:true,message:"Success",userData})
    } catch (err) {
      res.json({ status: false, err: err.message });
    }
  },
  updateUser:async(req,res)=>{
    try{
        const id=req.params.id
        let {email,username}=req.body
        let profile = "";
        if (req.file) {
          console.log(req.file.filename, "file name");
          //localhost:5001/profileimages/1702731407517-iphone2.jpg
          profile = `${process.env.BASE_URL}/profileimages/${req.file.filename}`;
        }
        if(profile){
            await User.updateOne({_id:id},{
                $set:{
                    email:email,
                    username:username,
                    profileImage:profile
                }
            })
        }else{
            await User.updateOne({_id:id},{
                $set:{
                    email:email,
                    username:username,
                }
            })

        }
        const userData=await User.find()
        res.json({status:true,message:"Success",userData})
    }catch(err){
        res.json({err:err.message,status:false}).status(500)
    }

  },
  deleteUser:async(req,res)=>{
    try{
        const id=req.params.id
        await User.deleteOne({_id:id})
        const userData=await User.find()
        res.json({status:true,message:"Success",userData})
    }catch(err){
        res.json({status:false,err:err.message})
    }
  },
  checkAdminAuth:(req,res)=>{
    try{
        console.log('admin check api called');
        const adminToken=req.cookies.jwtadmin
        if(!adminToken){
            throw new Error('Session Expired please login')
        }
        const verify=jwt.verify(adminToken,process.env.JWT_SECRET,async(err,decoded)=>{
            if(err) throw err;
            console.log('admin decoded'+decoded);
            const adminData=await Admin.findOne({_id:decoded.id})
            res.json({status:true,message:"Success",adminData})
        })
    }catch(err){
        res.json({status:false,err:err.message})
    }
  },
  adminLogout:(req,res)=>{
    try{
        res.clearCookie("jwtadmin")
        res.json({status:true})
    }catch(err){
        res.json({status:false,err:err.message})
    }
  }
};
