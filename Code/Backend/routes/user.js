const router = require("express").Router();
const userController = require('../controllers/userController')
const {verifyToken} = require('../middleware/jwt_token')

router.delete('/', verifyToken, userController.deleteUser)
router.get('/', verifyToken, userController.getUser)
router.post('/addToFavorites', verifyToken, userController.addToFavorites)
router.get('/favorites', verifyToken, userController.getFavorites)
router.post('/removeFromFavorites', verifyToken, userController.removeFromFavorites)
 
module.exports = router;


