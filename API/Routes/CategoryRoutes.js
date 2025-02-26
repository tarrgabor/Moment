const router = require("express").Router();
const { Category } = require("../Database/Entities/Main/Category");
const { sendMessage, tokenCheck } = require("../utils");

// Get all categories
router.get("/", tokenCheck, async (req, res) => {
    try
    {
        res.status(200).send(await Category.findAll());
    }
    catch
    {
        sendMessage(res, 500, false, "Hiba az adatbázis művelet közben!");
    }
});

// Get category by categoryID
router.get("/:categoryID", tokenCheck, async (req, res) => {
    if (!req.params.categoryID)
    {
        return sendMessage(res, 400, false, "Nem található kategória azonosító!");
    }

    try
    {
        if (!await Category.findOne({where: {id: req.params.categoryID}}))
        {
            return sendMessage(res, 400, false, "Kategória nem található!");
        }
        
        res.status(200).send(await Category.findOne({where: {id: req.params.categoryID}}));
    }
    catch
    {
        sendMessage(res, 500, false, "Hiba az adatbázis művelet közben!");
    }
});

// Create category
router.post("/create", tokenCheck, async (req, res) => {
    if (!req.body.name)
    {
        return sendMessage(res, 400, false, "Hiányzó adatok!");
    }

    try
    {
        if (await Category.findOne({where: {name: req.body.name}}))
        {
            return sendMessage(res, 400, false, "A kategória már létezik!");
        }

        await Category.create({name: req.body.name});

        sendMessage(res, 200, true, "Kategória létrehozva!");
    }
    catch
    {
        sendMessage(res, 500, false, "Hiba az adatbázis művelet közben!");
    }
});

// Modify category by categoryID
router.patch("/update/:categoryID", tokenCheck, async (req, res) => {
    if (!req.params.categoryID)
    {
        return sendMessage(res, 400, false, "Nem található kategória azonosító!");
    }

    if (!req.body.name)
    {
        return sendMessage(res, 400, false, "Hiányzó adatok!");
    }

    try
    {
        if (!await Category.findOne({where: {id: req.params.categoryID}}))
        {
            return sendMessage(res, 400, false, "Kategória nem található!");
        }

        if (await Category.findOne({where: {name: req.body.name}}))
        {
            return sendMessage(res, 400, false, "A kategória már létezik!");
        }

        await Category.update(
            {name: req.body.name},
            {where: {id: req.params.categoryID}}
        );

        sendMessage(res, 200, true, "Kategória módosítva!");
    }
    catch
    {
        sendMessage(res, 500, false, "Hiba az adatbázis művelet közben!");
    }
});

// Delete category by categoryID
router.delete("/delete/:categoryID", tokenCheck, async (req, res) => {
    if (!req.params.categoryID)
    {
        return sendMessage(res, 400, false, "Nem található kategória azonosító!");
    }

    try
    {
        if (!await Category.findOne({where: {id: req.params.categoryID}}))
        {
            return sendMessage(res, 400, false, "Kategória nem található!");
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