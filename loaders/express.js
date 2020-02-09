const express = require("express");
const expressWinston = require("express-winston");
const cors = require("cors");
const session = require("express-session");
const bodyParser = require("body-parser");
const AdminRoutes = require("../api/routes/admin");
const PatientRoutes = require("../api/routes/patient");
const AdminAuthRoutes = require("../api/routes/auth");
const config = require("../config/index");
const HttpLogger = require("../api/middleware/index");
const sessionStore = require("../loaders/sessionStore");
const app = express();

// cors
app.use(cors());

// bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "My Session",
    resave: false,
    saveUninitialized: false,
    store: sessionStore
  })
);

// http logger
app.use(expressWinston.logger(HttpLogger()));

//  health checks
// GET
app.get("/status", (req, res) => {
  res.status(200).json("working");
});

// routes
app.use(config.api.AdminPrefix, AdminAuthRoutes);
app.use(config.api.AdminPrefix, AdminRoutes);

app.use(config.api.prefix, PatientRoutes);

//Each 404 send to Omnipotent error handler
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

// Omnipotent error handler
app.use((error, res) => {
  res.status(error.status || 500).json({
    error: {
      status: error.status || 500,
      message: error.message || "Internal server error"
    }
  });
});
module.exports = app;
