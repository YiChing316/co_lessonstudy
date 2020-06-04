var community_id,communityMemberData,taskData;

function taskCard(taskbodyId,taskId,task_content,task_member_name,task_time){
  $("#"+taskbodyId).append('<div class="card mb-3 task" id="taskCard_'+taskId+'">'+
                              '<div class="card-body taskContent">'+task_content+'</div>'+
                              '<div class="card-footer">'+
                                  '<div class="float-right" data-taskid="'+taskId+'">'+
                                      '<span class="mr-2 taskMemberName">'+task_member_name+'</span>'+
                                      '<span class="taskTime">'+task_time+'</span>'+
                                      '<a class="ml-1 text-primary edittask" data-toggle="modal" data-target="#taskModal"><i class="fas fa-pen"></i></a>'+
                                      '<a class="ml-1 text-danger deletetask" data-toggle="modal" data-target="#deletetaskModal"><i class="far fa-trash-alt"></i></a>'+
                                  '</div>'+
                              '</div>'+
                            '</div>');
  dragandDrop();
}

//設定負責人選單
function setMemberOption(){
  for(i in communityMemberData){
    var data = communityMemberData[i];
    var member_id = data.member_id_member;
    var member_name = data.member_name;
    $("#taskMemberSelect").append('<option value="'+member_name+'" data-memberid="'+member_id+'">'+member_name+'</option>');
  }
}

//放入新卡片
function setTaskCard(taskData){
  if(taskData.length !== 0){
    taskData.forEach(function(data){
      var task_id = data.task_id;
      var task_content = data.task_content;
      var task_member_name = data.task_member_name;
      var task_status = data.task_status;
      var task_time = data.task_time;
      taskCard(task_status,task_id,task_content,task_member_name,task_time)
    })
    clickEvent();
  }
}

//更新現有卡片
function resetTaskCard(taskData){
  if(taskData.length !== 0){
    taskData.forEach(function(data){
      var task_id = data.task_id;
      var task_content = data.task_content;
      var task_member_name = data.task_member_name;
      var task_status = data.task_status;
      var task_time = data.task_time;
      $("#taskCard_"+task_id).find(".taskContent").text(task_content);
      $("#taskCard_"+task_id).find(".taskMemberName").text(task_member_name);
      $("#taskCard_"+task_id).find(".taskTime").text(task_time);
    })
    clickEvent();
  }
}

var socket = io();
$(function(){
    community_id = $("#community_id").text();
    communityMemberData = JSON.parse($("#communityMemberData").text());
    taskData = JSON.parse($("#taskData").text());

    socket.emit('join community',$("#community_id").text());

    socket.on('create new task',function(data){
      setTaskCard(data)
    });

    socket.on('edit the task',function(data){
      resetTaskCard(data)
    });

    socket.on('delete the task',function(data){
      $("#taskCard_"+data).remove();
    });

    socket.on('move the task',function(data){
      var id = data.task_id;
      var updateData = data.updateData;
      $("#taskCard_"+id).remove();
      setTaskCard(updateData)
    });

    setMemberOption();
    setTaskCard(taskData);

    $("#taskModal").on('hidden.bs.modal', function () {
      $(this).find("textarea").val("");
      $(this).find("p").text("");
      $(this).find('select').prop('selectedIndex',0);
    })

    $(".addtaskBtn").click(function(){
      $("#taskModalLabel").text("新增任務");
    })
})

//刪除卡片
function deleteTask(){
  var deleteTaskId = $("#deleteTaskId").text();
  
  var data = {task_id:deleteTaskId}
  $.ajax({
    url: '/taskManager/'+community_id+'/deleteTask',
    type: "POST",
    async:false,
    data:data,
    success: function(data){
        if(data.msg == "no"){
          window.location = "/member/login";
        }
        else{
          socket.emit('delete task',{community_id:community_id,task_id:deleteTaskId});
        }
    },
    error: function(){
        alert('失敗');
    }
  })
}

//新增、修改卡片
function saveTask(){
  var task_id = $("#editTaskId").text();
  var task_content = $("#taskContentTextarea").val();
  var task_member_name = $("#taskMemberSelect option:selected").val();
  var task_member_id = $("#taskMemberSelect option:selected").data("memberid");

  var data = {
    task_id:task_id,
    task_content:task_content,
    task_member_id:task_member_id,
    task_member_name:task_member_name
  }

  console.log(data)

  $.ajax({
    url: '/taskManager/'+community_id+'/saveTask',
    type: "POST",
    async:false,
    data:data,
    success: function(data){
        if(data.msg == "no"){
          window.location = "/member/login";
        }
        else{
          var selectData = data.selectData;

          if(task_id == ""){
            socket.emit('create task',{community_id:community_id,selectData:selectData});
          }
          else{
            socket.emit('edit task',{community_id:community_id,selectData:selectData});
          }
        }
    },
    error: function(){
        alert('失敗');
    }
  })
}

//拖拉功能
function dragandDrop(){
  $(".task").draggable({
    revert: "invalid",
    start: function() {
      $(this).addClass("selected");
    },
    stop: function() {
      $(this).removeClass("selected")
      var cardId = $(this).attr('id');
      var task_id = cardId.split('_')[1];
      // console.log($(this).index())
      var status = $(this).parent().attr("id");
      var data = {
        task_id:task_id,
        task_status:status
      }
      $.ajax({
        url: '/taskManager/'+community_id+'/updateStatus',
        type: "POST",
        async:false,
        data:data,
        success: function(data){
            if(data.msg == "no"){
              window.location = "/member/login";
            }
            else{
              var updateData = data.updateData;
              socket.emit('move task',{community_id:community_id,task_id:task_id,updateData:updateData});
              // resetTaskCard(updateData)
            }
        },
        error: function(){
            alert('失敗');
        }
      })
    }
  });
  
  $(".taskcolumn").droppable({
    accept: ".task",
    drop: function(event, ui) {
      ui.draggable
        .css("left", "0")
        .css("top", "0")
        .appendTo($(this).find(".taskbody"))
    }
  });
}

//taskcard內的click事件
function clickEvent(){
  $(".edittask").click(function(){
    var $task = $(this).parents(".task");
    var taskContent = $task.find(".taskContent").text();
    var taskMemberName = $task.find(".taskMemberName").text();
    var task_id = $(this).parent().data("taskid");
    $("#editTaskId").text(task_id)
    $("#taskModalLabel").text("修改任務");
    $("#taskContentTextarea").val(taskContent);
    $("#taskMemberSelect").val(taskMemberName);
  })

  $(".deletetask").click(function(){
    var task_id = $(this).parent().data("taskid")
    $("#deleteTaskId").text(task_id)
  })
}