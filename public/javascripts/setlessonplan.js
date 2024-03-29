/*將教案實作的內容以模組方式append出來 */
var lessonplan_Component = [
    {name:'教案簡介',id:'lessonplan_intro',type:'textarea',parentDiv:'lessonplan'},
    {name:'單元名稱',id:'lessonplan_unit_name',type:'text',parentDiv:'lessonplan'},
    {name:'課程領域',id:'lessonplan_field',type:'select',parentDiv:'lessonplan'},
    {name:'使用版本',id:'lessonplan_version',type:'select',parentDiv:'lessonplan'},
    {name:'學習階段',id:'lessonplan_grade',type:'select',parentDiv:'lessonplan'},
    {name:'授課時間',id:'lessonplan_time',type:'other',parentDiv:'lessonplan'}
];

var lessonplanbasic_Component = [
    {name:'核心素養',id:'cirn_form1'},
    {name:'學習重點',id:'learning_focus'},
    {name:'議題融入',id:'lessonplan_issue'},
    {name:'教學資源及器材',id:'lessonplan_resource'}
];

//會使用到編輯器的位置
var lessonplanstage_Component = [
    {id:'lessonplan_studentknowledge',createDiv:'lessonplan_studentknowledgeTextarea'},
    {id:'lessonplan_resource',createDiv:'lessonplan_resourceTextarea'},
    {id:'lessonplan_design',createDiv:'lessonplan_designTextarea'}
];

var threeselect_Component = [
    {labelname:'',firstselid:'fieldcontent_field_sel',secondselid:'core_competency_dimesion_sel',threeselid:'core_competency_item_sel',bodyname:'core_competency_body',parentDiv:'cirn_form1',onclickfunction:'addcore_competency()'},
    {labelname:'學習表現',firstselid:'performancefocus_item',secondselid:'performancefocus_childitem',threeselid:'performancefocus_content',bodyname:'performancefocus_body',parentDiv:'learning_focus',onclickfunction:'addlearning_performence()'},
    {labelname:'學習內容',firstselid:'contentfocus_item',secondselid:'contentfocus_childitem',threeselid:'contentfocus_content',bodyname:'contentfocus_body',parentDiv:'learning_focus',onclickfunction:'addlearning_content()'},
    {labelname:'',firstselid:'issue_name',secondselid:'issue_learning_theme',threeselid:'issue_content',bodyname:'issue_body',parentDiv:'lessonplan_issue',onclickfunction:'addissue()'}
];


/*****************內容元件 *****************************************************************************/
function textareaDiv(componentname,componentid,parentDiv){
    $('#'+parentDiv).append('<div class="form-group row">'+
                                '<label class="control-label col-sm-2">'+componentname+'</label>'+
                                '<div class="col-sm-10">'+
                                '<textarea id="'+componentid+'" class="form-control" rows="10"></textarea>'+
                                '</div>'+
                            '</div>');
};

function textDiv(componentname,componentid,parentDiv){
    $('#'+parentDiv).append('<div class="form-group row">'+
                                '<label class="control-label col-sm-2">'+componentname+'</label>'+
                                '<div class="col-sm-10">'+
                                '<input id="'+componentid+'" class="form-control">'+
                                '</div>'+
                            '</div>');
};

function selectDiv(componentname,componentid,parentDiv){
    $('#'+parentDiv).append('<div class="form-group row">'+
                                '<label class="control-label col-sm-2">'+componentname+'</label>'+
                                '<div class="col-sm-10">'+
                                '<select id="'+componentid+'" class="form-control"></select>'+
                                '</div>'+
                            '</div>');
};

function buttonDiv(parentDiv){
    var divid = "'"+parentDiv+"'";
    $('#'+parentDiv).append('<div class="row">'+
                                '<div class="btn-bg">'+
                                    '<div class="bt-group float-right" style="padding-right:15px">'+
                                        '<input type="button" class="btn btn-primary mt-2" value="儲存" onclick="saveLessonplanData('+divid+')">'+
                                    '</div>'+
                                '</div>'+
                            '</div>');
};

