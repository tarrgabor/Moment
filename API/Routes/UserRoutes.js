const router = require("express").Router();
const { Op } = require("sequelize");
const { User } = require("../Database/Entities/Main/User");
const CryptoJS = require("crypto-js");
const { sendMessage, sendMessageAndGenerateToken } = require("../utils");
const passwdRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

// Create a user
router.post("/registration", async (req, res) => {
    if (!req.body.username || !req.body.email || !req.body.password || !req.body.confirm)
    {
        return sendMessage(res, 203, "Hiányzó adatok!");
    }

    if (req.body.password != req.body.confirm)
    {
        return sendMessage(res, 203, "A jelszavak nem egyeznek!");
    }

    if (!req.body.password.match(passwdRegExp)){
        return sendMessage(res, 203, "A megadott jelszó nem elég biztonságos!");
    }

    try
    {
        const user = await User.findOne({where: {[Op.or]: [{email: req.body.email}, {username: req.body.username}]}});

        if (user != null)
        {
            return sendMessage(res, 203, "Foglalt felhasználói adatok!");
        }

        await User.create({
            username: req.body.username,
            email: req.body.email,
            password: String(CryptoJS.SHA1(req.body.password)),
        });

        return sendMessage(res, 200, "Sikeres regisztráció!");
    }
    catch
    {
        return sendMessage(res, 500, "Hiba az adatbázis művelet közben!");
    }
})

// Get user by email and password (login)
router.post("/login", async (req, res) => {
    if (!req.body.email || !req.body.password)
    {
        return sendMessage(res, 203, "Hiányzó adatok!");
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
                exclude: ["fullName", "password", "phoneNumber", "warnings"]
            }
        });

        if (user == null)
        {
            return sendMessage(res, 203, "Hibás belépési adatok!");
        }

        if (user.status == "banned")
        {
            return sendMessage(res, 203, "A felhasználó ki van tiltva!");
        }

        return sendMessageAndGenerateToken(res, 200, "Sikeres bejelentkezés!", user)
    }
    catch
    {
        return sendMessage(res, 500, "Hiba az adatbázis művelet közben!");
    }
})

module.exports = router;