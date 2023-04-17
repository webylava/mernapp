const Post = require("../models/Post");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const Create = async (req, res, next) => {
  const { access_token } = req.cookies;
  const newPath = "";
  try {
    jwt.verify(
      access_token,
      process.env.JWT_SECRET_KEY,
      {},
      async (err, info) => {
        if (err) next(err);

        if (req.file?.[0]) {
          const { originalname, path } = req.file;
          const parts = originalname.split(".");
          const ext = parts[parts.length - 1];
          const newPath = path + "." + ext;
          fs.renameSync(path, path + "." + ext);
        }

        const { title, summary, content } = req.body;

        const newPost = await Post.create({
          title,
          summary,
          content,
          cover: newPath,
          author: info?.id,
        });
        res.status(200).json(newPost);
      }
    );
  } catch (error) {
    next(error);
  }
};

const AllPost = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20);
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

const PostDetails = async (req, res, next) => {
  try {
    const posts = await Post.findById(req.params.id).populate("author", [
      "username",
    ]);
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

const EditPostDetails = async (req, res, next) => {
  console.log(req.body);
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }

  const { access_token } = req.cookies;

  jwt.verify(
    access_token,
    process.env.JWT_SECRET_KEY,
    {},
    async (err, info) => {
      if (err) next(err);

      const { id, title, summary, content } = req.body;

      const postDoc = await Post.findById(id);

      const isAuthor =
        JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(400).json("you are not the author");
      }

      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: { id, title, summary, content },
          },
          { new: true }
        );
        res.status(200).json(updatedPost);
      } catch (error) {
        res.status(500).json(error);
      }
    }
  );
};

module.exports = {
  Create,
  AllPost,
  PostDetails,
  EditPostDetails,
};
