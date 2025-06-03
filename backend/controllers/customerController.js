import { Customer } from "../models/customers.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Add a new customer
export const addCustomer = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({success:false,message:"Missing required fields"});
  }

  const existingCustomer = await Customer.findOne({ email });
  if (existingCustomer) {
    return res.status(400).json({success:false,message:"Customer with this email already exists"});
  }

  const customer = await Customer.create({ name, email, phone });
  return res.status(201).json({success:true,customer});
});

// Update customer details
export const updateCustomer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  const customer = await Customer.findByIdAndUpdate(
    id,
    { name, email, phone },
    { new: true }
  );

  if (!customer) {
    return res.status(404).json({success:false,message:"Customer not found"});
  }

  return res.status(200).json({success:true,customer});
});

export const getCustomers = asyncHandler(async (req, res) => {
  const customers = await Customer.find({});
  if(!customers){
    return res.status(404).json({success:false,message:"No customers found"});
  }
  return res.status(200).json({success:true,customers});
});

// Get Customer by ID
export const getCustomerById = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    return res.status(404).json({success:false,message:"Customer not found"});
  }
  return res.status(200).json({success:true,customer});
});