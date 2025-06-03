import express from "express";
import { addCustomer, getCustomers, updateCustomer } from "../controllers/customerController.js";
import { verifyJwt } from "../middleware/authMiddleware.js";
// import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router();

// Middleware to protect routes
router.use(verifyJwt);

// Routes
router.post("/", addCustomer);
router.get("/",  getCustomers);
router.put("/:id", updateCustomer);

export default router; 
