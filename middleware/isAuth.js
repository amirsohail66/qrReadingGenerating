const { verifyToken } = require("./authToken");

exports.isAuth = async(req,res,next)=>{
     // Check if user is authenticated
     if (!req.headers.authorization) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    
    const token = req.headers.authorization.split(' ')[1];

    // Verify the token
    const decodedToken = verifyToken(token);
    

    if (!decodedToken.email) {
        return res.status(401).json({ error: 'Invalid token' });
    }

    req.email = decodedToken.email;

    // Token is valid, continue with QR code generation
    next();

}