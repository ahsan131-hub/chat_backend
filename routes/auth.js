const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const router = require("express").Router();

router.post("/register", (req, res) => {
  const { userName, password, email } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);
  console.log(req.body);
  console.log(hashedPassword);
  console.log(userName, password, email);

  User.create(
    {
      userName: userName,
      password: hashedPassword,
      email: email,
    },
    function (err, user) {
      if (err) {
        res.status(401).send("the user could not be created");
      }

      var token = jwt.sign({ id: user._id }, process.env.KEY, {
        expiresIn: "30m",
      });
      res.status(200).send({ auth: true, token: token });
    }
  );
});

router.get("/me", function (req, res) {
  var token = req.headers["x-access-token"];
  if (!token)
    return res.status(401).send({ auth: false, message: "No token provided." });

  jwt.verify(token, process.env.KEY, function (err, decoded) {
    if (err)
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });

    User.findById(decoded.id, function (err, user) {
      if (err)
        return res.status(500).send("There was a problem finding the user.");
      if (!user) return res.status(404).send("No user found.");

      res.status(200).send(user);
    });
  });
});

router.post("/login", (req, res) => {
  console.log(req.body.email);
  User.findOne({ userName: req.body.email }, (err, user) => {
    if (err) {
      res.status(401).json({ message: "could not find user with specief id" });
    }
    if (!user) return res.status(404).json({ message: "user not found" });

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid)
      return res.status(401).send({ auth: false, token: null });

    var token = jwt.sign({ id: user._id }, process.env.KEY, {
      expiresIn: "30m",
    });
    res.status(200).json({ token: token, user });
  });
});

module.exports = router;
