var nodes = new vis.DataSet();
var edges = new vis.DataSet();

var node;
var edge;

// create a network
var container = document.getElementById('ideanetwork');

// provide the data in the vis format
var nodeData = {
    nodes: nodes,
    edges: edges
};

var nodeOptions = {
    nodes:{
        size:16
    },
    groups:{
        idea:{
            shape: 'image',
            image: '/images/ideanode.svg'
        },
        rise_above:{
            shape: 'image',
            image: '/images/riseabovenode.svg'
        },
        deleteactivity:{
            shape: 'image',
            image: '/images/deleteactivitynode.svg'
        },
        lessonplan:{
            shape: 'image',
            image: '/images/lessonplannode.svg'
        },
        activity:{
            shape: 'image',
            image: '/images/activitynode.svg'
        },
        convergence:{
            shape: 'image',
            image: '/images/convergenceIdea.svg'
        }
    },
    edges:{
        color:{
            color: "rgba(0,0,0,0.2)",
            highlight: "rgba(0,0,0,0.4)"
        },
        arrows:{
            to:{
                enabled: true
            }
        },
        //線的型態，直線或曲線
        smooth:{
            enabled: false
        }
    },
    interaction:{
        //多選
        multiselect: true
    },
    physics:{
        enabled: false
    }
};

var network = new vis.Network(container, nodeData, nodeOptions);

var clickid = [];

function drawNodeNetwork(node) {
    var newNodeArray =[];

    if(node.length > 0){
        $.each(node,function(i,val){
            var oldgroup = val.group;
            var newgroup;
            switch(oldgroup){
                case "lessonplan":
                case "lessonplan_target":
                case "core_competency":
                case "learning_focus":
                case "learning_issue":
                case "lessonplan_studentknowledge":
                case "lessonplan_resource":
                case "lessonplan_design":
                case "twowaytable":
                    newgroup = "lessonplan";
                    break;
                default:
                    newgroup = oldgroup;
            }
            newNodeArray.push({
                id:val.id,
                group:newgroup,
                member_id_member:val.member_id_member,
                member_name:val.member_name,
                node_title:val.node_title,
                node_tag:val.node_tag,
                x:val.x,
                y:val.y,
                node_file_count:val.node_file_count,
                node_revised_count:val.node_revised_count,
                node_read_count:val.node_read_count,
                node_createtime:val.node_createtime
            })
        })
        nodes.update(newNodeArray);
    }
}

function drawEdgeNetwork(edge) {
    if(edge.length > 0){
        edges.update(edge);
    }
}

function clickevent(){
    network.on("click", function(params) {
        params.event = "[click]";
        //nodeid
        clickid = params.nodes;
    });

    network.on("doubleClick", function(params) {
        params.event = "[doubleClick]";
        var community_id = $("#community_id").text();
        var clickid = params.nodes[0];

        if(clickid !== undefined){
            var data = {
                node_id:clickid
            };
            
            //獲得click node的資料
            var clickedNode=nodes.get({
                filter: function(item){
                    return (item.id == clickid);
                }
            });
    
            var node_type = clickedNode[0].group;
    
            switch(node_type){
                case 'rise_above':
                case 'idea':
                    openIdeaNode(community_id,data)
                    break;
                case 'lessonplan':
                    openLessonplanNode(community_id,data)
                    break;
                case 'activity':
                    openActivityNode(community_id,data)
                    break;
                case "deleteactivity":
                    alert("此活動已刪除");
                    break;
                case "convergence":
                    openConvergenceNode(community_id,data)
                    break;
            }
        }
    });

    network.on("oncontext", function(params) {
        params.event = "[rightclick]";
        var rightid = this.getNodeAt(params.pointer.DOM);
        
        if(rightid == undefined){
            clickid = []
        }
        //把右鍵的節點id放入clickid中
        else if(rightid !== undefined && !clickid.includes(rightid)){
            clickid.push(rightid);
        }

        var $trigger = $("#ideanetwork");
        if(clickid.length == 0) {
            $trigger.contextMenu(false);
        }
        else {
            $trigger.contextMenu(true);
        }

        this.redraw();
    });

    network.on("dragEnd", function(params) {
        params.event = "[dragEnd]";
        var drag_array = [];
        var dragid = params.nodes;
        var drag_position = network.getPositions(dragid);
        for(node in drag_position){

            drag_array.push({node_id:node,node_x:drag_position[node].x,node_y:drag_position[node].y})

            var string = JSON.stringify(drag_array);
            var community_id = $("#community_id").text();
            $.ajax({
                url: '/lessonplan/idea/'+community_id+'/divergence/updateNodePosition',
                type: "POST",
                async:false,
                data:{updateData:string},
                success: function(data){
                    if(data.msg == "ok"){
                        var results = data.results;
                        socket.emit('drag node',{community_id:community_id,nodeData:results})
                    }
                    else{
                        window.location = "/member/login";
                    }
                },
                error: function(){
                    alert('失敗');
                }
            })
        }
    });
}

