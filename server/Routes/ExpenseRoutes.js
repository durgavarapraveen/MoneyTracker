import express from "express";
import protect from "../Middlewares/TokenMiddleWare.js";
import {
  addExpenseController,
  getExpenseAccordingToDayController,
  getExpensesController,
  getMonthlyExpensesAccordingToCategoryController,
  getTotalExpenseofMonthController,
  getYearlyExpensesAccordingToCategoryController,
} from "../Controllers/ExpenseController.js";

const router = express.Router();

router.post("/addExpense", protect, addExpenseController);

router.post("/getExpenses", protect, getExpenseAccordingToDayController);

router.post(
  "/getTotalExpensesofMonth",
  protect,
  getTotalExpenseofMonthController
);

router.post(
  "/getexpensebycategory",
  protect,
  getMonthlyExpensesAccordingToCategoryController
);

router.post(
  "/getExpensebyCategoryYearly",
  protect,
  getYearlyExpensesAccordingToCategoryController
);

export default router;