function threeselecDiv(labelname,firstselid,secondselid,threeselid,bodyname,parentDiv,onclickfunction){
    $('#'+parentDiv).append('<div class="form-group">'+
                                '<label class="control-label">'+labelname+'</label>'+
                                '<div class="row">'+
                                    '<div class="col-sm-4 nopadding-right">'+
                                    '<select class="form-control" id="'+firstselid+'"></select>'+
                                    '</div>'+
                                    '<div class="col-sm-7 nopadding-right">'+
                                    '<select class="form-control" id="'+secondselid+'"></select>'+
                                    '</div>'+
                                '</div>'+
                                '<div class="row my-2">'+
                                    '<div class="col-sm-11 nopadding-right">'+
                                    '<select class="form-control" id="'+threeselid+'"></select>'+
                                    '</div>'+
                                    '<div class="col nopadding-right">'+
                                    '<input type="button" class="btn btn-outline-info" value="加入" onclick="'+onclickfunction+'">'+
                                    '</div>'+
                                '</div>'+
                                '<div class="cirn pt-2" id="'+bodyname+'"></div>'+
                            '</div>');
}

function ideaListCard(divId,ideaId,ideaTitle,ideaContent){
    $("#"+divId).append('<div class="card idealist mb-1">'+
                            '<p class="card-header collapsed bg-white" data-toggle="collapse" data-target="#ideaNode'+ideaId+'">'+ideaTitle+'<i class="fas fa-chevron-down float-right"></i></p>'+
                            '<div id="ideaNode'+ideaId+'" class="collapse">'+
                                '<div class="card-body">'+ideaContent+'</div>'+
                            '</div>'+
                        '</div>');
}

/*****************append元件 *****************************************************************************/
var basicData;
var lessonplanActivityProcessData;

//放置在教案基本資料內的div
function setLessonplanBasicData(){
    $("#lessonplan_basicdata").append("<div id='lessonplan'></div>");
    //議題融入內容暫時不放
    // $("#lessonplan_basicdata").append('<span>此教案是否需要進行議題融入？</span>'+
    //                                     '<input type="checkbox" data-toggle="toggle" id="toggle-demo" data-size="sm">');
    lessonplanbasic_Component.map(function(data){
        $("#lessonplan_basicdata").append("<div class='basic_body'>"+
                                            "<hr><h5 data-toggle='collapse' data-target='#"+data.id+"'><i class='far fa-plus-square mr-1' id='"+data.id+"icon'></i><b>"+data.name+"</b><small class='text-muted'>目前只提供自然科資料</small></h5>"+
                                            "<h6 class='card-subtitle mb-2 text-danger'>(請先完成領域、版本以及學習階段的設定)</h6>"+
                                            "<div class='collapse' id='"+data.id+"'></div>"+
                                        "</div>");
    })
    $("#lessonplan_issue").parent().hide();
}
//放入lessonplan div
function lessonplan_Map(){
    if(basicData.length !== 0){
        var lessonplan_intro = basicData.lessonplan_intro;
        var lessonplan_unit_name = basicData.lessonplan_unit_name;
        var lessonplan_field = basicData.lessonplan_field;
        var lessonplan_version = basicData.lessonplan_version;
        var lessonplan_grade = basicData.lessonplan_grade;
        var lessonplan_time = basicData.lessonplan_time.split(',');
        var lessonplan_time_class = lessonplan_time[0];
        var lessonplan_time_minutes = lessonplan_time[1];
    }
    
    lessonplan_Component.map(function(data){
        if(data.type == 'textarea'){
            textareaDiv(data.name,data.id,data.parentDiv);
            $("#"+data.id).val(lessonplan_intro);
        }
        else if(data.type == "text"){
            textDiv(data.name,data.id,data.parentDiv);
            $("#"+data.id).val(lessonplan_unit_name);
        }
        else if(data.type == 'select'){
            if(data.id == 'lessonplan_field'){
                var fieldArray = ['國語','英語','自然','數學'];
                $('#'+data.parentDiv).append('<div class="form-group row">'+
                                            '<label class="control-label col-sm-2">'+data.name+'</label>'+
                                            '<div class="col-sm-10">'+
                                                '<div id="'+data.id+'" class="form-check form-check-inline"></div>'+
                                            '</div>'+
                                        '</div>');
                $.each(fieldArray, function(i, val) {
                    $('#'+data.id).append($('<div class="custom-control custom-checkbox mr-4">'+
                                                    '<input type="checkbox" class="custom-control-input" id="'+ fieldArray[i]+'" name="fieldbox" value="'+fieldArray[i]+'">'+
                                                    '<label class="custom-control-label" for="'+ fieldArray[i] +'">'+ fieldArray[i] +'</label>'+
                                                '</div>'
                                                ));
                });
                if( lessonplan_field !== undefined && lessonplan_field !== ""){
                    var fieldData = lessonplan_field.split(',');
                    for(var i=0;i<fieldData.length;i++){
                        $("#"+data.id+" input[value="+fieldData[i]+"]").prop('checked', true);
                    }
                }
            }
            else if(data.id == 'lessonplan_version'){
                selectDiv(data.name,data.id,data.parentDiv);
                $('#'+data.id).append('<option value="" disabled selected>請選擇使用版本</option>'+
                                        '<option value="康軒">康軒</option>'+
                                        '<option value="南一">南一</option>'+
                                        '<option value="翰林">翰林</option>'+
                                        '<option value="自編">自編</option>');
                if(lessonplan_version !== ""){
                    $("#"+data.id+" option[value="+lessonplan_version+"]").attr("selected","selected");
                }
            }
            else if(data.id == 'lessonplan_grade'){
                selectDiv(data.name,data.id,data.parentDiv);
                $('#'+data.id).append('<option value="" disabled selected>請選擇學習階段</option>'+
                                        '<option value="3年級">3年級</option>'+
                                        '<option value="4年級">4年級</option>'+
                                        '<option value="5年級">5年級</option>'+
                                        '<option value="6年級">6年級</option>'+
                                        '<option value="國中">第四學習階段(國中)</option>'+
                                        '<option value="高中">第五學習階段(高中)</option>');
                if(lessonplan_grade !== ""){
                    $("#"+data.id+" option[value="+lessonplan_grade+"]").attr("selected","selected");
                }
            }
        }
        else{
            $('#lessonplan').append('<div class="form-group row">'+
                                        '<label class="control-label col-sm-2">'+data.name+'</label>'+
                                        '<div class="col-sm"><input type="number" min="1" id="'+data.id+'_class" class="form-control" value="'+lessonplan_time_class+'"></div>'+
                                        '<div class="col-sm-2"><label>節課，共</label></div>'+
                                        '<div class="col-sm"><input type="number" min="1" id="'+data.id+'_minutes" class="form-control" value="'+lessonplan_time_minutes+'"></div>'+
                                        '<div class="col-sm-1"><label>分鐘</label></div>'+ 
                                    '</div>');
        }
    })
    buttonDiv('lessonplan');
};

