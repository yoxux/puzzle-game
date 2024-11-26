const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
  res.render("index", {});
});

router.post("/get-images", function (req, res) {
  const imageList = [
    "/images/puzzle/image1.jpg",
    "/images/puzzle/image2.jpg",
    "/images/puzzle/image3.jpg",
    "/images/puzzle/image4.jpg",
    "/images/puzzle/image5.jpg",
  ];
  res.json(imageList);
});

module.exports = router;
