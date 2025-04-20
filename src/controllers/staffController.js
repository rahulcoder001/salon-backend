const prisma = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// **Staff Signup**
const staffSignup = async (req, res) => {
  const { fullname, contact, email, password, profile_img, user_id, staff_id, branch_id } = req.body;

  try {
    // Check if email already exists
    const existingEmail = await prisma.staff.findUnique({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Check if staff_id already exists
    const existingStaffId = await prisma.staff.findUnique({ where: { staff_id } });
    if (existingStaffId) {
      return res.status(400).json({ message: "Staff ID already in use" });
    }

    // Create staff member
    const newStaff = await prisma.staff.create({
      data: {
        fullname,
        contact,
        email,
        password,
        profile_img,
        user_id,
        staff_id,
        branch_id
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
module.exports = { staffLogin , staffSignup ,getStaffById };
