var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var memberRouter = require('./routes/member');
var communityRouter = require('./routes/community');
var lessonplanRouter = require('./routes/lessonplan');
var resourceRouter = require('./routes/resourceManager');
var memberManagerRouter = require('./routes/memberManager');
var taskRouter = require('./routes/taskManager');
var activityProcessRouter = require('./routes/activityProcess');

var app = express();
var server = require('http').Server(app);

server.listen(8000,function(){
  console.log("server listening on port 8000");
})
var io = require('socket.io')(server);

io.on('connection', function(socket){

  socket.on('join community',function(data){
    console.log("進入社群"+data);
    var roomName = "community_"+data;
    socket.join(roomName);
    socket.nsp.to(roomName).emit('test','hi');
  })

  socket.on('add node',function(data){
    var roomName = "community_"+data.community_id;
    socket.nsp.to(roomName).emit('update node data',data.nodeData);
  })

  socket.on('add edge',function(data){
    var roomName = "community_"+data.community_id;
    socket.nsp.to(roomName).emit('update edge data',data.edgeData);
  })

  socket.on('drag node',function(data){
    var roomName = "community_"+data.community_id;
    socket.nsp.to(roomName).emit('update drag data',data.nodeData);
  })

  socket.on('revise node',function(data){
    var roomName = "community_"+data.community_id;
    socket.nsp.to(roomName).emit('update node data',data.updateNodeData);
  })

  socket.on('delete file',function(data){
    var roomName = "community_"+data.community_id;
    socket.nsp.to(roomName).emit('update node data',data.updateNodeData);
  })

  socket.on('create activity',function(data){
    var roomName = "community_"+data.community_id;
    socket.nsp.to(roomName).emit('update node data',data.selectData);
  })

  socket.on('delete activity',function(data){
    var roomName = "community_"+data.community_id;
    socket.nsp.to(roomName).emit('update node data',data.nodeData);
  })

  socket.on('create tag',function(data){
    var roomName = "community_"+data.community_id;
    socket.nsp.to(roomName).emit('update tag',data.community_tag);
  })

  socket.on('save convergenceTextarea',function(data){
    var roomName = "community_"+data.community_id;
    socket.nsp.to(roomName).emit('update convergenceData',data);
  })

  socket.on('produce result',function(data){
    var roomName = "community_"+data.community_id;
    socket.nsp.to(roomName).emit('show result',data.saveData);
  })

  socket.on('send message',function(data){
    var roomName = "community_"+data.community_id;
    socket.nsp.to(roomName).emit('update message',data);
  })

  socket.on('create task',function(data){
    var roomName = "community_"+data.community_id;
    socket.nsp.to(roomName).emit('create new task',data.selectData);
  })

  socket.on('edit task',function(data){
    var roomName = "community_"+data.community_id;
    socket.nsp.to(roomName).emit('edit the task',data.selectData);
  })

  socket.on('delete task',function(data){
    var roomName = "community_"+data.community_id;
    socket.nsp.to(roomName).emit('delete the task',data.task_id);
  })

  socket.on('move task',function(data){
    var roomName = "community_"+data.community_id;
    socket.nsp.to(roomName).emit('move the task',data);
  })

});

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
app.use('/community', communityRouter);
app.use('/lessonplan', lessonplanRouter);
app.use('/resourceManager', resourceRouter);
app.use('/memberManager',memberManagerRouter);
app.use('/taskManager',taskRouter);
app.use('/activityProcess',activityProcessRouter);

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
