const router = require("express").Router();
const eventCountyController = require("../controllers/eventCountyControllers");
const {verifyToken} = require('../middleware/jwt_token')

router.post('/', verifyToken, eventCountyController.addEventCounty)
router.get('/', eventCountyController.getEventsCounty)
router.get('/:id', eventCountyController.getEventCounty)
router.get('/byEvent/:id', eventCountyController.getEventCountyByCounty)


module.exports = router;