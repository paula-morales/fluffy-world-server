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

router.post("/favorites/add", authMiddleware, async (req, res, next) => {
  const userLogged = req.user.dataValues;
  const { idUserService } = req.body;
  try {
    const newFavorite = await Favorites.create({
      userId: userLogged.id,
      userServiceId: idUserService,
    });
    console.log(newFavorite);
    res.status(201).json(newFavorite);
  } catch (e) {
    return res.status(400).send({ message: "Something went wrong, sorry" });
  }
});

router.delete(
  "/favorites/remove/:favoriteId",
  authMiddleware,
  async (req, res, next) => {
    const favoriteId = parseInt(req.params.favoriteId);
    try {
      const toDelete = await Favorites.findByPk(favoriteId);
      if (!toDelete) {
        res.status(404).send("Favorite not found");
      } else {
        const favoriteDeleted = await toDelete.destroy();
        console.log("DELETED", favoriteDeleted);
        res.status(201).json(favoriteDeleted);
      }
    } catch (e) {
      return res.status(400).send({ message: "Something went wrong, sorry" });
    }
  }
);

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
