import mongoose from "mongoose"

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Por favor ingrese el título de la película"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Por favor ingrese una descripción"],
      trim: true,
    },
    genre: {
      type: String,
      required: [true, "Por favor seleccione un género"],
      trim: true,
    },
    releaseYear: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
)

const Movie = mongoose.models.Movie || mongoose.model("Movie", movieSchema)

export default Movie
