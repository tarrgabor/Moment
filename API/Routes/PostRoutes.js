const router = require("express").Router();
require("dotenv").config();
const db = require("../Database/database");
const { QueryTypes } = require("sequelize");
const multer  = require('multer')
const { sendMessage, tokenCheck, uploadImage } = require("../utils");
const cloudinary = require("cloudinary").v2;

const { Post } = require("../Database/Models/Post");
const { Comment } = require("../Database/Models/Comment");
const { PostLike } = require("../Database/Models/PostLike");

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = multer({ storage: multer.memoryStorage() });

// Get all posts
router.get("/get/all", tokenCheck, async (req, res) => {
    try
    {
        res.status(200).send(await Post.findAll());
    }
    catch
    {
        sendMessage(res, 500, false, "Hiba az adatbázis művelet közben!");
    }
})

// Get user's posts with keyset pagination
router.get('/user/:username', tokenCheck, async (req, res) => {
    const cursor = req.query.cursor?.split('|');

    let nextCursor = null;

    try
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
        WHERE p.visible = 1 AND u.username = :username
        ${cursor ? `AND (p.createdAt < '${cursor[0]}' OR (p.createdAt = '${cursor[0]}' AND p.id < '${cursor[1]}'))` : ``}
        ORDER BY p.createdAt DESC, p.id DESC LIMIT 10`

        const posts = await db.query(query, {type: QueryTypes.SELECT, replacements: {userID: req.user.id, username: req.params.username}});

        nextCursor = posts.length ? `${posts.at(-1).createdAt}|${posts.at(-1).postID}` : null;
        
        res.status(200).json({posts, nextCursor});
    }
    catch
    {
        sendMessage(res, 500, false, "Hiba az adatbázis művelet közben!");
    }
});


// Get post by postID
router.get("/:postID", tokenCheck, async (req, res) => {
    if (!req.params.postID)
    {
        return sendMessage(res, 200, false, "Nem található poszt azonosító!");
    }

    try
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
            IF(p.userID = :userID, 1 , 0) as owned,
            IF(pl.postID IS NOT NULL, 1, 0) AS liked
            FROM posts p
            LEFT JOIN categories c ON c.id = p.categoryID
            LEFT JOIN users u ON u.id = p.userID
            LEFT JOIN postlikes pl ON pl.postID = p.id AND pl.userID = :userID
            WHERE (p.visible = 1 OR p.userID = :userID) AND p.id = :postID`

        const results = await db.query(query, {type: QueryTypes.SELECT, replacements: {postID: req.params.postID, userID: req.user.id}});
        
        res.status(200).send(results[0]);
    }
    catch
    {
        sendMessage(res, 500, false, "Hiba az adatbázis művelet közben!");
    }
})

// Create a post
router.post("/create", tokenCheck, upload.single('file'), async (req, res) => {
    if (!req.body.title || !req.body.description || !req.body.categoryID || !req.file)
    {
        return sendMessage(res, 200, false, "Hiányzó adatok!");
    }

    if (!req.body.title.match(/^[\p{L}0-9?!.\s]*$/u))
    {
        return sendMessage(res, 200, false, "A cím nem tartalmazhat tiltott speciális karaktereket!");
    }

    try
    {
        const uploadResults = await uploadImage(req.file.originalname, req.file.buffer);
        
        const post = await Post.create({
            userID: req.user.id,
            title: req.body.title,
            description: req.body.description,
            categoryID: req.body.categoryID,
            image: cloudinary.url(uploadResults.public_id, {
                transformation: [{
                    quality: "auto",
                    fetch_format: "auto"
                }]
            }),
            visible: 1
        });
        
        res.status(200).send({success: true, message: "Poszt létrehozva!", id: post.id});
    }
    catch
    {
        sendMessage(res, 200, false, "Poszt létrehozása sikertelen!");
    }
})

// Update post by postID
router.patch("/update/:postID", tokenCheck, async (req, res) => {
    if (!req.params.postID)
    {
        return sendMessage(res, 200, false, "Nem található poszt azonosító!");
    }

    if (!req.body.title || !req.body.description || !req.body.categoryID)
    {
        return sendMessage(res, 200, false, "Hiányzó adatok!");
    }

    try
    {
        const post = await Post.findOne({where: {id: req.params.postID}});

        if (!post)
        {
            return sendMessage(res, 200, false, "Poszt nem található!");
        }

        if (post.userID == req.user.id || req.user.role == "admin")
        {
            await Post.update({
                title: req.body.title,
                description: req.body.description,
                categoryID: req.body.categoryID
                }, {
                    where: {id: req.params.postID}
                }
            );

            return sendMessage(res, 200, true, "Poszt frissítve!");
        }

        sendMessage(res, 200, false, "Nincs jogosultságod ehhez!");
    }
    catch
    {
        sendMessage(res, 200, false, "Poszt frissítése sikertelen!");
    }
})

// Delete post by postID
router.delete("/delete/:postID", tokenCheck, async (req, res) => {
    if (!req.params.postID)
    {
        return sendMessage(res, 200, false, "Nem található poszt azonosító!");
    }

    const transaction = await db.transaction();

    try
    {
        const post = await Post.findOne({where: {id: req.params.postID}});

        if (!post)
        {
            return sendMessage(res, 200, false, "Poszt nem található!");
        }

        if (post.userID == req.user.id || req.user.role == "admin")
        {
            await PostLike.destroy({
                where: {postID: req.params.postID},
                transaction: transaction
            });
    
            await db.query(
                `DELETE cl
                FROM commentlikes cl
                JOIN comments c ON cl.commentID = c.id
                WHERE c.postID = :postID`, {
                replacements: {postID: req.params.postID},
                transaction: transaction
            });
    
            await Comment.destroy({
                where: {postID: req.params.postID},
                transaction: transaction
            });
    
            await Post.destroy({
                where: {id: req.params.postID},
                transaction: transaction
            });
            
            await transaction.commit();
    
            return sendMessage(res, 200, true, "Poszt törölve!");
        }

        transaction.rollback();

        sendMessage(res, 200, false, "Nincs jogosultságod ehhez!");
    }
    catch
    {
        transaction.rollback();

        sendMessage(res, 200, false, "Poszt törlése sikertelen!");
    }
})

// like and dislike post by postID
router.post("/like/:postID", tokenCheck, async (req, res) => {
    if (!req.params.postID)
    {
        return sendMessage(res, 200, false, "Nem található poszt azonosító!");
    }

    const transaction = await db.transaction();

    try
    {
        if (!await Post.findOne({where: {id: req.params.postID}, attributes: ["id"]}))
        {
            return sendMessage(res, 200, false, "Poszt nem található!");
        }

        if (!await PostLike.findOne({where: {userID: req.user.id, postID: req.params.postID}}))
        {
            await Post.increment('likes', {
                by: 1,
                where: {id: req.params.postID},
                transaction: transaction
            });

            await PostLike.create({
                userID: req.user.id,
                postID: req.params.postID,
            }, {transaction: transaction});

            await transaction.commit();

            return res.status(200).json({success: true, liked: true});
        }

        await Post.decrement('likes', {
            by: 1,
            where: {id: req.params.postID},
            transaction: transaction
        });

        await PostLike.destroy({where: {
            userID: req.user.id,
            postID: req.params.postID
        }, transaction: transaction});

        await transaction.commit();

        return res.status(200).json({success: true, liked: false});
    }
    catch
    {
        transaction.rollback();

        sendMessage(res, 500, false, "Hiba az adatbázis művelet közben!");
    }
})

module.exports = router;