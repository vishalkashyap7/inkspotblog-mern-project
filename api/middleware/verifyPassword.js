const User = require("../models/User");
const bcrypt = require("bcrypt");


async function verifyPassword(req, res, next) {
// console.log(req.headers.password,"password from the user as header");

    // console.log("verify password middleware", req.body, req.headers.password);
    try {
        // console.log("try block");
        const user = await User.findById({ _id: req.body.userId });   
        // console.log("user is ", user);
        if (!user) {
            // return res.status(404).json({ data: false });

            return res.status(400).json("Wrong credentials!");

        }
        else
        {
            const validated = await bcrypt.compare(req.headers.password, user.password);
            // console.log(validated, req.headers.password);
            if (!validated) {
                // console.log("else");
                // return res.status(404).json({ data: false });
                return res.status(400).json("Wrong credentials!");
            }
            else
            {
                // console.log("this is log in verifyPassword middleware", user);
                next();
            }
        }
    }
    catch(err)
    {
        return res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = verifyPassword;
