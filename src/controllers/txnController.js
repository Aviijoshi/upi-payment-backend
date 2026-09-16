const Transaction = require("../models/Transaction");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const sendMoney = async (req, res) => {
  try {
    const { phone, amount, mpin } = req.body;
    const senderId = req.user._id;

    if (!mpin) {
      return res.status(400).json({
        message: "MPIN is required for transactions",
      });
    }

    if (amount === undefined || !Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than zero",
      });
    }

    const transferAmount = Number(amount);

    const sender = await User.findById(senderId);

    if (!sender) {
      return res.status(404).json({
        message: "Sender not found",
      });
    }

    if (!sender.mpin) {
      return res.status(400).json({
        message: "Please setup your MPIN first",
      });
    }

    const isMpinCorrect = await bcrypt.compare(
      mpin.toString(),
      sender.mpin
    );

    if (!isMpinCorrect) {
      return res.status(401).json({
        message: "Incorrect MPIN",
      });
    }

    const receiver = await User.findOne({
      $or: [{ phone: phone }, { upiId: phone }],
    });

    if (!receiver) {
      return res.status(404).json({
        message: "Receiver not found (Invalid Phone/UPI)",
      });
    }

    if (senderId.toString() === receiver._id.toString()) {
      return res.status(400).json({
        message: "You cannot send money to yourself",
      });
    }

    if (sender.balance < transferAmount) {
      return res.status(400).json({
        message: "Insufficient balance",
      });
    }

    sender.balance -= transferAmount;
    receiver.balance += transferAmount;

    await sender.save();
    await receiver.save();

    const transaction = await Transaction.create({
      sender: senderId,
      receiver: receiver._id,
      type: "TRANSFER",
      amount: transferAmount,
      status: "SUCCESS",
    });

    res.status(201).json({
      message: "Money Transfer Successful",
      transaction,
      newBalance: sender.balance,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const transactions = await Transaction.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate("sender", "name phone upiId")
      .populate("receiver", "name phone upiId")
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  sendMoney,
  getTransactionHistory,
};