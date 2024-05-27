const router = require("express").Router();
const eventController = require("../controllers/eventController");
const {verifyToken} = require('../middleware/jwt_token')

router.post('/', verifyToken, eventController.addEvent)
router.get('/', eventController.getEvents)
router.get('/:id', eventController.getEvent)
router.get('/byCounty/:id', eventController.getEventsByCounty)
//router.get('/byEvent/:id', eventController.getEventCountyByEvent);

module.exports = router;