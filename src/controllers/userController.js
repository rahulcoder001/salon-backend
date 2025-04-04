const prisma = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const userSignup = async (req, res) => {
  const { fullname, contact, email, password, profile_img } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        fullname,
        contact,
        email,
        password: hashedPassword,
        profile_img,
      },
    });

    const token = generateToken(newUser.id, "user");

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: newUser,
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user.id, "user");

    const userWithSalon = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        fullname: true,
        contact: true,
        email: true,
        profile_img: true,
        salonId: true,
      },
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: userWithSalon,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const changePassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Final version recommendation
const getUserById = async (req, res) => {
  const { user_id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: user_id },
      select: {
        id: true,
        fullname: true,
        email: true,
        contact: true,
        profile_img: true,
        salonId: true,
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    console.error("Get User Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  userSignup,
  userLogin,
  changePassword,
  getUserById, // ✅ export new function
};
