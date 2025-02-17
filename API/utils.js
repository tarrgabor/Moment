import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function sendMessage(res, status, message)
{
    return res.status(status).json({message: message, status: status});
};

export function sendMessageAndGenerateToken(res, status, message, user)
{
    return res.status(status).json({token: jwt.sign(JSON.parse(JSON.stringify(user)), process.env.JWT_SECRET, {expiresIn: "2h"}), status: status, message: message});
};

export function tokenCheck(req, res, next){
    const authHeader = req.header('Authorization');
    
    if (!authHeader)
    {
        return sendMessage(res, 400, "Jelentkezz be!");
    }

    try
    {
        req.user = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
        next();
    }
    catch
    {
        return sendMessage(res, 400, "Hibás authentikáció!");
    }
}