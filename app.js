var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var memberRouter = require('./routes/member');
var dashboardRouter = require('./routes/dashboard');
var lessonplanRouter = require('./routes/lessonplan');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//session
var session = require('express-session');
app.use(session({
  secret: 'wenzi', // 建議使用 128 個字元的隨機字串
  cookie: { maxAge: 60*60*1000 }, // 設定時間
  resave : false,
  saveUninitialized : true
}));


app.use('/', indexRouter);
app.use('/member', memberRouter);
app.use('/dashboard', dashboardRouter);
app.use('/lessonplan', lessonplanRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
