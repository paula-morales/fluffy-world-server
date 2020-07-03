const express = require("express");
const { Router } = express;
const router = new Router();
const User = require("../models").user;
const Favorites = require("../models").favorite;
const authMiddleware = require("../auth/middleware");

router.get("/favorites", authMiddleware, async (req, res, next) => {
  const userLogged = req.user.dataValues;
  // console.log("userid", userLogged.id);

  try {
    const getFavorites = await Favorites.findAll({
      where: { userId: userLogged.id },
    });

    res.status(201).json(getFavorites);
  } catch (e) {
    return res
      .status(400)
      .send({ message: " here Something went wrong, sorry" });
  }
});

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
