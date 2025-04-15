const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const nodemailer = require("nodemailer");
require("dotenv").config();

function sendMessage(res, status, success, message)
{
    return res.status(status).json({success, message});
};

function validateUsername(res, username)
{
    if (username.match(/[^a-zA-Z0-9._\u00C0-\u024F\u1E00-\u1EFF-]/g))
    {
        sendMessage(res, 200, false, "A felhasználónév tiltott karaktereket tartalmaz!");
        return false;
    }

    return true;
}

function validateEmail(res, email)
{
    if (!email.match(/^((?!\.)[a-zA-Z0-9_-]+(?:[._-][a-zA-Z0-9_-]+)*)(@[a-zA-Z0-9-]+)(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?$/gim))
    {
        sendMessage(res, 200, false, "Az e-mail nem érvényes!");
        return false;
    }

    return true;
}

function validatePassword(res, password, confirm)
{
    if (!password || !confirm)
    {
        sendMessage(res, 200, false, "Hiányzó jelszó!");
        return false;
    }

    if (password != confirm)
    {
        sendMessage(res, 200, false, "A jelszavak nem egyeznek!");
        return false;
    }

    if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/))
    {
        sendMessage(res, 200, false, "A megadott jelszó nem elég biztonságos!");
        return false;
    }

    return true;
}

function verifyToken(token)
{
    if (!token) return sendMessage(res, 200, false, "Hiányzó token!");

    return jwt.verify(token, process.env.JWT_SECRET);
}

function tokenCheck(req, res, next){
    const authHeader = req.header('Authorization');
    
    if (!authHeader)
    {
        return sendMessage(res, 401, false, "Jelentkezz be!");
    }

    try
    {
        req.user = verifyToken(authHeader.split(' ')[1]);
        next();
    }
    catch
    {
        return sendMessage(res, 401, false, "Hibás authentikáció!");
    }
}

function formatFileName(fileName){
    const originalname = fileName.replaceAll(' ', '_');
    const name = originalname.substring(0, originalname.lastIndexOf('.'));
       
    return name + '-' + Date.now();
}

const uploadImage = (fileName, fileBuffer) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({
            public_id: formatFileName(fileName),
            resource_type: "image"
    }, (error, uploadResults) => {
        if (error)
        {
            reject(new Error("Kép feltöltés sikertelen!"));
        }
        else
        {
            resolve(uploadResults);
        }
      }).end(fileBuffer);
    });
};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "project.moment.hungary@gmail.com",
        pass: process.env.EMAIL_PASS
    }
});

async function sendResetEmail(email, token) {
    const resetLink = `http://localhost:4200/restore?token=${token}`;

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Moment - Jelszó visszaállítás',
        text: `Kattints ide a jelszó visszaállításához: ${resetLink}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Email küldési hiba:', error);
        } else {
            console.log('Email elküldve:', info.response);
        }
    });
}

module.exports = {
    sendMessage,
    tokenCheck,
    formatFileName,
    uploadImage,
    sendResetEmail,
    verifyToken,
    validatePassword,
    validateEmail,
    validateUsername
}