const { verifyToken } = require("./authToken");

exports.isAuth = async (req, res, next) => {
    // Check if user is authenticated
    if (!req.headers.authorization) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    
    const token = req.headers.authorization; 

    // Verify the token
    const decodedToken = verifyToken(token);    

    if (!decodedToken.email) {
        return res.status(401).json({ error: 'Session Expired or you have been loged out' });
    }
    req.email = decodedToken.email; 
    req.userId = decodedToken.userId;
   //console.log("fdsvfd",decodedToken)
    next();
};
