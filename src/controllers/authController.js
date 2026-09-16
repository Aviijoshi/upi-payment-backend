const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required information" });
    }

    let userExist = await User.findOne({ $or: [{ email }, { phone }] });

    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const sanitizedname = email.toLowerCase();
    const upiId = `${sanitizedname.split("@")[0]}@youpe`;

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      upiId,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        upiId: user.upiId,
        balance: user.balance,
        hasMpinSet: false,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      upiId: user.upiId,
      balance: user.balance,
      hasMpinSet: !!user.mpin,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const setUpMpin = async (req, res) => {
  const { mpin } = req.body;

  if (!mpin || !/^\d{4}$/.test(mpin.toString())) {
    return res
      .status(400)
      .json({ message: "Please provide a valid 4-digit MPIN" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedMpin = await bcrypt.hash(mpin.toString(), salt);

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { mpin: hashedMpin },
    { new: true }
  );

  if (user) {
    res.json({ message: "MPIN set successfully" });
  } else {
    res.status(400).json({ message: "Failed to set MPIN" });
  }
};

const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -mpin");

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  setUpMpin,
  getUserProfile,
};