const router = require("express").Router();
const authController = require("../controllers/authController");

router.post('/register', authController.createUser)
router.post('/login', authController.loginUser)
router.post('/logout', authController.logoutUser)
router.post('/update', authController.updateUser)
router.post('/saveTheme', authController.saveTheme)
router.get('/check',authController.checkAuth)

module.exports = router;