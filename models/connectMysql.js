var mysql = require("mysql");

//建立 con 連線物件，並利用 connet 進行連線
var pool = mysql.createPool({
    host: "localhost",//連線主機
    user: "root",//帳號
    password: "s10355041",//密碼
    database: "collaborative_lesson_study"//教案資料庫
});

var resourcePool = mysql.createPool({
    host: "localhost",//連線主機
    user: "root",//帳號
    password: "s10355041",//密碼
    database: "cls_resource"//資源資料庫
});

module.exports = [pool,resourcePool];