//安装express，引入express
var express=require("express");
var app=new express();//关键词new 可省略
var admin=require("./routes/admin");
var index=require("./routes/index");

app.use("/",index);
app.use("/admin",admin);

//监听端口
app.listen(3000,"127.0.0.1");