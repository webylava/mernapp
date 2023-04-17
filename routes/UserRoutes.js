const express = require("express");
const {
  UserRegister,
  UserLogin,
  UserProfile,
  UserLogout,
} = require("../controllers/User");
const route = express.Router();

route.post("/login", UserLogin);
route.post("/register", UserRegister);
route.get("/profile", UserProfile);
route.get("/logout", UserLogout);

module.exports = route;
