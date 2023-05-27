const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const multer = require("multer");
const path = require("path");
const port = process.env.PORT || 5000;
const cors =require('cors');

app.use(cors());//added for the error
// app.use(cors({
//   origin: ["https://inkspotblog.netlify.app"] //edit this
// }));//added for the error

dotenv.config();//env file
app.use(express.json());//middleware - to send json object in body / it parses incoming JSON request and puts the parser data in req.body
app.use("/images", express.static(path.join(__dirname, "/images")));// when a request is made to the server with a URL that starts with "/images", Express will look for the corresponding file in the directory specified by path.join(__dirname, "/images")

mongoose.connect(process.env.MONGODB_URI).then(console.log("Connected to MongoDB")).catch(error => console.log(error));


//multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");//images as destination
  },
  filename: (req, file, cb) => {
    // cb(null, "mahadev.jpg");//file name
    cb(null, req.body.name);//file name.. name taken from user
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {//key is file checkpostman
  res.status(200).json("File has been uploaded");
});



app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);

app.listen(port, () => {
  console.log(`Backend is running on port ${port}.`);
});