const Admin = require('../model/Admin');
const User = require('../model/User')
const { generateToken, verifyToken } = require('../middleware/authToken')

exports.getAllUser = async (req, res, next) => {
    try {

        // Check if user is authenticated
        if (!req.headers.authorization) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const token = req.headers.authorization.split(' ')[1];

        // Verify the token
        const decodedToken = verifyToken(token);

        if (!decodedToken) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        // Token is valid, continue with QR code generation
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

exports.signup = async (req, res, next) => {
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

exports.delete = async (req, res, next) => {
    const email = req.body.email;

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(401).json({ message: 'A user with this email could not be found.' });
        }
        await user.deleteOne();
        res.send("deleted")
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "An error occurred" });
    }
}
