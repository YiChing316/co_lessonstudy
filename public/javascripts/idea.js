var nodes = new vis.DataSet();
var edges = new vis.DataSet();

// var node = [
//     {id: 1, group:'idea', node_content: "Node 1", node_text: '111'},
//     {id: 2, group:'rise_above', node_content: "Node 2", node_text: '111'},
//     {id: 3, group:'vote', node_content: "Node 3", node_text: '111'},
//     {id: 4, group:'idea', node_content: "Node 4", node_text: '111'},
//     {id: 5, group:'vote', node_content: "Node 5", node_text: '111'}
// ];

// var edge = [
//     {from: 1, to: 3},
//     {from: 1, to: 2},
//     {from: 2, to: 4},
//     {from: 2, to: 5}
// ]
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
        vote:{
            shape: 'image',
            image: '/images/vote.svg'
        },
        lessonplan:{
            shape: 'image',
            image: '/images/lessonplannode.svg'
        },
        activity:{
            shape: 'image',
            image: '/images/activitynode.svg'
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

//畫上Node標題跟創建人姓名
function addNodeContent(){
    network.on("beforeDrawing", function (ctx) {
        for(i=0;i<node.length;i++){
            var nodeid = node[i].id;
            var node_title = node[i].node_title;
            var member_name = node[i].member_name;
            var node_createtime = node[i].node_createtime;
            var nodePosition = network.getPositions([nodeid]);
            //將文字寫入對應的node節點
            ctx.font = "bold 16px 微軟正黑體";
            ctx.fillStyle = 'black';
            ctx.fillText(node_title, nodePosition[nodeid].x+30, nodePosition[nodeid].y-10);
            ctx.font = "12px 微軟正黑體";
            ctx.fillStyle = 'gray';
            ctx.fillText(member_name, nodePosition[nodeid].x+30, nodePosition[nodeid].y+10);
            ctx.font = "12px 微軟正黑體";
            ctx.fillText(node_createtime, nodePosition[nodeid].x+30, nodePosition[nodeid].y+30);
        }
    })
}

//畫node被點擊時的背景
function drawClickBackground(nodeIdArray){
    network.on("beforeDrawing", function(ctx) {
        $.each(nodeIdArray,function(i,val){
            var id = nodeIdArray[i];
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
    });
  }

function drawNetwork() {

    node = JSON.parse($("#nodeData").text());
    edge = JSON.parse($("#edgeData").text());
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
                    newgroup = "lessonplan";
                    break;
                case "activity":
                    newgroup = "activity";
                    break;
                case "idea":
                    newgroup = "idea";
                    break;
                case "rise_above":
                    newgroup = "rise_above";
                    break;
                case "vote":
                    newgroup = "newgroup";
                    break;
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
                node_revised_count:val.node_revised_count,
                node_read_count:val.node_read_count,
                node_createtime:val.node_createtime
            })
        })
        nodes.update(newNodeArray);

        if(edge.length > 0){
            edges.update(edge);
        }
    }
    addNodeContent();
}

function clickevent(){
    network.on("click", function(params) {
        //nodeid
        var clickid = params.nodes;
        network.off("beforeDrawing");
        addNodeContent();
        if(clickid.length > 0){
            drawClickBackground(clickid);
        }
    });

    network.on("doubleClick", function(params) {
        var clickid = params.nodes[0];
        $("#readIdeaModal").modal("show");
        $("#readIdeaModal").find("#readIdeaNodeid").text(clickid)
        // params.event = "[original event]";
        // document.getElementById("eventSpan").innerHTML =
        //   "<h2>doubleClick event:</h2>" + JSON.stringify(params, null, 4);
    });
}

$(function(){

    drawNetwork();
    clickevent();
    openIdeaModal();

    
    // Add the following code if you want the name of the file appear on select
    $(".custom-file-input").on("change", function() {
        var files = [];
        for (var i = 0; i < $(this)[0].files.length; i++) {
            files.push($(this)[0].files[i].name);
        }
        // $(this).next('.custom-file-label').html(files.join(', '));
        // var fileName = $(this).val().split("\\").pop();
        $(this).siblings(".custom-file-label").addClass("selected").html(files.join(', '));
    });

})

function openIdeaModal(){
    $("#creatIdeaBtn").click(function(){
        $("#createIdeaModel").modal("show");
        $("#createIdeaModel").find(".ideatag").append('<input type="text" class="form-control" name="tagInputText" id="createIdeaTag">');
        ideasummernoteClass();
        ideatagClass();
        ideaScaffold_Add();
    })

    $("#creatVoteBtn").click(function(){
        $("#createVoteModel").modal("show");
    })
}

function ideaScaffold_Add(){
    $(".ideascaffold").click(function(){
        var scaffoldText = $(this).text();
        var textareaId = $(this).parents(".row").find("textarea").attr("id");
        var string = "<b><font style='background-color: rgb(255, 231, 206);'>"+scaffoldText+"</font></b>";
        $("#"+textareaId).summernote('pasteHTML', string);
        
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
            break;
    } 
}

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
                  ['insert', ['link', 'picture', 'video']],
                  ['view', ['codeview']]
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

function ideatagClass(){
    
    $('input[name="tagInputText"]').inputTags({
        autocomplete: {
            values: ['教案基本資料', '課程學習目標', '學生先備概念', '核心素養', '學習重點','議題融入','教學資源及器材','教學設計理念','活動與評量設計'],
            only: true
        },
        max: 3,
        init: function($elem) {
            console.log('Event called on plugin init', $elem);
        },
        create: function() {
            //console.log('Tag added !');
        }
    });
}

function saveNode(modalId){
    switch(modalId){
        case "createIdeaModel":
            var community_id = $("#community_id").text();
            var node_title = $("#newIdeaTitle").val();
            var idea_content = $("#newIdeaContent").summernote('code');
            var tagcontent = $("input[name='tagInputText']").val();
            var node_tagarray = [];
            node_tagarray.push(tagcontent)
            var node_tag = node_tagarray.toString();
            var fileData = $("#createNewIdeaFile").prop("files");
            var file_length = fileData.length;

            if( node_title == ""){
                alert("想法標題不可空白!!")
            }
            else{
                var formData = new FormData();
                formData.append("node_title",node_title);
                formData.append("idea_content",idea_content);
                formData.append("node_tag",node_tag);
                for(var i=0;i<file_length;i++){
                    formData.append("ideafile",fileData[i])
                }

                $.ajax({
                    url: "/lessonplan/idea/"+community_id+"/createIdea",
                    type: "POST",
                    async:false,
                    data:formData,
                    contentType: false,
                    processData: false,
                    success: function(data){
                        if(data.msg == "no"){
                            window.location = "/member/login";
                        }
                        else if(data.msg =="ok"){
                            ideaModalCloseBtn('createIdeaModel');
                            $("#createIdeaModel").modal("hide");
                        }
                        else if(data.msg == "isexist"){
                            alert(data.checkResults+"\n已存在相同檔名檔案，請修改檔名後再上傳");
                        }
                    },
                    error: function(){
                        alert('失敗');
                    }
                })
            }
            break;
    }
}