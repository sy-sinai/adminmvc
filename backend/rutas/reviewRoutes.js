import express from "express"
import { getReviews, getUserReviews, createReview, getReviewById } from "../controllers/reviewController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/").get(protect, getReviews).post(protect, createReview)

router.get("/user", protect, getUserReviews)
router.get("/:id", protect, getReviewById)

export default router
