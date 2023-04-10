const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const router = express.Router();
const ejs = require("ejs");
const _ = require("lodash");

require("dotenv").config();
const app = express();
const port = process.env.PORT;

////////////////////////////MongoDB////////////////////////////
//Connect to database
mongoose.connect("mongodb://127.0.0.1:27017/blogDB");

//Post Schema
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

//Post Model
const Post = mongoose.model("Post", postSchema);

//////////////////////////////////////////////////////////////

const homeContent =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque viverra mauris in aliquam sem fringilla ut morbi. Et ligula ullamcorper malesuada proin. Mattis enim ut tellus elementum sagittis vitae et leo. Dignissim cras tincidunt lobortis feugiat vivamus at. Et sollicitudin ac orci phasellus egestas tellus. Sit amet luctus venenatis lectus magna fringilla urna. Consequat semper viverra nam libero justo laoreet sit amet cursus. Urna neque viverra justo nec.";

const aboutContent =
  "Rutrum quisque non tellus orci ac auctor augue. Nibh sit amet commodo nulla facilisi. Viverra adipiscing at in tellus integer feugiat scelerisque varius morbi. Nunc eget lorem dolor sed viverra ipsum nunc aliquet bibendum. Gravida neque convallis a cras semper auctor neque.";

const contactContent =
  "Commodo viverra maecenas accumsan lacus vel facilisis volutpat est. Sed euismod nisi porta lorem mollis aliquam. Sed felis eget velit aliquet.";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

//Linking side navbar javascript file
app.get("/side-navbar.js", function (req, res) {
  res.sendFile(__dirname + "/public/side-navbar.js");
});

//Website Pages
app.get("/", function (req, res) {
  find();
  async function find() {
    await Post.find({})
      .sort({ date: "descending" })
      .then((foundPosts) => {
        res.render("home", { homeContent: homeContent, posts: foundPosts });
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.get("/posts/:postId", function (req, res) {
  const postTopicLink = _.lowerCase(req.params.postTopic);
  const postId = req.params.postId;

  Post.findOne({ _id: postId })
    .then((foundPost) => {
      res.render("post", {
        title: foundPost.title,
        body: foundPost.body,
        date: foundPost.date,
        post: foundPost,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

//////////////////////////////////////////////////////////////////////
app.post("/compose", function (req, res) {
  let postTitle = req.body.postTitle;
  let postText = req.body.postText;

  const post = new Post({
    title: postTitle,
    body: postText,
  });

  post
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});

//Delete post
app.post("/posts/:id/delete", function (req, res) {
  const postId = req.body.deleteBtn;
  Post.findByIdAndDelete(postId)
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(port, function () {
  console.log("The server is listening on port " + port);
});
