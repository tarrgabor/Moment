const router = require("express").Router();
const db = require("../Database/database");
const uuid = require("uuid");
const { Post } = require("../Database/Entities/Main/Post");
const { UsersPost } = require("../Database/Entities/Binders/UsersPost");
const { sendMessage, tokenCheck } = require("../utils");
const { QueryTypes } = require("sequelize");

// Get posts with keyset pagination
router.get('/', tokenCheck, async (req, res) => {
    const lastPost = req.query.lastPost?.split('|');

    const query = `SELECT id, title, description, visible, likes, DATE_FORMAT(createdAt, '%Y-%m-%d %H:%i:%s') AS createdAt
        FROM posts 
        ${lastPost ? `WHERE createdAt > :createdAt OR (createdAt = :createdAt AND id > :id)`: ``}
        ORDER BY createdAt DESC, id DESC LIMIT 10`;

    try {
        const posts = await db.query(query, {
            replacements: { createdAt: lastPost[0], id: lastPost[1] },
            type: QueryTypes.SELECT
        })

        const nextPost = posts.length ? `${posts.at(-1).createdAt}|${posts.at(-1).id}` : null;
        res.status(200).json({ posts: posts, nextPost });
    }
    catch
    {
        return sendMessage(res, 500, "Hiba az adatbázis művelet közben!");
    }
});


// Get all posts
router.get("/all", tokenCheck, async (req, res) => {
    try
    {
        res.status(200).send(await Post.findAll());
    }
    catch
    {
        return sendMessage(res, 500, "Hiba az adatbázis művelet közben!");
    }
})


// Get post by postID
router.get("/:postID", tokenCheck, async (req, res) => {
    if (!req.params.postID)
    {
        return sendMessage(res, 203, "Nem található poszt azonosító!");
    }

    try
    {
        res.status(200).send(await Post.findOne({where: {id: req.params.postID}}));
    }
    catch
    {
        return sendMessage(res, 500, "Hiba az adatbázis művelet közben!");
    }
})


// Create a post
router.post("/create", tokenCheck, async (req, res) => {
    if (!req.body.title || !req.body.description || !req.body.visible)
    {
        return sendMessage(res, 203, "Hiányzó adatok!");
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

        await transaction.commit()
        return sendMessage(res, 200, "Poszt létrehozva!");
    }
    catch
    {
        await transaction.rollback()
        return sendMessage(res, 500, "Hiba az adatbázis művelet közben!");
    }
})

// Update post by postID
router.patch("/update/:postID", tokenCheck, async (req, res) => {
    if (!req.params.postID)
    {
        return sendMessage(res, 203, "Nem található poszt azonosító!");
    }

    if (!req.body.title || !req.body.description || !req.body.visible)
    {
        return sendMessage(res, 203, "Hiányzó adatok!");
    }

    try
    {
        const post = await UsersPost.findOne({where: {
            userID: req.user.id,
            postID: req.params.postID
        }});

        if (post == null)
        {
            return sendMessage(res, 203, "Poszt nem található!");
        }

        await Post.update({
                title: req.body.title,
                description: req.body.description,
                visible: req.body.visible
            },
            {where: {id: req.params.postID}});

        return sendMessage(res, 200, "Poszt frissítve!");
    }
    catch
    {
        return sendMessage(res, 500, "Hiba az adatbázis művelet közben!");
    }
})

// Delete post by postID
router.delete("/delete/:postID", tokenCheck, async (req, res) => {
    if (!req.params.postID)
    {
        return sendMessage(res, 203, "Nem találhatók azonosítók!");
    }

    try
    {
        const post = await UsersPost.findOne({where: {
            userID: req.user.id, 
            postID: req.params.postID
        }});
        
        if (post == null)
        {
            return sendMessage(res, 203, "Poszt nem található!");
        }

        await Post.destroy({where: {id: req.params.postID}})
        return sendMessage(res, 200, "Poszt törölve!");
    }
    catch
    {
        return sendMessage(res, 500, "Hiba az adatbázis művelet közben!");
    }
})

module.exports = router;