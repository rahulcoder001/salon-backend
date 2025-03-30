const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const userRoutes = require("./routes/userRoutes");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));

// Routes
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;
