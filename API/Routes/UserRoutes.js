const router = require("express").Router();
const { Op, QueryTypes } = require("sequelize");
const CryptoJS = require("crypto-js");
const uuid = require("uuid");
const db = require("../Database/database");
const { sendMessage, tokenCheck, sendResetEmail, verifyToken, validateEmail, validatePassword, validateUsername } = require("../utils");
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

    if (!req.body.password || !req.body.confirm)
    {
        return sendMessage(res, 200, false, "Hiányzó jelszó!");
    }

    if (req.body.password != req.body.confirm)
    {
        return sendMessage(res, 200, false, "A jelszavak nem egyeznek!");
    }

    if (!validateUsername(res, req.body.username)) return;

    if (!validateEmail(res, req.body.email)) return;

    if (!validatePassword(res, req.body.password, req.body.confirm)) return;

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
                exclude: ["password", "followerCount", "followedCount", "createdAt", "restoreCode"]
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
        const query =
        `SELECT
        u.username,
        u.profilePicture,
        u.followerCount,
        u.followedCount,
        IF(uf.followerID = :userID, 1, 0) as "followed"
        FROM users u
        LEFT JOIN userfollows uf ON u.id = uf.followedID
        WHERE u.username = :username`;

        const user = await db.query(query, {type: QueryTypes.SELECT, replacements: {userID: req.user.id, username: req.params.username}});

        if (user[0] == null)
        {
            return sendMessage(res, 200, false, "A felhasználó nem található!");
        }

        res.status(200).json({success: true, user: user[0]});
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

// Request for password reset
router.post('/reset/request', async (req, res) => {
    if (!validateEmail(res, req.body.email)) return;

    try
    {
        const user = await User.findOne({
            where: {email: req.body.email},
            attributes: ["email", "restoreCode"]
        });

        if (!user)
        {
            return sendMessage(res, 200, false, "Nincs ilyen regisztrált email!")
        }

        await sendResetEmail(req.body.email, jwt.sign(JSON.parse(JSON.stringify(user)), process.env.JWT_SECRET, {expiresIn: "10min"}));

        sendMessage(res, 200, true, "Email elküldve!");
    }
    catch
    {
        sendMessage(res, 200, false, "Nem sikerült elküldeni az emailt!");
    }
});

// Reset password by token
router.patch('/reset/password', async (req, res) => {
    const restoreToken = verifyToken(req.query.token);

    if (!restoreToken.email || !restoreToken.restoreCode)
    {
        sendMessage(res, 200, false, "Hiányzó adatok!");
    }

    if (!validatePassword(res, req.body.password, req.body.confirm)) return;

    try
    {
        const user = await User.findOne({where: {email: restoreToken.email, restoreCode: restoreToken.restoreCode}})
    
        if (user)
        {
            await User.update({
                password: String(CryptoJS.SHA1(req.body.password)),
                restoreCode: uuid.v4()
            }, {where: {email: restoreToken.email, restoreCode: restoreToken.restoreCode}});

            return sendMessage(res, 200, true, "Jelszó sikeresen visszaállítva!");
        }

        sendMessage(res, 200, false, "Jelszó visszaállítása sikertelen!");
    }
    catch
    {
        sendMessage(res, 200, false, "Hiba az adatbázis művelet közben!");
    }
});

module.exports = router;