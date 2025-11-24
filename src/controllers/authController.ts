import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/admin';
import { JWT_SECRET } from '../middleware/auth';
import database from '../database';
import { AuthRequest } from '../middleware/auth';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    const user = await Admin.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user._id, username: user.username, role: user.role ,  statuscode:200,message:"login successful" } });

  
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};


export const registerAdmin = async (req: Request, res: Response) => {
  try {
    const { username, email, password, mobile } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const admin = new Admin({
      username,
      email,
      password: hashedPassword,
      mobile,
      role: 'Admin'
    });

    await admin.save();
    res.json({ 
      message: 'Admin registered successfully',
      statusCode: 201,
      data: admin
    });
  } catch (error: any) {
    console.error('Register admin error:', error);
    res.status(500).json({ error: 'Failed to register admin', statusCode: 500, data: null });
  }
};

export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const { username, email, password, mobile } = req.body;
    
    if (!username || !email || !password || !mobile) {
      return res.status(400).json({ error: 'All fields are required', statusCode: 400 });
    }

    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists', statusCode: 400 });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new Admin({
      username,
      email,
      password: hashedPassword,
      mobile,
      role: 'User'
    });

    await user.save();
    res.json({ 
      message: 'User created successfully',
      statusCode: 201,
      data: { id: user._id, username: user.username, email: user.email, role: user.role }
    });
  } catch (error: any) {
    console.error('Create user error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already exists', statusCode: 400 });
    }
    res.status(500).json({ error: 'Failed to create user', statusCode: 500 });
  }
};