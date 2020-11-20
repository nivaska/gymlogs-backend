const router = require("express").Router();

router.get("/test", (req, res) => {
  res.json({
    message: "test data",
  });
});

module.exports = router;
