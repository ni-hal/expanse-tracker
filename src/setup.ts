import bcrypt from 'bcryptjs';
import db from './database';
import User from './models/User';

async function setupDefaultAdmin() {
  try {
    await db.connect();
    
    const existingAdmin = await User.findOne({ role: 'Admin' });
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const admin = new User({
        fullName: 'System Admin',
        username: 'admin',
        password: hashedPassword,
        mobile: '1234567890',
        role: 'Admin'
      });
      
      await admin.save();
      
      console.log('Default admin user created:');
      console.log('Username: admin');
      console.log('Password: admin123');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Setup failed:', error);
  }
}

setupDefaultAdmin();