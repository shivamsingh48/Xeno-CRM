import { asyncHandler } from "../utils/asyncHandler.js";
import {CommunicationLog} from "../models/communicationLog.model.js";

// Vendor Delivery API
export const vendorDelivery = asyncHandler(async (req, res) => {
  const { campaignId, customerId, status } = req.body;

  if(!campaignId || !customerId || !status){
    return res.status(400).json({success:false,message:"Missing required fields"});
  }

  const newLog = new CommunicationLog({
    campaignId,
    customerId,
    status,
    createdAt: new Date(),
  });

  const savedLog = await newLog.save();
  return res.status(200).json({success:true,savedLog});
});

// Delivery Receipt API
export const deliveryReceipt = asyncHandler(async (req, res) => {
  const { campaignId, customerId, status } = req.body;

  if(!campaignId || !customerId || !status){
    res.status(400).json({success:false,message:"Missing required fields"});
    return;
  }

  const logEntry = await CommunicationLog.findOneAndUpdate(
    { campaignId, customerId },
    { status },
    { new: true }
  );

  if (!logEntry) {
    return res.status(404).json({success:false,message:"Log entry not found"});
  }

  return res.status(200).json({success:true,logEntry});
});
