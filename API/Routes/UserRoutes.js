const router = require("express").Router();
const { Op, QueryTypes } = require("sequelize");
const CryptoJS = require("crypto-js");
const db = require("../Database/database");
const { sendMessage, tokenCheck } = require("../utils");
const passwdRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
require("dotenv").config();
const jwt = require("jsonwebtoken");

const { User } = require("../Database/Models/User");
const { UserFollow } = require("../Database/Models/UserFollow");

// Create a user
router.post("/registration", async (req, res) => {
    if (!req.body.username || !req.body.email || !req.body.password || !req.body.confirm)
    {
        return sendMessage(res, 200, false, "Hiányzó adatok!");
    }

    if (req.body.username.match(/[^a-zA-Z0-9._-]/) || req.body.email.match(/[^a-zA-Z0-9._%+-@,;:"<>[\]()\\\s]/))
    {
        return sendMessage(res, 200, false, "A mezők tiltott karaktereket tartalmaznak!");
    }

    if (!req.body.email.match(/^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim))
    {
        return sendMessage(res, 200, false, "Az e-mail nem érvényes!");
    }

    if (req.body.password != req.body.confirm)
    {
        return sendMessage(res, 200, false, "A jelszavak nem egyeznek!");
    }

    if (!req.body.password.match(passwdRegExp)){
        return sendMessage(res, 200, false, "A megadott jelszó nem elég biztonságos!");
    }

    try
    {
        const user = await User.findOne({where: {[Op.or]: [{email: req.body.email}, {username: req.body.username}]}});

        if (user != null)
        {
            return sendMessage(res, 200, false, "Foglalt felhasználói adatok!");
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
        return sendMessage(res, 200, false, "Hiányzó adatok!");
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
                exclude: ["password", "followerCount", "followedCount", "createdAt"]
            }
        });

        if (user == null)
        {
            return sendMessage(res, 200, false, "Hibás belépési adatok!");
        }

        if (user.status == "banned")
        {
            return sendMessage(res, 200, false, "A felhasználó ki van tiltva!");
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
            return sendMessage(res, 200, false, "A felhasználó nem található!");
        }

        res.status(200).json({success: true, user});
    }
    catch
    {
        sendMessage(res, 500, false, "Hiba az adatbázis művelet közben!");
    }
})

// Toggle following user by username
router.post("/follow/:username", tokenCheck, async (req, res) => {
    if (!req.params.username)
    {
        return sendMessage(res, 200, false, "Nem található felhasználónév!");
    }

    const transaction = await db.transaction();

    try
    {
        const user = await User.findOne({where: {username: req.params.username}, attributes: ["id", "username"]});

        if (!user || user.username == req.user.username)
        {
            return sendMessage(res, 200, false, "Sikertelen művelet!");
        }

        if (!await UserFollow.findOne({where: {followerID: req.user.id, followedID: user.id}}))
        {
            await User.increment('followerCount', {
                by: 1,
                where: {id: user.id},
                transaction: transaction
            });
    
            await UserFollow.create({
                followerID: req.user.id,
                followedID: user.id,
            }, {transaction: transaction});
    
            await transaction.commit();
    
            return res.status(200).json({success: true, followed: true});
        }

        await User.decrement('followerCount', {
            by: 1,
            where: {id: user.id},
            transaction: transaction
        });

        await UserFollow.destroy({where: {
            followerID: req.user.id,
            followedID: user.id,
        }, transaction: transaction});

        await transaction.commit();

        return res.status(200).json({success: true, followed: false});
    }
    catch
    {
        transaction.rollback();

        sendMessage(res, 500, false, "Hiba az adatbázis művelet közben!");
    }
})

// Get user's followers
router.post("/followers/:username", tokenCheck, async (req, res) => {
    if (!req.params.username)
    {
        return sendMessage(res, 200, false, "Nem található felhasználónév!");
    }

    try
    {
        const user = await User.findOne({where: {username: req.params.username}, attributes: ["id"]})

        if (!user)
        {
            return sendMessage(res, 200, false, "Felhasználó nem található!");
        }

        const query =
        `SELECT
        u.username,
        u.profilePicture
        FROM users u
        LEFT JOIN userfollows uf ON uf.followerID = u.id
        WHERE uf.followedID = :followedID`

        const followers = await db.query(query, {
            replacements: {followedID: user.id},
            type: QueryTypes.SELECT
        });

        return res.status(200).json({followers});
    }
    catch
    {
        sendMessage(res, 500, false, "Hiba az adatbázis művelet közben!");
    }
})

// Get user's followers
router.post("/followed/:username", tokenCheck, async (req, res) => {
    if (!req.params.username)
    {
        return sendMessage(res, 200, false, "Nem található felhasználónév!");
    }

    try
    {
        const user = await User.findOne({where: {username: req.params.username}, attributes: ["id"]})

        if (!user)
        {
            return sendMessage(res, 200, false, "Felhasználó nem található!");
        }

        const query =
        `SELECT
        u.username,
        u.profilePicture
        FROM users u
        LEFT JOIN userfollows uf ON uf.followedID = u.id
        WHERE uf.followerID = :followerID`

        const followedUsers = await db.query(query, {
            replacements: {followerID: user.id},
            type: QueryTypes.SELECT
        });

        return res.status(200).json({followedUsers});
    }
    catch
    {
        sendMessage(res, 500, false, "Hiba az adatbázis művelet közben!");
    }
})

module.exports = router;