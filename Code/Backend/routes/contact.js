const router = require("express").Router();
const contactController = require("../controllers/contactController");
const {verifyToken} = require('../middleware/jwt_token')

router.post('/newcontact', verifyToken,  contactController.createContact)
router.get('/contacts', contactController.getContact)

module.exports = router;


