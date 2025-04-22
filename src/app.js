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
const appoiment = require("./routes/appoimentRoutes")
const numbersRoutes = require("./routes/numberRoutes")
const clientRoutes = require("./routes/clientRoutes")
const charRoutes = require("./routes/chartRoutes")
const financeRoutes=require("./routes/financialRoutes")
const feedbackRoutes=require("./routes/feedbackRoutes")
const app = express();

// Middlewares
app.use(express.json());
// CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {
    callback(null, true); // Allow all origins
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // if you're using cookies or auth headers
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
app.use("/api/inventry",inventryRoutes);
app.use("/api/appoiment",appoiment);
app.use("/api/number",numbersRoutes);
app.use("/api/clients",clientRoutes);
app.use("/api/chart",charRoutes);
app.use("/api/finance",financeRoutes);
app.use("/api/feedback",feedbackRoutes);


app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;
