const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const AdminRoutes = require("../api/routes/admin");
const config = require("../config/index");
const app = express();

//  health checks
app.get("/status", (req, res) => {
  res.status(200).send("working");
});

// cors
app.use(cors());

// bodyparser
app.use(bodyParser.json());

// routes

app.use(config.api.prefix, AdminRoutes);
// Error 404 handler
app.use((req, res) => {
  res.send("not found");
});

module.exports = app;
