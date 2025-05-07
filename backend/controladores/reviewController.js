import Review from "../models/Review.js"

// @desc    Obtener todas las reseñas
// @route   GET /api/reviews
// @access  Private
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({}).populate("user", "name").populate("movie", "title").sort({ createdAt: -1 })

    res.json(reviews)
  } catch (error) {
    console.error("Error al obtener reseñas:", error)
    res.status(500).json({ message: "Error del servidor" })
  }
}

// @desc    Obtener reseñas de un usuario
// @route   GET /api/reviews/user
// @access  Private
export const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id }).populate("movie", "title").sort({ createdAt: -1 })

    res.json(reviews)
  } catch (error) {
    console.error("Error al obtener reseñas del usuario:", error)
    res.status(500).json({ message: "Error del servidor" })
  }
}

// @desc    Crear una nueva reseña
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
  try {
    const { title, content, rating, movieId } = req.body

    const review = await Review.create({
      title,
      content,
      rating,
      user: req.user._id,
      movie: movieId,
    })

    const populatedReview = await Review.findById(review._id).populate("user", "name").populate("movie", "title")

    res.status(201).json(populatedReview)
  } catch (error) {
    console.error("Error al crear reseña:", error)
    res.status(500).json({ message: "Error del servidor" })
  }
}

// @desc    Obtener una reseña por ID
// @route   GET /api/reviews/:id
// @access  Private
export const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate("user", "name").populate("movie", "title")

    if (review) {
      res.json(review)
    } else {
      res.status(404).json({ message: "Reseña no encontrada" })
    }
  } catch (error) {
    console.error("Error al obtener reseña:", error)
    res.status(500).json({ message: "Error del servidor" })
  }
}
