const prisma = require("../config/db");

const getDailyStatsLast30Days = async (req, res) => {
  const { salonId } = req.params;

  try {
    // Verify salon exists
    const salonExists = await prisma.salon.findUnique({
      where: { id: salonId },
    });

    if (!salonExists) {
      return res.status(404).json({ message: 'Salon not found' });
    }

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    // 1. Get daily revenue (corrected query)
    const revenueData = await prisma.appointment.findMany({
      where: {
        salon_id: salonId,
        date: {
          gte: startDate.toISOString(),
          lte: endDate.toISOString(),
        }
      },
      include: {
        service: {
          select: {
            service_price: true
          }
        }
      }
    });

    // 2. Get daily new clients (corrected query)
    const clientsData = await prisma.client.groupBy({
      by: ['createdAt'],
      where: {
        branch: {
          salon_id: salonId,
        },
        createdAt: {
          gte: startDate,
          lte: endDate,
        }
      },
      _count: {
        _all: true
      },
    });

    // 3. Get daily appointments (corrected query)
    const appointmentsData = await prisma.appointment.groupBy({
      by: ['date'],
      where: {
        salon_id: salonId,
        date: {
          gte: startDate.toISOString(),
          lte: endDate.toISOString(),
        }
      },
      _count: {
        _all: true
      },
    });

    // Process revenue data
    const revenueByDate = revenueData.reduce((acc, appointment) => {
      const date = new Date(appointment.date).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + (appointment.service?.service_price || 0);
      return acc;
    }, {});

    // Create date map
    const dateMap = new Map();
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().split('T')[0];
      const formattedDay = `${currentDate.getDate()} ${currentDate.toLocaleString('default', { month: 'short' })}`;
      
      dateMap.set(dateKey, {
        day: formattedDay,
        revenue: revenueByDate[dateKey] || 0,
        newClients: 0,
        appointments: 0
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Populate client data
    clientsData.forEach(({ createdAt, _count }) => {
      const dateKey = new Date(createdAt).toISOString().split('T')[0];
      if (dateMap.has(dateKey)) {
        dateMap.get(dateKey).newClients = _count._all;
      }
    });

    // Populate appointment data
    appointmentsData.forEach(({ date, _count }) => {
      const dateKey = new Date(date).toISOString().split('T')[0];
      if (dateMap.has(dateKey)) {
        dateMap.get(dateKey).appointments = _count._all;
      }
    });

    // Convert to sorted array
    const result = Array.from(dateMap.values()).sort((a, b) => 
      new Date(a.day.split(' ').reverse().join('-')) - 
      new Date(b.day.split(' ').reverse().join('-'))
    );

    return res.status(200).json(result);

  } catch (error) {
    console.error('Error fetching daily stats:', error);
    return res.status(500).json({ message: 'Failed to retrieve daily stats' });
  }
};

module.exports = {getDailyStatsLast30Days}

