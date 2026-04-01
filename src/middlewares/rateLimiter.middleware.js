import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // máx 3 solicitudes por IP
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  handler: (req, res) => {
    return res.status(429).json({
      ok: false,
      message:
        "Has realizado demasiadas solicitudes. Intenta de nuevo más tarde.",
    });
  },
});
