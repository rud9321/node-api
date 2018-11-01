const errors = require("restify-errors");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const auth = require("../auth");
const config = require("../config");
const jwt = require("jsonwebtoken");

module.exports = app => {
  app.post("/register", (req, res, next) => {
    const { email, password } = req.body;
    const user = new User({
      email,
      password
    });
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, async (err, hash) => {
        user.password = hash;
        try {
          await user.save();
          res.send(201);
          next();
        } catch (err) {
          return next(new errors.InternalError(err.message));
        }
      });
    });
  });
  //authenticat user
  app.post("/auth", async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await auth.aunthenticate(email, password);

      const token = jwt.sign(user.toJSON(), config.JWT_SECRET, {
        expiresIn: "1m"
      });
      const { iat, exp } = jwt.decode(token);
      console.log(user);
      res.send({ iat, exp, token });
      next();
    } catch (err) {
      return next(new errors.NotAuthorizedError(err));
    }
  });
};
