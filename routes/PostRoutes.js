const express = require("express");
const {
  Create,
  AllPost,
  PostDetails,
  EditPostDetails,
} = require("../controllers/PostController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const route = express.Router();

route.post("/", upload.single("file"), Create);
route.get("/", AllPost);
route.get("/:id", PostDetails);
route.put("/:id", upload.single("file"), EditPostDetails);

module.exports = route;
