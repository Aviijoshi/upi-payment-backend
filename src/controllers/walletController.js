const User = require("../models/User");
const Transaction = require("../models/Transaction");
const bcrypt = require("bcryptjs");

const addMoney = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user._id;

    if (
      amount === undefined ||
      !Number.isFinite(Number(amount)) ||
      Number(amount) <= 0
    ) {
      return res.status(400).json({
        message: "Amount should be valid",
      });
    }

    const addAmount = Number(amount);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.balance += addAmount;

    await user.save();

    const transaction = await Transaction.create({
      sender: userId,
      type: "ADD_MONEY",
      amount: addAmount,
      status: "SUCCESS",
    });

    res.json({
      message: `Successfully added ${addAmount} to wallet`,
      balance: user.balance,
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const payBill = async (req, res) => {
  try {
    const { billerName, amount, mpin } = req.body;
    const userId = req.user._id;

    if (!mpin) {
      return res.status(400).json({
        message: "MPIN is required",
      });
    }

    if (
      amount === undefined ||
      !Number.isFinite(Number(amount)) ||
      Number(amount) <= 0
    ) {
      return res.status(400).json({
        message: "Amount should be valid",
      });
    }

    const billAmount = Number(amount);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.mpin) {
      return res.status(400).json({
        message: "Please setup MPIN first",
      });
    }

    const isMpinCorrect = await bcrypt.compare(
      mpin.toString(),
      user.mpin
    );

    if (!isMpinCorrect) {
      return res.status(401).json({
        message: "Incorrect MPIN",
      });
    }

    if (user.balance < billAmount) {
      return res.status(400).json({
        message: "Insufficient wallet balance",
      });
    }

    user.balance -= billAmount;

    await user.save();

    const transaction = await Transaction.create({
      sender: user._id,
      type: "BILL_PAYMENT",
      billerName: billerName || "Unknown Utility",
      amount: billAmount,
      status: "SUCCESS",
    });

    res.json({
      message: `Bill paid successfully for ${
        billerName || "Unknown Utility"
      }`,
      balance: user.balance,
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addMoney,
  payBill,
};