const Admin = require('../model/Admin');
const User = require('../model/User')
const { generateToken, logoutToken } = require('../middleware/authToken')
const bcrypt = require('bcryptjs');
const { sendEmail } = require('../services/emailServices');

exports.getAllUser = async (req, res, next) => {
    try {
        const users = await User.find();
        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }
        return res.status(200).json({ users });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "An error occurred" });
    }
};

exports.signup = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;

    try {
        const hashedPw = await bcrypt.hash(password, 12);
        const admin = new Admin({
            email: email,
            password: hashedPw,
            role: role
        });
        const result = await admin.save();
        res.status(201).json({ message: 'Admin created!', userId: result._id });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "An error occurred" });
    }
};

exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const admin = await Admin.findOne({ email: email });
        if (!admin) {
            return res.status(401).json({ message: 'An admin with this email could not be found.' });
        }
        const isEqual = await bcrypt.compare(password, admin.password);
        if (!isEqual) {
            e
            return res.status(401).json({ message: 'Wrong password!' });
        }

        const token = await generateToken(email);
        res.status(200).json({ message: 'Login successful!', userId: admin._id, token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "An error occurred" });
    }
};

exports.logout = async (req, res) => {
    const token = await logoutToken();
    res.json({ message: "You have successfully logged out" });
};

exports.delete = async (req, res, next) => {
    const email = req.body.email;

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(401).json({ message: 'A user with this email could not be found.' });
        }
        await user.deleteOne();
        res.send("User deleted successfully")
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "An error occurred" });
    }
}

exports.sendEmailToUser = async (req, res) => {
    const userEmail = req.body.email;

    try {
        const user = await User.findOne({ email: userEmail }).populate('qrCodes');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await sendEmail(userEmail, user.qrCodes);

        res.json({ message: 'Email sent successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while sending the email' });
    }
};

