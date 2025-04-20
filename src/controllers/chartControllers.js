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

    // Set up UTC date range (00:00:00 30 days ago to 23:59:59 today)
    const endDate = new Date();
    endDate.setUTCHours(23, 59, 59, 999);
    const startDate = new Date(endDate);
    startDate.setUTCDate(startDate.getUTCDate() - 30);
    startDate.setUTCHours(0, 0, 0, 0);

    // 1. Get daily revenue (using stored date strings directly)
    const revenueData = await prisma.appointment.findMany({
      where: {
        salon_id: salonId,
        date: {
          gte: startDate.toISOString().split('T')[0],
          lte: endDate.toISOString().split('T')[0]
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

    // Process revenue data using stored date strings
    const revenueByDate = revenueData.reduce((acc, appointment) => {
      const dateKey = appointment.date; // Directly use the stored date string
      acc[dateKey] = (acc[dateKey] || 0) + (appointment.service?.service_price || 0);
      return acc;
    }, {});

    // 2. Get daily new clients (fetch all and group in memory)
    const clients = await prisma.client.findMany({
      where: {
        salon_id: salonId,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      select: {
        createdAt: true
      }
    });

    // Group clients by UTC date
    const clientsByDate = clients.reduce((acc, client) => {
      const date = new Date(client.createdAt);
      const dateKey = `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1)
        .toString().padStart(2, '0')}-${date.getUTCDate().toString().padStart(2, '0')}`;
      acc[dateKey] = (acc[dateKey] || 0) + 1;
      return acc;
    }, {});

    // 3. Get daily appointments (using stored date strings)
    const appointmentsData = await prisma.appointment.groupBy({
      by: ['date'],
      where: {
        salon_id: salonId,
        date: {
          gte: startDate.toISOString().split('T')[0],
          lte: endDate.toISOString().split('T')[0]
        }
      },
      _count: {
        _all: true
      },
    });

    // Create date map with UTC-formatted days
    const dateMap = new Map();
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().split('T')[0];
      const formattedDay = `${currentDate.getUTCDate()} ${currentDate.toLocaleString('default', { 
        month: 'short', 
        timeZone: 'UTC' 
      })}`;
      
      dateMap.set(dateKey, {
        day: formattedDay,
        revenue: 0,
        newClients: 0,
        appointments: 0
      });
      
      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }

    // Populate data from all sources
    // Add revenue
    Object.entries(revenueByDate).forEach(([dateKey, revenue]) => {
      if (dateMap.has(dateKey)) {
        dateMap.get(dateKey).revenue = revenue;
      }
    });

    // Add clients
    Object.entries(clientsByDate).forEach(([dateKey, count]) => {
      if (dateMap.has(dateKey)) {
        dateMap.get(dateKey).newClients = count;
      }
    });

    // Add appointments
    appointmentsData.forEach(({ date, _count }) => {
      if (dateMap.has(date)) {
        dateMap.get(date).appointments = _count._all;
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

