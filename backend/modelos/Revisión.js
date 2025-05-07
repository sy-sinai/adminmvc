import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Por favor ingrese un título para la reseña"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Por favor ingrese el contenido de la reseña"],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, "Por favor ingrese una calificación"],
      min: 1,
      max: 5,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema)

export default Review