//放入三層選單(核心素養、學習重點、議題融入)
function threeselect_Map(){
    //三層select中有學習表現,學習內容須包含在核心素養內的學習重點，故將cirn_Set()放於此;議題融入為其餘大標
    //總綱核心素養，增加領域選擇
    threeselect_Component.map(function(data){
        threeselecDiv(data.labelname,data.firstselid,data.secondselid,data.threeselid,data.bodyname,data.parentDiv,data.onclickfunction);
    })
    buttonDiv('cirn_form1');
    buttonDiv('learning_focus');
    buttonDiv('lessonplan_issue');
}

//將需要編輯器的stage放入(資源及器材、先備知識、設計理念)
function lessonplanstage_Map(){
    lessonplanstage_Component.map(function(data){
        $('#'+data.id).append('<div id="'+data.createDiv+'" class="summernote"></div>');
        buttonDiv(data.id);
        summernoteClass();
    })
}

//放入學習目標
function lessonplantarget_Append(){
    $("#lessonplan_target").append('<button id="addtargetlist" class="btn btn-outline-info" onclick="addlessonplantargetlist()"><i class="fas fa-plus"></i> 新增學習目標</button>'+
                                    '<table class="table table-bordered w-auto mt-3" id="lessonplantargetTable">'+
                                    '<thead class="thead-light">'+
                                        '<tr>'+
                                        '<th scope="col">#</th>'+
                                        '<th scope="col" class="col-sm-6">學習目標內容</th>'+
                                        '<th scope="col"></th>'+
                                        '</tr>'+
                                    '</thead>'+
                                    '<tbody id="lessonplantargetTbody"></tbody>'+
                                    '</table>');
    buttonDiv('lessonplan_target');
}

//新增學習目標列表
function addlessonplantargetlist(){
    //尋找最後一個tr的標題th數字為多少
    var listnum = $("#lessonplantargetTbody").find("tr").last().children("th").text();
    listnum++;
    $("#lessonplantargetTbody").append('<tr>'+
                                            '<th scope="row">'+listnum+'</th>'+
                                            '<td><input type="text" class="form-control" name="lessonplantargercontent" placeholder="請輸入學習目標" data-updateaction="new" data-olddata=""></td>'+
                                            '<td class="lasttd"><button class="btn btn-danger btnDelete"><i class="far fa-trash-alt"></i></button></td>'+
                                        '</tr>');
    deletetableTr('#lessonplantargetTbody');
}

var targetContent = [];

