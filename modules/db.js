//数据库操作 安装mongodb模块
const MongoClient = require('mongodb').MongoClient;
const dbUrl="mongodb://localhost:27017/productmanage";
var ObjectID=require("mongodb").ObjectID;

function __connectDb(callback) {
	MongoClient.connect(dbUrl,function (err,db) {
		if (err) {
			console.info(err);
			return;
		};
		callback(err,db);
	})
}

//数据库查找

exports.find=function (collectionName,json,callback) {
	__connectDb(function (err,db) {
		const mydb = db.db('productmanage');
		//查询数据
		var result = mydb.collection(collectionName).find(json);
		result.toArray(function (err,data) {
			callback(err,data);//拿到数据执行回调函数
			db.close();
		})
	})
}

//数据库增加数据
exports.insert=function (collectionName,json,callback) {
	__connectDb(function (err,db) {
		const mydb = db.db('productmanage');
		//查询数据
		mydb.collection(collectionName).insertOne(json,function (err,data) {
			callback(err,data);//拿到数据执行回调函数
			db.close();
		});
	})
}

//数据库修改数据
exports.updateOne=function (collectionName,json1,json2,callback) {
	__connectDb(function (err,db) {
		const mydb = db.db('productmanage');
		//查询数据
		mydb.collection(collectionName).updateOne(json1,{$set:json2},function (err,data) {
			callback(err,data);//拿到数据执行回调函数
			db.close();
		});
	})
}

//数据库删除数据
exports.deleteOne=function (collectionName,json,callback) {
	__connectDb(function (err,db) {
		const mydb = db.db('productmanage');
		//查询数据
		mydb.collection(collectionName).deleteOne(json,function (err,data) {
			callback(err,data);//拿到数据执行回调函数
			db.close();
		});
	})
}

//暴露ObjectID
exports.ObjectID=ObjectID;

