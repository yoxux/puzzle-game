const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
  const image = req.query["image-url"];
  console.log(image)
  res.render("play", { imageUrl: image });
});

module.exports = router;
