/**
 * Honeypot anti-bot.
 * El frontend incluye un campo oculto con name="_hp" que debe llegar vacío.
 * Un bot que llene todos los campos automáticamente lo enviará con valor
 * y aquí lo detectamos y rechazamos silenciosamente.
 */
export function honeypot(req, res, next) {
  const trap = req.body._hp;

  // Si el campo tiene cualquier valor, es un bot
  if (trap !== undefined && trap !== "") {
    // Respondemos 200 para no dar pistas al bot
    return res.status(200).json({
      ok: true,
      message:
        "Cotización recibida. En breve nos pondremos en contacto contigo.",
    });
  }

  // Limpiamos el campo antes de pasar al siguiente middleware
  delete req.body._hp;
  next();
}
