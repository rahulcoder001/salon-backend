const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const userRoutes = require("./routes/userRoutes");
const staffRoutes = require("./routes/staffRoutes")
const salonRoutes = require("./routes/salonRoutes")
const branchRoutes = require("./routes/branchRoutes")
const sendEmailRoutes = require("./routes/sendEmailRoutes")
const inventryRoutes = require("./routes/inventryRoutes")
const app = express();

// Middlewares
app.use(express.json());
// CORS Configuration
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // handle preflight properly
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/staff",staffRoutes);
app.use("/api/email",sendEmailRoutes);
app.use("/api/salon",salonRoutes);
app.use("/api/branch", branchRoutes);
app.use("/api/inventry",inventryRoutes )


app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;
