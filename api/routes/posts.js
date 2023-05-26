const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const verify = require("../middleware/verify.js");

//CREATE POST
router.post("/", verify, async (req, res) => {
  if (req.user.id === req.body.userId) {
    const user = await User.findById(req.user.id);
    // console.log("user from ", user);
    if(user.verified){
      const newPost = new Post(req.body);
      try {
        const savedPost = await newPost.save();
        res.status(200).json({ success: true, message: 'Post published', post: savedPost });
      } catch (err) {
        res.status(400).json({ success: false, message: 'Server error' });
      }
    }
    else
    {
      res.status(401).json({ success: false, message: "Please verify you account first!" });
    }
  }
  else
  {
    res.status(403).json({ success: false, message: "You are not Authenticated!" });
  }
});

//UPDATE POST
router.put("/:id", verify,  async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);//post id
    if (post.username === req.body.username) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedPost);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can update only your post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE POST
router.delete("/:id", verify, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        await post.deleteOne();//we found a post and simply deleted
        res.status(200).json("Post has been deleted...");
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can delete only your post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//search
router.get('/search', async (req, res) => {
  const query = decodeURIComponent(req.query.query.toString());; // explicitly parse as string
  // console.log("query is ", query);
  try {
    const posts = await Post.find({ title: { $regex: new RegExp(query, 'i') } });
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

//GET POST
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL POSTS
router.get("/", async (req, res) => {
  const username = req.query.user;//for query
  const catName = req.query.cat;
  try {
    let posts;
    if (username) {
      posts = await Post.find({ username });
    } else if (catName) {
      posts = await Post.find({
        categories: {
          $in: [catName],//similar to sql in
        },
      });
    } else {
      posts = await Post.find();
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;