import express from "express";
import connectDB from "./Config/db.js";
import dotenv from "dotenv";
import UserRoutes from "./Routes/UserRoute.js";
import ExpenseRoutes from "./Routes/ExpenseRoutes.js";
import IncomeRoutes from "./Routes/IncomeRoute.js";
import cors from "cors";

connectDB();

const app = express();
const corsOrigin = {
  origin: "*",
};

dotenv.config();

console.log(process.env.MONGO_URI);

app.use(cors(corsOrigin));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/users", UserRoutes);

app.use("/api/expenses", ExpenseRoutes);

app.use("/api/incomes", IncomeRoutes);

const PORT = 5000;

const server = app.listen(
  5000,
  "0.0.0.0",
  console.log(`Server running on port ${PORT}`)
);
