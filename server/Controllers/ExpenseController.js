import User from "../Modals/UserModal.js";
import Expenses from "../Modals/ExpenseModal.js";

export const addExpenseController = async (req, res) => {
  try {
    const { category, amount, description } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const expense = new Expenses({
      user: req.user._id,
      category,
      amount,
      description,
      date: new Date(),
    });

    await expense.save();

    return res.status(201).json({ message: "Expense added successfully" });
  } catch (error) {
    console.log(error);
  }
};

export const getExpensesController = async (req, res) => {
  try {
    const expenses = await Expenses.find({ user: req.user._id });

    return res.status(200).json(expenses);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//get expense according to day
export const getExpenseAccordingToDayController = async (req, res) => {
  console.log("getExpenseAccordingToDayController");
  try {
    const { day } = req.body;
    console.log("day", day);

    if (!day) {
      return res.status(400).json({ message: "Day is required" });
    }

    const startOfDay = new Date(day);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(day);
    endOfDay.setUTCHours(0, 0, 0, 0);
    endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);

    const expenses = await Expenses.find({
      user: req.user._id,
      date: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    return res.status(200).json(expenses);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// fetch total expense of the month
export const getTotalExpenseofMonthController = async (req, res) => {
  try {
    const { day } = req.body;

    const month = new Date(day).getMonth();
    const year = new Date(day).getFullYear();

    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);

    const expenses = await Expenses.find({
      user: req.user._id,
      date: {
        $gte: startOfMonth,
        $lt: endOfMonth,
      },
    });

    const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    return res.status(200).json({ totalExpense });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// get expenses monthly wise according to category
export const getMonthlyExpensesAccordingToCategoryController = async (
  req,
  res
) => {
  try {
    const { month, year } = req.body;

    // month will be name
    // year will be number

    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);

    const expenses = await Expenses.find({
      user: req.user._id,
      date: {
        $gte: startOfMonth,
        $lt: endOfMonth,
      },
    });

    const categoryWiseExpenses = expenses.reduce((acc, curr) => {
      if (!acc[curr.category]) {
        acc[curr.category] = 0;
      }
      acc[curr.category] += curr.amount;
      return acc;
    }, {});

    console.log(categoryWiseExpenses);

    return res.status(200).json(categoryWiseExpenses);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// category wise expenses yearly
export const getYearlyExpensesAccordingToCategoryController = async (
  req,
  res
) => {
  try {
    const { year } = req.body;

    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31);

    const expenses = await Expenses.find({
      user: req.user._id,
      date: {
        $gte: startOfYear,
        $lt: endOfYear,
      },
    });

    const categoryWiseExpenses = expenses.reduce((acc, curr) => {
      if (!acc[curr.category]) {
        acc[curr.category] = 0;
      }
      acc[curr.category] += curr.amount;
      return acc;
    }, {});

    return res.status(200).json(categoryWiseExpenses);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// get dates where data is present in month according to selected date
export const getDatesWhereDataIsPresentController = async (req, res) => {
  try {
    const { date } = req.body;

    // Validate input date
    if (!date || isNaN(new Date(date).getTime())) {
      return res.status(400).json({ message: "Invalid or missing date" });
    }

    const month = new Date(date).getMonth();
    const year = new Date(date).getFullYear();

    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);

    // Query database for expenses
    const expenses = await Expenses.find({
      user: req.user._id,
      date: {
        $gte: startOfMonth,
        $lt: endOfMonth,
      },
    });

    if (expenses.length === 0) {
      return res
        .status(200)
        .json({ message: "No data available for this month", dates: [] });
    }

    // Extract unique dates where data is present
    const dates = [
      ...new Set(expenses.map((expense) => new Date(expense.date).getDate())),
    ];

    console.log("Dates with data:", dates);

    return res.status(200).json(dates);
  } catch (error) {
    console.error("Error fetching dates:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
