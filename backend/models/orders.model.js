import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    customerId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer' 
    },
    amount: Number,
    items: [{
        name: String,
        price: Number,
        quantity: Number
    }],
    status: { 
        type: String, 
        enum: ['pending', 'shipped', 'delivered'], 
        default: 'pending' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

export const Order = mongoose.model('Order', orderSchema);