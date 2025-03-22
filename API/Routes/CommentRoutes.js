const router = require("express").Router();
const { QueryTypes } = require("sequelize");
const db = require("../Database/database");
const { sendMessage, tokenCheck } = require("../utils");

const { Comment } = require("../Database/Models/Comment");
const { CommentLike } = require("../Database/Models/CommentLike");

// Get all comments under post
router.get("/post/:postID", tokenCheck, async (req, res) => {
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
        c.id as "commentID",
        c.message,
        c.likes,
        c.createdAt,
        IF(cl.commentID IS NOT NULL, 1, 0) AS liked
        FROM comments c
        LEFT JOIN users u ON c.userID = u.id
        LEFT JOIN commentlikes cl ON c.id = cl.commentID
        ORDER BY c.createdAt DESC`

        res.status(200).send(await db.query(query, {
                replacements: {postID: req.params.postID},
                type: QueryTypes.SELECT
            })
        );
    }
    catch
    {
        sendMessage(res, 500, false, "Hiba az adatbázis művelet közben!");
    }
});

// Create comment under post
router.post("/create/:postID", tokenCheck, async (req, res) => {
    if (!req.params.postID)
    {
        return sendMessage(res, 200, false, "Nem található poszt azonosító!");
    }

    if (!req.body.message)
    {
        return sendMessage(res, 200, false, "Hiányzó adatok!");
    }
    
    try
    {
        await Comment.create({
            userID: req.user.id,
            postID: req.params.postID,
            message: req.body.message,
        });

        sendMessage(res, 200, true, "Komment létrehozva!");
    }
    catch
    {
        sendMessage(res, 500, false, "Hiba az adatbázis művelet közben!");
    }
});

// Modify comment by commentID
router.patch("/update/:commentID", tokenCheck, async (req, res) => {
    if (!req.params.commentID)
    {
        return sendMessage(res, 200, false, "Nem található komment azonosító!");
    }

    try
    {
        if (!await Comment.findOne({where: {id: req.params.commentID, userID: req.user.id}}))
        {
            return sendMessage(res, 200, false, "Komment nem található!");
        }

        await Comment.update(
            {message: req.body.message},
            {where: {id: req.params.commentID}}
        );

        sendMessage(res, 200, true, "Komment módosítva!");
    }
    catch
    {
        sendMessage(res, 500, false, "Hiba az adatbázis művelet közben!");
    }
});

// Delete comment by commentID
router.delete("/delete/:commentID", tokenCheck, async (req, res) => {
    if (!req.params.commentID)
    {
        return sendMessage(res, 200, false, "Nem található komment azonosító!");
    }

    const transaction = await db.transaction();

    try
    {
        if (!await Comment.findOne({where: {id: req.params.commentID, userID: req.user.id}}))
        {
            return sendMessage(res, 200, false, "Komment nem található!");
        }

        await CommentLike.destroy({
            where: {commentID: req.params.commentID},
            transaction: transaction
        });

        await Comment.destroy({
            where: {id: req.params.commentID},
            transaction: transaction
        });

        await transaction.commit();

        sendMessage(res, 200, true, "Komment törölve!");
    }
    catch
    {
        transaction.rollback();

        sendMessage(res, 500, false, "Hiba az adatbázis művelet közben!");
    }
});

// like and dislike comment by commentID
router.post("/like/:commentID", tokenCheck, async (req, res) => {
    if (!req.params.commentID)
    {
        return sendMessage(res, 200, false, "Nem található komment azonosító!");
    }

    const transaction = await db.transaction();

    try
    {
        if (!await Comment.findOne({where: {id: req.params.commentID}}))
        {
            return sendMessage(res, 200, false, "Komment nem található!");
        }

        if (!await CommentLike.findOne({where: {userID: req.user.id, commentID: req.params.commentID}}))
        {
            await Comment.increment('likes', {
                by: 1,
                where: {id: req.params.commentID},
                transaction: transaction
            });

            await CommentLike.create({
                userID: req.user.id,
                commentID: req.params.commentID,
            }, {transaction: transaction});

            await transaction.commit();

            return res.status(200).json({success: true, liked: true});
        }

        await Comment.decrement('likes', {
            by: 1,
            where: {id: req.params.commentID},
            transaction: transaction
        });

        await CommentLike.destroy({where: {
            userID: req.user.id,
            commentID: req.params.commentID
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