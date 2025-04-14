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
  
      // 1. Get daily revenue
      const revenueData = await prisma.appointment.groupBy({
        by: ['date'],
        where: {
          salon_id: salonId,
          date: {
            gte: startDate.toISOString(),
            lte: endDate.toISOString(),
          }
        },
        _sum: {
          service: {
            service_price: true
          }
        },
      });
  
      // 2. Get daily new clients
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
        _count: true,
      });
  
      // 3. Get daily appointments
      const appointmentsData = await prisma.appointment.groupBy({
        by: ['date'],
        where: {
          salon_id: salonId,
          date: {
            gte: startDate.toISOString(),
            lte: endDate.toISOString(),
          }
        },
        _count: true,
      });
  
      // Create a map for all dates
      const dateMap = new Map();
      const currentDate = new Date(startDate);
  
      // Initialize date map with empty data
      while (currentDate <= endDate) {
        const dateKey = currentDate.toISOString().split('T')[0];
        const formattedDay = `${currentDate.getDate()} ${currentDate.toLocaleString('default', { month: 'short' })}`;
        
        dateMap.set(dateKey, {
          day: formattedDay,
          revenue: 0,
          newClients: 0,
          appointments: 0
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
  
      // Populate revenue data
      revenueData.forEach(({ date, _sum }) => {
        const dateKey = new Date(date).toISOString().split('T')[0];
        if (dateMap.has(dateKey)) {
          dateMap.get(dateKey).revenue = _sum.service?.service_price || 0;
        }
      });
  
      // Populate client data
      clientsData.forEach(({ createdAt, _count }) => {
        const dateKey = new Date(createdAt).toISOString().split('T')[0];
        if (dateMap.has(dateKey)) {
          dateMap.get(dateKey).newClients = _count;
        }
      });
  
      // Populate appointment data
      appointmentsData.forEach(({ date, _count }) => {
        const dateKey = new Date(date).toISOString().split('T')[0];
        if (dateMap.has(dateKey)) {
          dateMap.get(dateKey).appointments = _count;
        }
      });
  
      // Convert map to sorted array
      const result = Array.from(dateMap.values())
        .sort((a, b) => new Date(a.day) - new Date(b.day));
  
      return res.status(200).json(result);
  
    } catch (error) {
      console.error('Error fetching daily stats:', error);
      return res.status(500).json({ message: 'Failed to retrieve daily stats' });
    }
  };

  module.exports = {getDailyStatsLast30Days}