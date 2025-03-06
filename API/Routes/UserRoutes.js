const router = require("express").Router();
const { Op } = require("sequelize");
const { User } = require("../Database/Entities/Main/User");
const CryptoJS = require("crypto-js");
const { sendMessage } = require("../utils");
const passwdRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
require("dotenv").config();
const jwt = require("jsonwebtoken");

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
                exclude: ["fullName", "password", "phoneNumber", "warnings"]
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

router.delete('/users/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      const deletedUser = await User.destroy({ where: { id: userId } });

      if (!deletedUser) {
        return res.status(404).json({ message: 'Felhasználó nem található' });
      }

      res.status(200).json({ message: 'Sikeres fiók törlés' });
    } catch (error) {
      res.status(500).json({ message: 'Hiba az adatbázis művelet közben', error });
    }
});



module.exports = router;