const bcrypt = require("bcrypt");
const { Router } = require("express");
const { toJWT } = require("../auth/jwt");
const authMiddleware = require("../auth/middleware");
const User = require("../models/").user;
const { SALT_ROUNDS } = require("../config/constants");
const userServices = require("../models/").userService;
const Reviews = require("../models/").review;
const Languages = require("../models/").language;
const router = new Router();

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Please provide both email and password" });
    }

    const user = await User.findOne({
      where: { email },
      include: [userServices, Reviews, Languages],
    });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(400).send({
        message: "User with that email not found or password incorrect",
      });
    }

    delete user.dataValues["password"]; // don't send back the password hash
    const token = toJWT({ userId: user.id });
    return res.status(200).send({ token, ...user.dataValues });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: "Something went wrong, sorry" });
  }
});

router.post("/signup", async (req, res) => {
  const {
    firstName,
    lastName,
    phoneNumber,
    profilePicture,
    email,
    password,
    latitude,
    longitude,
    languages,
    isOwner,
    isCandidate,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !phoneNumber ||
    !email ||
    !password ||
    !latitude ||
    !longitude ||
    !languages.length
  ) {
    return res.status(400).send("Please fill out all the fields");
  } else if ((!isOwner && !isCandidate) || (isOwner && isCandidate)) {
    return res.status(400).send("Please choose one option");
  }

  try {
    if (!profilePicture) {
      const newUser = await User.create({
        firstName,
        lastName,
        phoneNumber,
        profilePicture:
          "https://i0.wp.com/www.mvhsoracle.com/wp-content/uploads/2018/08/default-avatar.jpg?ssl=1",
        email,
        password: bcrypt.hashSync(password, SALT_ROUNDS),
        latitude,
        longitude,
        isOwner,
        isCandidate,
      });

      delete newUser.dataValues["password"]; // don't send back the password hash

      const token = toJWT({ userId: newUser.id });

      res.status(201).json({ token, ...newUser.dataValues });
    } else {
      console.log("lang here", languages);

      const newUser = await User.create({
        firstName,
        lastName,
        phoneNumber,
        profilePicture,
        email,
        password: bcrypt.hashSync(password, SALT_ROUNDS),
        latitude,
        longitude,
        isOwner,
        isCandidate,
      });

      delete newUser.dataValues["password"]; // don't send back the password hash

      const token = toJWT({ userId: newUser.id });
      const newLanguagesCreatePromises = languages.map(
        async (lang) =>
          await Languages.create({ name: lang, userId: newUser.id })
      );

      //Using this we await on the whole array of promises as if it was just one
      await Promise.all(newLanguagesCreatePromises);

      res.status(201).json({ token, ...newUser.dataValues });
    }
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .send({ message: "There is an existing account with this email" });
    }

    return res.status(400).send({ message: "Something went wrong, sorry" });
  }
});

// The /me endpoint can be used to:
// - get the users email & name using only their token
// - checking if a token is (still) valid
router.get("/me", authMiddleware, async (req, res) => {
  // don't send back the password hash
  delete req.user.dataValues["password"];
  res.status(200).send({ ...req.user.dataValues });
});

module.exports = router;
