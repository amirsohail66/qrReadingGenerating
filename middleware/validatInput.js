const validator = require('validator');
const User = require('../model/User');
const Admin = require('../model/Admin');

exports.validateAdminSignupInput = async (req, res, next) => {
    const email = req.body.email;
    const role = req.body.role;

    try {
        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }
        // Check if email is already registered for an admin
        const existingAdmin = await Admin.findOne({ email: email });
        if (existingAdmin) {
            return res.status(400).json({ error: 'Email already registered as admin' });
        }
        // Check if role is valid
        if (!['admin', 'superadmin'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'An error occurred' });
    }
};


exports.validateSignupInput = async (req, res, next) => {
    const email = req.body.email;
    const address = req.body.address;

    try {
        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }
        // Check if email is already registered
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }
        // Check if address is present
        if (!address || typeof address !== 'string' || address.trim() === '') {
            return res.status(400).json({ error: 'Invalid or empty address' });
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'An error occurred' });
    }
};
exports.validateInput = async (qrText, req, res) => {
    try {
        if (!qrText || typeof qrText !== 'string' || qrText.trim() === '') {
            return res.status(400).json({ error: 'Invalid or empty QR text' });
        }

    } catch (error) {
        console.log(error)

    }
}
