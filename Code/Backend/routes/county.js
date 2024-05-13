const router = require("express").Router();
const countyController = require("../controllers/countyController");

router.post('/newcounty', countyController.addCounty)
router.get('/getcounty', countyController.getCounties)

module.exports = router;