const prisma = require("../config/db");

const addAttendance = async (req, res) => {
  try {
      // Convert to IST (UTC+5:30)
      const now = new Date();
      const istOffset = 330 * 60000; // 5h30m in milliseconds
      const istTime = new Date(now.getTime() + istOffset);

      // Set IST day boundaries
      const todayStart = new Date(istTime);
      todayStart.setHours(0, 0, 0, 0);
      
      const todayEnd = new Date(istTime);
      todayEnd.setHours(23, 59, 59, 999);

      // Check existing attendance for IST date
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
          return res.status(400).json({ 
              message: 'Attendance already recorded today',
              success: false
          });
      }

      // Create record with IST time
      const newAttendance = await prisma.attendance.create({
          data: {
              staff_id: req.body.staffId,
              login_time: istTime.toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
              }),
              date: todayStart // Store date without time component
          }
      });

      return res.status(201).json({
          data: newAttendance,
          message: 'Attendance recorded successfully',
          success: true
      });

  } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({
          message: 'Failed to record attendance',
          success: false
      });
  }
};

module.exports = { addAttendance }; // ES module export