import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Por favor ingrese su nombre"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Por favor ingrese su correo electrónico"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Por favor ingrese un correo electrónico válido"],
    },
    cedula: {
      type: String,
      required: [true, "Por favor ingrese su número de cédula"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Por favor ingrese una contraseña"],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
    },
  },
  {
    timestamps: true,
  },
)

// Middleware para encriptar la contraseña antes de guardar
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next()
  }

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.models.User || mongoose.model("User", userSchema)

export default User
