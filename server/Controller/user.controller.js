const { UserModel } = require("../Model/userModel");
const bcrypt = require("bcrypt");
require("dotenv").config();
var jwt = require("jsonwebtoken");

const findUsers = async (req, res) => {
  const query = req.query.search;
  const { userId } = req.body;
  console.log(userId);
  try {
    const data = await UserModel.find({
      $and: [
        {
          $or: [
            { name: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } },
          ],
        },
      ],
      _id: { $ne: userId },
    });
    res.send({ data });
  } catch (err) {
    res
      .status(404)
      .json({ message: "S;;omething went wrong. Try again later", err });
  }
};

const loginUsers = async (req, res) => {
  const payload = req.body;
  console.log(payload);
  const userDetails = await UserModel.findOne({ email: payload.email });
  if (!userDetails) {
    res.status(400).send({ message: "Invalid credentials." });
  } else {
    bcrypt.compare(
      payload.password,
      userDetails.password,
      async function (err, result) {
        // result == true
        if (!result) {
          res.status(400).send({ message: "Invalid credentials." });
        }
        if (err) {
          res.status(500).send({ message: "Something went wrong. Try again." });
        } else {
          jwt.sign(
            { userId: userDetails.id },
            process.env.PRIVATE_KEY,
            function (err, token) {
              if (err) {
                res
                  .status(500)
                  .send({ message: "Something went wrong. Try again." });
              } else {
                res.send({
                  name: userDetails.name,
                  email: userDetails.email,
                  avatar: userDetails.avatar,
                  userId: userDetails.id,
                  token,
                });
              }
            }
          );
        }
      }
    );
  }
};

const signupUsers = async (req, res) => {
  const isEmailPresent = await UserModel.findOne({ email: req.body.email });
  console.log(req.body);
  if (isEmailPresent) {
    res.status(400).send({ message: "Email already registered." });
  } else {
    bcrypt.hash(req.body.password, 4, async function (err, hash) {
      // Store hash in your password DB.
      if (err) {
        res.status(500).send({ message: "Something went wrong. Try again." });
      } else {
        await UserModel.insertMany([{ ...req.body, password: hash }]);
        res.send({ message: "Signup successful" });
      }
    });
  }
};

const updateAvatar = async (req, res) => {
  const userId = req.body.userId; // Extract the userId from the authenticated user (using middleware)
  const avatarUrl = req.body.avatarUrl; // New avatar URL sent in the request body
  console.log(userId, avatarUrl);
  try {
    // Find the user by their userId
    const user = await UserModel.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update the avatar field of the user
    user.avatar = avatarUrl;
    await user.save();

    res.json({ message: "Avatar updated successfully.", avatarUrl });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong. Try again later.", err });
  }
};

module.exports = { findUsers, loginUsers, signupUsers, updateAvatar };
