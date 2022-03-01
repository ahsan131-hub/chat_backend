const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("dashboard");
});

module.exports = router;
