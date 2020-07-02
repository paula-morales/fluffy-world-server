const express = require("express");
const { Router } = express;
const router = new Router();
const Review = require("../models").review;
const User = require("../models").user;
const authMiddleware = require("../auth/middleware");

router.post("/", authMiddleware, async (req, res) => {
  const userLogged = req.user.dataValues;
  const { rating, comment, userServiceId } = req.body;
  console.log("body", req.body);
  if (!rating || !comment) {
    return res.status(400).send("Please fill out all the fields");
  } else if (userLogged.isCandidate) {
    return res
      .status(400)
      .send("Sorry, you cannot comment a post of another candidate");
  } else if (rating < 1 || rating > 5 || !userServiceId) {
    return res.status(400).send({ message: "Something went wrong, sorry" });
  }

  try {
    const newReview = await Review.create({
      rating,
      comment,
      userId: userLogged.id,
      userServiceId,
    });

    const reviews = await Review.findAll({
      include: [User],
    });
    res.status(201).json(reviews);
  } catch (error) {
    return res.status(400).send({ message: "Something went wrong, sorry" });
  }
});

router.get("/", async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      include: [User],
    });
    res.status(201).json(reviews);
  } catch (e) {
    return res.status(400).send({ message: "Something went wrong, sorry" });
  }
});

module.exports = router;
