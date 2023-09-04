const Admin = require('../model/Admin');
const User = require('../model/User');
const { generateToken, logoutToken } = require('../middleware/authToken');
const bcrypt = require('bcryptjs');
const { sendEmail } = require('../services/emailServices');
const messageRespons = require('../Responses/messageRespons');

// Created a function to check if an admin with the given email exists
async function adminExists(email) {
  return await Admin.exists({ email });
}

async function createAdmin(email, password) {       // Can be used for creating admin
  try {
    const isExistingAdmin = await adminExists(email);

    if (isExistingAdmin) {
      // Handle the case where admin already exists
    } else {
      const hashedPassword = await bcrypt.hash(password, 12);
      const newAdmin = new Admin({
        email,
        password: hashedPassword,
      });

      const savedAdmin = await newAdmin.save();
      console.log('Admin saved successfully:', savedAdmin);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

exports.adminGetAllUser = async (req, res, next) => {
  const adminIdParam = req.params.adminId; // Get adminId from params
  // Check if the authenticated user is an admin
  if (!adminIdParam) {
    return res.status(400).json(messageRespons.error(400, 'Admin ID is required in params'));
  }
  if (adminIdParam !== req.userId) {
    return res.status(403).json(messageRespons.error(403, 'Admin authorization required'));
  }

  // Your existing code for fetching all users here
  try {
    const users = await User.find();
    if (!users || users.length === 0) {
      return res.status(404).json(messageRespons.error(404, 'No users found'));
    }
    return res.status(200).json(messageRespons.success(200, 'Users found', { users }));
  } catch (err) {
    console.error(err);
    res.status(500).json(messageRespons.error(500, 'An error occurred'));
  }
};

exports.adminLogin = async (req, res, next) => {
  const email = req.body.email.toLowerCase();
  const password = req.body.password;
  try {
    const admin = await Admin.findOne({ email: email });
    if (!admin) {
      return res.status(401).json(messageRespons.error(401, 'An admin with this email could not be found.'));
    }
    const isEqual = await bcrypt.compare(password, admin.password);
    if (!isEqual) {
      return res.status(401).json(messageRespons.error(401, 'Wrong password!'));
    }
    const token = await generateToken(email, admin._id);
    res.status(200).json(messageRespons.success(200, 'Login successful', { userId: admin._id, token }));
  } catch (err) {
    console.error(err);
    res.status(500).json(messageRespons.error(500, 'An error occurred'));
  }
};

exports.adminDeleteUser = async (req, res) => {
  const adminIdParam = req.params.adminId; // Get adminId from params
  // Check if the authenticated user is an admin
  if (adminIdParam !== req.userId) {
    return res.status(403).json(messageRespons.error(403, 'Admin authorization required'));
  }

  const email = req.body.email;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json(messageRespons.error(401, 'A user with this email could not be found.'));
    }
    await user.deleteOne();
    res.json(messageRespons.success(200, 'User deleted successfully'));
  } catch (err) {
    console.error(err);
    res.status(500).json(messageRespons.error(500, 'An error occurred'));
  }
};

exports.adminSendEmailToUser = async (req, res) => {
  const adminIdParam = req.params.adminId; // Get adminId from params
  // Check if the authenticated user is an admin
  if (adminIdParam !== req.userId) {
    return res.status(403).json(messageRespons.error(403, 'Admin authorization required'));
  }

  const userEmail = req.body.email;
  if (!userEmail) {
    return res.status(400).json(messageRespons.error(400, 'Email is required'));
  }

  try {
    const user = await User.findOne({ email: userEmail }).populate('qrCodes');
    if (!user) {
      return res.status(404).json(messageRespons.error(404, 'User not found'));
    }
    await sendEmail(userEmail, user.qrCodes);
    res.json(messageRespons.success(200, 'Email sent successfully', { user }));
  } catch (error) {
    console.error(error);
    res.status(500).json(messageRespons.error(500, 'An error occurred while sending the email'));
  }
};
