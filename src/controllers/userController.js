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
        step:1
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
        step: true,
        salon:true
      },
    });

    if (!user) return res.status(404).json({ message: "User no found" });

    res.status(200).json({ user });
  } catch (error) {
    console.error("Get User Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateUser = async (req, res) => {
  const { user_id } = req.params;
  const { fullname, contact, email, profile_img, step, salonId, password } = req.body;

  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ 
      where: { id: user_id } 
    });
    
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate email uniqueness if changing email
    if (email && email !== existingUser.email) {
      const emailUser = await prisma.user.findUnique({ 
        where: { email } 
      });
      if (emailUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    // Prepare update data
    const updateData = {
      fullname,
      contact,
      email,
      profile_img,
      step,
      salonId
    };

    // Handle password update securely
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Perform the update
    const updatedUser = await prisma.user.update({
      where: { id: user_id },
      data: updateData,
      select: {
        id: true,
        fullname: true,
        email: true,
        contact: true,
        profile_img: true,
        salonId: true,
        step: true,
      },
    });

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ 
      message: "Server error during update",
      error: error.message 
    });
  }
};

const getUsersByPeriod = async (req, res) => {
  const now = new Date();

  // Calculate time ranges
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const weekStart = new Date(now);
  const day = weekStart.getDay(); // 0 (Sunday) to 6 (Saturday)
  const diff = day === 0 ? 6 : day - 1; // Days since Monday
  weekStart.setDate(weekStart.getDate() - diff);
  weekStart.setHours(0, 0, 0, 0);

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  try {
    // Get the earliest date to optimize database query
    const earliestDate = new Date(Math.min(
      todayStart.getTime(),
      weekStart.getTime(),
      monthStart.getTime()
    ));

    // Fetch all relevant users
    const users = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: earliestDate
        }
      },
      select: {
        id: true,
        fullname: true,
        email: true,
        contact: true,
        profile_img: true,
        salonId: true,
        step: true,
        createdAt: true
      }
    });

    // Categorize users
    const result = {
      daily: { count: 0, users: [] },
      weekly: { count: 0, users: [] },
      monthly: { count: 0, users: [] }
    };

    users.forEach(user => {
      const createdAt = user.createdAt;
      
      if (createdAt >= todayStart) {
        result.daily.users.push(user);
        result.daily.count++;
      }
      if (createdAt >= weekStart) {
        result.weekly.users.push(user);
        result.weekly.count++;
      }
      if (createdAt >= monthStart) {
        result.monthly.users.push(user);
        result.monthly.count++;
      }
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Get Users by Period Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllUsersWithContactInfo = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullname: true,
        email: true,
        contact: true,
        createdAt: true,
        profile_img: true,
        PurchasedPlan: {
          select: {
            date: true,
            package: {
              select: {
                name: true,
                price: true,
                branchLimit: true,
                features: true
              }
            }
          }
        },
        salon: {
          select: {
            salon_name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Format the output
    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.fullname,
      email: user.email,
      phone: user.contact,
      profile_image: user.profile_img,
      created_at: user.createdAt,
      salon: user.salon?.salon_name || null,
      purchasedPlans: user.PurchasedPlan.map(plan => ({
        purchaseDate: plan.date,
        planName: plan.package.name,
        price: plan.package.price,
        branchLimit: plan.package.branchLimit,
        features: plan.package.features
      }))
    }));

    res.status(200).json({
      success: true,
      count: formattedUsers.length,
      data: formattedUsers
    });

  } catch (error) {
    console.error("Get Users Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message
    });
  }
};



module.exports = {
  userSignup,
  userLogin,
  changePassword,
  getUserById, 
   updateUser,
   getUsersByPeriod,
   getAllUsersWithContactInfo
};
