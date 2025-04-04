const prisma = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const userSignup = async (req, res) => {
  const { fullname, contact, email, password, profile_img } = req.body;

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "Email already in use" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user (DO NOT pass `id`)
    const newUser = await prisma.user.create({
      data: {
        fullname,
        contact,
        email,
        password: hashedPassword,
        profile_img,
      },
    });

    // Generate JWT token
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


// **User Login**
const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user.id, "user");

    // Fetch user again to include salonId
    const userWithSalon = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        fullname: true,
        contact: true,
        email: true,
        profile_img: true,
        salonId: true, // ✅ Corrected field name
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

module.exports = { userSignup, userLogin };
