//安装express，引入express
var express=require("express");
var md5=require("md5-node");//md5密码加密
var app=new express();//关键词new 可省略

//安装ejs模板引擎,安装以后可直接使用,默认找views目录
app.set("view engine","ejs");//使用ejs模板引擎

//配置public目录为我们的静态资源目录
app.use(express.static("public"));
app.use("/upload",express.static("upload"))

// //获取form表单数据模块 body-parser 无法获取图片
// //下面为固定写法
// var bodyParser=require("body-parser");
// //设置body-parser中间件
// app.use(bodyParser.urlencoded({extended:false}));
// app.use(bodyParser.json());

//使用multiparty模块获取form表单数据，包含图片
var multiparty=require("multiparty");

var fs=require("fs");

//数据库操作模块
var Db=require("./modules/db");
// //数据库操作 安装mongodb模块
// const MongoClient = require('mongodb').MongoClient;
// const dbUrl="mongodb://localhost:27017/productmanage";

//session模块用于后台保存用户登陆信息
var session = require('express-session');
//配置中间件
app.use(session({
	secret: 'keyboard cat',//加密格式
	resave: false,
	saveUninitialized: true,
	cookie: {
		maxAge:1000*60*30
	},
	rolling:true
}))

//自定中间件  判断登陆状态
app.use(function (req,res,next) {
	if(req.url=="/login"||req.url=="/doLogin"){
		next()
	}else {
		if(req.session.userinfo&&req.session.userinfo.username!=""){
			app.locals['userinfo']=req.session.userinfo;
			next()
		}else {
			res.redirect("/login")
		}
	}
})

//ejs中设置全局数据 所有页面均可使用
// app.locals['userinof']="1111"

app.get("/",function (req,res) {
	res.send("index");
});

//定义登陆路由
app.get("/login",function (req,res) {
	// res.send("login");
	res.render("login");
});

//获取登陆提交数据
app.post("/doLogin",function (req,res) {
	//获取post提交数据
	var form = new multiparty.Form();
	form.uploadDir='upload'   //上传图片保存的地址     目录必须存在

	form.parse(req, function(err, fields, files) {
		if(err){
			console.info(err);
			return;
		}
		var username=fields.username[0];
		var password=md5(fields.password[0]);
		Db.find("user",{username,password},function (err,data) {
			if(data.length>0){
				// console.info("登陆成功");
				//登陆成功跳转商品页面并保存用户信息
				req.session.userinfo=data[0];
				res.redirect("/product");
			}else {
				// console.info("登陆失败");
				res.send("<script>alert('登陆失败');location.href='/login'</script>")
			};
		})
	})


	// //连接数据库，查询数据库
	// MongoClient.connect(dbUrl,function (err,db) {
	// 	if(err){
	// 		console.info(err);
	// 		return;
	// 	};
	// 	// var result=db.collection("user").find();mongodb 3版本以下写法
	// 	//mongodb 3版本以上写法
	// 	const mydb = db.db('productmanage');
	// 	//查询数据
	// 	var result = mydb.collection("user").find({username,password});
	//
	// 	//以前版本写法
	// 	// var list=[];
	// 	// result.forEach(function (err,doc) {
	// 	// 	if(err){
	// 	// 		console.info(err);
	// 	// 		return
	// 	// 	}else{
	// 	// 		if(doc!=null){
	// 	// 			list.push[doc]
	// 	// 		}else {
	// 	// 			console.info(list);
	// 	// 			db.close();
	// 	// 		}
	// 	// 	}
	// 	// })
	//
	// 	//遍历数据写法
	// 	result.toArray(function (err,data) {
	// 		// console.info(data);
	// 		if(data.length>0){
	// 			// console.info("登陆成功");
	// 			//登陆成功跳转商品页面并保存用户信息
	// 			req.session.userinfo=data[0];
	// 			res.redirect("/product");
	// 		}else {
	// 			// console.info("登陆失败");
	// 			res.send("<script>alert('登陆失败');location.href='/login'</script>")
	// 		};
	// 		db.close();
	// 	})
	// })
});

