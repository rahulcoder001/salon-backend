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

module.exports = {
  getPlanRevenue
};