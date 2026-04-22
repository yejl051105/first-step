const express = require("express")
const router = express.Router()
const { login } = require("../controller/loginController/loginController.js")

router.post("/", login)

module.exports = router
