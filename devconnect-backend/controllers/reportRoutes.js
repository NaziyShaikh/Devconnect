const Report = require('../models/Report');

exports.reportContent = async (req, res) => {
  const { targetType, targetId, reason } = req.body;
  const report = new Report({
    reporter: req.user._id,
    targetType,
    targetId,
    reason
  });

  await report.save();
  res.status(201).json({ message: 'Report submitted' });
};
