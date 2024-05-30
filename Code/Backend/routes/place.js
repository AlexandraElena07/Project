const router = require("express").Router();
const placeController = require("../controllers/placeController");
const {verifyToken} = require('../middleware/jwt_token')

router.post('/', verifyToken, placeController.addPlaces)
router.post('/addReview/:id', verifyToken, placeController.addReview);
router.get('/topPlaces', placeController.getTopPlaces)
router.get('/', placeController.getPlaces)
router.get('/:id', placeController.getPlace)
router.get('/byCounty/:id', placeController.getPlacesByCounty)

module.exports = router;