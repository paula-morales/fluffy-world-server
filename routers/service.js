const express = require("express");
const { Router } = express;
const router = new Router();
const Service = require("../models").service;

//get all /
router.get("/", async (req, res, next) => {
  try {
    const getServices = await Service.findAll();
    res.json(getServices);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
