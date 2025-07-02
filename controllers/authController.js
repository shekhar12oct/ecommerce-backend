const EcommerceUsers = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User Registration
const register = async (req, res) => {
  try {
    const { name, email, password } = req?.body;

    // if registering user is already registered
    const existingCustomer = await EcommerceUsers.findOne({ email });
    if (existingCustomer)
      return res.status(400).json({ msg: 'User already exists' });

    // if non-registered user
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const user = new EcommerceUsers({ name, email, password: hashed });
    await user.save();

    res.status(200).json({ msg: 'User Registered' });
  } catch (err) {
    res.status(500).json({ msg: 'Server Erro', error: err.message });
  }
};

// User Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await EcommerceUsers.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true on HTTPS
      sameSite: 'Lax', // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      msg: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// User Logout
const logout = async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true if HTTPS
    sameSite: 'Lax',
  });
  res.status(200).json({ msg: 'Logged out successfully' });
};

module.exports = {
  register,
  login,
  logout,
};
