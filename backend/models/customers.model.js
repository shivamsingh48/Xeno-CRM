import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: String,
  email: { 
        type: String, 
        unique: true 
    },
    phone: String,
    totalSpent: {
        type: Number, 
        default: 0 
    },
    lastOrder: Date,
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
  updatedAt: Date
});

export const Customer = mongoose.model('Customer', customerSchema);