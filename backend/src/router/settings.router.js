const express = require('express')
const router = express.Router()
const { getSettings, setNewSettings } = require('../controller/settings.controller')

router.get('/', getSettings)
router.post('/', setNewSettings)

module.exports = router
