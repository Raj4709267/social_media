const getUsers = async (req, res) => {
  res.send({ message: "get usersss" });
};

const loginUsers = async (req, res) => {
  res.send({ message: "login" });
};

const signupUsers = async (req, res) => {
  res.send({ message: "signup" });
};

module.exports = { getUsers, loginUsers, signupUsers };
