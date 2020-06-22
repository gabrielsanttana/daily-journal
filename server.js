const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER_URL}/daily-journal`, {
  useNewUrlParser: true, 
  useUnifiedTopology: true
});

const postSchema = new mongoose.Schema({
    title: String,
    text: String
});

const Post = new mongoose.model("Post", postSchema);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    Post.find({}, (err, foundPosts) => {
        res.render("home", {posts: foundPosts});
    });
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/contact", (req, res) => {
    res.render("contact");
});

app.get("/compose", (req, res) => {
    res.render("compose");
});

app.post("/compose", async function(req, res) {
    const { postTitle, postText } = req.body;

    const post = new Post({
        title: postTitle,
        text: postText
    });

    await post.save();

    res.redirect("/");
});

app.get("/posts/:post_id", (req, res) => {
   const { post_id } = req.params;

   Post.findOne({_id: post_id}, (err, foundPost) => {
        res.render("post", {
            post_title: foundPost.title,
            post_text: foundPost.text
        });
   });
});

app.listen(3333, () => {
    console.log("Server is running on port 3333");
});
