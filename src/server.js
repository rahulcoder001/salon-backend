require("dotenv").config();
const http = require("http");
const app = require("./app");
const prisma = require("./config/db");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await prisma.$connect();
    console.log("Connected to PostgreSQL");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
});
