const User = require("../models/user");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports.profile = function (req, res) {
  User.findById(req.params.id, function (err, user) {
    return res.render("user_profile", {
      title: "User Profile",
      profile_user: user,
    });
  });
};

module.exports.update = async function (req, res) {
  // if(req.user.id == req.params.id){
  //     User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
  //         req.flash('success', 'Updated!');
  //         return res.redirect('back');
  //     });
  // }else{
  //     req.flash('error', 'Unauthorized!');
  //     return res.status(401).send('Unauthorized');
  // }

  if (req.user.id == req.params.id) {
    try {
      let user = await User.findById(req.params.id);
      User.uploadedAvatar(req, res, function (err) {
        if (err) {
          console.log("*****Multer Error: ", err);
        }

        user.name = req.body.name;
        user.email = req.body.email;

        if (req.file) {
          if (user.avatar && fs.existsSync(user.avatar)) {
            fs.unlinkSync(path.join(__dirname, "..", user.avatar));
          }

          // this is saving the path of the uploaded file into the avatar field in the user
          user.avatar = User.avatarPath + "/" + req.file.filename;
        }

        user.save();
        return res.redirect("back");
      });
    } catch (err) {
      req.flash("error", err);
      return res.redirect("back");
    }
  } else {
    req.flash("error", "Unauthorized!");
    return res.status(401).send("Unauthorized");
  }
};

// get the sign up data
module.exports.signUp = async function (req, res) {
  try {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });

    return res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    });
  } catch (err) {
    console.error("Signup Error:", err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// sign in and create a session for the user
module.exports.signIn = async function (req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: { $regex: `^${email}$`, $options: 'i' } });
    if (!user) {
      return res.status(404).json({ message: "User not exist" });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      console.log('test data11');
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Store user info in session
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
    };
    return res
      .status(200)
      .json({ message: "Sign in successful", user: req.session.user });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Logout function
module.exports.logout = function (req, res) {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.clearCookie("codeial-session");
    return res.json({ message: "Logged out successfully" });
  });
};
