const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

require("dotenv").config();
const app = express();
const port = process.env.PORT;

const homeContent =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque viverra mauris in aliquam sem fringilla ut morbi. Et ligula ullamcorper malesuada proin. Mattis enim ut tellus elementum sagittis vitae et leo. Dignissim cras tincidunt lobortis feugiat vivamus at. Et sollicitudin ac orci phasellus egestas tellus. Sit amet luctus venenatis lectus magna fringilla urna. Consequat semper viverra nam libero justo laoreet sit amet cursus. Urna neque viverra justo nec.";

const aboutContent =
  "Rutrum quisque non tellus orci ac auctor augue. Nibh sit amet commodo nulla facilisi. Viverra adipiscing at in tellus integer feugiat scelerisque varius morbi. Nunc eget lorem dolor sed viverra ipsum nunc aliquet bibendum. Gravida neque convallis a cras semper auctor neque.";

const contactContent =
  "Commodo viverra maecenas accumsan lacus vel facilisis volutpat est. Sed euismod nisi porta lorem mollis aliquam. Sed felis eget velit aliquet.";

let posts = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

//Linking side navbar javascript file
app.get("/side-navbar.js", function (req, res) {
  res.sendFile(__dirname + "/public/side-navbar.js");
});

//Website Pages
app.get("/", function (req, res) {
  res.render("home", { homeContent: homeContent, posts: posts });
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

app.get("/posts/:postTopic", function (req, res) {
  const postTopicLink = _.lowerCase(req.params.postTopic);

  posts.forEach(function (post) {
    const postTitle = _.lowerCase(post.title);

    if (postTopicLink === postTitle) {
      res.render("post", { title: post.title, body: post.body });
    }
  });
});

//////////////////////////////////////////////////////////////////////
app.post("/compose", function (req, res) {
  let postTitle = req.body.postTitle;
  let postText = req.body.postText;

  const blogPost = {
    title: postTitle,
    body: postText,
  };

  posts.push(blogPost);
  res.redirect("/");
});

app.listen(port, function () {
  console.log("The server is listening on port " + port);
});
