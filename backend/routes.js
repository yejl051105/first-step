const express = require("express")
const router = express.Router()

router.get("/",(req,res)=>{
  // res.json({
  //   message:"这是用户路由"
  // })
  // res.send("这是用户路由")
})  

module.exports = router