var community_tag;
var socket = io();
$(function(){
    //發送訊息，經過 事件 傳送 object
    socket.emit('join community',$("#community_id").text());
    //接收
    socket.on('test',function(data){
        console.log(data)
    });

    socket.on('update node data',function(data){
        drawNodeNetwork(data);
    })

    socket.on('update edge data',function(data){
        drawEdgeNetwork(data);
    })

    socket.on('update drag data',function(data){
        drawNodeNetwork(data);
    })

    socket.on('update tag',function(data){
        community_tag = data;
    })

    node = JSON.parse($("#nodeData").text());
    edge = JSON.parse($("#edgeData").text());
    community_tag = $("#community_tag").text().split(',');

    drawNodeNetwork(node);
    drawEdgeNetwork(edge);

    clickevent();

    ideaScaffold_Add();
    openIdeaModal();
    setcontextMenu();

    replyIdea();

    // Add the following code if you want the name of the file appear on select
    $(".custom-file-input").on("change", function() {
        var files = [];
        for (var i = 0; i < $(this)[0].files.length; i++) {
            files.push($(this)[0].files[i].name);
        }
        $(this).siblings(".custom-file-label").addClass("selected").html(files.join(', '));
    });

    //畫上Node標題跟創建人姓名
    network.on("beforeDrawing", function (ctx) {
        //畫node被點擊時的背景
        if(clickid.length >0){
            $.each(clickid,function(i,val){
                var id = clickid[i];
                var nodePosition = network.getPositions([id]);
                ctx.strokeStyle = "rgba(220, 217, 204, 0.5)";
                ctx.fillStyle = "rgba(220, 217, 204, 0.5)";
    
                ctx.beginPath();
                //context.arc(x,y,r(半徑),sAngle(起始角),eAngle(結束角),counterclockwise);
                ctx.arc(nodePosition[id].x,nodePosition[id].y,25,0,2 * Math.PI,false);
                ctx.closePath();
    
                ctx.fill();
                ctx.stroke();
            })
        }
        
        nodes.forEach(function(data) {
            var nodeid = data.id;
            var node_title = data.node_title;
            var member_name = data.member_name;
            var node_createtime = data.node_createtime;
            var node_tag = data.node_tag;
            var node_file_count = data.node_file_count;

            if(node_tag.length > 0){
                node_tag = "["+node_tag+"]";
            }

            var titleContent = node_tag+node_title;

            var nodePosition = network.getPositions([nodeid]);
            //將文字寫入對應的node節點
            ctx.font = "bold 16px 微軟正黑體";
            ctx.fillStyle = 'pink';
            var width = ctx.measureText(node_tag).width;
            ctx.fillRect(nodePosition[nodeid].x+30, nodePosition[nodeid].y-26,width,"16");
            ctx.fillStyle = 'black';
            ctx.fillText(titleContent, nodePosition[nodeid].x+30, nodePosition[nodeid].y-10);
            ctx.fillStyle = 'gray';
            if(node_file_count > 0){
                ctx.font='900 12px "Font Awesome 5 Free"';
                ctx.fillText('\uf0c6', nodePosition[nodeid].x+30, nodePosition[nodeid].y+10);
                ctx.font = "12px 微軟正黑體";
                ctx.fillText(member_name, nodePosition[nodeid].x+45, nodePosition[nodeid].y+10);
                ctx.font = "12px 微軟正黑體";
                ctx.fillText(node_createtime, nodePosition[nodeid].x+45, nodePosition[nodeid].y+30);
            }
            else{
                ctx.font = "12px 微軟正黑體";
                ctx.fillText(member_name, nodePosition[nodeid].x+30, nodePosition[nodeid].y+10);
                ctx.font = "12px 微軟正黑體";
                ctx.fillText(node_createtime, nodePosition[nodeid].x+30, nodePosition[nodeid].y+30);
            }
        });
    })

    var community_id = $("#community_id").text();
    $("#sidebar .list-unstyled").append('<li class="sidebar-menu">'+
                                            '<a href="javascript:void(0)" class="onpage disabledNav" aria-expanded="false">'+
                                                '<img src="/images/one.svg" width="25" height="25" class="d-inline-block mr-1">想法發散'+
                                            '</a>'+
                                        '</li>'+
                                        '<li class="sidebar-menu">'+
                                            '<a href="/lessonplan/idea/'+community_id+'/convergence" aria-expanded="false">'+
                                                '<img src="/images/two.svg" width="25" height="25" class="d-inline-block mr-1">想法收斂'+
                                            '</a>'+
                                        '</li>');

    $('html, body').css('overflowY', 'hidden'); 
})

