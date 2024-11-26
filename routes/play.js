const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
  res.render("play", { title: "" });
});

router.post("/", function (req, res) {
  req.body.image;
});

module.exports = router;