//呈現儲存於lessonplan_stage資料庫中資料
function showLessonplanStageSaveData(){
    lessonplanStageData = $("#lessonplanStageData").text();
    if( lessonplanStageData.length !== 0){
        lessonplanStageData = JSON.parse(lessonplanStageData);

        for(var i=0;i<lessonplanStageData.length;i++){
            var stageData = lessonplanStageData[i];
            var lessonplan_stage_type = stageData.lessonplan_stage_type;
            var lessonplan_stage_content = stageData.lessonplan_stage_content;

            switch(lessonplan_stage_type){
                case 'lessonplan_target':
                    targetContent = lessonplan_stage_content.split(',');
                    
                    for(var s=0;s<targetContent.length;s++){
                        var listnum = s+1;
                        var value = targetContent[s];

                        $("#lessonplantargetTbody").append('<tr>'+
                                                                '<th scope="row">'+listnum+'</th>'+
                                                                '<td><input type="text" class="form-control" name="lessonplantargercontent" placeholder="請輸入學習目標" value="'+value+'" data-updateaction="update" data-olddata="'+value+'"></td>'+
                                                                '<td class="lasttd"><button class="btn btn-danger btnDelete"><i class="far fa-trash-alt"></i></button></td>'+
                                                            '</tr>');
                    }
                    deletetableTr('#lessonplantargetTbody');

                    break;
                case 'core_competency':
                    var core_content = JSON.parse(lessonplan_stage_content);
                    
                    for(var z=0;z<core_content.length;z++){
                        var item_text = core_content[z].item_text;
                        var dimesion_description = core_content[z].dimesion_description;
                        var field_title = core_content[z].field_title;
                        var field_content = core_content[z].field_content;
                        coreCardDiv(item_text,dimesion_description,field_title,field_content);
                    }
                    break;
                case 'learning_focus':
                    var learningFocus_content = JSON.parse(lessonplan_stage_content);

                    for(var y=0;y<learningFocus_content.length;y++){
                        var data = learningFocus_content[y];
                        var stage = data.stage;
                        var content = data.content;

                        for(var t=0;t<content.length;t++){
                            var focussavetitle = content[t].title;
                            var focussavecontent = content[t].content;
                            addselectbodyDiv(stage,focussavetitle,focussavecontent);
                        }
                    }
                    break;
                case 'learning_issue':
                    var issue_content = JSON.parse(lessonplan_stage_content);
                    for(var x=0;x<issue_content.length;x++){
                        var issuesavetitle = issue_content[x].title;
                        var issuesavecontent = issue_content[x].content;
                        addselectbodyDiv('issue_body',issuesavetitle,issuesavecontent);
                    }
                    break;
                case 'lessonplan_studentknowledge':
                case 'lessonplan_resource':
                case 'lessonplan_design':
                    $("#"+lessonplan_stage_type+"Textarea").summernote('code',lessonplan_stage_content);
                break;
            }
        }
    }
}

var course_field_info,course_grade_info;
function stageControl(){
    course_field_info = $("#course_field_info").text();
    course_grade_info = $("#course_grade_info").text();
    if(course_field_info == "" || course_grade_info == ""){
        $(".basic_body *").prop("disabled",true);
    }
    else{
        $(".basic_body *").prop("disabled",false);
        $(".basic_body ").find(".card-subtitle").hide();
    }
}

var convergenceData;
function setConvergenceResults(convergenceData){
    var div_length = $(".ideaConvergenceResult").length;
    if(convergenceData.length !== 0){
        convergenceData.forEach(function(data){
            var convergence_id = data.convergence_id;
            var convergence_tag = data.convergence_tag;
            var convergence_content = data.convergence_content;
            for(var i=0;i<div_length;i++){
                var tagtitle = $($(".ideaConvergenceResult")[i]).data("tagtitle");
                var divId = $($(".ideaConvergenceResult")[i]).attr("id");
                if(convergence_tag == tagtitle){
                    var num = $("#"+divId).find(".idealist").length +1;
                    ideaListCard(divId,convergence_id,"收斂結果"+num,convergence_content)
                }
            }
        })
    }
}

var socket = io();

