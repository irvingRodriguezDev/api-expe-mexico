exports.check = (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API funcionando correctamente 🚀",
    timestamp: new Date(),
  });
};
