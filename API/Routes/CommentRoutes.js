const router = require("express").Router();
const { QueryTypes } = require("sequelize");
const { PostsComment } = require("../Database/Entities/Binders/PostsComment");
const { UsersComment } = require("../Database/Entities/Binders/UsersComment");
const { Comment } = require("../Database/Entities/Main/Comment");
const db = require("../Database/database");
const { sendMessage, tokenCheck } = require("../utils");
const uuid = require("uuid");

// Get all comments under post
router.get("/post/:postID", tokenCheck, async (req, res) => {
    if (!req.params.postID)
    {
        return sendMessage(res, 400, false, "Nem található poszt azonosító!");
    }

    try
    {
        res.status(200).send(await db.query(
            `SELECT comments.id AS commentID, comments.message, users.username FROM comments
            JOIN postscomments ON comments.id = postscomments.commentID
            JOIN posts ON postscomments.postID = posts.id
            LEFT JOIN userscomments ON comments.id = userscomments.commentID
            LEFT JOIN users ON userscomments.userID = users.id
            WHERE posts.id = :postID`, {
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
        return sendMessage(res, 400, false, "Nem található poszt azonosító!");
    }

    if (!req.body.message)
    {
        return sendMessage(res, 400, false, "Hiányzó adatok!");
    }

    const transaction = await db.transaction();
    
    try
    {
        const commentID = uuid.v4();
        await Comment.create({
            id: commentID,
            message: req.body.message,
        }, {transaction: transaction});

        await UsersComment.create({
            userID: req.user.id,
            commentID: commentID
        }, {transaction: transaction});

        await PostsComment.create({
            postID: req.params.postID,
            commentID: commentID
        }, {transaction: transaction});

        await transaction.commit();

        sendMessage(res, 200, true, "Komment létrehozva!");
    }
    catch
    {
        transaction.rollback();

        sendMessage(res, 500, false, "Hiba az adatbázis művelet közben!");
    }
});

// Modify comment by commentID
router.patch("/update/:commentID", tokenCheck, async (req, res) => {
    if (!req.params.commentID)
    {
        return sendMessage(res, 400, false, "Nem található komment azonosító!");
    }

    try
    {
        if (!await UsersComment.findOne({where: {commentID: req.params.commentID, userID: req.user.id}}))
        {
            return sendMessage(res, 400, false, "Komment nem található!");
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
        return sendMessage(res, 400, false, "Nem található komment azonosító!");
    }

    const transaction = await db.transaction();

    try
    {
        if (!await UsersComment.findOne({where: {commentID: req.params.commentID, userID: req.user.id}}))
        {
            return sendMessage(res, 400, false, "Komment nem található!");
        }

        await Comment.destroy({
            where: {id: req.params.commentID}
        }, {transaction: transaction});

        await UsersComment.destroy({
            where: {commentID: req.params.commentID}
        }, {transaction: transaction});

        await PostsComment.destroy({
            where: {commentID: req.params.commentID}
        }, {transaction: transaction});

        await transaction.commit();

        sendMessage(res, 200, true, "Komment törölve!");
    }
    catch
    {
        transaction.rollback();

        sendMessage(res, 500, false, "Hiba az adatbázis művelet közben!");
    }
});


module.exports = router;