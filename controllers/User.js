const User = require("../models/User");
const bycrypt = require("bcryptjs");
const createError = require("../utils/error");
const jwt = require("jsonwebtoken");

const UserRegister = async (req, res, next) => {
  const salt = await bycrypt.genSalt(10);
  hashpassword = await bycrypt.hash(req.body.password, salt);
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashpassword,
  });

  try {
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (error) {
    next(error);
  }
};

const UserLogin = async (req, res, next) => {
  try {
    const user = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.username }],
    });

    if (!user) return next(createError(404, "User dint find"));

    const isPasswordCorrect = await bycrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordCorrect)
      return next(createError(404, "Wrong password or username"));

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "300s",
      }
    );

    const { password, ...others } = user._doc;

    res
      .cookie("access_token", token, { httpOnly: true })
      .cookie("loggedIn", true, { httpOnly: true })
      .status(200)
      .json({ ...others });
  } catch (error) {
    next(error);
  }
};

const UserProfile = (req, res) => {
  const { access_token } = req.cookies;
  jwt.verify(access_token, process.env.JWT_SECRET_KEY, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
};

const UserLogout = (req, res) => {
  res.clearCookie("access_token");
  res.status(200).json({ message: "logout Successfully" });
};

module.exports = {
  UserRegister,
  UserLogin,
  UserProfile,
  UserLogout,
};
