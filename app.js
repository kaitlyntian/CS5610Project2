const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const bodyParser = require("body-parser");
const indexRouter = require("./routes/index.js");
const ventureHighlight = require("./routes/venture_highlight");

const port = 3000;
const app = express();
//Connection test
app.listen(port, () => {
    console.log(`Project running at http://localhost:${port}`);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/client")));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/venturehighlight", ventureHighlight);

module.exports = app;
