import { Order } from "../models/orders.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Add a new order
export const addOrder = asyncHandler(async (req, res) => {
  const { customerId, amount, items } = req.body;

  if (!customerId || !amount || !items || !items.length) {
    return res.status(400).json({success:false,message:"Missing required fields" });
  }

  const order = await Order.create({ customerId, amount, items });
  return res.status(201).json({success:true,order});
});

// Fetch orders for a customer
export const getCustomerOrders = asyncHandler(async (req, res) => {
  const { customerId } = req.params;

  const orders = await Order.find({ customerId });
  if (!orders.length) {
    return res.status(404).json({success:false,message:"No orders found for this customer" });
  }

  return res.status(200).json({success:true,orders});
});

// Get Order by ID
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({success:false,message:"Order not found"});
  }
  return res.status(200).json({success:true,order});
});