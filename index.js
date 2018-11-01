const restify = require("restify");
const mongoose = require("mongoose");
const config = require("./config");
const rjwt = require("restify-jwt-community");
const app = restify.createServer();
//middelware
app.use(restify.plugins.bodyParser());
//to protect all routes
app.use(
  rjwt({ secret: config.JWT_SECRET }).unless({ path: ["/auth", "/register"] })
);
app.listen(config.PORT, () => {
  mongoose.connect(
    config.MONGODB_URI,
    { useNewUrlParser: true }
  );
});

const db = mongoose.connection;
db.on("error", err => console.log(err));
db.once("open", () => {
  require("./routes/customers")(app);
  require("./routes/users")(app);
  console.log(`server is running on port ${config.PORT}`);
});
