import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectRedis } from "./config/redis.js";
import campaignRoutes from "./routes/campaignRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { processCampaignStream } from "./services/campaignConsumer.js";
import userRoutes from "./routes/userRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js"

connectRedis()

const app= express() 

const allowedOrigins = [
    'http://localhost:5173', 
  ];
  
  app.use(cors({
    origin: function (origin, callback) {
      if (allowedOrigins.includes(origin)) {
        callback(null, true); 
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }));

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


app.use("/api/campaigns", campaignRoutes);
app.use("/api/customers",customerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", userRoutes);
app.use("api/delivery",deliveryRoutes)

// Start Redis Stream Consumer
processCampaignStream().catch(console.error);

export default app;