//定义商品路由
app.get("/product",function (req,res) {
	// res.send("product");
	Db.find("product",{},function (err,data) {
		res.render("product",{
			list:data
		});
	})
	// MongoClient.connect(dbUrl,function (err,db) {
	// 	if(err){
	// 		console.info(err);
	// 		return
	// 	};
	// 	//mongodb 3版本以上写法
	// 	const mydb = db.db('productmanage');
	// 	var result= mydb.collection("product").find();
	// 	result.toArray(function (err,data) {
	// 		if(err){
	// 			console.info(err);
	// 			return;
	// 		}
	// 		db.close();
	// 		// console.info(data);
	// 		res.render("product",{
	// 			list:data
	// 		});
	// 	})
	// })

});

//定义增加商品路由
app.get("/addProduct",function (req,res) {
	// res.send("addProduct");
	res.render("addProduct");//显示增加商品的页面
});

//获取表单提交数据及post过来的图片
app.post("/doAddProduct",function (req,res) {
	// res.send("addProduct");
	var form = new multiparty.Form();
	form.uploadDir="upload";//上传图片保存的地址 目录把必须存在 须在页面表单处设置enctype="multipart/form-data"
	form.parse(req, function(err, fields, files) {
		// console.info(fields);//获取表单的数据
		// console.info(files);//图片上传成功返回的信息
		var title=fields.title[0];
		var price=fields.price[0];
		var fee=fields.fee[0];
		var description=fields.description[0];
		var pic=files.pic[0].path;
		// console.info(pic);
		Db.insert("product",{title,price,fee,description,pic},function (err,data) {
			if(err){
				console.info(err);
				return;
			};
			res.redirect("/product")
		})
	});
});


//修改商品信息路由
app.post("/doEditProduct",function (req,res) {
	var form = new multiparty.Form();
	form.uploadDir="upload";//上传图片保存的地址 目录把必须存在 须在页面表单处设置enctype="multipart/form-data"
	form.parse(req, function(err, fields, files) {
		// console.info(fields);//获取表单的数据
		// console.info(files);//图片上传成功返回的信息
		var _id=fields._id[0];
		var title=fields.title[0];
		var price=fields.price[0];
		var fee=fields.fee[0];
		var description=fields.description[0];

		var originalFilename=files.pic[0].originalFilename;
		var pic=files.pic[0].path;
		if(originalFilename){//修改图片时
			var setData={title,price,fee,description,pic};
		}else {//未修改图片时
			var setData={title,price,fee,description};
			//删除生成得临时图片
			fs.unlink(pic,function () {
				
			})
		};
		// console.info(new Db.ObjectID(_id),setData);

		Db.updateOne("product",{"_id":new Db.ObjectID(_id)},setData,function (err,data) {
			if(err){
				console.info(err);
				return;
			};
			res.redirect("/product")
		})
	});
});

//定义修改商品路由
app.get("/editProduct",function (req,res) {
	// res.send("editProduct");
	//获取get传值
	var id = req.query.id;
	//直接查询_id是无法查询到的，格式不一样，需对_id做处理
	Db.find("product",{"_id":new Db.ObjectID(id)},function (err,data) {
		res.render("editProduct",{
			list:data[0]
		})
	})
});

//定义删除商品路由
app.get("/delProduct",function (req,res) {
	var id=req.query.id;

	Db.find("product",{"_id":new Db.ObjectID(id)},function (err,data) {
		if(data.length>0){
			var pic=data[0].pic;
			Db.deleteOne("product",{"_id":new Db.ObjectID(id)},function (err,data) {
				if(err){
					console.info(err);
					return
				}else {
					fs.unlink(pic,function () {

					})
					res.redirect("/product")
				}
			})
		}else {
			// console.info("登陆失败");
			res.send("<script>alert('删除失败');location.href='/product'</script>")
		};
	})

});

//定义退出路由 销毁session
app.get("/loginOut",function (req,res) {
	req.session.destroy(function (err) {
		if(err){
			console.info(err);
		}else {
			res.redirect("/login")
		}
	})
});


//监听端口
app.listen(3000,"127.0.0.1");