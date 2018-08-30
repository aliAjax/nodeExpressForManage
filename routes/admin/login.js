var express=require("express");
var router=express.Router();
router.get("/",function (req,res) {
	res.send("admin index")
});

router.get("/doLogin",function (req,res) {
	res.send("admin user")
});

router.get("/product",function (req,res) {
	res.send("admin product")
});

//模块化暴露
module.exports=router;