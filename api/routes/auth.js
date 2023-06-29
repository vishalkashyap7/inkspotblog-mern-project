const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const verify = require("../middleware/verify.js");

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
      console.log("error of nodemailer", err);
    });
}

//REGISTER
router.post("/register", async (req, res) => {
  try {
    const newOtp = generateOTP();
    const salt = await bcrypt.genSalt(Number(process.env.SALTBCRYPT));
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
      <a href="https://inkspotblog.netlify.app/verifyotp">Click here</a> to verify
      </span>`
    );
    sendEmail("Welcome to InkSpotBlog!", newUser.email, template);
    const idd = newUser._id.toString();
    // console.log(idd);
    const accessToken = jwt.sign({ id: idd }, process.env.SECRET_KEY, {
      expiresIn: "5d",
    });

    const { password, verificationCode, ...others } = user._doc;
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
        const { password, verificationCode, ...others } = user._doc; //check the user it has the _doc object for the user // also we seperated password from it
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
    const { password, verificationCode, ...others } = user._doc;

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

        const { password, verificationCode, ...others } = userNw._doc;
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
      const { password, verificationCode, ...others } = user._doc; //check the user it has the _doc object for the user // also we seperated password from it
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

//password reset
router.post("/resetpwd", async (req, res) => {
  try {
    const user = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.username }],
    });
    // console.log(user, "user from resetpwd");
    if (!user) {
      res.status(200).json("Check email if you have given correct info");
    } else {
      const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
        expiresIn: "6m",
      });

      //template ready
      const templatePath = path.join(
        __dirname,
        "../templateForOtp",
        "templateForResetPassword.html"
      ); //html file
      let template = fs.readFileSync(templatePath, "utf8");
      template = template.replace("{user}", user.username);
      template = template.replace(
        "{info}",
        `<a href="https://inkspotblog.netlify.app/resetpwd/${token}">Reset Password</a>`
      );

      // console.log(typeof(token));
      // console.log(template);
      sendEmail(
        "Bye bye, old password! You're about to be reset.",
        user.email,
        template
      );

      //reset token used false set - Important
      user.resetTokenUsed = false;
      await user.save();

      // const { password, verificationCode, ...others } = user._doc; //check the user it has the _doc object for the user // also we seperated password from it
      res.status(200).json({ success: true });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//update password
router.post("/updatepwd", verify, async (req, res) => {
  // console.log("req user from middleware", req.user);
  // console.log("req user from body", req.body);

  // req user from middleware { id: '6495ab1cb718ea5', iat: 1688390, exp: 168800 }
  // req user from body { username: 'newa', password: '888', cnfPassword: '888' }

  try {
    // console.log("try block");
    const user = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.username }],
    });
    // console.log(user, "ueer");

    if (!user) {
      // res.status(200).json("Check email if you have given correct info");
      res.status(404).json("Wrong username or email");
    } else if (user.resetTokenUsed) {
      res.status(403).json("Token already used");
    } else if (user._id.toString() === req.user.id) {
      // console.log("id matchedd");
      if (req.body.password === req.body.cnfPassword) {
        // console.log("both password matched, hello");
        //save the new password
        const salt = await bcrypt.genSalt(Number(process.env.SALTBCRYPT));
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        // const updatedPost =
        await User.findByIdAndUpdate(
          req.user.id,
          {
            password: hashedPass,
            resetTokenUsed: true,
          },
          { new: true }
        );

        // console.log(updatedPost, "upadtaed post");
        res.status(200).json("Password updated successfully");
      } else {
        // console.log("not matching");
        res.status(400).json("Both password are not matching! Retry");
      }
    } else {
      // console.log("token is nit for u");
      res.status(403).json("Token is not for you!");
    }
  } catch (err) {
    console.log("error in update password route", err);
    res.status(500).json("Server error");
  }
});

//for checking http://localhost:5000/api/auth/mailsend
router.get("/mailsend", (req, res) => {
  // console.log("route for mailsend");

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
