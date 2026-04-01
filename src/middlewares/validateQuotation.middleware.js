import Joi from "joi";

const schema = Joi.object({
  tripType: Joi.string().valid("one_way", "round_trip").required().messages({
    "any.only": 'El tipo de viaje debe ser "one_way" o "round_trip".',
    "any.required": "El tipo de viaje es obligatorio.",
  }),

  contractorName: Joi.string().min(3).max(150).required().messages({
    "string.min": "El nombre debe tener al menos 3 caracteres.",
    "string.max": "El nombre no puede exceder 150 caracteres.",
    "any.required": "El nombre del contratador es obligatorio.",
  }),

  contractorPhone: Joi.string()
    .pattern(/^\+?[\d\s\-()]{7,20}$/)
    .required()
    .messages({
      "string.pattern.base": "El teléfono no tiene un formato válido.",
      "any.required": "El teléfono de WhatsApp es obligatorio.",
    }),

  contractorEmail: Joi.string()
    .email({ tlds: { allow: false } })
    .max(150)
    .required()
    .messages({
      "string.email": "El correo electrónico no tiene un formato válido.",
      "any.required": "El correo electrónico es obligatorio.",
    }),

  origin: Joi.string().min(3).max(255).required().messages({
    "any.required": "El lugar de origen es obligatorio.",
  }),

  destination: Joi.string().min(3).max(255).required().messages({
    "any.required": "El lugar de destino es obligatorio.",
  }),

  unitTypeId: Joi.string().uuid().required().messages({
    "string.uuid": "El tipo de unidad no es válido.",
    "any.required": "El tipo de unidad es obligatorio.",
  }),

  departureAt: Joi.date().iso().greater("now").required().messages({
    "date.greater": "La fecha de salida debe ser futura.",
    "any.required": "La fecha y hora de salida es obligatoria.",
  }),

  returnAt: Joi.when("tripType", {
    is: "round_trip",
    then: Joi.date().iso().greater(Joi.ref("departureAt")).required().messages({
      "date.greater": "La fecha de regreso debe ser posterior a la de salida.",
      "any.required":
        "La fecha de regreso es obligatoria para viajes redondos.",
    }),
    otherwise: Joi.date().iso().optional().allow(null, ""),
  }),

  description: Joi.string().max(1000).optional().allow(null, ""),
});

export function validateQuotation(req, res, next) {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false, // Reporta todos los errores, no solo el primero
    stripUnknown: true, // Elimina campos no definidos en el schema (incluye _hp si quedó)
  });

  if (error) {
    const messages = error.details.map((d) => d.message);
    return res.status(400).json({
      ok: false,
      message: "Error de validación.",
      errors: messages,
    });
  }

  req.body = value; // Usamos el valor ya limpio y casteado por Joi
  next();
}
