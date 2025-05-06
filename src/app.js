const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const userRoutes = require("./routes/userRoutes");
const staffRoutes = require("./routes/staffRoutes");
const salonRoutes = require("./routes/salonRoutes");
const branchRoutes = require("./routes/branchRoutes");
const sendEmailRoutes = require("./routes/sendEmailRoutes");
const inventryRoutes = require("./routes/inventryRoutes");
const appoimentRoutes = require("./routes/appoimentRoutes");
const numbersRoutes = require("./routes/numberRoutes");
const clientRoutes = require("./routes/clientRoutes");
const chartRoutes = require("./routes/chartRoutes");
const financeRoutes = require("./routes/financialRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const attendenceRoutes = require("./routes/attendanceRoutes");
const pakageRoutes = require("./routes/pakageRoutes.js")
const salespersonRoutes=require("./routes/salesRoutes.js")
const purchasedplanRoutes=require("./routes/purchasedplanRoutes.js")
const app = express();

// Middlewares
app.use(express.json());

// CORS Configuration
const allowedOrigins = [
  "https://salon.edubotix.online",
  "http://localhost:3000",
  "https://salon.movestrongly.com"
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // handle preflight requests

app.use(helmet());
app.use(compression());
app.use(morgan("dev"));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/email", sendEmailRoutes);
app.use("/api/salon", salonRoutes);
app.use("/api/branch", branchRoutes);
app.use("/api/inventry", inventryRoutes);
app.use("/api/appoiment", appoimentRoutes);
app.use("/api/number", numbersRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/chart", chartRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/attendence", attendenceRoutes);
app.use("/api/purchasedplan",purchasedplanRoutes)
app.use("/api/packages", pakageRoutes)
app.use("/api/sales",salespersonRoutes)


app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;
