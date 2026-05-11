const express = require('express')
const router = express.Router()
const { getDashboardData } = require('../controller/dashboard.controller')

router.get('/', getDashboardData)

module.exports = router
