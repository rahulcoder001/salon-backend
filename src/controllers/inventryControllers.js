const prisma = require("../config/db");

const SaveProduct = async (req, res) => {
  let { product_name, product_quantity, price, branch_id } = req.body;

  try {
    // Convert to numbers
    product_quantity = parseInt(product_quantity);
    price = parseInt(price);

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
  let { service_name, service_price, time, branch_id } = req.body;

  try {
    // Convert to numbers
    service_price = parseInt(service_price);
    time = parseInt(time);

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

const updateService = async (req, res) => {
  const { id } = req.params; // Get service ID from URL params
  let { service_name, service_price, time, branch_id } = req.body;

  try {
    // Convert to numbers
    service_price = parseInt(service_price);
    time = parseInt(time);

    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        service_name,
        service_price,
        time,
        branch_id,
      },
    });

    return res.status(200).json({ 
      message: "Service updated successfully", 
      service: updatedService 
    });
  } catch (error) {
    console.error(error);
    
    if (error.code === 'P2025') {
      // Prisma record not found error
      return res.status(404).json({ message: "Service not found" });
    }
    
    res.status(500).json({ message: "Failed to update service" });
  }
};


const DeleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Inventory ID is required" });
  }

  try {
    await prisma.inventory.delete({
      where: { id: id },
    });

    return res.status(200).json({ message: "Inventory deleted successfully" });
  } catch (error) {
    console.error(error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ message: "Inventory not found" });
    }
    res.status(500).json({ message: "Failed to delete inventory" });
  }
};

const UpdateProduct = async (req, res) => {
  const { id } = req.params;
  let updateData = req.body;

  if (!id) {
    return res.status(400).json({ message: "Inventory ID is required" });
  }

  try {
    // Convert numerical fields if they exist in the request
    if (updateData.product_quantity) {
      updateData.product_quantity = parseInt(updateData.product_quantity);
    }
    if (updateData.price) {
      updateData.price = parseInt(updateData.price);
    }

    const updatedInventory = await prisma.inventory.update({
      where: { id: id },
      data: updateData
    });

    return res.status(200).json({ 
      message: "Inventory updated successfully", 
      inventory: updatedInventory 
    });
  } catch (error) {
    console.error(error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ message: "Inventory not found" });
    }
    res.status(500).json({ message: "Failed to update inventory" });
  }
};

module.exports = { SaveProduct, saveService,DeleteProduct,UpdateProduct,updateService };
