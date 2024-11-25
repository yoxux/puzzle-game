const express = require('express');
const router = express.Router();

/* GET play page. */
router.get('/', function(req, res, next) {
  res.render('play', { title: '' });
});

module.exports = router;
