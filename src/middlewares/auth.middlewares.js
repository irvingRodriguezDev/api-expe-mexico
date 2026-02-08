const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Token requerido",
    });
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({
      message: "Formato de token inválido",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // payload del token
    req.user = decoded; // { id, role, iat, exp }

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token inválido o expirado",
    });
  }
};

module.exports = authMiddleware;
