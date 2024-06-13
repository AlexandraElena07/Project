const router = require("express").Router();
const countyController = require("../controllers/countyController");
 
router.post('/', countyController.addCounty)
router.get('/', countyController.getCounties)
router.get('/:id', countyController.getCounty)
router.post('/places', countyController.addPlacesToCounty)
router.post('/hotels', countyController.addHotelsToCounty)
router.post('/events', countyController.addEventsToCounty)

module.exports = router;



