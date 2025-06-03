import { redisClient } from "../config/redis.js";
import { Campaign } from "../models/campaign.model.js";

export const processCampaignStream = async () => {
  try {
    console.log("Starting to process the Redis stream...");
    
    // Get the last processed ID from Redis
    let lastId = await redisClient.get("campaignStream:lastId");
    if (!lastId) {
      lastId = "0"; // Default to "0" if no ID is stored
    }

    while (true) {
      // Read the stream starting from the last processed ID
      const streams = await redisClient.xRead(
        { key: "campaignStream", id: `${lastId}` },
        { BLOCK: 5000, COUNT: 10 }
      );

      if (streams) {
        for (const stream of streams) {
          const messages = stream.messages;

          for (const message of messages) {
            const messageId = message.id;

            // Process only new messages
            if (messageId > lastId) {
              const campaignData = message.message;

              // Parse and save to MongoDB
              const newCampaign = new Campaign({
                name: campaignData.name,
                segment: JSON.parse(campaignData.segment),
                messageTemplate: campaignData.messageTemplate,
                userId: campaignData.userId,
                createdAt: campaignData.createdAt,
                status: "draft",
              });

              await newCampaign.save();
              console.log("Campaign saved to MongoDB:", newCampaign);

              // Update the last processed ID in Redis
              await redisClient.set("campaignStream:lastId", messageId);
              lastId = messageId; // Update local reference
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Error processing Redis Stream:", error);
  }
};
