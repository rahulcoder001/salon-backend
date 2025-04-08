const prisma = require("../config/db");

const SaveProduct = async (req, res) => {

  const { product_name, product_quantity, price, branch_id } = req.body;

  try {
    const newInventory = await prisma.inventory.create({
      data: {
        product_name,
        product_quantity,
        price,
        branch_id,
      },
    });

    return res.status(201).json({ message: "Inventory saved successfully", inventory: newInventory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save inventory" });
  }
};


 const saveService = async (req, res) => {

  const { service_name, service_price, time, branch_id } = req.body;

  try {
    const newService = await prisma.service.create({
      data: {
        service_name,
        service_price,
        time,
        branch_id,
      },
    });

    return res.status(201).json({ message: "Service saved successfully", service: newService });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save service" });
  }
};

module.exports = { SaveProduct , saveService };