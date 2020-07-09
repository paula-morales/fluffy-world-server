const express = require("express");
const { Router } = express;
const router = new Router();
const Service = require("../models").service;

router.get("/", async (req, res, next) => {
  try {
    const getServices = await Service.findAll();
    res.status(201).json(getServices);
  } catch (e) {
    return res.status(400).send({ message: "Something went wrong, sorry" });
  }
});

module.exports = router;
