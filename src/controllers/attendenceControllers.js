const prisma = require("../config/db");

const prisma = new PrismaClient();

const  addAttendance = async(req,res)=> {
  // Get today's start and end times
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  // Check for existing attendance
  const existingAttendance = await prisma.attendance.findFirst({
    where: {
      staff_id: req.body.staffId,
      date: {
        gte: todayStart,
        lte: todayEnd
      }
    }
  });

  if (existingAttendance) {
    throw new Error('Attendance already recorded for this staff member today');
  }

  // Create new attendance record
  return await prisma.attendance.create({
    data: {
      staff_id: req.body.staffId,
      login_time: req.body.loginTime
      // date is automatically set by Prisma (now())
    }
  });
}

// Usage example
try {
  const newAttendance = await addAttendance('staff-uuid-123', '09:00 AM');
  console.log('Attendance created:', newAttendance);
} catch (error) {
  console.error(error.message);
}

module.exports = {addAttendance}