const express = require("express");
const { Router } = express;
const router = new Router();
const User = require("../models").user;

router.get("/:userId", async (req, res, next) => {
  const { userId } = req.params;
  parseInt(userId);
  try {
    const getUser = await User.findByPk(userId);
    res.status(201).json(getUser);
  } catch (e) {
    return res.status(400).send({ message: "Something went wrong, sorry" });
  }
});

module.exports = router;