var isChange = false;
$(function(){
    basicData = JSON.parse($("#basicData").text());
    convergenceData = JSON.parse($("#convergenceData").text())

    //發送訊息，經過 事件 傳送 object
    socket.emit('join community',$("#community_id").text());
    socket.on('show result',function(data){
        console.log(data);
        setConvergenceResults(data)
    })

    setLessonplanBasicData();
    lessonplan_Map();
    threeselect_Map();
    lessonplanstage_Map();
    lessonplantarget_Append();
    showLessonplanStageSaveData();
    stageControl();

    //判斷畫面上是否有物件有更動，但未儲存
    $("input,textarea,select").change(function () {
        isChange = true;
        $(this).addClass("editing");
    });

    $(".summernote").on("summernote.change", function (e) {
        isChange = true;
        $(this).addClass("editing");
    });

    //lessonplantargetTable內的input有變化時
    $("#lessonplantargetTable").on("change","input",function(){
        isChange = true;
        $(this).addClass("editing");
    })

    $(window).bind('beforeunload', function (e) {
        if (isChange || $(".editing").get().length > 0 || localStorage.length > 0) {
            console.log(isChange)
            console.log($(".editing").get())
            console.log(localStorage.length )
            return '資料尚未存檔，確定是否要離開？';
        }
    })

    //lessonplan_basic內折疊的icon變化
    $(".basic_body .collapse").on('show.bs.collapse', function(){
        var id = $(this).parent().find("i").attr("id")
        $('#'+id).removeClass('far fa-plus-square');
        $('#'+id).addClass("far fa-minus-square");
    });
    $(".basic_body .collapse").on('hide.bs.collapse', function(){
        var id = $(this).parent().find("i").attr("id");
        $('#'+id).removeClass('far fa-minus-square');
        $('#'+id).addClass("far fa-plus-square");
    });

    //議題融入內容暫時不放:此為設定boostrapToggle
    // $("#toggle-demo").bootstrapToggle({
    //     on:"是",
    //     off:"否"
    // });
    // $('#toggle-demo').change(function() {
    //     var state = $(this).prop('checked');
    //     if(state == false){
    //         $("#lessonplan_issue").parent().hide();
    //     }
    //     else{
    //         $("#lessonplan_issue").parent().show();
    //     }
    // })

    summernoteClass();
})

/***功能function*********************************** */

//刪除該table內tbody的tr//目前只用於targettable
function deletetableTr(tbody){
    $(tbody).on('click','.btnDelete',function(){
        //抓取最近的input值
        var $input = $(this).closest('tr').find("input[name='lessonplantargercontent']");
        var updateaction = $input.data("updateaction");
        var olddata = $input.data("olddata");
        //若為資料庫抓出來的資料才需處理delete動作
        if(updateaction == "update"){
            updateData.push({olddata:olddata,newdata:"",updateaction:"delete"})
        }

        $(this).closest('tr').remove();
        $(tbody+" tr").each(function(index) {
            $(this).find('th:eq(0)').first().html(index + 1);
        });
        isChange = true;
    });
}

