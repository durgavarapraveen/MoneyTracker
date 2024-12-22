import User from "../Modals/UserModal.js";
import Income from "../Modals/IncomeModal.js";

export const addIncomeController = async (req, res) => {
  try {
    const { amount, description } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const income = new Income({
      user: req.user._id,
      amount,
      description,
      date: new Date(),
    });

    await income.save();

    return res.status(201).json({ message: "Income added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getIncomeController = async (req, res) => {
  try {
    const { day } = req.body;
    if (!day) {
      return res.status(400).json({ message: "Day is required" });
    }

    const startOfDay = new Date(day);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(day);
    endOfDay.setUTCHours(0, 0, 0, 0);
    endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);

    const income = await Income.find({
      user: req.user._id,
      date: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    return res.status(200).json(income);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getIncomeByMonthController = async (req, res) => {
  try {
    const { day } = req.body;

    if (!day) {
      return res.status(400).json({ message: "Day is required" });
    }

    const startOfMonth = new Date(day);
    startOfMonth.setUTCDate(1);
    startOfMonth.setUTCHours(0, 0, 0, 0);

    const endOfMonth = new Date(day);
    endOfMonth.setUTCHours(0, 0, 0, 0);
    endOfMonth.setUTCMonth(endOfMonth.getUTCMonth() + 1);

    const income = await Income.find({
      user: req.user._id,
      date: {
        $gte: startOfMonth,
        $lt: endOfMonth,
      },
    });

    //calculate total income
    let totalIncome = 0;
    income.forEach((income) => {
      totalIncome += income.amount;
    });

    console.log(totalIncome);

    return res.status(200).json(totalIncome);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// get income by years for every month

export const getIncomeByYearController = async (req, res) => {
  try {
    const { year } = req.body;

    if (!year) {
      return res.status(400).json({ message: "Year is required" });
    }

    const startOfYear = new Date(year, 0, 1);
    startOfYear.setUTCHours(0, 0, 0, 0);

    const endOfYear = new Date(year, 0, 1);
    endOfYear.setUTCHours(0, 0, 0, 0);
    endOfYear.setUTCFullYear(endOfYear.getUTCFullYear() + 1);

    const income = await Income.find({
      user: req.user._id,
      date: {
        $gte: startOfYear,
        $lt: endOfYear,
      },
    });

    // calculate income month wise
    let incomeByMonth = new Array(12).fill(0);

    income.forEach((income) => {
      incomeByMonth[income.date.getUTCMonth()] += income.amount;
    });
    console.log(incomeByMonth);
    return res.status(200).json(incomeByMonth);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
