const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validación básica
    if (!email || !password) {
      return res.status(400).json({
        message: "Email y password son requeridos",
      });
    }

    // 2️⃣ Buscar usuario
    const user = await User.findOne({
      where: { email },
    });

    if (!user || !user.is_active) {
      return res.status(401).json({
        message: "Credenciales inválidas",
      });
    }

    // 3️⃣ Comparar password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        message: "Credenciales inválidas",
      });
    }

    // 4️⃣ Generar token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    // 5️⃣ Respuesta
    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Error interno en login",
    });
  }
};

exports.me = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      attributes: ["id", "name", "email", "role", "is_active", "created_at"],
    });

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    res.json(user);
  } catch (error) {
    console.error("ME error:", error);
    res.status(500).json({
      message: "Error obteniendo usuario",
    });
  }
};
exports.updatePassword = async (req, res) => {
  try {
    const { email, password, password_confirmation } = req.body;

    // 1️⃣ Validaciones básicas
    if (!email || !password || !password_confirmation) {
      return res.status(400).json({
        message: "Email, password y password_confirmation son requeridos",
      });
    }

    if (password !== password_confirmation) {
      return res.status(400).json({
        message: "Las contraseñas no coinciden",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "La contraseña debe tener al menos 8 caracteres",
      });
    }

    // 2️⃣ Buscar usuario
    const user = await User.findOne({
      where: { email },
    });

    if (!user || !user.is_active) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    // 3️⃣ Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Actualizar contraseña
    user.password = hashedPassword;
    await user.save();

    // 5️⃣ Respuesta
    return res.status(200).json({
      message: "Contraseña actualizada correctamente",
    });
  } catch (error) {
    console.error("Update password error:", error);
    return res.status(500).json({
      message: "Error interno al actualizar la contraseña",
    });
  }
};
