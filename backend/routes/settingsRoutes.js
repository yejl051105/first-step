const express = require('express')
const router = express.Router()
const { setNewSettings, getSettings } = require("../controller/settingsController/settingsController")

router.get('/', getSettings)
router.post('/', setNewSettings)

module.exports = router