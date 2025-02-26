const jwt = require("jsonwebtoken");
require("dotenv").config();

function sendMessage(res, status, success, message)
{
    return res.status(status).json({success, message});
};

function tokenCheck(req, res, next){
    const authHeader = req.header('Authorization');
    
    if (!authHeader)
    {
        return sendMessage(res, 401, false, "Jelentkezz be!");
    }

    try
    {
        req.user = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
        next();
    }
    catch
    {
        return sendMessage(res, 401, false, "Hibás authentikáció!");
    }
}

module.exports = {
    sendMessage,
    tokenCheck
}