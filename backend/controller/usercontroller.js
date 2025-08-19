import usermodel from '../models/usermodel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'username, email and password are required' });
    }
    const userExist = await usermodel.findOne({ email });
    if (userExist) {
      return res.status(400).json({ error: 'user already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new usermodel({ username, email, password: hashedPassword });
    await newUser.save();
    return res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    return res.status(500).json({ error: 'internal server error: ' + error.message });
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await usermodel.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      success: true,
      token,
      user: { username: user.username, email: user.email }
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ name: user.name, email: user.email, phone: user.phone, address: user.address, img: user.img });
  } catch (err) {
    res.status(500).json({ error: "Failed to load profile" });
  }
};
