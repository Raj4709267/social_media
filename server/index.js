const express = require("express");
const cors = require("cors");
const { userRoutes } = require("./Routes/user.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send({ message: "welcome" });
});

app.use("/users", userRoutes);

app.listen(8000, () => {
  console.log("app running");
});
