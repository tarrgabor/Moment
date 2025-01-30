const router = require("express").Router();
const db = require("../Database/database");
const { QueryTypes } = require("sequelize");
const uuid = require("uuid");
const { User } = require("../Database/Entities/Main/User");
const { Post } = require("../Database/Entities/Main/Post");
const { UsersPost } = require("../Database/Entities/Binders/UsersPost");

// Get all posts
router.get("/", async (req, res) => {
    try
    {
        res.status(200).send(await Post.findAll());
    }
    catch
    {
        res.send("Hiba az adatbázis művelet közben!");
    }
})

// Create a post
router.post("/", async (req, res) => {
    if (!req.body.userID)
    {
        res.status(400).send("Nem található felhasználó azonosító!");
        return;
    }

    if (!req.body.title || !req.body.description || !req.body.visible)
    {
        res.status(400).send("Hiányzó adatok!");
        return;
    }

    try
    {
        const postID = uuid.v4();
        await db.query(`INSERT INTO posts VALUES ('${postID}', ?, ?, ?, '0')`, {
            replacements: [req.body.title, req.body.description, req.body.visible],
            type: QueryTypes.INSERT
        }).then(async () => {
            await db.query(`INSERT INTO usersposts VALUES ('${uuid.v4()}', ?, '${postID}')`, {
                replacements: [req.body.userID],
                type: QueryTypes.INSERT
            });
        });

        res.send("Poszt létrehozva");
    }
    catch
    {
        res.send("Hiba az adatbázis művelet közben!");
    }
})


// Get everything related to UsersPosts table --- might be moved to an other file (most likely)
router.get("/usersPosts", async (req, res) => {
    try
    {
        res.send(await UsersPost.findAll({
            include: [
                {model: User,
                    attributes: {exclude: "password"}
                },
                {model: Post}
            ],
            attributes: {
                exclude: ["userID", "postID"]
            }
        }));
    }
    catch
    {
        res.send("Hiba az adatbázis művelet közben!");
    }
})

module.exports = router;