import express from "express"
import { getMovies, getMovieById, createMovie } from "../controllers/movieController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/").get(protect, getMovies).post(protect, createMovie)

router.route("/:id").get(protect, getMovieById)

export default router
