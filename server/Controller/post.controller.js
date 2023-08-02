const { CommentModel } = require("../Model/commentModel");
const { PostModel } = require("../Model/postModel");

const getAllPost = async (req, res) => {
  console.log("kk");
  console.log(req.body);
  try {
    const result = await PostModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "postId",
          as: "comments",
        },
      },
      {
        $addFields: {
          comment_count: { $size: "$comments" },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong. Try again" });
  }
};

const addPost = async (req, res) => {
  const { content, file, userId } = req.body;
  if (!content && !file) {
    res.status(400).json({ message: "Write something or add files." });
  } else {
    const payload = { content, file, user: userId };
    try {
      const result = await PostModel.create(payload);
      res.send({ message: "Post created successfully." });
    } catch (err) {
      res.status(400).json({ message: "Something went wrong. Try again" });
    }
  }
};

const deletePost = async (req, res) => {
  const { postId, userId } = req.body;

  console.log(postId, userId);
  try {
    const result = await PostModel.deleteOne({ _id: postId, user: userId });
    console.log(result);
    res.send({ message: "Success" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong. Try again" });
  }
};

const postLike = async (req, res) => {
  const { postId, userId } = req.body;
  const alreadyLiked = await PostModel.findOne({
    _id: postId,
    $includes: { likes: userId },
  });
  console.log(alreadyLiked);
  let query = { $push: { likes: userId } };
  if (alreadyLiked.likes.includes(userId)) {
    query = { $pull: { likes: userId } };
  }
  try {
    const result = await PostModel.updateOne({ _id: postId }, query);
    res.send({ message: "Success" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong. Try again" });
  }
};

module.exports = { getAllPost, addPost, postLike, deletePost };
