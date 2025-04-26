const prisma = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (userId, role, expiresIn) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: `${expiresIn}s` }
  );
};

// **Staff Signup**
const staffSignup = async (req, res) => {
  const { fullname, contact, email, password, profile_img, user_id, staff_id, branch_id } = req.body;

  try {
    // Check for existing email
    const existingEmail = await prisma.staff.findUnique({ where: { email } });
    if (existingEmail) return res.status(400).json({ message: "Email already in use" });

    // Check for existing contact
    const existingContact = await prisma.staff.findUnique({ where: { contact } });
    if (existingContact) return res.status(400).json({ message: "Contact number already in use" });

    // Check for existing staff_id
    const existingStaffId = await prisma.staff.findUnique({ where: { staff_id } });
    if (existingStaffId) return res.status(400).json({ message: "Staff ID already in use" });

    // Validate user exists
    const userExists = await prisma.user.findUnique({ where: { id: user_id } });
    if (!userExists) return res.status(400).json({ message: "Invalid user ID" });

    // Validate branch exists
    const branchExists = await prisma.branch.findUnique({ where: { id: branch_id } });
    if (!branchExists) return res.status(400).json({ message: "Invalid branch ID" });

    // Create staff member
    const newStaff = await prisma.staff.create({
      data: {
        fullname,
        contact,
        email,
        password: password, 
        profile_img,
        user_id,
        staff_id,
        branch_id
      },
    });
    res.status(201).json({ message: "Staff registered successfully", staff: newStaff });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// **Staff Login**
const staffLogin = async (req, res) => {

  const { staffId, password } = req.body;

  try {
    // Get staff with branch information
    const staff = await prisma.staff.findUnique({
      where: { staff_id: staffId },
      include: { branch: true }
    });

    if (!staff) return res.status(404).json({ message: "Staff not found" });

    // Password check (consider using bcrypt in real-world scenario)
    if (staff.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Parse opening time from branch
    const [openingHour, openingMinute] = staff.branch.opning_time.split(':').map(Number);
    
    // Calculate expiration time
    const now = new Date();
    const todayOpening = new Date(now);
    todayOpening.setHours(openingHour, openingMinute, 0, 0);

    let expirationTime = new Date(todayOpening);
    if (now >= todayOpening) {
      expirationTime.setDate(expirationTime.getDate() + 1);
    }

    // Calculate token duration in seconds
    const expiresIn = Math.floor((expirationTime - now) / 1000);

    // Generate token with expiration
    const token = generateToken(staff.id, "staff", expiresIn);

    res.status(200).json({
      message: "Login successful",
      token,
      staff,
      expirationTime: expirationTime.toISOString()
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Updated token generator (example using jsonwebtoken)



const getStaffById = async (req, res) => {
  try {
    const { id } = req.params;

    const staff = await prisma.staff.findUnique({
      where: { id },
      include: {
        salaries: {
          orderBy: {
            date: 'desc'
          }
        },
        attendances: {
          orderBy: {
            date: 'desc'
          }
        },
        user: true,
        branch: true,
        appointments: {
          include: {
            service: true,
            client: true
          }
        },
        clients: true
      }
    });

    if (!staff) {
      return res.status(404).json({ 
        success: false,
        message: 'Staff member not found' 
      });
    }

    // Format response
    const response = {
      id: staff.id,
      fullname: staff.fullname,
      email: staff.email,
      contact: staff.contact,
      profile_img: staff.profile_img,
      staff_id: staff.staff_id,
      password:staff.password,
      branch: {
        id: staff.branch.id,
        name: staff.branch.branch_name,
        location: staff.branch.branch_location
      },
      user: {
        id: staff.user.id,
        name: staff.user.fullname
      },
      salary_history: staff.salaries.map(salary => ({
        id: salary.id,
        amount: salary.amount,
        date: salary.date
      })),
      attendance_history: staff.attendances.map(attendance => ({
        id: attendance.id,
        date: attendance.date,
        login_time: attendance.login_time
      })),
      appointments: staff.appointments.map(appointment => ({
        id: appointment.id,
        date: appointment.date,
        time: appointment.time,
        status: appointment.status,
        service: appointment.service.service_name,
        service_price:appointment.service.service_price,
        client: appointment.client.client_name
      })),
      clients: staff.clients.map(client => ({
        id: client.id,
        name: client.client_name,
        email: client.email
      }))
    };

    res.status(200).json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('Error fetching staff details:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};



const  addSalary = async(req, res)=> {
  const { staff_id, amount, date } = req.body;

  // Validate required fields
  if (!staff_id || !amount) {
    return res.status(400).json({ error: 'staff_id and amount are required' });
  }

  // Validate amount type
  if (typeof amount !== 'number' || amount <= 0 || !Number.isInteger(amount)) {
    return res.status(400).json({ error: 'Amount must be a positive integer' });
  }

  try {
    // Check if staff exists
    const staffExists = await prisma.staff.findUnique({
      where: { id: staff_id },
    });

    if (!staffExists) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    // Create new salary record
    const newSalary = await prisma.salary.create({
      data: {
        staff_id: staff_id,
        amount: amount,
        date: date ? new Date(date) : new Date(), // Use provided date or current date
      },
      include: {
        staff: true, // Include staff details in response if needed
      },
    });

    return res.status(201).json({
      message: 'Salary added successfully',
      salary: newSalary,
    });
  } catch (error) {
    console.error('Error adding salary:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

const getStaffByIdatnav = async (req, res) => {
  const { id } = req.params;
  try {
    const staff = await prisma.staff.findUnique({
      where: { id: id },
      include: {
        user: true,
        branch: true,
        appointments: true,
        salaries: true,
        attendances: true,
        clients: true,
        usedProducts: true,
        feedbacks: true
      }
    });

    if (!staff) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    // Remove sensitive information
    const { password, ...staffData } = staff;

    res.status(200).json(staffData);
  } catch (error) {
    console.error("Error fetching staff:", error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = { staffLogin , staffSignup ,getStaffById,addSalary , getStaffByIdatnav};
