var express=require("express");
var router=express.Router();
router.get("/",function (req,res) {
	res.send("用户首页")
});

router.get("/add",function (req,res) {
	res.send("admin user")
});

router.get("/edit",function (req,res) {
	res.send("admin product")
});

router.get("/del",function (req,res) {
	res.send("admin product")
});

//模块化暴露
module.exports=router;