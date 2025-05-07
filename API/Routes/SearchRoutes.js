const router = require("express").Router();
require("dotenv").config();
const db = require("../Database/database");
const { Op, QueryTypes } = require("sequelize");
const { sendMessage, tokenCheck } = require("../utils");

const { Post } = require("../Database/Models/Post");
const { User } = require("../Database/Models/User");

// Get posts and users by search text
router.get("/searchbar", tokenCheck, async (req, res) => {
    const searchText = req.query.q || "";

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



// Get posts and users with keyset pagination
router.get('/', tokenCheck, async (req, res) => {
    const cursor = req.query.cursor?.split('|');

    const type = req.query.type || "posts";
    const q = req.query.q;

    let categories = [];

    req.query.categories?.split('|').forEach(category => {
        categories.push(`"${category}"`);
    });

    let nextCursor = null;

    try
    {
        if (type == "users")
        {
            const query =
            `SELECT
            u.username,
            u.profilePicture,
            u.followerCount,
            DATE_FORMAT(u.createdAt, '%Y-%m-%d %H:%i:%s') AS createdAt
            FROM users u
            WHERE 1 = 1
            ${q ? `AND u.username like :q` : ``}
            ${cursor ? `AND u.createdAt > :cursor` : ``}
            ORDER BY u.createdAt ASC, u.username DESC
            LIMIT 20`

            const users = await db.query(query, {type: QueryTypes.SELECT, replacements: {q: "%" + q + "%", cursor: cursor ? cursor[0] : ""}});

            nextCursor = users.length ? users.at(-1).createdAt : null;
            
            res.status(200).json({users, nextCursor});
            return;
        }
        else if (type == "posts" || type == "follows")
        {
            const query =
            `SELECT
            u.username,
            u.profilePicture,
            p.id AS 'postID',
            p.title,
            p.description,
            c.name as 'category',
            p.image,
            p.likes,
            DATE_FORMAT(p.createdAt, '%Y-%m-%d %H:%i:%s') AS createdAt,
            IF(pl.postID IS NOT NULL, 1, 0) AS liked,
            IF(p.userID = :userID, 1, 0) as owned
            FROM posts p
            LEFT JOIN categories c ON c.id = p.categoryID
            LEFT JOIN users u ON u.id = p.userID
            LEFT JOIN postlikes pl ON pl.postID = p.id AND pl.userID = :userID
            ${type == "follows" ? `LEFT JOIN userfollows uf ON u.id = uf.followedID AND uf.followerID = :userID` : ``}
            WHERE p.visible = 1
            ${type == "follows" ? `AND uf.followerID IS NOT NULL` : ``}
            ${q ? `AND p.title like :q`: ``}
            ${categories.length ? `AND c.name IN (${categories})` : ``}
            ${cursor ? `AND (p.createdAt < '${cursor[0]}' OR (p.createdAt = '${cursor[0]}' AND p.id < '${cursor[1]}'))` : ``}
            ORDER BY p.createdAt DESC, p.id DESC LIMIT 10`

            const posts = await db.query(query, {type: QueryTypes.SELECT, replacements: {userID: req.user.id, q: "%" + q + "%"}});

            nextCursor = posts.length ? `${posts.at(-1).createdAt}|${posts.at(-1).postID}` : null;
            
            res.status(200).json({posts, nextCursor});
            return;
        }

        res.status(200).json([]);
    }
    catch
    {
        sendMessage(res, 500, false, "Hiba az adatbázis művelet közben!");
    }
});

module.exports = router;