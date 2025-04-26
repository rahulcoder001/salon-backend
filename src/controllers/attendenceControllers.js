import prisma from "../config/db.js";

const addAttendance = async (req, res) => {
    try {
        const now = new Date();
        
        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0);
        
        const todayEnd = new Date(now);
        todayEnd.setHours(23, 59, 59, 999);

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
                success: true // Fixed typo
            });
        }

        const newAttendance = await prisma.attendance.create({
            data: {
                staff_id: req.body.staffId,
                login_time: now.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                }),
                date: now
            }
        });

        return res.status(201).json({
            newAttendance,
            success: true // Fixed typo
        });

    } catch (error) {
        console.error('Attendance error:', error);
        return res.status(500).json({
            message: error.message || 'Failed to record attendance',
            success: false // Added proper error status
        });
    }
};

export { addAttendance }; // ES module export