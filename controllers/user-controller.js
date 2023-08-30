const User = require('../model/User');
const bcrypt = require('bcryptjs');
const { generateToken, verifyToken } = require('../middleware/authToken')

exports.signup = async (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const address = req.body.address;

    try {
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
    const email = req.body.email;
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

