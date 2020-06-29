const express = require("express");
const { Router } = express;
const router = new Router();
const UserService = require("../models").userservice;
const User = require("../models").user;
const authMiddleware = require("../auth/middleware");

//get all /
router.get("/", async (req, res, next) => {
  try {
    const getUserServices = await UserService.findAll({ include: [User] });
    res.json(getUserServices);
  } catch (e) {
    next(e);
  }
});
module.exports = router;
