const router = require("express").Router();
const db = require("../Database/database");
const uuid = require("uuid");
const { Post } = require("../Database/Entities/Main/Post");
const { UsersPost } = require("../Database/Entities/Binders/UsersPost");
const { PostsCategory } = require("../Database/Entities/Binders/PostsCategory");
const { sendMessage, tokenCheck } = require("../utils");
const { QueryTypes } = require("sequelize");
const { PostLike } = require("../Database/Entities/Binders/PostLike");

// Get posts with keyset pagination
router.get('/', tokenCheck, async (req, res) => {
    const oldestPost = req.query.oldestPost?.split('|');

    let filterByCategories = false;

    let categories = [];

    if (req.query.categories)
    {
        filterByCategories = true;

        req.query.categories.split('|').forEach(category => {
            categories.push(`"${category}"`);
        });
    }

    const query =
    `SELECT
        u.id AS 'userID',
        u.username,
        u.profilePicture,
        p.id AS 'postID',
        p.title,
        p.description,
        c.name as 'category',
        p.likes,
        DATE_FORMAT(p.createdAt, '%Y-%m-%d %H:%i:%s') AS createdAt,
        IF(l.postID IS NOT NULL, 1, 0) AS liked
    FROM posts p
    JOIN postscategories pc ON p.id = pc.postID
    JOIN categories c ON c.id = pc.categoryID
    LEFT JOIN postlikes l ON p.id = l.postID AND l.userID = '${req.user.id}'
    LEFT JOIN usersposts up ON p.id = up.postID
    LEFT JOIN users u ON u.id = up.userID
    WHERE p.visible = 1
    ${filterByCategories ? `AND c.name IN (${categories})` : ``}
    ${oldestPost ? `AND (p.createdAt < '${oldestPost[0]}' OR (p.createdAt = '${oldestPost[0]}' AND p.id < '${oldestPost[1]}'))` : ``}
    ORDER BY p.createdAt DESC, p.id DESC LIMIT 5`

    try {
        const posts = await db.query(query, {type: QueryTypes.SELECT});

        const oldestPost = posts.length ? `${posts.at(-1).createdAt}|${posts.at(-1).postID}` : null;
        
        res.status(200).json({ posts, oldestPost });
    }
    catch
    {
        sendMessage(res, 500, false, "Hiba az adatbázis művelet közben!");
    }
});


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


// Get post by postID
router.get("/:postID", tokenCheck, async (req, res) => {
    if (!req.params.postID)
    {
        return sendMessage(res, 400, false, "Nem található poszt azonosító!");
    }

    try
    {
        res.status(200).send(await Post.findOne({where: {id: req.params.postID}}));
    }
    catch
    {
        sendMessage(res, 500, false, "Hiba az adatbázis művelet közben!");
    }
})


// Create a post
router.post("/create", tokenCheck, async (req, res) => {
    if (!req.body.title || !req.body.description || !req.body.visible || !req.body.categoryID)
    {
        return sendMessage(res, 400, false, "Hiányzó adatok!");
    }

    const transaction = await db.transaction();

    try
    {
        const postID = uuid.v4();
        await Post.create({
            id: postID,
            title: req.body.title,
            description: req.body.description,
            visible: req.body.visible
        }, {transaction: transaction});

        await UsersPost.create({
            userID: req.user.id,
            postID: postID
        }, {transaction: transaction});

        await PostsCategory.create({
            postID: postID,
            categoryID: req.body.categoryID
        }, {transaction: transaction});

        await transaction.commit();

        sendMessage(res, 200, true, "Poszt létrehozva!");
    }
    catch
    {
        await transaction.rollback()

        sendMessage(res, 500, false, "Hiba az adatbázis művelet közben!");
    }
})

// Update post by postID
router.patch("/update/:postID", tokenCheck, async (req, res) => {
    if (!req.params.postID)
    {
        return sendMessage(res, 400, false, "Nem található poszt azonosító!");
    }

    if (!req.body.title || !req.body.description || !req.body.visible || !req.body.categoryID)
    {
        return sendMessage(res, 400, false, "Hiányzó adatok!");
    }

    const transaction = await db.transaction();

    try
    {
        if (await UsersPost.findOne({where: {userID: req.user.id, postID: req.params.postID}}) == null)
        {
            return sendMessage(res, 400, false, "Poszt nem található!");
        }

        await Post.update({
                title: req.body.title,
                description: req.body.description,
                visible: req.body.visible
            }, {
                where: {id: req.params.postID},
                transaction: transaction
            },
        );

        await PostsCategory.update({
            categoryID: req.body.categoryID
            }, {
                where: {postID: req.params.postID},
                transaction: transaction
            }
        );

        await transaction.commit();

        sendMessage(res, 200, true, "Poszt frissítve!");
    }
    catch
    {
        transaction.rollback();

        sendMessage(res, 500, false, "Hiba az adatbázis művelet közben!");
    }
})

// Delete post by postID
router.delete("/delete/:postID", tokenCheck, async (req, res) => {
    if (!req.params.postID)
    {
        return sendMessage(res, 400, false, "Nem található poszt azonosító!");
    }

    try
    {
        if (await UsersPost.findOne({where: {userID: req.user.id, postID: req.params.postID}}) == null)
        {
            return sendMessage(res, 400, false, "Poszt nem található!");
        }

        await Post.destroy({where: {id: req.params.postID}});
        
        sendMessage(res, 200, true, "Poszt törölve!");
    }
    catch
    {
        sendMessage(res, 500, false, "Hiba az adatbázis művelet közben!");
    }
})

// like and dislike post by postID
router.post("/like/:postID", tokenCheck, async (req, res) => {
    if (!req.params.postID)
    {
        return sendMessage(res, 400, false, "Nem található poszt azonosító!");
    }

    const transaction = await db.transaction();

    try
    {
        if (await Post.findOne({where: {id: req.params.postID}}) == null)
        {
            return sendMessage(res, 400, false, "Poszt nem található!");
        }

        if (!await PostLike.findOne({where: {postID: req.params.postID, userID: req.user.id}}))
        {
            await Post.increment('likes', {
                by: 1,
                where: {id: req.params.postID},
                transaction: transaction
            });

            await PostLike.create({
                postID: req.params.postID,
                userID: req.user.id
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
            postID: req.params.postID,
            userID: req.user.id
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