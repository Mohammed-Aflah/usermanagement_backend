const express = require("express");
const app = express();
const userRoute = require("./router/user");
const adminRoute = require("./router/admin");
const cookieParser=require('cookie-parser')
app.use(cookieParser())
app.set(express.static('public'))
app.use(express.json());
app.use(require('cors')({ origin: 'http://localhost:5173', credentials: true }));
app.use("/profileimages",express.static('public/profile-images'))
app.use(express.urlencoded({ extended: false }));

app.use("/", userRoute.router);
// app.use("/admin", adminRoute.router);

app.listen(5001,()=>{
    console.log('serverr running in ');
})