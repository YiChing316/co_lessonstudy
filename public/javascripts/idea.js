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
                    newgroup = "vote";
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
        params.event = "[click]";
        //nodeid
        var clickid = params.nodes;
        network.off("beforeDrawing");
        addNodeContent();
        if(clickid.length > 0){
            drawClickBackground(clickid);
        }
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
                    console.log(clickedNode)
                    break;
                case 'activity':
                    console.log(clickedNode)
                    break;
                case 'vote':
                    console.log(clickedNode)
                    break;
            }
        }
    });
}

$(function(){

    drawNetwork();
    ideaScaffold_Add();
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
    var url = "/lessonplan/idea/"+community_id+"/openIdea";
    var results = ajaxGetData(url,data);

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
    
}

/**打開 ideatoolbar新增節點 modal ***********************************/
function openIdeaModal(){
    $("#creatIdeaBtn").click(function(){
        $("#createIdeaModel").modal("show");
        $("#createIdeaModel").find(".ideatag").append('<input type="text" class="form-control" name="tagInputText" id="createIdeaTag">');
        ideasummernoteClass();
        ideatagClass();
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
    } 
}

/**修改/閱讀modal **************************************************/
function showReadIdeaContent(ideaData){

    var node_id = ideaData.node_id;
    var node_title = ideaData.node_title;
    var node_tag = ideaData.node_tag.split(',');
    var idea_content = ideaData.idea_content;
    var read_count = ideaData.node_read_count;
    var revise_count = ideaData.node_revised_count;

    changeIdeaTab(node_title);

    $("#readIdeaModal").find("#readIdeaNodeid").text(node_id);

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
    ideatagClass(node_tag);

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
        var file_id = $(this).data("fileid");
        var filename = $(this).data("filename");

        var data = {
            file_id:file_id,
            filepath:'./public/communityfolder/community_'+community_id+'/communityfile/'+filename
        }

        $(this).parent().remove()

        $.ajax({
            url: "/lessonplan/idea/"+community_id+"/deletefile",
            type: "POST",
            async:false,
            data:data,
            success: function(data){
                if(data.msg == "yes"){
                    console.log("已刪除");
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

//想法tag api設定
function ideatagClass(tag){
    
    $('input[name="tagInputText"]').inputTags({
        autocomplete: {
            values: ['教案基本資料', '課程學習目標', '學生先備概念', '核心素養', '學習重點','議題融入','教學資源及器材','教學設計理念','活動與評量設計'],
            only: true
        },
        tags:tag,
        max: 3,
        init: function($elem) {
            // console.log('Event called on plugin init', $elem);
        },
        create: function() {
            //console.log('Tag added !');
        }
    });
}

/**儲存節點 *********************************************************/
function saveNode(modalId){
    var community_id = $("#community_id").text();
    switch(modalId){
        case "createIdeaModel":
            var node_title = $("#newIdeaTitle").val();
            var idea_content = $("#newIdeaContent").summernote('code');
            var node_tag = $("input[name='tagInputText']").val();
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
                
                var createResults =  ajaxPostFormData("/lessonplan/idea/"+community_id+"/createIdea",formData)

                if(createResults.msg == "no"){
                    window.location = "/member/login";
                }
                else if(createResults.msg =="ok"){
                    ideaModalCloseBtn('createIdeaModel');
                    $("#createIdeaModel").modal("hide");
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
            var revise_file_length = revise_fileData.length;

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
                for(var s=0;s<revise_file_length;s++){
                    reviseformData.append("ideafile",revise_fileData[s])
                }

                var reviseResults =  ajaxPostFormData("/lessonplan/idea/"+community_id+"/updateIdea",reviseformData)

                if(reviseResults.msg == "no"){
                    window.location = "/member/login";
                }
                else if(reviseResults.msg =="ok"){
                    ideaModalCloseBtn('readIdeaModal');
                    $("#readIdeaModal").modal("hide");
                }
                else if(reviseResults.msg == "isexist"){
                    alert(reviseResults.checkResults+"\n已存在相同檔名檔案，請修改檔名後再上傳");
                }
            }
            break;
    }
}