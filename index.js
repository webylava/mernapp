const express = require("express");
const app = express();
const UserRouter = require("./routes/UserRoutes");
const PostRouter = require("./routes/PostRoutes");
const mongoose = require("mongoose");
const errorMiddleware = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");
require("dotenv").config();

app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(cookieParser());
app.use(express.json());
app.use("/api/users", UserRouter);
app.use("/api/posts", PostRouter);
app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.status(200).json({ message: "all fine" });
});

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`connectd to mongo database`);
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongodb disconencted");
});

mongoose.connection.on("connected", () => {
  console.log("mongodb connected");
});

app.listen(process.env.PORT, () => {
  connect();
});
