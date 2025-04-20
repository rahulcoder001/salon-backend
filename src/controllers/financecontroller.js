const prisma = require("../config/db");

const getFinancialData = async (req, res) => {
  try {
    const { salonId, startDate, endDate } = req.body;
    
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Get all branches for the salon
    const branches = await prisma.branch.findMany({
      where: { salon_id: salonId },
      include: {
        staff: {
          include: {
            salaries: {
              where: {
                date: {
                  gte: startOfDay(start),
                  lte: endOfDay(end)
                }
              }
            }
          }
        },
        appointments: {
          where: {
            date: {
              gte: start.toISOString(),
              lte: end.toISOString()
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
              gte: startOfDay(start),
              lte: endOfDay(end)
            }
          }
        }
      }
    });

    const financialData = branches.map(branch => {
      // Calculate earnings from appointments
      const earnings = branch.appointments.reduce((sum, appointment) => 
        sum + (appointment.service?.service_price || 0), 0);

      // Calculate staff salaries
      const staffSalaries = branch.staff.reduce((sum, staff) => 
        sum + staff.salaries.reduce((s, salary) => s + salary.amount, 0), 0);

      // Calculate product costs
      const productCosts = branch.usedProducts.reduce((sum, product) => sum + product.price, 0);

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

    // Calculate totals
    const totalEarnings = financialData.reduce((sum, data) => sum + data.earnings, 0);
    const totalSalaries = financialData.reduce((sum, data) => sum + data.staffSalaries, 0);
    const totalProductCosts = financialData.reduce((sum, data) => sum + data.productCosts, 0);
    const totalNetProfit = totalEarnings - totalSalaries - totalProductCosts;

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
        trendData: financialData.flatMap(data => 
          data.appointments.map(appointment => ({
            date: appointment.date,
            amount: appointment.service?.service_price || 0
          }))
        )
      }
    });

  } catch (error) {
    console.error('Error fetching financial data:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {getFinancialData}