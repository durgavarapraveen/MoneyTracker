import express from "express";
import protect from "../Middlewares/TokenMiddleWare.js";
import {
  addIncomeController,
  getIncomeByMonthController,
  getIncomeByYearController,
  getIncomeController,
} from "../Controllers/IncomeController.js";

const router = express.Router();

router.use("/addIncome", protect, addIncomeController);

router.use("/getincome", protect, getIncomeController);

router.use("/getIncomeByMonth", protect, getIncomeByMonthController);

router.use("/getIncomeByYear", protect, getIncomeByYearController);

export default router;
