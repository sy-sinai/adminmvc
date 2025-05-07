import Movie from "../models/Movie.js"

// @desc    Obtener todas las películas
// @route   GET /api/movies
// @access  Private
export const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find({}).sort({ title: 1 })
    res.json(movies)
  } catch (error) {
    console.error("Error al obtener películas:", error)
    res.status(500).json({ message: "Error del servidor" })
  }
}

// @desc    Obtener una película por ID
// @route   GET /api/movies/:id
// @access  Private
export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id)

    if (movie) {
      res.json(movie)
    } else {
      res.status(404).json({ message: "Película no encontrada" })
    }
  } catch (error) {
    console.error("Error al obtener película:", error)
    res.status(500).json({ message: "Error del servidor" })
  }
}

// @desc    Crear una nueva película
// @route   POST /api/movies
// @access  Private
export const createMovie = async (req, res) => {
  try {
    const { title, description, genre, releaseYear } = req.body

    const movie = await Movie.create({
      title,
      description,
      genre,
      releaseYear,
    })

    res.status(201).json(movie)
  } catch (error) {
    console.error("Error al crear película:", error)
    res.status(500).json({ message: "Error del servidor" })
  }
}
