const prisma = require("../config/db");

const getPlanRevenue = async (req, res) => {
  try {
    const now = new Date();
    
    // Calculate period start dates
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    const weekStart = new Date(now);
    const dayOfWeek = now.getDay(); // 0 (Sunday) to 6 (Saturday)
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Days since Monday
    weekStart.setDate(now.getDate() - diff);
    weekStart.setHours(0, 0, 0, 0);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Helper function to calculate revenue
    const calculateRevenue = async (startDate) => {
      const plans = await prisma.purchasedPlan.findMany({
        where: {
          date: {
            gte: startDate
          }
        },
        include: {
          package: true
        }
      });

      return plans.reduce((total, plan) => total + plan.package.price, 0);
    };

    // Get all revenues
    const [daily, weekly, monthly] = await Promise.all([
      calculateRevenue(todayStart),
      calculateRevenue(weekStart),
      calculateRevenue(monthStart)
    ]);

    res.status(200).json({
      success: true,
      data: {
        daily_revenue: daily,
        weekly_revenue: weekly,
        monthly_revenue: monthly
      }
    });

  } catch (error) {
    console.error("Revenue Calculation Error:", error);
    res.status(500).json({
      success: false,
      message: "Error calculating plan revenue",
      error: error.message
    });
  }
};
const getTopSalesmen = async (req, res) => {
  try {
    // Fetch all purchased plans with their associated users and salesmen
    const allPlans = await prisma.purchasedPlan.findMany({
      include: {
        user: {
          include: {
            salesman: true
          }
        },
        package: true
      }
    });

    // Aggregate results using a Map
    const salesmenMap = new Map();

    allPlans.forEach(plan => {
      const salesman = plan.user.salesman;
      if (!salesman) return; // Skip plans without associated salesman

      if (!salesmenMap.has(salesman.id)) {
        salesmenMap.set(salesman.id, {
          name: salesman.name,
          clients: new Set(), // Using Set to track unique clients
          totalRevenue: 0
        });
      }

      const entry = salesmenMap.get(salesman.id);
      entry.clients.add(plan.user.id); // Add unique client ID
      entry.totalRevenue += plan.package.price;
    });

    // Convert Map to sorted array
    const results = Array.from(salesmenMap.values())
      .map(entry => ({
        name: entry.name,
        clientsAdded: entry.clients.size,
        totalRevenue: entry.totalRevenue
      }))
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 3);

    res.status(200).json({
      success: true,
      data: results
    });

  } catch (error) {
    console.error("Top Salesmen Error:", error);
    res.status(500).json({
      success: false,
      message: "Error calculating top salesmen",
      error: error.message
    });
  }
};
const getRevenueLastSixMonths = async (req, res) => {
  try {
    const currentDate = new Date();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Calculate start date (6 months ago)
    const startDate = new Date(currentDate);
    startDate.setMonth(currentDate.getMonth() - 5);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    // Get all plans in the 6-month period
    const plans = await prisma.purchasedPlan.findMany({
      where: {
        date: {
          gte: startDate
        }
      },
      include: {
        package: true
      }
    });

    // Initialize revenue map for all 6 months
    const revenueMap = new Map();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      revenueMap.set(monthKey, {
        name: monthNames[date.getMonth()],
        revenue: 0
      });
    }

    // Calculate revenue for each month
    plans.forEach(plan => {
      const planDate = new Date(plan.date);
      const monthKey = `${planDate.getFullYear()}-${planDate.getMonth()}`;
      
      if (revenueMap.has(monthKey)) {
        revenueMap.get(monthKey).revenue += plan.package.price;
      }
    });

    // Convert map to sorted array
    const revenueData = Array.from(revenueMap.values())
      .sort((a, b) => {
        const currentMonth = currentDate.getMonth();
        const aIndex = (monthNames.indexOf(a.name) - currentMonth + 12) % 12;
        const bIndex = (monthNames.indexOf(b.name) - currentMonth + 12) % 12;
        return aIndex - bIndex;
      })
      .slice(0, 6);

    res.status(200).json({
      success: true,
      data: revenueData
    });

  } catch (error) {
    console.error("Revenue Data Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching revenue data",
      error: error.message
    });
  }
};
module.exports = {
  getPlanRevenue,
  getTopSalesmen,
  getRevenueLastSixMonths
};