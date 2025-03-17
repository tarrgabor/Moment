const router = require("express").Router();
const { Op } = require("sequelize");
const CryptoJS = require("crypto-js");
const { sendMessage, tokenCheck } = require("../utils");
const passwdRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
require("dotenv").config();
const jwt = require("jsonwebtoken");

const { User } = require("../Database/Models/User");

// Create a user
router.post("/registration", async (req, res) => {
    if (!req.body.username || !req.body.email || !req.body.password || !req.body.confirm)
    {
        return sendMessage(res, 400, false, "Hiányzó adatok!");
    }

    if (req.body.password != req.body.confirm)
    {
        return sendMessage(res, 400, false, "A jelszavak nem egyeznek!");
    }

    if (!req.body.password.match(passwdRegExp)){
        return sendMessage(res, 400, false, "A megadott jelszó nem elég biztonságos!");
    }

    try
    {
        const user = await User.findOne({where: {[Op.or]: [{email: req.body.email}, {username: req.body.username}]}});

        if (user != null)
        {
            return sendMessage(res, 400, false, "Foglalt felhasználói adatok!");
        }

        await User.create({
            username: req.body.username,
            email: req.body.email,
            password: String(CryptoJS.SHA1(req.body.password)),
        });

        sendMessage(res, 200, true, "Sikeres regisztráció!");
    }
    catch
    {
        sendMessage(res, 500, false, "Hiba az adatbázis művelet közben!");
    }
})

// Get user by email and password (login)
router.post("/login", async (req, res) => {
    if (!req.body.email || !req.body.password)
    {
        return sendMessage(res, 400, false, "Hiányzó adatok!");
    }

    try
    {
        const user = await User.findOne({
            where: 
            {
                email: req.body.email, 
                password: String(CryptoJS.SHA1(req.body.password))
            },
            attributes:
            {
                exclude: ["fullName", "password", "phoneNumber"]
            }
        });

        if (user == null)
        {
            return sendMessage(res, 400, false, "Hibás belépési adatok!");
        }

        if (user.status == "banned")
        {
            return sendMessage(res, 401, false, "A felhasználó ki van tiltva!");
        }

        res.status(200).json({success: true, message: "Sikeres bejelentkezés", token: jwt.sign(JSON.parse(JSON.stringify(user)), process.env.JWT_SECRET, {expiresIn: "2h"})});
    }
    catch
    {
        sendMessage(res, 500, false, "Hiba az adatbázis művelet közben!");
    }
})

// Get user by username (profile)
router.get("/profile/:username", tokenCheck, async (req, res) => {
    try
    {
        const user = await User.findOne({where: {username: req.params.username},
            attributes:
            {
                exclude: ["id", "password"]
            }
        });

        if (user == null)
        {
            return sendMessage(res, 400, false, "A felhasználó nem található!");
        }

        res.status(200).json({success: true, user});
    }
    catch
    {
        sendMessage(res, 500, false, "Hiba az adatbázis művelet közben!");
    }
})

module.exports = router;