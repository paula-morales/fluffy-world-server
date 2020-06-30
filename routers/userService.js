const express = require("express");
const { Router } = express;
const router = new Router();
const UserService = require("../models").userService;
const User = require("../models").user;
const authMiddleware = require("../auth/middleware");

function calculateDistance(latA, lngA, latB, lngB) {
  // http://www.movable-type.co.uk/scripts/latlong.html

  const lat1 = latA;
  const lon1 = lngA;

  const lat2 = latB;
  const lon2 = lngB;

  const R = 6371e3; // earth radius in meters
  const φ1 = lat1 * (Math.PI / 180);
  const φ2 = lat2 * (Math.PI / 180);
  const Δφ = (lat2 - lat1) * (Math.PI / 180);
  const Δλ = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * (Math.sin(Δλ / 2) * Math.sin(Δλ / 2));

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = (R * c) / 1000;
  return distance; // in km
}

//get all /
router.get("/", async (req, res, next) => {
  try {
    const getUserServices = await UserService.findAll({ include: [User] });
    res.json(getUserServices);
  } catch (e) {
    next(e);
  }
});

router.get("/:serviceId/:latOwner/:lngOwner", async (req, res, next) => {
  const { serviceId, latOwner, lngOwner } = req.params;

  parseFloat(latOwner);
  parseFloat(lngOwner);
  parseInt(serviceId);

  try {
    const getUserServices = await UserService.findAll({
      where: { serviceId },
      include: [User],
    });

    const profilesFiltered = getUserServices.filter((userService) => {
      const user = userService.dataValues.user.dataValues;
      const latUser = parseFloat(user.latitude);
      const longUser = parseFloat(user.longitude);
      const distance = calculateDistance(
        latUser,
        longUser,
        parseFloat(latOwner),
        parseFloat(lngOwner)
      );
      console.log("distance", distance);
      if (distance < 4) {
        return userService;
      }
    });

    res.json(profilesFiltered);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
