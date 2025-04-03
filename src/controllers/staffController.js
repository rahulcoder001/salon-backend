const prisma = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// **Staff Signup**
const staffSignup = async (req, res) => {
    const { fullname, contact, email, password, profile_img, user_id } = req.body;
  
    try {
      // Check if staff already exists
      const existingStaff = await prisma.staff.findUnique({ where: { email } });
      if (existingStaff) return res.status(400).json({ message: "Email already in use" });
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create staff member
      const newStaff = await prisma.staff.create({
        data: {
          fullname,
          contact,
          email,
          password: hashedPassword,
          profile_img,
          user_id,
        },
      });
  
      // Generate JWT token
      const token = generateToken(newStaff.id, "staff");
  
      res.status(201).json({ message: "Staff registered successfully", token, staff: newStaff });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };

// **Staff Login**
const staffLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const staff = await prisma.staff.findUnique({ where: { email } });

    if (!staff) return res.status(404).json({ message: "Staff not found" });

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(staff.id, "staff");

    res.status(200).json({ message: "Login successful", token, staff });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { staffLogin , staffSignup };
