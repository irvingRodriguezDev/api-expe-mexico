require("dotenv").config();
process.env.TZ = "America/Mexico_City";

const express = require("express");
const http = require("http");
const cors = require("cors");
const sequelize = require("./config/db");
const app = express();
const httpServer = http.createServer(app);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", require("./routes"));
app.use((req, res) => {
  res.status(404).json({ msg: "Ruta no encontrada" });
});

const PORT = process.env.PORT || 3000;

sequelize
  .sync({ alter: false })
  .then(async () => {
    console.log("Base de datos sincorinizada");

    httpServer.listen(PORT, "0.0.0.0", () => {
      console.log(`servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("errorDB", err));

module.exports = app;
