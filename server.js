require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const swaggerUi = require("swagger-ui-express");

const authRoutes = require("./src/routes/authRoutes");
const transactionRoutes = require("./src/routes/transactionRoutes");
const walletRoutes = require("./src/routes/walletRoutes");

let swaggerDocument = {};

try {
  swaggerDocument = require("./swagger-output.json");
} catch (err) {
  console.log("Error loading swagger document", err);
}

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

const port = process.env.PORT || 3000;

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

app.get("/", (req, res) => {
  res.send("Upi backend is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/wallet", walletRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(
    `Swagger Docs available at http://localhost:${port}/api-docs`
  );
});