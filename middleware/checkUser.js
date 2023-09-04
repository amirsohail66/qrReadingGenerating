const UserModel = require('../model/User');
const messageResponse = require('../Responses/messageRespons');

exports.checkUser = async (req, res, next) => {
  try {
    const userEmail = req.email;
    const user = await UserModel.findOne({ email: userEmail });

    // Check if the user exists with the user's token
    if (!user) {
      return res.status(401).json(messageResponse.error(401, 'Unauthorized user'));
    }

    // Check if the logged-in user ID matches the one stored in the database
    if (user._id.toString() !== req.userId) {
      return res.status(403).json(messageResponse.error(403, 'Unauthorized access'));
    }

    // Check if the user is an admin
    if (!user.isAdmin) {
      return res.status(403).json(messageResponse.error(403, 'Unauthorized access. User is not an admin.'));
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json(messageResponse.error(500, 'Error checking user'));
  }
};
