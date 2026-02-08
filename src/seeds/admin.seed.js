const bcrypt = require("bcryptjs");
const { User } = require("../models");

const seedAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL;

    if (!email) {
      console.log("⚠️ ADMIN_EMAIL no definido, seed omitido");
      return;
    }

    const adminExists = await User.findOne({
      where: { email },
    });

    if (adminExists) {
      console.log("👤 Admin ya existe, seed ignorado");
      return;
    }

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    await User.create({
      name: process.env.ADMIN_NAME || "Admin",
      email,
      password: hashedPassword,
      role: "admin",
      is_active: true,
    });

    console.log("✅ Usuario admin creado correctamente");
  } catch (error) {
    console.error("❌ Error creando admin seed:", error);
  }
};

module.exports = seedAdmin;
