const router = require("express").Router();
const contactController = require("../controllers/contactController");

router.post('/newcontact', contactController.createContact)

module.exports = router;