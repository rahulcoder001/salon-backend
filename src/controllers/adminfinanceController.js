const prisma = require("../config/db");


// Get purchased plans
const getalladminfinacedata = async (req,res)=> {
  try {
    const [purchasedPlans, salesmanSalaries, allPurchases, totalPlans] = await Promise.all([
      prisma.purchasedPlan.findMany({
        include: {
          user: { select: { fullname: true } },
          package: { select: { name: true, price: true } }
        }
      }),
      prisma.salesmanSalary.findMany({
        include: { salesman: { select: { name: true } } }
      }),
      prisma.purchasedPlan.findMany({
        select: {
          package: { select: { price: true } }
        }
      }),
      prisma.purchasedPlan.count()
    ]);

    // Calculate total revenue manually
    const totalRevenue = allPurchases.reduce(
      (sum, purchase) => sum + (purchase.package?.price || 0),
      0
    );

    const formattedData = {
      purchasedPlans: purchasedPlans.map(plan => ({
        userName: plan.user?.fullname || 'N/A',
        planName: plan.package?.name || 'N/A',
        planPrice: plan.package?.price || 0,
        buyDate: plan.date
      })),
      salesmanSalaries: salesmanSalaries.map(salary => ({
        salesmanName: salary.salesman?.name || 'N/A',
        amount: salary.amount,
        date: salary.date
      })),
      financialSummary: {
        totalRevenue,
        totalPlans,
        totalSalaries: salesmanSalaries.reduce((sum, salary) => sum + salary.amount, 0)
      }
    };

    res.status(200).json({
      success: true,
      data: formattedData
    });

  } catch (error) {
    console.error("Finance Data Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch accounting data",
      details: error.message
    });
  }
}

module.exports = {getalladminfinacedata}