var mysql = require("mysql");

//建立 con 連線物件，並利用 connet 進行連線
var resourcepool = mysql.createPool({
    host: "localhost",//連線主機
    user: "root",//帳號
    password: "s10355041",//密碼
    database: "cls_resource"//課綱因材網等資源資料庫
});

module.exports = resourcepool;