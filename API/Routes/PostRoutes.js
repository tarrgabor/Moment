const router = require("express").Router();
require("dotenv").config();
const db = require("../Database/database");
const { QueryTypes, Op } = require("sequelize");
const multer  = require('multer')
const { sendMessage, tokenCheck, formatFileName } = require("../utils");
const cloudinary = require("cloudinary").v2;

const { Post } = require("../Database/Entities/Main/Post");
const { Comment } = require("../Database/Entities/Main/Comment");
const { Image } = require("../Database/Entities/Main/Image");
const { Report } = require("../Database/Entities/Main/Report");

const { UserPost } = require("../Database/Entities/Binders/UserPost");
const { PostCategory } = require("../Database/Entities/Binders/PostCategory");
const { PostLike } = require("../Database/Entities/Binders/PostLike");
const { PostImage } = require("../Database/Entities/Binders/PostImage");
const { PostComment } = require("../Database/Entities/Binders/PostComment");
const { PostReport } = require("../Database/Entities/Binders/PostReport");
const { UserComment } = require("../Database/Entities/Binders/UserComment");

cloudinary.config({ 
    cloud_name: 'dntjplkcp',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = multer({ storage: multer.memoryStorage() });

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
        i.path as 'image',
        p.likes,
        DATE_FORMAT(p.createdAt, '%Y-%m-%d %H:%i:%s') AS createdAt,
        IF(pl.postID IS NOT NULL, 1, 0) AS liked
    FROM posts p
    LEFT JOIN postcategories pc ON p.id = pc.postID
    LEFT JOIN categories c ON c.id = pc.categoryID
    LEFT JOIN postimages pi ON p.id = pi.postID
    LEFT JOIN images i ON i.id = pi.imageID
    LEFT JOIN postlikes pl ON p.id = pl.postID AND pl.userID = '${req.user.id}'
    LEFT JOIN userposts up ON p.id = up.postID
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
router.post("/create", tokenCheck, upload.single('file'), async (req, res) => {
    if (!req.body.title || !req.body.description || !req.body.visible || !req.body.categoryID || !req.file)
    {
        return sendMessage(res, 400, false, "Hiányzó adatok!");
    }

    const transaction = await db.transaction();

    try
    {
        const post = await Post.create({
            title: req.body.title,
            description: req.body.description,
            visible: req.body.visible
        }, {transaction: transaction});

        await UserPost.create({
            userID: req.user.id,
            postID: post.id
        }, {transaction: transaction});

        await PostCategory.create({
            postID: post.id,
            categoryID: req.body.categoryID
        }, {transaction: transaction});

        cloudinary.uploader.upload_stream({
            
            public_id: formatFileName(req.file.originalname),
            resource_type: "image"
        }, async (error, uploadResults) => {
            if (error) return new Error("Kép feltöltés sikertelen!");
            const image = await Image.create({
                path: cloudinary.url(uploadResults.public_id, {
                    transformation: [
                        {
                            quality: "auto",
                            fetch_format: "auto"
                        }
                    ],
                })
            }, {transaction: transaction});

            await PostImage.create({
                postID: post.id,
                imageID: image.id
            }, {transaction: transaction});

            await transaction.commit();
        }).end(req.file.buffer)

        sendMessage(res, 200, true, "Poszt létrehozva!");
    }
    catch
    {
        transaction.rollback()

        sendMessage(res, 500, false, "Poszt létrehozása sikertelen!");
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
        if (await UserPost.findOne({where: {userID: req.user.id, postID: req.params.postID}}) == null)
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

        await PostCategory.update({
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

        sendMessage(res, 500, false, "Poszt frissítése sikertelen!");
    }
})

// Delete post by postID
router.delete("/delete/:postID", tokenCheck, async (req, res) => {
    if (!req.params.postID)
    {
        return sendMessage(res, 400, false, "Nem található poszt azonosító!");
    }

    const transaction = await db.transaction();

    try
    {
        if (await UserPost.findOne({where: {userID: req.user.id, postID: req.params.postID}}) == null)
        {
            return sendMessage(res, 400, false, "Poszt nem található!");
        }

        await UserPost.destroy({
            where: {postID: req.params.postID},
            transaction: transaction
        });

        await PostCategory.destroy({
            where: {postID: req.params.postID},
            transaction: transaction
        });

        await PostImage.destroy({
            where: {postID: req.params.postID},
            transaction: transaction
        });

        const relatedComments = await PostComment.findAll({
            where: {postID: req.params.postID},
            include: [
              {
                model: Comment,
                attributes: ['id'],
              }
            ],
            transaction: transaction
        });

        const commentIDs = relatedComments.map((pc) => pc.Comment.id);

        await PostComment.destroy({
            where: {postID: req.params.postID},
            transaction: transaction
        });

        const relatedReports = await PostReport.findAll({
            where: {postID: req.params.postID},
            include: [
              {
                model: Report,
                attributes: ['id'],
              }
            ],
            transaction: transaction
        });

        const reportIDs = relatedReports.map((pc) => pc.Report.id);

        await PostReport.destroy({
            where: {postID: req.params.postID},
            transaction: transaction
        });

        await PostLike.destroy({
            where: {postID: req.params.postID},
            transaction: transaction
        });

        await UserComment.destroy({
            where: {commentID: {[Op.in]: commentIDs}},
            transaction: transaction
        })

        await Comment.destroy({
            where: {id: {[Op.in]: commentIDs}},
            transaction: transaction
        })

        await Report.destroy({
            where: {id: {[Op.in]: reportIDs}},
            transaction: transaction
        })

        await Post.destroy({
            where: {id: req.params.postID},
            transaction: transaction
        });
        
        await transaction.commit();

        sendMessage(res, 200, true, "Poszt törölve!");
    }
    catch (err)
    {
        transaction.rollback();

        sendMessage(res, 500, false, "Poszt törlése sikertelen!" + err);
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