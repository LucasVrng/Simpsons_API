const VALID_TYPES = ["episode", "character", "location"];

export const validateType = (req, res, next) => {
  const { type } = req.params;

  if (!VALID_TYPES.includes(type)) {
    return res.status(400).json({
      message: `Type invalide. Valeurs acceptées : ${VALID_TYPES.join(", ")}`
    });
  }

  next();
};