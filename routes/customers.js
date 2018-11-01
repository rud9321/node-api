const errors = require("restify-errors");
const Customer = require("../models/Customer");
module.exports = app => {
  //get Customers
  //rjwt({ secret: config.JWT_SECRET }) //as second parameter to protect
  //individual routes
  app.get("/customers", async (req, res, next) => {
    try {
      const customer = await Customer.find({});
      res.send(customer);
      next();
    } catch (error) {
      return next(new errors.InvalidContentError(error));
    }
  });
  //get Customer
  app.get("/customer/:id", async (req, res, next) => {
    try {
      const customer = await Customer.findById(req.params.id);
      res.send(customer);
      next();
    } catch (error) {
      return next(
        new errors.ResourceNotFoundError(
          `There is no customer found with id ${req.params.id}`
        )
      );
    }
  });
  //post Customer
  app.post("/customer", async (req, res, next) => {
    if (!req.is("application/json"))
      return next(new errors.InvalidContentError('Expects "application/json"'));

    const { name, email, balance } = req.body;
    const customer = new Customer({
      name,
      email,
      balance
    });
    try {
      await customer.save();
      res.send(201);
      next();
    } catch (err) {
      return next(new errors.InternalError(err.message));
    }
  });
  //update Customer
  app.put("/customer/:id", async (req, res, next) => {
    if (!req.is("application/json"))
      return next(new errors.InvalidContentError('Expects "application/json"'));
    try {
      await Customer.findOneAndUpdate({ _id: req.params.id }, req.body);
      res.send(200);
      next();
    } catch (err) {
      return next(new errors.InternalError(err.message));
    }
  });
  //delete Customer
  app.del("/customer/:id", async (req, res, next) => {
    try {
      await Customer.findOneAndRemove({ _id: req.params.id });
      res.send(204);
      next();
    } catch (err) {
      return next(new errors.InternalError(err.message));
    }
  });
};
