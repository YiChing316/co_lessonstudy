var mysql = require("mysql");

//建立 con 連線物件，並利用 connet 進行連線
var pool = mysql.createPool({
    host: "localhost",//連線主機
    user: "root",//帳號
    password: "",//密碼
    database: "collaborative_lesson_study"//教案資料庫
});

module.exports = pool;