function ajaxGetData(url,data){
    var results;
    $.ajax({
        url: url,
        type: "GET",
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

function ajaxPostFormData(url,formdata){
    var results;
    $.ajax({
        url: url,
        type: "POST",
        async:false,
        data:formdata,
        contentType: false,
        processData: false,
        success: function(data){
            results = data;
        },
        error: function(){
            alert('失敗');
        }
    })
    return results
}

function openIdeaNode(community_id,data){

    var results = ajaxGetData("/lessonplan/idea/"+community_id+"/divergence/openIdea",data);

    if(results.msg == "ok"){
        var authority = results.authority;
        var ideaData = results.ideaData[0];
        var ideaFileData = results.ideaFileData;

        $("#readIdeaModal").modal("show");
        $('#ideaTab a[href="#readmodal"]').tab('show')
        //如果為作者可以修改，其他人只能閱讀
        if(authority == "revise"){
            $('#ideaTab').show(); 
        }
        else{
            $('#ideaTab').hide();
        }
        showReadIdeaContent(ideaData);
        showReadIdeaFile(community_id,ideaFileData);
    }
    else{
        window.location = "/member/login";
    }
}

function openLessonplanNode(community_id,data){
    var results = ajaxGetData("/lessonplan/idea/"+community_id+"/divergence/openLessonplanNode",data);
    if(results.msg == "ok"){
        var selectData = results.selectResults[0];
        var node_title = selectData.node_title;
        var bodyContent;
        $("#lessonplanNodeModal").modal("show");
        $("#lessonplanNodeModalLabel").html(node_title);
        $("#lessonplanNodeModal").find(".readNodeid").text(selectData.id);
        switch (node_title){
            case '教案基本資料':
                bodyContent = '<p>此部分包含了</p>'+
                                '<p><i class="fas fa-dot-circle"></i> 此教案所針對的課程領域、使用版本、學習階段等</p>'+
                                '<p><i class="fas fa-dot-circle"></i> 課綱提供的對應核心素養、學習重點</p>'+
                                '<p><i class="fas fa-dot-circle"></i> 此教案會需要的教學資源及器材</p>';
                break;
            case '學生先備概念':
                bodyContent = '<p>請想想</p>'+
                                '<p><i class="fas fa-dot-circle"></i> 為了達成課程目標，你的學生需要什麼樣的學習經驗？</p>'+
                                '<p><i class="fas fa-dot-circle"></i> 上述的學習體驗需要藉由什麼樣的活動來達成？教師做什麼？學生做什麼？</p>';
                break;
            case '教學設計理念':
                bodyContent = '<p>請想想</p>'+
                                '<p><i class="fas fa-dot-circle"></i> 此教案所使用的教學策略以及要提供給學生什麼樣的教學活動</p>';
                break;
            case '課程學習目標':
                bodyContent = '<p>請想想</p>'+
                                '<p><i class="fas fa-dot-circle"></i> 你的學生原來狀態（能力、知識、態度等）為何？</p>'+
                                '<p><i class="fas fa-dot-circle"></i> 透過這堂課，學生能夠有哪些的成長？</p>';
                break;
        }
        $("#nodeTip").html(bodyContent);
    }
    else{
        window.location = "/member/login";
    }
}

function openActivityNode(community_id,data){
    var results = ajaxGetData("/lessonplan/idea/"+community_id+"/divergence/openActivityNode",data);

    if(results.msg == "no"){
        window.location = "/member/login";
    }
    else{
        var nodeData = results.nodeData[0];
        var node_title = nodeData.node_title;
        var activity_target = nodeData.lessonplan_activity_target;
        var targetArray = activity_target.split(',');
        var bodyContent = '<p>此活動包含的學習目標有</p><div class="activityTargetDiv"></div>'+
                            '<p>此部分須規劃活動內容以及內容其對應的評量</p>'+
                            '<img src="/images/activitytip.png" width="800">';
        $("#lessonplanNodeModal").modal("show");
        $("#lessonplanNodeModalLabel").html(node_title);
        $("#lessonplanNodeModal").find(".readNodeid").text(nodeData.node_id);
        $("#nodeTip").html(bodyContent);

        targetArray.forEach(function(target){
            $("#lessonplanNodeModal .activityTargetDiv").append('<p><i class="fas fa-dot-circle mr-1 text-danger"></i>'+target+'</p>');
        })
        
    }
}

function openConvergenceNode(community_id,data){
    var results = ajaxGetData("/lessonplan/idea/"+community_id+"/divergence/openConvergenceNode",data);

    if(results.msg == "no"){
        window.location = "/member/login";
    }
    else{
        var nodeData = results.nodeData[0];
        var node_title = nodeData.node_title;
        var node_tag = nodeData.node_tag;
        var convergence_content = nodeData.convergence_content;
        var title = '【'+node_tag+'】'+node_title;
        $("#lessonplanNodeModal").modal("show");
        $("#lessonplanNodeModalLabel").html(title);
        $("#lessonplanNodeModal").find(".readNodeid").text(nodeData.node_id);
        $("#nodeTip").html(convergence_content);
    }
}

/**打開 ideatoolbar新增節點 modal ***********************************/
function openIdeaModal(){
    $("#creatIdeaBtn").click(function(){
        $("#createIdeaModelTitle").html('新增想法');
        $("#createIdeaModelTitle").attr("data-nodetype",'idea');
        $("#createIdeaModel").modal("show");
    })

    $('#createIdeaModel').on('show.bs.modal', function () {
        $("#createIdeaModel").find(".ideatag").append('<input type="text" class="form-control" name="tagInputText" id="createIdeaTag">');
        ideasummernoteClass();
        ideatagClass(community_tag);
    })

    $("#creatVoteBtn").click(function(){
        $("#createVoteModel").modal("show");
    })
}

function ideaModalCloseBtn(modalid){
    switch(modalid){
        case "createIdeaModel":
            $("#newIdeaTitle").val("");
            $("#newIdeaContent").summernote("code",'');
            $(".custom-file-label").removeClass("selected").html("請選擇檔案");
            $("#createNewIdeaFile").val("");
            $("#createIdeaModel").find("input[name='tagInputText']").remove();
            $("#createIdeaModel").find(".inputTags-list").remove();
            $("#replyNodeId").text("");
            break;
        case "readIdeaModal":
            $("#reviseIdeaTitle").val("");
            $("#reviseIdeaContent").summernote("code",'');
            $(".custom-file-label").removeClass("selected").html("請選擇檔案");
            $("#reviseIdeaFile").val("");
            $(".reviseIdeaFile").empty();
            $("#readIdeaFileDiv").empty();
            $("#readIdeaModal").find("input[name='tagInputText']").remove();
            $("#readIdeaModal").find(".inputTags-list").remove();
            break;
        case "lessonplanNodeModal":
            $("#nodeTip").empty();
            break;
    } 
}


/**修改/閱讀modal **************************************************/
function showReadIdeaContent(ideaData){

    var node_id = ideaData.node_id;
    var node_title = ideaData.node_title;
    var node_tag;
    var idea_content = ideaData.idea_content;
    var read_count = ideaData.node_read_count;
    var revise_count = ideaData.node_revised_count;

    if(ideaData.node_tag !== ""){
        node_tag = ideaData.node_tag.split(',');
    }
    else{
        node_tag = "";
    }

    changeIdeaTab(node_title);

    $("#readIdeaModal").find(".readNodeid").text(node_id);

    //閱讀頁籤
    $("#readIdeaTag").html('<h4 id="readIdeaTagContent"></h4>')
    if(node_tag.length >0){
        node_tag.map(function(data){
            $("#readIdeaTagContent").append('<span class="badge badge-info mr-2">'+data+'</span>')
        })
    }
    $("#readIdeaModalLabel").html(node_title);
    $(".readCountDiv").html(" "+read_count);
    $("#readIdeaContent").html(idea_content);

    //修改頁籤
    $("#readIdeaModal").find(".ideatag").append('<input type="text" class="form-control" name="tagInputText" id="reviseIdeaTag">');
    ideasummernoteClass();
    if(node_tag == ""){
        ideatagClass(community_tag);
    }else{
        ideatagClass(community_tag,node_tag);
    }
    
    $("#reviseCountDiv").text(revise_count);
    $("#reviseIdeaTitle").val(node_title);
    $("#reviseIdeaContent").summernote('code',idea_content);

}

//想法內file呈現
function showReadIdeaFile(community_id,ideaFileData){
    if(ideaFileData.length > 0){
        var path = '/communityfolder/community_'+community_id+'/communityfile/'
        ideaFileData.map(function(data){
            var file_id = data.community_file_id;
            var file_name = data.community_file_name;
            $("#readIdeaFileDiv").append('<li><a href="'+path+file_name+'" download="'+file_name+'" class="mr-2"><i class="fas fa-file-download"> '+file_name+'</i></a></li>');
            $(".reviseIdeaFile").append('<div class="form-inline mt-2 reviseIdeaFileDiv">'+
                                            '<label>'+file_name+'</label>'+
                                            '<a class="text-danger ml-2 deleteIdeaFile" data-filename="'+file_name+'" data-fileid="'+file_id+'"><i class="fas fa-times"></i></a>'+
                                        '</div>');
        })
        deleteIdeaFile();
    }
}

//顯示閱讀或修改畫面tab
function changeIdeaTab(title){
    $('#ideaTab a').on('shown.bs.tab', function (e) {
        e.target;
        var tab_id = $(this).attr('id');
        if(tab_id == 'read-tab'){
            $("#readIdeaModalLabel").html(title)
        }
        else{
            $("#readIdeaModalLabel").html('修改想法')
        } 
    })
}

//閱讀節點內回覆按鈕
function replyIdea(){
    $(".replyideabtn").click(function(){
        var modalid = $(this).parents(".modal").attr("id");
        var replyNodeId = $("#"+modalid).find(".readNodeid").text();
        var btnAction = $(this).data("type");

        $("#"+modalid).modal("hide");
        ideaModalCloseBtn(modalid);
        $("#createIdeaModel").modal("show");
        $("#replyNodeId").text(replyNodeId)

        if(btnAction == "rise_above"){
            $("#createIdeaModelTitle").attr("data-nodetype",'rise_above');
            $("#createIdeaModelTitle").html('提出昇華的想法');
        }
        else{
            $("#createIdeaModelTitle").attr("data-nodetype",'idea');
            $("#createIdeaModelTitle").html('新增想法');
        }
    })
}



/**Modal內所需 *****************************************************/
function ideaScaffold_Add(){
    $(".ideascaffold").click(function(){
        var scaffoldText = $(this).text();
        var textareaId = $(this).parents(".row").find("textarea").attr("id");
        var string = "<b><font style='background-color: rgb(255, 231, 206);'>"+scaffoldText+"</font></b>";
        $("#"+textareaId).summernote('pasteHTML', string);
        
    })
}

function deleteIdeaFile(){
    var community_id = $("#community_id").text();
    $(".deleteIdeaFile").on('click',function(){
        var node_id = $("#readIdeaNodeid").text();
        var file_id = $(this).data("fileid");
        var filename = $(this).data("filename");

        var data = {
            file_id:file_id,
            filepath:'./public/communityfolder/community_'+community_id+'/communityfile/'+filename,
            node_id:node_id
        }

        $(this).parent().remove()

        $.ajax({
            url: "/lessonplan/idea/"+community_id+"/divergence/deletefile",
            type: "POST",
            async:false,
            data:data,
            success: function(data){
                if(data.msg == "yes"){
                    console.log("已刪除");
                    var updateNodeData = data.results;
                    socket.emit('delete file',{community_id:community_id,updateNodeData:updateNodeData})
                }
                else if(data.msg == "no"){
                    window.location = "/member/login";
                }
            },
            error: function(){
                alert('失敗');
            } 
        })
    })
}

//想法summernote設定
function ideasummernoteClass(){
    $('.ideasummernote').summernote({
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
        width:560,
        minHeight: 250,
        maxHeight: 250,
        disableDragAndDrop: true,
        dialogsInBody: true,
        callbacks:{
            onImageUpload : function(files){
                var community_id = $("#community_id").text();
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
            }
        }
    });
}

//想法tag api設定
function ideatagClass(community_tag,tag){
    
    $('input[name="tagInputText"]').inputTags({
        autocomplete: {
            values: community_tag,
            only: true
        },
        tags:tag,
        max: 1,
        init: function($elem) {
            // console.log('Event called on plugin init', $elem);
        },
        create: function() {
            //console.log('Tag added !');
        }
    });
}

//右鍵選單設定
function setcontextMenu(){
    $.contextMenu({
        selector: '#ideanetwork', 
        callback: function(key, options) {
            var m = "clicked: " + key;
            window.console && console.log(m) || alert(m); 
        },
        items: {
            "replyIdea": {
                name: "回覆一般想法",
                callback: function(itemKey, opt, e) {
                    $("#replyNodeId").text(clickid)
                    $("#createIdeaModelTitle").html('新增想法');
                    $("#createIdeaModelTitle").attr("data-nodetype",'idea');
                    $("#createIdeaModel").modal("show"); 
            }},
            "replyRiseAbove": {
                name: "提出昇華的想法",
                callback: function(itemKey, opt, e) {
                    $("#replyNodeId").text(clickid)
                    $("#createIdeaModelTitle").html('提出昇華的想法');
                    $("#createIdeaModelTitle").attr("data-nodetype",'rise_above');
                    $("#createIdeaModel").modal("show"); 
        }}
        },
        events:{
            //右鍵選單關閉時清空clickid array
            hide: function(opt){
                clickid = [];
            }
        }
    });
}

/**儲存節點 *********************************************************/
function saveNode(modalId){
    var community_id = $("#community_id").text();
    switch(modalId){
        case "createIdeaModel":
            var node_type = $("#createIdeaModelTitle").data('nodetype');
            var node_title = $("#newIdeaTitle").val();
            var replyNodeId = $("#replyNodeId").text();
            var idea_content = $("#newIdeaContent").summernote('code');
            var node_tag = $("input[name='tagInputText']").val();
            var fileData = $("#createNewIdeaFile").prop("files");
            var file_length = fileData.length;

            if( node_title == ""){
                alert("想法標題不可空白!!")
            }
            else{
                var formData = new FormData();
                formData.append("node_type",node_type);
                formData.append("node_title",node_title);
                formData.append("replyNodeId",replyNodeId);
                formData.append("idea_content",idea_content);
                formData.append("node_tag",node_tag);
                formData.append("node_file_count",file_length);

                for(var i=0;i<file_length;i++){
                    formData.append("ideafile",fileData[i])
                }
                
                var createResults =  ajaxPostFormData("/lessonplan/idea/"+community_id+"/divergence/createIdea",formData)

                if(createResults.msg == "no"){
                    window.location = "/member/login";
                }
                else if(createResults.msg =="ok"){
                    ideaModalCloseBtn('createIdeaModel');
                    $("#createIdeaModel").modal("hide");
                    var nodeData = createResults.insertnodeData;
                    var edgeData = createResults.insertedgeData;
                    socket.emit('add node',{community_id:community_id,nodeData:nodeData})
                    if(edgeData.length > 0){
                        socket.emit('add edge',{community_id:community_id,edgeData:edgeData})
                    }
                }
                else if(createResults.msg == "isexist"){
                    alert(createResults.checkResults+"\n已存在相同檔名檔案，請修改檔名後再上傳");
                }

            }
            break;
        case "readIdeaModal":
            var node_id = $("#readIdeaNodeid").text();
            var revise_count = $("#reviseCountDiv").text();
            var revise_node_title = $("#reviseIdeaTitle").val();
            var revise_idea_content = $("#reviseIdeaContent").summernote('code');
            var revise_tagcontent = $("#reviseIdeaTag").val();
            var revise_fileData = $("#reviseIdeaFile").prop("files");
            var fileDiv_length = $(".reviseIdeaFileDiv").length;
            
            var revise_file_length = revise_fileData.length;
            var node_file_count = fileDiv_length+revise_file_length;

            if( revise_node_title == ""){
                alert("想法標題不可空白!!")
            }
            else{
                var reviseformData = new FormData();
                reviseformData.append("revise_node_id",node_id);
                reviseformData.append("revise_count",revise_count);
                reviseformData.append("node_title",revise_node_title);
                reviseformData.append("idea_content",revise_idea_content);
                reviseformData.append("node_tag",revise_tagcontent);
                reviseformData.append("node_file_count",node_file_count);
                for(var s=0;s<revise_file_length;s++){
                    reviseformData.append("ideafile",revise_fileData[s])
                }

                var reviseResults =  ajaxPostFormData("/lessonplan/idea/"+community_id+"/divergence/updateIdea",reviseformData)

                if(reviseResults.msg == "no"){
                    window.location = "/member/login";
                }
                else if(reviseResults.msg =="ok"){
                    ideaModalCloseBtn('readIdeaModal');
                    $("#readIdeaModal").modal("hide");
                    var updateNodeData = reviseResults.updatenodeData;
                    socket.emit('revise node',{community_id:community_id,updateNodeData:updateNodeData})
                }
                else if(reviseResults.msg == "isexist"){
                    alert(reviseResults.checkResults+"\n已存在相同檔名檔案，請修改檔名後再上傳");
                }
            }
            break;
    }
}