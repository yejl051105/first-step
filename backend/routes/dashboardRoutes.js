const express = require("express")
const router = express.Router()

const { getDashboardData } = require("../controller/dashboardController/dashboardController")

router.get('/', getDashboardData)

module.exports = router