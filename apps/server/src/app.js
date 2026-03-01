//app.js: cau hinh express app
//bin/www: chay server ~ main() trong spring boot
//routes: xu ly api endpoints / request
//public: static files
//views: template engine files

//reuqire ~ import cac thu vien can thiet
require("dotenv").config();
const connectDB = require("./config/db");
var express = require("express");
var cors = require("cors");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var app = express();

// Connect to database
connectDB();

// Middleware
app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use("/", require("./routes"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const error = new Error("Route not found");
  error.status = 404;
  next(error);
});

// error handler
app.use(function (err, req, res, next) {
  console.error("Error:", err);

  const isDev = req.app.get("env") === "development";
  const status = err.status || 500;

  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(isDev && { stack: err.stack }), // chỉ show stack khi dev
  });
});

module.exports = app;
