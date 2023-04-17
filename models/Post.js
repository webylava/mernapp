const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    summary: {
      type: String,
      require: true,
    },
    content: {
      type: String,
      require: true,
    },
    cover: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
