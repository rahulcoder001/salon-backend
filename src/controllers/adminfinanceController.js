const prisma = require("../config/db");


// Get purchased plans
const getalladminfinacedata = async (req,res)=> {
  try {
    const [purchasedPlans, salesmanSalaries, totalRevenue, totalPlans] = await Promise.all([
      prisma.purchasedPlan.findMany({
        include: {
          user: { select: { fullname: true } },
          package: { select: { name: true, price: true } }
        }
      }),
      prisma.salesmanSalary.findMany({
        include: { salesman: { select: { name: true } } }
      }),
      prisma.purchasedPlan.aggregate({
        _sum: { package: { price: true } },
      }),
      prisma.purchasedPlan.count()
    ]);

    return NextResponse.json({
      purchasedPlans: purchasedPlans.map(plan => ({
        userName: plan.user.fullname,
        planName: plan.package.name,
        planPrice: plan.package.price,
        buyDate: plan.date
      })),
      salesmanSalaries: salesmanSalaries.map(salary => ({
        salesmanName: salary.salesman.name,
        amount: salary.amount,
        date: salary.date
      })),
      totalRevenue: totalRevenue._sum.package?.price || 0,
      totalPlans
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch accounting data" },
      { status: 500 }
    );
  }
}

module.exports = {getalladminfinacedata}