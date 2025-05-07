import mongoose from "mongoose"
import dotenv from "dotenv"
import User from "./models/User.js"
import Movie from "./models/Movie.js"
import Review from "./models/Review.js"

dotenv.config()

// Datos de ejemplo
const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    cedula: "1234567890",
    password: "123456",
  },
  {
    name: "Juan Pérez",
    email: "juan@example.com",
    cedula: "0987654321",
    password: "123456",
  },
]

const movies = [
  {
    title: "Inception",
    description: "Un ladrón que roba secretos corporativos a través del uso de la tecnología de compartir sueños.",
    genre: "Ciencia ficción",
    releaseYear: 2010,
  },
  {
    title: "The Shawshank Redemption",
    description:
      "Dos hombres encarcelados se unen durante varios años, encontrando consuelo y eventual redención a través de actos de decencia común.",
    genre: "Drama",
    releaseYear: 1994,
  },
  {
    title: "The Dark Knight",
    description: "Batman se enfrenta a un nuevo villano, el Joker, que busca sumir a Ciudad Gótica en la anarquía.",
    genre: "Acción",
    releaseYear: 2008,
  },
]

// Conectar a MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB conectado: ${conn.connection.host}`)
    return conn
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

// Importar datos
const importData = async () => {
  try {
    // Limpiar datos existentes
    await User.deleteMany()
    await Movie.deleteMany()
    await Review.deleteMany()

    // Insertar usuarios
    const createdUsers = await User.insertMany(users)
    const adminUser = createdUsers[0]._id

    // Insertar películas
    const createdMovies = await Movie.insertMany(movies)

    // Crear algunas reseñas
    const reviews = [
      {
        title: "Una obra maestra",
        content: "Esta película es increíble, la recomiendo totalmente.",
        rating: 5,
        user: adminUser,
        movie: createdMovies[0]._id,
      },
      {
        title: "Buena pero no excelente",
        content: "Me gustó pero esperaba más del final.",
        rating: 4,
        user: adminUser,
        movie: createdMovies[1]._id,
      },
    ]

    await Review.insertMany(reviews)

    console.log("Datos importados correctamente")
    process.exit()
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

// Eliminar datos
const destroyData = async () => {
  try {
    await User.deleteMany()
    await Movie.deleteMany()
    await Review.deleteMany()

    console.log("Datos eliminados correctamente")
    process.exit()
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

// Ejecutar script
connectDB().then(() => {
  if (process.argv[2] === "-d") {
    destroyData()
  } else {
    importData()
  }
})
