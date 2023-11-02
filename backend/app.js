require("dotenv").config();
const cors = require('cors');

const express = require("express");
const app = express();
const userRouter = require("./api/users/user.router");

app.use(express.json());
//cors origin configuration
app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    optionsSuccessStatus: 200,
  }));

app.use("/api/users", userRouter);
const port = process.env.APP_PORT || 4000;
app.listen(port, () => {
  console.log("server up and running on PORT :", port);
});
