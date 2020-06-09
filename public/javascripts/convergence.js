var community_id,community_tag;
var convergence_id,convergence_content,convergence_tag;
var convergence_ref_node = [];
var $convergenceMessageTable;

function ideaListCard(ideaId,ideaTitle,ideaContent,author){
    $("#ideaListCardBody").append('<div class="card idealist">'+
                                        '<div class="card-header form-inline">'+
                                            '<div class="custom-control custom-checkbox">'+
                                                '<input type="checkbox" class="custom-control-input refNodeCheckbox" id="checkRef'+ideaId+'" name="refNodeCheckbox" value="'+ideaId+'" onclick="checkRefNode('+ideaId+')">'+
                                                '<label class="custom-control-label" for="checkRef'+ideaId+'"></label>'+
                                            '</div>'+
                                            '<div class="collapsed" data-toggle="collapse" data-target="#ideaNode'+ideaId+'" style="width:92%">'+ideaTitle+
                                                '<i class="fas fa-chevron-down float-right"></i>'+
                                            '</div>'+
                                        '</div>'+
                                        '<div id="ideaNode'+ideaId+'" class="collapse">'+
                                            '<div class="card-body">'+ideaContent+'</div>'+
                                            '<div class="card-footer text-right">'+
                                                '<small class="text-muted mr-2">建立者:<span class="authorName">'+author+'</span></small>'+
                                                '<input type="button" class="btn btn-info btn-sm" id="refBtn'+ideaId+'" data-ideaid="'+ideaId+'" value="引用至收斂空間" onclick="addRefNode('+ideaId+')">'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>');
}

var socket = io();
$(function(){
    community_id = $("#community_id").text();
    community_tag = $("#community_tag").text().split(",");

    //發送訊息，經過 事件 傳送 object
    socket.emit('join community',community_id);
    socket.on('update convergenceData',function(data){
        var tag = data.tag;
        var updateData = data.updateData;
        if(tag == convergence_tag){
            setConvergenceSpace(updateData)
        }
    })
    socket.on('update message',function(data){
        var tag = data.tag;
        var insertData = data.insertData;
        if(tag == convergence_tag){
            $convergenceMessageTable.bootstrapTable('append',insertData);
        }
    })
    socket.on('update tag',function(data){
        community_tag = data;
    })

    setConvergenceSelect(community_tag);
    convergencesummernoteClass();
    setcommunicateTable();
    clickEvent();

    $("#convergenceSpace *").prop("disabled",true);
    $("#convergenceTextarea").summernote("disable");
    $("#sidebar .list-unstyled").append('<li class="sidebar-menu">'+
                                            '<a href="/lessonplan/idea/'+community_id+'/divergence" aria-expanded="false">'+
                                                '<img src="/images/one.svg" width="25" height="25" class="d-inline-block mr-1">想法發散'+
                                            '</a>'+
                                        '</li>'+
                                        '<li class="sidebar-menu">'+
                                            '<a href="javascript:void(0)" class="onpage disabledNav" aria-expanded="false">'+
                                                '<img src="/images/two.svg" width="25" height="25" class="d-inline-block mr-1">想法收斂'+
                                            '</a>'+
                                        '</li>');
    $("#convergenceTag").change(function(){
        $(".selectNodeTag").attr("disabled",false);
    })

    $('html, body').css('overflowY', 'hidden');
})

//設定選擇收斂想法標籤的select option
function setConvergenceSelect(tagArray){
    tagArray.forEach(function(data){
        $("#convergenceTag").append('<option value="'+data+'">'+data+'</option>')
    })
}

//設定想法列表
function setIdeaList(nodeData){
    if(nodeData.length == 0){
        alert("請先到想法發散區提出想法")
    }
    else{
        nodeData.forEach(function(data){
            var node_id = data.node_id;
            var node_title = data.node_title;
            var idea_content =data.idea_content;
            var member_name = data.member_name;
            ideaListCard(node_id,node_title,idea_content,member_name)
        })
    }
}

//設定收斂空間
function setConvergenceSpace(convergenceData){
    convergenceData = convergenceData[0];
    convergence_id = convergenceData.convergence_id;
    convergence_content = convergenceData.convergence_content;
    var refString = convergenceData.convergence_ref_node;
    if(refString !== ""){
        var ref_node_array = refString.split(',');
        ref_node_array.forEach(function(node_id){
            var $checkbox = $("#checkRef"+node_id)
            $checkbox.prop('checked', true);
            if(!convergence_ref_node.includes(parseInt(node_id))){
                convergence_ref_node.push(parseInt(node_id));
            }
        })
        console.log(convergence_ref_node)
    }
    else{
        $("#convergenceSpace *").prop("disabled",true);
        $("#convergenceTextarea").summernote("disable");
    }
    $("#convergenceTextarea").summernote('code',convergence_content);
    $("#convergenceTextarea").removeClass("editing");
}

//設定收斂空間留言板內容
function setcommunicateTable(){
    $convergenceMessageTable = $("#convergenceMessageTable");
    $convergenceMessageTable.bootstrapTable({
        columns:[
            {title:"留言id",field:"message_id",visible:false,sortable:true},
            {title:"留言內容",field:"message_content"},
            {title:"留言者",field:"member_name",width:80},
            {title:"留言時間",field:"message_time",width:200}
        ],
        theadClasses:'thead-light',
        pageSize: 5,
        pagination:true,
        sortName:"message_id",
        sortOrder:"desc",
        classes:'table table-bordered table-sm'
    })
}

function clickEvent(){
    //送出選擇標籤
    $(".selectNodeTag").click(function(){
        var editing = $("#convergenceTextarea").hasClass("editing");
        //有資料變動
        if(editing == true){
            alert("收斂空間有內容尚未儲存");
        }
        else{
            $("#ideaListCardBody").empty();
            $("#convergenceTextarea").summernote('reset');
            $convergenceMessageTable.bootstrapTable('removeAll');
            $("#convergenceSpace *").prop("disabled",false);
            $("#convergenceTextarea").summernote("enable");
            $(this).attr("disabled",true);
            convergence_ref_node = [];
            convergence_tag = $("#convergenceTag option:selected").val();
            $(".convergenceCard").find("span.cardheaderTagName").text("【"+convergence_tag+"】");
            var data = {
                node_tag:convergence_tag
            }
            $.ajax({
                url: '/lessonplan/idea/'+community_id+'/convergence/selectThisTagNode',
                type: "GET",
                async:false,
                data:data,
                success: function(data){
                    if(data.msg == "no"){
                        window.location = "/member/login";
                    }
                    else{
                        var nodeData = data.nodeData;
                        var convergenceData = data.convergenceData;
                        var messageData = data.messageData;
                        setIdeaList(nodeData);
                        setConvergenceSpace(convergenceData);
                        $convergenceMessageTable.bootstrapTable('load',messageData);
                    }
                },
                error: function(){
                    alert('失敗');
                }
            })
        }
    })

    //儲存按鈕
    $(".saveResults").click(function(){
        convergence_content = $("#convergenceTextarea").summernote('code');

        $("#convergenceTextarea").removeClass("editing")
        var data = {
            convergence_id:convergence_id,
            convergence_content:convergence_content,
            convergence_ref_node:convergence_ref_node.toString()
        }

        var saveResults = ajaxPostData('/lessonplan/idea/'+community_id+'/convergence/saveConvergence',data);
        if(saveResults.msg == "no"){
            window.location = "/member/login";
        }
        else{
            var updateData = saveResults.updateData;
            socket.emit('save convergenceTextarea',{community_id:community_id,updateData:updateData,tag:convergence_tag})
            //alert('儲存成功');
        }

    })

    //產生收斂結果
    $(".createNodeResults").click(function(){
        convergence_content = $("#convergenceTextarea").summernote('code');
        var data = {
            convergence_id:convergence_id,
            convergence_tag:convergence_tag,
            convergence_content:convergence_content,
            convergence_ref_node:convergence_ref_node.toString()
        }

        var createNodeResults = ajaxPostData('/lessonplan/idea/'+community_id+'/convergence/creatConvergenceNode',data);
        if(createNodeResults.msg == "no"){
            window.location = "/member/login";
        }
        else{
            var nodeData = createNodeResults.nodeData;
            var edgeData = createNodeResults.edgeData;
            var saveData = createNodeResults.saveData;
            socket.emit('add node',{community_id:community_id,nodeData:nodeData})
            if(edgeData.length > 0){
                socket.emit('add edge',{community_id:community_id,edgeData:edgeData})
            }
            socket.emit('produce result',{community_id:community_id,saveData:saveData})
            alert("結果產生完成");
            window.location.reload();
        }
    })

    //送出討論留言
    $(".sendMessage").click(function(){
        var send_content = $("#messageContentInput").val();
        var data = {
            convergence_id:convergence_id,
            convergence_tag:convergence_tag,
            message_content:send_content
        }
        var messageResults = ajaxPostData('/lessonplan/idea/'+community_id+'/convergence/sendMessage',data);

        if(messageResults.msg == "no"){
            window.location = "/member/login";
        }
        else{
            $("#messageContentInput").val("");
            var insertData = messageResults.insertData[0];
            socket.emit('send message',{community_id:community_id,insertData:insertData,tag:convergence_tag})
        }
    })

    $(".showalert").click(function(){
        $("#alertConvergenceModal").modal("show");
    })
}

//引用至收斂
function addRefNode(node_id){
    var $btn = $("#refBtn"+node_id)
    var idea_content = $("#ideaNode"+node_id).find(".card-body").html();
    $("#convergenceTextarea").summernote('pasteHTML',idea_content);
}

//勾選要收斂的節點
function checkRefNode(node_id){
    var $checkbox = $("#checkRef"+node_id)
    if($checkbox.is(":checked")){
        if(!convergence_ref_node.includes(node_id)){
            convergence_ref_node.push(node_id);
        }
    }
    else{
        var newArray = [];
        for(i in convergence_ref_node){
            var elem = convergence_ref_node[i]
            if(elem !== node_id){
                newArray.push(elem)
            }
        }
        convergence_ref_node = newArray;
    }
    
    if(convergence_ref_node.length !== 0){
        $("#convergenceSpace *").prop("disabled",false);
        $("#convergenceTextarea").summernote("enable");
    }
    else{
        $("#convergenceSpace *").prop("disabled",true);
        $("#convergenceTextarea").summernote("disable");
    }
    console.log(convergence_ref_node)
}

//想法summernote設定
function convergencesummernoteClass(){
    $('.convergencesummernote').summernote({
        tabsize: 2,
        toolbar: [
                  // [groupName, [list of button]]
                  ['style', ['style']],
                  ['font', ['bold', 'underline', 'clear']],
                  ['color', ['color']],
                  ['para', ['ul', 'ol', 'paragraph']],
                  ['table', ['table']],
                  ['insert', ['link', 'picture', 'video']]
                //   ['view', ['codeview']]
        ],
        minHeight: 180,
        maxHeight: 180,
        placeholder:'請先勾選要收斂的想法',
        disableDragAndDrop: true,
        dialogsInBody: true,
        callbacks:{
            onImageUpload : function(files){
                var formData = new FormData();
                var file_length = files.length;

                for(var i=0;i<file_length;i++){
                    formData.append("imageFile",files[i])
                }
                var id = $(this).attr("id");

                $.ajax({
                    url: "/lessonplan/edit/"+community_id+"/uploadsummernotefile",
                    type: "POST",
                    async:false,
                    data:formData,
                    contentType: false,
                    processData: false,
                    success: function(data){
                        if(data.msg == "no"){
                            window.location = "/member/login";
                        }
                        else if(data.msg =="yes"){
                            var filepath = data.filepath;
                            $.each(filepath,function(i){
                                $("#"+id).summernote('insertImage', filepath[i].url);
                            })
                        }
                    },
                    error: function(){
                        alert('失敗');
                    }
                })
            },
            onChange: function(){
                var id = $(this).attr("id");
                $("#"+id).addClass("editing")
            }
        }
    });
    $(".note-resizebar").hide();
}

function ajaxPostData(url,data){
    var results;
    $.ajax({
        url: url,
        type: "POST",
        async:false,
        data:data,
        success: function(data){
            results = data;
        },
        error: function(){
            alert('失敗');
        }
    })
    return results
}