const router = require("express").Router();
const Like = require("../../models/PostLikes");
const verify = require("../../middleware/verify.js");

// tested
router.get("/post/:postId/likedby/:userId?", async (req, res) => {
  const postId = req.params.postId;
  const userId = req.params.userId;

  try {
    const like = await Like.findOne({ postId });

    if (!like) {
      // return empty array.
      return res.json({ likedBy: [], userLiked: false, message: "" });
    }

    if (userId) {
      const userLiked = like.users.includes(userId);
      res.json({ likedBy: like.users, userLiked: userLiked, message: "" });
    } else {
      res.json({ likedBy: like.users, userLiked: false, message: "" });
    }
  } catch (error) {
    // console.error(error);
    res.status(500).send({message: "Server Error"});
  }
});

// tested
router.put("/post/:postId/like/:userId", verify, async (req, res) => {
  const postId = req.params.postId;
  const userId = req.params.userId;
  const userFromJWT = req.user;
  if (userFromJWT.id != userId) {
    // Not a valid user. // TODO: Create dash board for this.
    res.status(401).send({ message: "Unauthorized user! Try relogging" });
  } else {
    let userLiked = false;
    try {
      let like = await Like.findOne({ postId });
      if (!like) {
        // Since user is already verified by middleware, so its good to go.
        like = new Like({
          postId,
          users: [userId],
        });
        userLiked = true;
      } else {
        const userIndex = like.users.indexOf(userId);
        if (userIndex === -1) {
          like.users.push(userId);
          userLiked = true;
        } else {
          like.users.splice(userIndex, 1);
          userLiked = false;
        }
      }
      await like.save();

      res.json({
        likedBy: like.users,
        userLiked: userLiked,
        message: "Saved successfully",
      });
    } catch (error) {
      res.status(500).send({ message: "Server Error" });
    }
  }
});

module.exports = router;
