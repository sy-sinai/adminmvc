import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import userRoutes from "./routes/userRoutes.js"
import movieRoutes from "./routes/movieRoutes.js"
import reviewRoutes from "./routes/reviewRoutes.js"

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Rutas
app.use("/api/users", userRoutes)
app.use("/api/movies", movieRoutes)
app.use("/api/reviews", reviewRoutes)

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("API funcionando correctamente")
})

// Conexión a MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB conectado: ${conn.connection.host}`)
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

// Iniciar servidor
const PORT = process.env.PORT || 5000

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`)
  })
})
