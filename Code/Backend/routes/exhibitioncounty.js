const router = require("express").Router();
const exhibitionCountyController = require("../controllers/exibitionCountyController");
const {verifyToken} = require('../middleware/jwt_token')

router.post('/', verifyToken, exhibitionCountyController.addExhibitionCounty)
router.get('/', exhibitionCountyController.getExhibitionsCounty)
router.get('/:id', exhibitionCountyController.getExhibitionCounty)
router.get('/byEvent/:id', exhibitionCountyController.getExhibitionCountyByEvent)


module.exports = router;