import User from "../models/User.js"
import jwt from "jsonwebtoken"

// Generar token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  })
}

// @desc    Registrar un nuevo usuario
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, cedula, password } = req.body

    // Verificar si el email ya existe
    const emailExists = await User.findOne({ email })
    if (emailExists) {
      return res.status(400).json({ message: "El correo electrónico ya está registrado" })
    }

    // Verificar si la cédula ya existe
    const cedulaExists = await User.findOne({ cedula })
    if (cedulaExists) {
      return res.status(400).json({ message: "El número de cédula ya está registrado" })
    }

    // Validar longitud de la contraseña
    if (password.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" })
    }

    // Crear usuario
    const user = await User.create({
      name,
      email,
      cedula,
      password,
    })

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      })
    } else {
      res.status(400).json({ message: "Datos de usuario inválidos" })
    }
  } catch (error) {
    console.error("Error al registrar usuario:", error)
    res.status(500).json({ message: "Error del servidor" })
  }
}

// @desc    Autenticar usuario y obtener token
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    // Buscar usuario por email
    const user = await User.findOne({ email })

    // Verificar usuario y contraseña
    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      })
    } else {
      res.status(401).json({ message: "Correo electrónico o contraseña incorrectos" })
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error)
    res.status(500).json({ message: "Error del servidor" })
  }
}

// @desc    Obtener perfil de usuario
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password")

    if (user) {
      res.json(user)
    } else {
      res.status(404).json({ message: "Usuario no encontrado" })
    }
  } catch (error) {
    console.error("Error al obtener perfil:", error)
    res.status(500).json({ message: "Error del servidor" })
  }
}

