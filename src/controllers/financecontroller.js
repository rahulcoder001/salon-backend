const prisma = require("../config/db");
const { startOfDay, endOfDay, format } = require("date-fns");

const getFinancialData = async (req, res) => {
  try {
    const { salonId, startDate, endDate } = req.body;

    const start = format(new Date(startDate), "yyyy-MM-dd");
    const end = format(new Date(endDate), "yyyy-MM-dd");

    const branches = await prisma.branch.findMany({
      where: { salon_id: salonId },
      include: {
        staff: {
          include: {
            salaries: {
              where: {
                date: {
                  gte: startOfDay(new Date(startDate)),
                  lte: endOfDay(new Date(endDate))
                }
              }
            }
          }
        },
        appointments: {
          where: {
            date: {
              gte: start,
              lte: end
            }
          },
          include: {
            service: true,
            usedProducts: true
          }
        },
        usedProducts: {
          where: {
            date: {
              gte: startOfDay(new Date(startDate)),
              lte: endOfDay(new Date(endDate))
            }
          }
        }
      }
    });

    const financialData = branches.map(branch => {
      const earnings = branch.appointments.reduce(
        (sum, appointment) => 
          sum + (
            appointment.status === "confirmed" 
              ? (appointment.service?.service_price || 0) 
              : 0
          ),
        0
      );

      const staffSalaries = branch.staff.reduce(
        (sum, staff) =>
          sum +
          staff.salaries.reduce((s, salary) => s + salary.amount, 0),
        0
      );

      const productCosts = branch.usedProducts.reduce(
        (sum, product) => sum + product.price,
        0
      );

      return {
        branchId: branch.id,
        branchName: branch.branch_name,
        earnings,
        staffSalaries,
        productCosts,
        netProfit: earnings - staffSalaries - productCosts,
        appointments: branch.appointments,
        services: branch.appointments.map(a => a.service)
      };
    });

    const totalEarnings = financialData.reduce((sum, d) => sum + d.earnings, 0);
    const totalSalaries = financialData.reduce((sum, d) => sum + d.staffSalaries, 0);
    const totalProductCosts = financialData.reduce((sum, d) => sum + d.productCosts, 0);
    const totalNetProfit = totalEarnings - totalSalaries - totalProductCosts;

    const trendData = financialData.flatMap(data =>
      data.appointments.map(app => ({
        date: app.date,
        amount: app.service?.service_price || 0
      }))
    );

    res.status(200).json({
      success: true,
      data: {
        branches: financialData,
        totals: {
          earnings: totalEarnings,
          staffSalaries: totalSalaries,
          productCosts: totalProductCosts,
          netProfit: totalNetProfit
        },
        trendData
      }
    });
  } catch (error) {
    console.error("Error in getFinancialData:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getFinancialData };
