const router = require("express").Router();
const hotelController = require("../controllers/hotelController");
const {verifyToken} = require('../middleware/jwt_token')

router.post('/', verifyToken, hotelController.addHotels)
router.post('/addReview/:id', verifyToken, hotelController.addReview);
router.get('/topHotels', hotelController.getTopHotels)
router.get('/', hotelController.getHotels)
router.get('/:id', hotelController.getHotel)
router.get('/byCounty/:id', hotelController.getHotelsByCounty)

module.exports = router;