const express = require("express");
const { Router } = express;
var nodemailer = require("nodemailer");
const router = new Router();
const UserService = require("../models").userService;
const User = require("../models").user;
const Languages = require("../models").language;
const Service = require("../models").service;
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

  const distance = Math.abs((R * c) / 1000);
  return distance; // in km
}

router.get("/", async (req, res, next) => {
  try {
    const getUserServices = await UserService.findAll({
      include: {
        model: User,
        include: [Languages],
      },
    });
    res.status(201).json(getUserServices);
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: "Something went wrong, sorry" });
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

    res.status(201).json(profilesFiltered);
  } catch (e) {
    return res.status(400).send({ message: "Something went wrong, sorry" });
  }
});

router.post("/contact", authMiddleware, async (req, res, next) => {
  try {
    const userLogged = req.user.dataValues;

    //mailToId = id of the person for whom is addressed
    const { mailToId, date, time, message, serviceId } = req.body;
    if (!mailToId || !date || !time || !message) {
      return res
        .status(400)
        .send({ message: "Please fill out all the fields" });
    } else {
      const candidate = await User.findByPk(mailToId);
      const serviceOffered = await Service.findByPk(serviceId);
      const email = candidate.dataValues.email;

      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD_EMAIL,
        },
      });

      var mailOptions = {
        from: `${userLogged.firstName} from Fluffy World<${process.env.EMAIL}>`,
        to: email,
        subject: "You have received a new request!🐶🐱",
        html: `<h2>Hello <strong>${candidate.dataValues.firstName}<strong>!</h2>
            <h3><strong>${userLogged.firstName}</strong> has required your services.</h3>
            <p><u>Service</u>: ${serviceOffered.dataValues.name} </p>
            <p><u>Date</u>:${date}</p>
            <p><u>Time</u>:${time}</p>
            <p><u>Message</u>:${message}</p>
            <p>You can find more information <a href="http://localhost:3000/userservice/${userLogged.id}">here</a></p>
            `,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return res
            .status(400)
            .send({ message: "Something went wrong, sorry" });
        } else {
          console.log("Email sent: " + info.response);
          res.status(201).json(info.response);
        }
      });
    }
  } catch (e) {
    return res.status(400).send({ message: "Something went wrong, sorry" });
  }
});

router.post("/registerpet", authMiddleware, async (req, res) => {
  const userLogged = req.user.dataValues;
  const { name, description, picture } = req.body;
  if (!picture || !name || !description) {
    return res.status(400).send("Please fill out all the fields");
  } else if (!userLogged.isOwner) {
    return res.status(400).send("Sorry, you cannot register your pet");
  }

  try {
    //to find the id of "pet friends"
    const getServices = await Service.findAll();
    const serviceFiltered = getServices.find(
      (service) => service.name === "pet friends"
    );
    const serviceId = serviceFiltered.id;

    //the new pet is register with the service type "pet friends"
    const newUserService = await UserService.create({
      title: name,
      rating: 0,
      price: 0,
      description,
      picture,
      userId: userLogged.id,
      serviceId,
    });

    res.status(201).json(newUserService);
  } catch (error) {
    return res.status(400).send({ message: "Something went wrong, sorry" });
  }
});

router.post("/registerservice", authMiddleware, async (req, res) => {
  const userLogged = req.user.dataValues;
  const { title, price, description, picture, serviceId } = req.body;

  //to find the id of "pet friends"
  const getServices = await Service.findAll();
  const serviceFiltered = getServices.find(
    (service) => service.name === "pet friends"
  );
  const serviceIdPetFriends = serviceFiltered.id;

  if (!title || !price || !description || !picture || !serviceId) {
    return res.status(400).send("Please fill out all the fields");
  } else if (!userLogged.isCandidate) {
    return res.status(400).send("Sorry, you cannot register your service");
  } else if (serviceId === serviceIdPetFriends) {
    //this option should not be available to choose
    return res.status(400).send({ message: "Something went wrong, sorry" });
  }

  try {
    const newUserService = await UserService.create({
      title,
      rating: 0,
      price,
      description,
      picture,
      userId: userLogged.id,
      serviceId,
    });

    res.status(201).json(newUserService);
  } catch (error) {
    return res.status(400).send({ message: "Something went wrong, sorry" });
  }
});
module.exports = router;
