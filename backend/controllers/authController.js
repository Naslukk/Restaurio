import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import { findByEmail, createUser } from "../models/userModel.js";

export const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
      const existingUser = await findByEmail(email);
      if (existingUser) return res.status(400).json({ message: 'Email already exists' });
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await createUser(name, email, hashedPassword, role || 'waiter');
  
      res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (err) {
        console.log(err);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await findByEmail(email);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
  
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });
  
      res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };