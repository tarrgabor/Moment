const router = require("express").Router();
const { QueryTypes, Op } = require("sequelize");
const db = require("../Database/database");
const { sendMessage, tokenCheck } = require("../utils");

const { Comment } = require("../Database/Models/Comment");
const { CommentLike } = require("../Database/Models/CommentLike");
const { Reply } = require("../Database/Models/Reply");

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
        p.id as postID,
        c.id,
        c.message,
        DATE_FORMAT(c.createdAt, '%Y-%m-%d %H:%i:%s') AS createdAt,
        c.likes,
        IF(cl.commentID IS NOT NULL, 1, 0) AS liked,
        IF(c.userID = :userID, 1, 0) as owned,
        (SELECT
			GROUP_CONCAT(
                JSON_OBJECT(
                    "username", ru.username,
                    "profilePicture", ru.profilePicture,
                    "postID", rp.id,
                    "id", rc.id,
                    "message", rc.message,
                    "createdAt", rc.createdAt,
                    "likes", rc.likes,
                    "liked", IF(rl.commentID IS NOT NULL, 1, 0),
                    "owned", IF(rc.userID = :userID, 1, 0)
                )
                ORDER BY rc.createdAt DESC
            )
            FROM replies r
            LEFT JOIN comments rc ON rc.id = r.replyID
            LEFT JOIN posts rp on rp.id = rc.postID
            LEFT JOIN users ru ON rc.userID = ru.id
            LEFT JOIN commentlikes rl ON rc.id = rl.commentID AND rl.userID = :userID
            WHERE r.commentID = c.id
        ) AS "replies"
        FROM comments c
        LEFT JOIN posts p on p.id = c.postID
        LEFT JOIN users u ON c.userID = u.id
        LEFT JOIN commentlikes cl ON c.id = cl.commentID AND cl.userID = :userID
        WHERE p.id = :postID AND c.id NOT IN (SELECT replyID FROM replies)
        ORDER BY c.createdAt DESC`

        const comments = await db.query(query, {
            replacements: {postID: req.params.postID, userID: req.user.id},
            type: QueryTypes.SELECT
        });

        comments.forEach(comment => {
            if (comment.replies)
            {
                comment.replies = JSON.parse(`[${comment.replies}]`); 
                
                comment.replies.forEach(reply => {
                    reply.likes = parseInt(reply.likes);
                    reply.liked = parseInt(reply.liked);
                    reply.owned = parseInt(reply.owned);
                })
            }
        });

        res.status(200).send(comments);
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
        const comment = await Comment.create({
            userID: req.user.id,
            postID: req.params.postID,
            message: req.body.message,
        });

        res.status(200).send({
            success: true,
            message: "Komment létrehozva",
            comment: {
                id: comment.id,
                likes: comment.likes,
                createdAt: comment.createdAt,
                postID: comment.postID,
                message: comment.message,
                owned: 1
            }
        });
    }
    catch
    {
        sendMessage(res, 500, false, "Hiba az adatbázis művelet közben!");
    }
});

// Create reply to comment under post
router.post("/reply/:postID/:commentID", tokenCheck, async (req, res) => {
    if (!req.params.postID || !req.params.commentID)
    {
        return sendMessage(res, 200, false, "Nem találhatók az azonosítók!");
    }

    const transaction = await db.transaction();

    if (!req.body.message)
    {
        return sendMessage(res, 200, false, "Hiányzó adatok!");
    }
    
    try
    {
        const comment = await Comment.create({
            userID: req.user.id,
            postID: req.params.postID,
            message: req.body.message,
        }, {transaction: transaction});

        await Reply.create({
            commentID: req.params.commentID,
            replyID: comment.id
        }, {transaction: transaction});

        await transaction.commit();

        res.status(200).send({
            success: true,
            message: "Válasz létrehozva",
            comment: {
                id: comment.id,
                likes: comment.likes,
                createdAt: comment.createdAt,
                postID: comment.postID,
                message: comment.message,
                owned: 1
            }
        });
    }
    catch
    {
        transaction.rollback();

        sendMessage(res, 500, false, "Válasz hozzáadása sikertelen!");
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
        const comment = await Comment.findOne({where: {id: req.params.commentID}});

        if (!comment)
        {
            return sendMessage(res, 200, false, "Komment nem található!");
        }

        if (comment.userID == req.user.id || req.user.role == "admin")
        {
            await Comment.update(
                {message: req.body.message},
                {where: {id: req.params.commentID}}
            );
    
            return sendMessage(res, 200, true, "Komment módosítva!");
        }

        sendMessage(res, 200, false, "Nincs jogosultságod ehhez!");
    }
    catch
    {
        sendMessage(res, 500, false, "Komment módosítás sikertelen!");
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
        const comment = await Comment.findOne({where: {id: req.params.commentID}});

        if (!comment)
        {
            return sendMessage(res, 200, false, "Komment nem található!");
        }

        if (comment.userID == req.user.id || req.user.role == "admin")
        {
            const replies = await Reply.findAll({
                where: {commentID: req.params.commentID},
                transaction: transaction
            })
    
            await CommentLike.destroy({
                where: {[Op.or]: [
                    {commentID: req.params.commentID},
                    {commentID: {[Op.in]: replies.map(reply => reply.commentID)}}
                ]},
                transaction: transaction
            });
    
            await Reply.destroy({
                where: {commentID: req.params.commentID},
                transaction: transaction
            });
    
            await Comment.destroy({
                where: {[Op.or]: [
                    {id: req.params.commentID},
                    {id: {[Op.in]: replies.map(reply => reply.replyID)}}
                ]},
                transaction: transaction
            });
    
            await transaction.commit();
    
            return sendMessage(res, 200, true, "Komment törölve!");
        }

        transaction.rollback();
        
        sendMessage(res, 200, false, "Nincs jogosultságod ehhez!");
    }
    catch
    {
        transaction.rollback();

        sendMessage(res, 500, false, "Komment törlése sikertelen!");
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