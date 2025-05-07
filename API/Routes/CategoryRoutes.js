const router = require("express").Router();
const { sendMessage, tokenCheck, adminCheck } = require("../utils");

const { Category } = require("../Database/Models/Category");


// Get all categories
router.get("/", tokenCheck, async (req, res) => {
    try {
        res.status(200).send(await Category.findAll());
    } catch {
        sendMessage(res, 500, false, "Hiba az adatbázis művelet közben!");
    }
});


// Get category by categoryID
router.get("/:categoryID", tokenCheck, async (req, res) => {
    if (!req.params.categoryID)
    {
        return sendMessage(res, 200, false, "Nem található kategória azonosító!");
    }

    try
    {
        if (!await Category.findOne({where: {id: req.params.categoryID}}))
        {
            return sendMessage(res, 200, false, "Kategória nem található!");
        }
        
        res.status(200).send(await Category.findOne({where: {id: req.params.categoryID}}));
    }
    catch
    {
        sendMessage(res, 500, false, "Hiba az adatbázis művelet közben!");
    }
});

// Create category
router.post("/create", tokenCheck, adminCheck, async (req, res) => {
    if (!req.body.name)
    {
        return sendMessage(res, 200, false, "Hiányzó adatok!");
    }

    try
    {
        if (await Category.findOne({where: {name: req.body.name}}))
        {
            return sendMessage(res, 200, false, "A kategória már létezik!");
        }

        const category = await Category.create({name: req.body.name});

        res.status(200).send({success: true, message: "Kategória létrehozva!", categoryID: category.id});
    }
    catch
    {
        sendMessage(res, 500, false, "Hiba az adatbázis művelet közben!");
    }
});

// Delete category by categoryID
router.delete("/delete/:categoryID", tokenCheck, adminCheck, async (req, res) => {
    if (!req.params.categoryID)
    {
        return sendMessage(res, 200, false, "Nem található kategória azonosító!");
    }

    try
    {
        if (!await Category.findOne({where: {id: req.params.categoryID}}))
        {
            return sendMessage(res, 200, false, "Kategória nem található!");
        }

        await Category.destroy({where: {id: req.params.categoryID}});

        sendMessage(res, 200, true, "Kategória törölve!");
    }
    catch
    {
        sendMessage(res, 500, false, "Hiba az adatbázis művelet közben!");
    }
});


module.exports = router;