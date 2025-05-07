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
    if (!token) return;

    try{
        return jwt.verify(token, process.env.JWT_SECRET);
    }
    catch{
        return;
    }
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
        from: "project.moment.hungary@gmail.com",
        to: email,
        subject: 'Moment - Jelszó visszaállítás',
        html: 
        `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Jelszó visszaállítás</title>
            <link href="https://fonts.googleapis.com/css2?family=Lilita+One&display=swap" rel="stylesheet">
            <style>
                :root {
                    --theme-color: #335CB5;
                    --text-color: black;
                    --background-color: #fff;
                    --button-text-color: #fff;
                }
        
                * {
                    margin: 0;
                    padding: 0;
                    text-decoration: none;
                }
        
                html {
                    overflow-x: hidden;
                    font-size: 16px;
                    width: 100%;
                    height: 100%;
                }
        
                .email-wrapper {
                    height: 100%;
                    margin: auto;
                }
        
                .email-content {
                    max-width: 600px;
                    background-color: var(--background-color);
                    text-align: center;
                    border-radius: 10px;
                    padding: 1.4rem;
                    margin: auto;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                }
        
                .email-content h1 {
                    text-align: center;
                    margin-bottom: 1.8rem;
                }
        
                .email-content .brand {
                    font-size: 4rem;
                    font-weight: 400;
                    font-family: 'Lilita One', 'Poppins', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                    color: var(--theme-color);
                }
        
                .email-content .title {
                    font-size: 1.8rem;
                    color: var(--text-color);
                }
        
                .email-body {
                    font-size: 1rem;
                    color: var(--text-color);
                    line-height: 1.5;
                    margin-bottom: 1.5rem;
                }
        
                .email-body p:first-child {
                    margin-bottom: 1.2rem;
                }
        
                .reset-button a {
                    padding: .8rem 1.6rem;
                    font-size: 1rem;
                    border-radius: 6px;
                    color: var(--button-text-color);
                    background-color: var(--theme-color);
                }
            </style>
        </head>
        <body>
            <div class="email-wrapper">
                <div class="email-content">
                    <h1 class="brand">Moment</h1>
        
                    <h1 class="title">Jelszó visszaállítás</h1>
        
                    <div class="email-body">
                        <p>Üdvözöljük</p>
                        <p>Jelszó visszaállítási kérést kaptunk. Ha nem ön volt, akkor nincs több teendője. Ha ön volt, akkor
                            kattintson erre a gombra, hogy visszaállíthassa jelszavát:</p>
                    </div>
        
                    <div class="reset-button">
                        <a href="${resetLink}">Reset Your Password</a>
                    </div>
                </div>
            </div>
        </body>
        </html>`
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