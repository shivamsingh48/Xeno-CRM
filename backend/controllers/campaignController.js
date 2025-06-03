import { redisClient } from "../config/redis.js";
import { Campaign } from "../models/campaign.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
// API to enqueue data
export const addCampaign = asyncHandler(async (req, res) => {
  const { name, segment, messageTemplate, userId } = req.body;

  // Validate request body
  if (!name || !segment || !messageTemplate || !userId) {
      return res.status(400).json({success:false,message:"Missing required fields"});
  }

  // Enqueue campaign data to Redis Stream
  const campaignData = {
    name,
    segment: JSON.stringify(segment),
    messageTemplate,
    userId,
    createdAt: new Date().toISOString(),
  };

  await redisClient.xAdd("campaignStream", "*", campaignData);

  return res.status(201).json({success:true,message:"Campaign added to processing queue"});
});

// Consumer to process Redis Stream data



// export const saveCampaign = asyncHandler(async (req, res) => {
//   const { name, segment, messageTemplate, userId } = req.body;

//   const campaign = new Campaign({ name, segment, messageTemplate, userId });
//   await campaign.save();

//   const customers = await Customer.find(JSON.parse(segment));
//   console.log(`Found ${customers.length} customers matching segment.`);

//   customers.forEach((customer) => {
//     sendMessageToVendor(campaign._id, customer);
//   });

//   res.status(201).json({ message: "Campaign created and messages sent." });
// });

export const getCampaigns = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  if(!userId){
      return res.status(401).json({success:false,message:"Unauthorized"});
  }
  const campaigns = await Campaign.find({ userId }).sort({ createdAt: -1 });
  return res.status(200).json({success:true,campaigns});
});

// Get Campaign by ID
export const getCampaignById = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) {
    return res.status(404).json({success:false,message:"Campaign not found"});
  }
  return res.status(200).json({success:true,campaign});
});