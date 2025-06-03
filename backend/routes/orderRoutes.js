import express from "express";
import { addOrder, getCustomerOrders, getOrderById } from "../controllers/orderController.js";
import { verifyJwt } from "../middleware/authMiddleware.js";
// import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router();

// Middleware to protect routes
router.use(verifyJwt);

// Routes
router.post("/", addOrder);
router.get("/:customerId", getCustomerOrders);
router.get("/:id", getOrderById);


export default router;
