const { CommentModel } = require("../Model/commentModel");
const { PostModel } = require("../Model/postModel");

const getComments = async (req, res) => {
  const { postId } = req.params;
  try {
    const result = await CommentModel.find({ postId })
      .populate("commenterId")
      .sort({ createdAt: -1 });

    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong. Try again" });
  }
};

const addComments = async (req, res) => {
  const { commenterId, content, postId } = req.body;
  const payload = { commenterId, content, postId };

  try {
    const result = await CommentModel.create(payload);
    const response = await PostModel.findByIdAndUpdate(
      { _id: postId },
      { latestComment: result._id }
    );
    res.send({ message: "Success" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong. Try again" });
  }
};

module.exports = { getComments, addComments };
