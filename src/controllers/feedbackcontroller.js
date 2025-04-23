const prisma = require("../config/db");

const updateFeedbackFeature = async (req, res) => {
  const { id } = req.params;
  const { isFeatured } = req.body;

  try {
    if (!id) {
      return res.status(400).json({ message: "Feedback ID is required." });
    }

    const updatedFeedback = await prisma.feedback.update({
      where: { id },
      data: { feature: isFeatured },
    });

    return res.status(200).json({
      message: "Feature status updated successfully.",
      data: updatedFeedback,
    });
  } catch (error) {
    console.error("Error updating feedback feature:", error);
    return res.status(500).json({ message: "Failed to update feature status." });
  }
};

module.exports = {updateFeedbackFeature} ;
