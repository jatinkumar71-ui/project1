const express = require("express");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authRoutes");

const app = express();

app.use(express.json()); // required to parse JSON request bodies
app.use(cookieParser()); // required to parse cookies

app.use("/api/auth", authRouter);

module.exports = app;