var express=require("express");
var router=express.Router();
router.get("/",function (req,res) {
	res.send("index")
});

router.get("/product",function (req,res) {
	res.send("product页面")
});

//模块化暴露
module.exports=router;