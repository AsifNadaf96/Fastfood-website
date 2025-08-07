import usermodel from '../models/usermodel.js';  // <-- include .js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'email, username and password are required' });
        }
        const userExist = await usermodel.findOne({ email });
        
        if (userExist) {
            return res.status(400).json({ error: 'user already exists' });
        }
        req.body.password = await bcrypt.hash(password, 10);
        let newUser = new usermodel(req.body);
        await newUser.save();
        return res.status(200).json({ message: "user registered successfully", user: newUser });

    } catch (error) {
        return res.status(500).json({ error: 'internal server error' + error.message });
    }
}
export const login =async (req,res) =>{
  try {
    const { email, password } = req.body;
    const user = await usermodel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const forgotpassword = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'id is required' });
        }
        const user = await usermodel.findById(id);
        if (!user) {
            return res.status(404).json({ error: "user not found" });
        }
        if (!req.body.password) {
            return res.status(400).json({ error: 'password is required' });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        let updatedUser = { ...user._doc, password: hashedPassword };
        updatedUser = await usermodel.findByIdAndUpdate(id, updatedUser, { new: true });
        return res.status(200).json({ message: "user updated successfully", user: updatedUser });
    } catch (error) {
        return res.status(500).json({ error: 'internal server error' + error.message });
    }
}

export const deleteuser = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'id is required' });
        }
        const user = await usermodel.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ error: "user not found" });
        }
        return res.status(200).json({ message: "user deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: 'internal server error' + error.message });
    }
}