//設定summernote編輯器
function summernoteClass(){
    $('.summernote').summernote({
        tabsize: 2,
        toolbar: [
                  // [groupName, [list of button]]
                  ['style', ['style']],
                  ['font', ['bold', 'underline', 'clear']],
                  ['color', ['color']],
                  ['para', ['ul', 'ol', 'paragraph']],
                  ['table', ['table']],
                  ['insert', ['link', 'picture']],
                  ['view', ['codeview']]
        ],
        minHeight: 250,
        maxHeight: 450,
        disableDragAndDrop: true,
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

    $('.fixsummernote').summernote({
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
        minHeight: 180,
        maxHeight: 180,
        disableDragAndDrop: true,
        dialogsInBody: true,
        placeholder: "請輸入活動流程(必填)",
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

    $('.notoolbarsummernote').summernote({
        toolbar:false,
        disableDragAndDrop: true,
        dialogsInBody: true,
        minHeight: 180,
        maxHeight: 180
    });

}


/*******儲存******************************************** */
var updateData = [];//放target內容變更用的空array

//儲存的ajaxfunction
function saveAjax(data){
    var community_id = $("#community_id").text();
    var results;
    $.ajax({
        url: "/lessonplan/edit/"+community_id+"/save",
        type: "POST",
        async:false, //ajax請求結束後才會執行window function
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

//設定課程目標內所有savebutton動作
function saveLessonplanData(divId){
    var community_id = $("#community_id").text();
    switch(divId){
        case 'lessonplan':
            var lessonplan_intro = $("#lessonplan_intro").val();
            var lessonplan_unit_name = $("#lessonplan_unit_name").val();
            var lessonplan_field = [];
            $("input[name='fieldbox']:checked").each(function(){
                lessonplan_field.push($(this).val());
            })
            var fieldString = lessonplan_field.toString();
            var lessonplan_version = $("#lessonplan_version :selected").val();
            var lessonplan_grade = $("#lessonplan_grade :selected").val();
            var lessonplan_time_class = parseInt($("#lessonplan_time_class").val());
            var lessonplan_time_minutes = parseInt($("#lessonplan_time_minutes").val());
            var lessonplan_time = [lessonplan_time_class,lessonplan_time_minutes];
            var timeString = lessonplan_time.toString();

            var data = {
                stage:divId,
                lessonplan_intro:lessonplan_intro,
                lessonplan_unit_name:lessonplan_unit_name,
                lessonplan_field:fieldString,
                lessonplan_version:lessonplan_version,
                lessonplan_grade:lessonplan_grade,
                lessonplan_time:timeString
            };

            var editing = $("#lessonplan").find(".editing").get().length;

            if(editing == 0){
                alert('此區沒有資料變動喔!!')
            }
            else{
                for(var i=0;i<editing;i++){
                    $($("#lessonplan").find(".editing")[i]).removeClass("editing");
                }
                $("#lessonplan").find(".custom-control-input").removeClass("editing");
                $("#lessonplan").find(".form-control").removeClass("editing");
                isChange = false;

                var lessonplanResults = saveAjax(data);
                if(lessonplanResults.msg == "ok"){
                    alert("儲存成功");
                    window.location = "/lessonplan/edit/"+community_id;
                }
                else{
                    window.location = "/member/login";
                }
            }
            break;
        case 'creatActivityModal':
        case 'editActivityModal':

            var lessonplan_activity_name = $("#"+divId).find(".activityName").val();
            var baseid = $("#"+divId).find(".activityid").text();
            var editparentCardId = $("#parentCardId").text();

            if(lessonplan_activity_name == ""){
                $("#"+divId).find(".alert").show();
            }
            else{
                var newtwowayData = []
                var targetandActivityArray = []
                $("#"+divId+" input[name='targetandactivity']:checked").each(function(){
                    var targetName = $(this).val();
                    newtwowayData.push({targetName:targetName,activityName:lessonplan_activity_name})
                    targetandActivityArray.push(targetName)
                })
                console.log(newtwowayData)
                var tableContent = targetandActivityArray.toString();

                var data = {
                    stage:divId,
                    baseid:baseid,
                    lessonplan_activity_name:lessonplan_activity_name,
                    tableContent:tableContent
                };

                isChange = false;
                $("#"+divId).find(".activityName").removeClass("editing");
                $("#"+divId).find("input[name='targetandactivity']").removeClass("editing");

                var activityResults = saveAjax(data);
                if(activityResults.msg == "ok"){

                    $("#"+divId).modal('hide');
                    modalclosebtn(divId);
                    if( divId == 'creatActivityModal'){
                        console.log("新增成功");
                        var id = $(".activityRow").length + 1;
                        var process_id = activityResults.process_id;
                        var selectNodeData = activityResults.selectnodeData;
                        var community_tag = activityResults.tagData[0].community_tag.split(',');
                        activityandAssessmentDesign_Append(id,process_id,lessonplan_activity_name);
                        resetActivityNameandTargetArray(process_id,lessonplan_activity_name,newtwowayData)
                        socket.emit('create activity',{community_id:community_id,selectData:selectNodeData})
                        socket.emit('create tag',{community_id:community_id,community_tag:community_tag})

                    }
                    else{
                        console.log("修改成功");
                        var selectData = activityResults.selectData;
                        var nodeData = activityResults.nodeData;
                        var edit_community_tag = activityResults.tagData[0].community_tag.split(',');
                        socket.emit('add node',{community_id:community_id,nodeData:nodeData})
                        socket.emit('create tag',{community_id:community_id,community_tag:edit_community_tag})

                        var parnetid = $("#"+editparentCardId).find(".card-body").attr("id");
                        //card-header內標題文字顯示修改
                        $("#header"+parnetid+" span.headeractivityname").text(lessonplan_activity_name)
                        $("#header"+parnetid).attr("data-activityname",lessonplan_activity_name);
                        $("#ideaConvergenceResult"+parnetid).attr("data-tagtitle",lessonplan_activity_name);
                        $("#"+parnetid+"Table Tbody").empty();

                        var newAssessmentArray = [];
                        targetandAssessmentArray.forEach(function(val){
                            //將不屬於此活動的評量對應資料先push進新array
                            if(val.lessonplan_activity_name !== lessonplan_activity_name){
                                newAssessmentArray.push(val)
                            }
                        })
                        //取代舊有的評量對用array
                        targetandAssessmentArray = newAssessmentArray;

                        //在此function處理table呈現，以及該活動評量與學習目標對應資料
                        setOneCardActivityProcess(selectData,baseid,parnetid)
                        setActivityandTargetData(selectData)
                        editActivityName(baseid,lessonplan_activity_name)
                        console.log(twowayTableData)
                        console.log(targetandAssessmentArray)
                    }
                }
                else{
                    window.location = "/member/login";
                }

            }
            break;
        case 'lessonplan_target':

            var processChange = localStorage.length;

            var array =[];
            for ( var i = 0; i < processChange; ++i ) {
                var activityDivId = localStorage.key( i );
                var activityName = $("#header"+activityDivId).text();
                array.push(activityName)
            }
            var nameString = array.toString();

            if(processChange > 0){
                $("#targetalertModal").modal("show");
                $(".targetAlertLabel").text(nameString+"的活動流程")
            }
            else{
                saveLearningTarget();
            }

            break;
        case 'cirn_form1':
            var coreArray = [];
            var $card = $("#core_competency_body").find('.card');
            var card_length = $card.length;
            
            for(var i=0;i<card_length;i++){
                var item_text = $($card[i]).find(".itemtext").text();
                var dimesion_description = $($card[i]).find(".dimesion_description").text();
                var field_title = $($card[i]).find(".field_title").text();
                var field_content = $($card[i]).find(".field_content").text();
                coreArray.push({item_text:item_text,dimesion_description:dimesion_description,field_title:field_title,field_content:field_content})
            }

            var coreString = JSON.stringify(coreArray);

            $("#cirn_form1").find("select").removeClass("editing")
            isChange = false;

            var data = {
                stage:'lessonplan_stage',
                lessonplan_stage_type:'core_competency',
                lessonplan_stage_content:coreString
            }

            var cirn_form1Results = saveAjax(data);
            if(cirn_form1Results.msg == "ok"){
                alert("儲存成功");
            }
            else{
                window.location = "/member/login";
            }

            break;
        case 'learning_focus':
            var learningFocusItem = ["performancefocus_body","contentfocus_body"];
            var form2Array = [];
            learningFocusItem.map(function(data){
                var learnignFocusArray = [];
                var $card = $("#"+data).find('.card');
                var card_length = $card.length;

                for(var i=0;i<card_length;i++){
                    var title = $($card[i]).find(".card-title").text();
                    var content = $($card[i]).find(".card-text").text();
                    learnignFocusArray.push({title:title,content:content});
                }
                form2Array.push({stage:data,content:learnignFocusArray})
            })

            $("#learning_focus").find("select").removeClass("editing")
            isChange = false;

            var form2String = JSON.stringify(form2Array);

            var data = {
                stage:'lessonplan_stage',
                lessonplan_stage_type:'learning_focus',
                lessonplan_stage_content:form2String
            }

            var learning_focusResults = saveAjax(data);
            if(learning_focusResults.msg == "ok"){
                alert("儲存成功");
            }
            else{
                window.location = "/member/login";
            }

            break;
        case 'lessonplan_issue':
            var issueArray = [];
            var $card = $("#issue_body").find('.card');
            var card_length = $card.length;
            
            for(var i=0;i<card_length;i++){
                var title = $($card[i]).find(".card-title").text();
                var content = $($card[i]).find(".card-text").text();
                issueArray.push({title:title,content:content});
            }

            var issueString = JSON.stringify(issueArray);

            var data = {
                stage:'lessonplan_stage',
                lessonplan_stage_type:'learning_issue',
                lessonplan_stage_content:issueString
            }

            var lessonplan_issueResults = saveAjax(data);
            if(lessonplan_issueResults.msg == "ok"){
                alert("儲存成功");
            }
            else{
                window.location = "/member/login";
            }

            break;
        case 'lessonplan_studentknowledge':
        case 'lessonplan_resource':
        case 'lessonplan_design':
            var summernote_content = $("#"+divId+"Textarea").summernote('code');
            $("#"+divId+"Textarea").removeClass("editing");
            isChange = false;

            var data = {
                stage:'lessonplan_stage',
                lessonplan_stage_type:divId,
                lessonplan_stage_content:summernote_content
            }

            var stageResults = saveAjax(data);
            if(stageResults.msg == "ok"){
                alert("儲存成功");
            }
            else{
                window.location = "/member/login";
            }

            break;
    }
}

//儲存學習目標(modal內確定儲存按鈕)
function saveLearningTarget(){
    var tr_length = $("#lessonplantargetTbody tr").length;
    var targetArray = [];

    for(var i=0;i<tr_length;i++){
        $($("#lessonplantargetTbody tr")[i]).find("input[name='lessonplantargercontent']").removeClass('editing');
        var $input = $($("#lessonplantargetTbody tr")[i]).find("input[name='lessonplantargercontent']");
        var lessonplantargetcontent = $input.val();
        var updateaction = $input.data("updateaction");
        var olddata = $input.data("olddata");
        targetArray.push(lessonplantargetcontent);
        updateData.push({olddata:olddata,newdata:lessonplantargetcontent,updateaction:updateaction})
    }
    isChange = false;

    var targetString = targetArray.toString();
    var updateString = JSON.stringify(updateData);
    var data= {
        stage:'lessonplan_target',
        lessonplan_stage_type:'lessonplan_target',
        lessonplan_stage_content:targetString,
        target_update_data:updateString
    }

    var targetResults = saveAjax(data);
    updateData = [];
    if(targetResults.msg == "ok"){
        $("#targetalertModal").modal("hide");
        alert("儲存成功");
        var targetData = targetResults.targetData[0].lessonplan_stage_content;
        var activityData = targetResults.activityData;

        targetContent = targetData.split(',');
        $("#lessonplantargetTbody").empty();

        for(var s=0;s<targetContent.length;s++){
            var listnum = s+1;
            var value = targetContent[s];

            $("#lessonplantargetTbody").append('<tr>'+
                                                    '<th scope="row">'+listnum+'</th>'+
                                                    '<td><input type="text" class="form-control" name="lessonplantargercontent" placeholder="請輸入學習目標" value="'+value+'" data-updateaction="update" data-olddata="'+value+'"></td>'+
                                                    '<td class="lasttd"><button class="btn btn-danger btnDelete"><i class="far fa-trash-alt"></i></button></td>'+
                                                '</tr>');
        }
        deletetableTr('#lessonplantargetTbody');
        $("#lessonplanActivityProcessData").text(activityData);
        $(".activityTbody tr").remove();
        lessonplanActivityProcessData = $("#lessonplanActivityProcessData").text();
        lessonplanActivityProcessData = JSON.parse(lessonplanActivityProcessData);
        setActivityProcess();
    }
    else{
        window.location = "/member/login";
    }
}

function saveActivityProcessData(divId){
    
    var lessonplan_activity_process_id = $("#"+divId).find(".lessonplan_activity_process_id").text();
    var lessonplan_activity_name = $("#header"+divId).data("activityname");

    var activityContentString = localStorage.getItem(divId);

    if(activityContentString !== null){
        var data = {
            stage:'activiy_process',
            lessonplan_activity_process_id:lessonplan_activity_process_id,
            lessonplan_activity_content:activityContentString
        };

        localStorage.removeItem(divId);

        isChange = false;

        var processResults = saveAjax(data);
        if(processResults.msg == "ok"){
            alert("儲存成功");
            var processData = processResults.selectData;
            showtrargetandAssessmentTableData(processData)

            var newAssessmentArray = [];
            targetandAssessmentArray.forEach(function(val){
                //將不屬於此活動的評量對應資料先push進新array
                if(val.lessonplan_activity_name !== lessonplan_activity_name){
                    newAssessmentArray.push(val)
                }
            })
            //取代舊有的評量對用array
            targetandAssessmentArray = newAssessmentArray;

            $("#"+divId+"Table Tbody").empty();
            //在此function處理table呈現，以及該活動評量與學習目標對應資料
            setOneCardActivityProcess(processData,lessonplan_activity_process_id,divId)
            setActivityandTargetData(processData)
            console.log(twowayTableData)
            console.log(targetandAssessmentArray)

        }
        else{
            window.location = "/member/login";
        }

    }
    else{
        alert('目前沒有資料可以儲存');
    }
    
}

function resetActivityNameandTargetArray(process_id,lessonplan_activity_name,newtwowayData){
    activityName.push({lessonplan_activity_process_id:process_id,lessonplan_activity_name:lessonplan_activity_name})
    $("#sidebarul").empty();
    $("#activityDesignUl").empty();
    sidebar_Map();
    newtwowayData.forEach(function(data){
        twowayTableData.push(data)
    });
    console.log(activityName)
}


function editActivityName(process_id,lessonplan_activity_name){
    var newNameArray = [];
    activityName.forEach(function(val){
        var id= val.lessonplan_activity_process_id;
        var name = val.lessonplan_activity_name;
        if(id == process_id){
            newNameArray.push({lessonplan_activity_process_id:id,lessonplan_activity_name:lessonplan_activity_name})
        }
        else{
            newNameArray.push({lessonplan_activity_process_id:id,lessonplan_activity_name:name})
        }
    })
    activityName = newNameArray;
    $("#sidebarul").empty();
    $("#activityDesignUl").empty();
    sidebar_Map();
    console.log(activityName);
}