var express=require("express");
var router=express.Router();

//后台的路由  所有后台处理都要经过这里

var login=require("./admin/login");
var product=require("./admin/product");
var user=require("./admin/user");

//配置路由
router.use("/login",login);
router.use("/product",product);
router.use("/user",user);


//模块化暴露
module.exports=router;