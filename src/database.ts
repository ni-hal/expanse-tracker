import mongoose from 'mongoose';

class Database {
  async connect() {
    try {
      const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/expense_tracker';
      await mongoose.connect(mongoUri);
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('MongoDB connection error:', error);
    }
  }
}

export default new Database();
