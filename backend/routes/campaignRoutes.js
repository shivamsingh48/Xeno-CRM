import express from "express";
import { addCampaign, getCampaignById, getCampaigns } from "../controllers/campaignController.js";
import { verifyJwt } from "../middleware/authMiddleware.js";
// import { saveCampaign } from "../controllers/saveCampaignController.js"

const router = express.Router();

// Route to add a campaign to the queue
router.use(verifyJwt)

router.post("/", addCampaign);
router.get("/",getCampaigns);
router.get("/:id", getCampaignById);

// router.post("/save", saveCampaign);

export default router;
