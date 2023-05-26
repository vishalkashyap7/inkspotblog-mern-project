const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

//otp generator
function generateOTP() {
  const digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

function sendEmail(subject, toUser, bodyOfMail) {
  // mail send krne ki taiyaari
  let configg = {
    service: "gmail", // your email domain
    auth: {
      user: process.env.EMAIL_USER, // your email address
      pass: process.env.EMAIL_PASSWORD, // your password
    },
  };

  let transporter = nodemailer.createTransport(configg);

  let message = {
    from: "newabcartworks@gmail.com", // sender address
    to: toUser, // list of receivers
    subject: subject, // Subject line
    html: bodyOfMail, // html file
  };

  transporter
    .sendMail(message)
    .then((info) => {
      // console.log(info, "info about email");
    })
    .catch((err) => {
      console.log(err, " <- err of nodemailer");
    });
}

//REGISTER
router.post("/register", async (req, res) => {
  try {
    const newOtp = generateOTP();
    const salt = await bcrypt.genSalt(process.env.SALTBCRYPT);
    const templatePath = path.join(
      __dirname,
      "../templateForOtp",
      "template.html"
    ); //html file
    let template = fs.readFileSync(templatePath, "utf8");
    template = template.replace("{otp}", newOtp);

    const hashedPass = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
      verificationCode: newOtp,
    });

    const user = await newUser.save();
    // mail send krne ki taiyaari
    // let configg = {
    //   service: "gmail", // your email domain
    //   auth: {
    //     user: process.env.EMAIL_USER, // your email address
    //     pass: process.env.EMAIL_PASSWORD, // your password
    //   },
    // };

    template = template.replace("{user}", req.body.username);
    // let transporter = nodemailer.createTransport(configg);

    // let message = {
    //   from: "newabcartworks@gmail.com", // sender address
    //   to: newUser.email, // list of receivers
    //   subject: "Welcome to InkSpotBlog!", // Subject line
    //   html: template, // html file
    // };

    // transporter
    //   .sendMail(message)
    //   .then((info) => {
    //     console.log(info, "info about email");
    //   })
    //   .catch((err) => {
    //     console.log(err, "info about err");
    //   });
    template = template.replace(
      "{info}",
      `<span>
      <a href="http://localhost:3000/verifyotp">Click here</a> to verify
      </span>`
    );
    sendEmail("Welcome to InkSpotBlog!", newUser.email, template);
    const idd = newUser._id.toString();
    // console.log(idd);
    const accessToken = jwt.sign({ id: idd }, process.env.SECRET_KEY, {
      expiresIn: "5d",
    });

    const { password, ...others } = user._doc;
    res.status(200).json({ success: true, user: others, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      //register the user

      res.status(400).json("Wrong credentials!");
    } else {
      const validated = await bcrypt.compare(req.body.password, user.password);
      if (!validated) {
        res.status(400).json("Wrong credentials!");
      } else {
        const { password, ...others } = user._doc; //check the user it has the _doc object for the user // also we seperated password from it
        // console.log(user._doc._id, "auth route");
        const accessToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
          expiresIn: "5d",
        });
        res.status(200).json({ success: true, user: others, accessToken });
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//verifyotp
router.post("/verify", async (req, res) => {
  try {
    const { username, otp } = req.body;
    // console.log(typeof(opt));
    const user = await User.findOne({ username });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.verified) {
      return res
        .status(400)
        .json({ success: false, message: "User already verified" });
    }
    const otpNum = Number(otp);
    // console.log(typeof(otpNum));
    if (user.verificationCode !== otpNum) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    user.verified = true;
    await user.save();
    const { password, ...others } = user._doc;

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      user: others,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//googlesignin
router.post("/googlesignin", async (req, res) => {
  // console.log(req.body.response.credential, "req from google signin button ");
  const userObject = jwt.decode(req.body.response.credential);
  // console.log("userobject is ", userObject);
  try {
    const user = await User.findOne({ email: userObject.email });
    if (!user) {
      //create new user
      // console.log("user not found");
      try {
        let newPwd = generateOTP(); //default password for the user
        newPwd = newPwd + generateOTP().substring(0, 1);

        const salt = await bcrypt.genSalt(10);
        const templatePath = path.join(
          __dirname,
          "../templateForOtp",
          "template.html"
        ); //html file
        let template = fs.readFileSync(templatePath, "utf8");
        template = template.replace("OTP", "Password");
        template = template.replace("{otp}", newPwd);
        template = template.replace("{info}", ``);


        const hashedPass = await bcrypt.hash(newPwd, salt);

        let usernm = userObject.email.substring(0, 4);
        usernm = usernm + generateOTP().substring(0, 2);
        template = template.replace("{user}", usernm);

        const newUser = new User({
          username: usernm,
          email: userObject.email,
          password: hashedPass,
          profilePic: userObject.picture,
          verified: true,
        });

        const userNw = await newUser.save();

        const idd = userNw._id.toString();
        // console.log(idd, "id o dnew user");
        const accessToken = jwt.sign({ id: idd }, process.env.SECRET_KEY, {
          expiresIn: "5d",
        });

        const { password, ...others } = userNw._doc;
        //mail send
        sendEmail("Welcome to InkSpotBlog!", userNw.email, template);
        res.status(200).json({ success: true, user: others, accessToken });
      } catch (err) {
        // console.log(err);
        res.status(500).json(err);
      }
    } else {
      //login simple
      // console.log("user found");
      const { password, ...others } = user._doc; //check the user it has the _doc object for the user // also we seperated password from it
      // console.log(user._doc._id, "auth route");
      const accessToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
        expiresIn: "5d",
      });
      res.status(200).json({ success: true, user: others, accessToken });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/checkpassword", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(200).json({ data: false });
    }

    const validated = await bcrypt.compare(req.body.password, user.password);
    if (!validated) {
      return res.status(200).json({ data: false });
    }

    return res.status(200).json({ data: validated });
  } catch (err) {
    // console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//for checking http://localhost:5000/api/auth/mailsend
router.get("/mailsend", (req, res) => {
  console.log("route for mailsend");

  // try {
  //   //path of the html file for the otp
  //   const templatePath = path.join(
  //     __dirname,
  //     "../templateForOtp",
  //     "template.html"
  //   );

  //   //content of html file
  //   let template = fs.readFileSync(templatePath, "utf8");

  //   let otp1 = generateOTP(); //new otp

  //   //just replace the otp with the new one
  //   template = template.replace("{otp}", otp1);
    // template = template.replace("{user}", otp1);

    // console.log(template.toString());
  //   let configg = {
  //     service: "gmail", // your email domain
  //     auth: {
  //       user: process.env.EMAIL_USER, // your email address
  //       pass: process.env.EMAIL_PASSWORD, // your password
  //     },
  //   };

  //   let transporter = nodemailer.createTransport(configg);

  //   let message = {
  //     from: "newabcartworks@gmail.com", // sender address
  //     to: "kashyapvishal225@gmail.com", // list of receivers
  //     subject: "Welcome to ABC Website!", // Subject line
  //     html: template, // html file
  //   };

  //   transporter
  //     .sendMail(message)
  //     .then((info) => {
  //       console.log(info, "info about email");
  //     })
  //     .catch((err) => {
  //       console.log(err, "info about err");
  //     });
  // } catch (err) {
  //   console.log(err);
  // }

  res.send("done, mail send to the user");
});

module.exports = router;
