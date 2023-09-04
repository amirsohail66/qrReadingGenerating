const User = require('../model/User');
const bcrypt = require('bcryptjs');
const { generateToken, logoutToken } = require('../middleware/authToken')
const jwt = require('jsonwebtoken');
const messageResponse = require('../Responses/messageRespons');
const QRCode = require('../model/QRCode');

exports.deleteUserQRCode = async (req, res) => {
    try {
      const qrcodeId = req.params.qrcodeId;
  
      // Get the user ID from the authenticated user's token
      const userId = req.userId; 
  
      // Find and remove the QR code by its ID
      const deletedQRCode = await QRCode.findByIdAndRemove(qrcodeId);

      if (!deletedQRCode) {
        return res.status(404).json(messageResponse.error(404, 'QR code not found'));
      }
  
      if (deletedQRCode.userId.toString() !== userId.toString()) {
        return res.status(403).json(messageResponse.error(403, 'You do not have permission to delete this QR code'));
      }
      res.status(200).json(messageResponse.success(200, 'QR code deleted successfully', {deletedQRCode}));
    } catch (error) {
      console.error(error);
      res.status(500).json(messageResponse.error(500, 'An error occurred'));
    }
  };
  

  exports.getUserQRCodes = async (req, res) => {
    try {
        const userIdParam = req.params.userId; // Get the user ID from request parameters
        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decodedToken.userId;

        // Check if the user ID from request parameters matches the authenticated user's ID
        if (userIdParam !== userId) {
            return res.status(403).json(messageResponse.error(403, 'Unauthorized access'));
        }

        // Find all QR codes associated with the user
        const qrCodes = await QRCode.find({ userId: userId });

        // Return the list of QR codes in the response
        res.status(200).json(messageResponse.success(200, 'User QR codes fetched successfully', qrCodes));
    } catch (error) {
        console.error(error);
        res.status(500).json(messageResponse.error(500, 'An error occurred'));
    }
};


  exports.updateUser = async (req, res) => {
    try {
        const fieldsToUpdate = req.body;
        const userIdParam = req.params.userId; // Get the user ID from request parameters
        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decodedToken.userId;

        // Check if the user ID from request parameters matches the authenticated user's ID
        if (userIdParam !== userId) {
            return res.status(403).json(messageResponse.error(403, 'Unauthorized access'));
        }

        // Check if a new password is provided in the request
        if (fieldsToUpdate.password) {
            // Hash the new password using bcrypt
            const hashedPassword = await bcrypt.hash(fieldsToUpdate.password, 12);
            // Update the 'password' field in 'fieldsToUpdate' with the hashed password
            fieldsToUpdate.password = hashedPassword;
        }

        // Prevent email update and send a message
        if (fieldsToUpdate.email) {
            return res.status(400).json(messageResponse.error(400, 'You cannot update your email address.'));
        }

        const updatedUser = await User.findByIdAndUpdate(userId, { $set: fieldsToUpdate });
        if (!updatedUser) {
            return res.status(404).json(messageResponse.error(404, 'User not found'));
        }
        res.status(200).json(messageResponse.success(200, 'Fields updated successfully', updatedUser));
    } catch (error) {
        console.error(error);
        res.status(500).json(messageResponse.error(500, 'An error occurred'));
    }
};




exports.signup = async (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email.toLowerCase();
    const password = req.body.password;
    const address = req.body.address;
    try {
        const find = await User.findOne({ email: email });
        if (find && find.email === email) {
            return res.status(401).json(messageResponse.error(401, 'A user with this email is already registered.'));
        }
        const hashedPw = await bcrypt.hash(password, 12);
        const user = new User({
            name: name,
            email: email,
            password: hashedPw,
            address: address
        });
        const result = await user.save();
        res.status(201).json(messageResponse.success(201, 'User created!', { userId: result._id }));
    } catch (err) {
        console.error(err);
        res.status(500).json(messageResponse.error(500, 'An error occurred'));
    }
};


exports.login = async (req, res, next) => {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(401).json(messageResponse.error(401, 'A user with this email could not be found.'));
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            return res.status(401).json(messageResponse.error(401, 'Wrong password!'));
        }
        const userId = user._id;
        const token = generateToken(email, userId);
        res.status(200).json(messageResponse.success(200, 'Login successful!', { userId: user._id, token }));
    } catch (err) {
        console.error(err);
        res.status(500).json(messageResponse.error(500, 'An error occurred'));
    }
};