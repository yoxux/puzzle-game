const express = require("express");
const path = require("path");

const indexRouter = require("./routes/index");
const playRouter = require("./routes/play");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// handle requests
app.use("/", indexRouter);
app.use("/play", playRouter);

app.listen(6969, () => {
  console.log("Listening on http://localhost:6969");
});
