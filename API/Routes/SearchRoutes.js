const router = require("express").Router();
require("dotenv").config();
const { Op } = require("sequelize");
const { sendMessage, tokenCheck } = require("../utils");

const { Post } = require("../Database/Models/Post");
const { User } = require("../Database/Models/User");

// Get posts and users by search text
router.get("/searchbar", tokenCheck, async (req, res) => {
    const searchText = req.query.search ? req.query.search : null;

    try
    {
        const posts = await Post.findAll({
            where: {title: {[Op.like]: "%" + searchText + "%"}, visible: 1},
            limit: 4,
            attributes: ["id", "title", "likes"],
            order: [["likes", 'DESC']]
        });

        const users = await User.findAll({
            where: {username: {[Op.like]: "%" + searchText + "%"}},
            limit: 4,
            attributes: ["username", "profilePicture", "followerCount"],
            order: [['followerCount', 'DESC']]
        });

        res.status(200).send([posts, users]);
    }
    catch
    {
        sendMessage(res, 500, false, "Hiba az adatbázis művelet közben!");
    }
})

module.exports = router;