const router = require("express").Router();

router.get("/test", (req, res) => {
  res.json({
    message: "test data",
  });
});

router.get("/profile", (req, res) => {
  res.json({
    name: req.user.name,
    image: req.user.profileImageUrl,
  });
});

module.exports = router;
