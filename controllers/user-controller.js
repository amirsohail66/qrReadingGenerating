const User = require('../model/User');
const bcrypt = require('bcryptjs');
const { generateToken, logoutToken } = require('../middleware/authToken')
const jwt = require('jsonwebtoken');

exports.updateUser = async (req, res) => {
    try {
        const fieldsToUpdate = req.body;
        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decodedToken.userId;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: fieldsToUpdate }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Fields updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
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
            return res.status(401).json({ message: 'A user with this email is already registered.' });
        }
        const hashedPw = await bcrypt.hash(password, 12);
        const user = new User({
            name: name,
            email: email,
            password: hashedPw,
            address: address
        });
        const result = await user.save();
        // const token = await generateToken(email);
        res.status(201).json({ message: 'User created!', userId: result._id });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "An error occurred" });
    }
};

exports.login = async (req, res, next) => {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(401).json({ message: 'A user with this email could not be found.' });
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            return res.status(401).json({ message: 'Wrong password!' });
        }
        const userId = user._id;
        const token = await generateToken(email, userId);
        res.status(200).json({ message: 'Login successful!', userId: user._id, token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "An error occurred" });
    }
};


exports.logout = async (req, res) => {
    const token = await logoutToken();
    res.json({ message: "You have successfully logged out" });
};

