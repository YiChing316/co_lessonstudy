/*將教案實作的內容以模組方式append出來 */
var lessonplan_Component = [
    {name:'教案簡介',id:'lessonplan_intro',type:'textarea',parentDiv:'lessonplan'},
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

function alertStageDiv(parentDiv){
    $('#'+parentDiv).append('<small><b class="text-danger">(請先完成領域、版本以及學習階段的設定)</b></small>');
}


/*****************append元件 *****************************************************************************/
var basicData,lessonplanUnitActivityData;
var lessonplanActivityProcessData;

//放置在教案基本資料內的div
function setLessonplanBasicData(){
    $("#lessonplan_basicdata").append("<div id='lessonplan'></div>");
    $("#lessonplan_basicdata").append('<span>此教案是否需要進行議題融入？</span>'+
                                        '<input type="checkbox" data-toggle="toggle" id="toggle-demo" data-size="sm">');
    lessonplanbasic_Component.map(function(data){
        $("#lessonplan_basicdata").append("<div class='basic_body'>"+
                                            "<hr><h5 data-toggle='collapse' data-target='#"+data.id+"'><i class='far fa-plus-square mr-1' id='"+data.id+"icon'></i><b>"+data.name+"</b></h5>"+
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
                if(lessonplan_field !== undefined){
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
        // ckeditorDiv(data.createDiv);
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
    // sorttableTbody('#lessonplantargetTbody');
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
                                                                '<th scope="row" title="可上下移動排序">'+listnum+'</th>'+
                                                                '<td><input type="text" class="form-control" name="lessonplantargercontent" placeholder="請輸入學習目標" value="'+value+'" data-updateaction="update" data-olddata="'+value+'"></td>'+
                                                                '<td class="lasttd"><button class="btn btn-danger btnDelete"><i class="far fa-trash-alt"></i></button></td>'+
                                                            '</tr>');
                    }
                    deletetableTr('#lessonplantargetTbody');
                    // sorttableTbody('#lessonplantargetTbody');

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

//顯示學習目標與活動對應表
function setLessonplanTargetandActivityTable(){
    //須要先有學習目標以及活動名稱才會出現
    if(targetContent == undefined || activityName == ""){
        $("#cardidlessonplan_targetandActivity").parent(".row").hide();
    }
    else{
        $("#cardidlessonplan_targetandActivity").parent(".row").show();
        $("#lessonplan_targetandActivity").append('<table id="lessonplanTargetandActivityTable" class="table table-bordered">'+
                                                    '<thead class="thead-light text-center">'+
                                                        '<tr><th scope="col"></th></tr>'+
                                                    '</thead>'+
                                                    '<tbody></tbody>'+
                                                '</table>');

        $.each(targetContent,function(i,val){
            $("#lessonplanTargetandActivityTable").find("tbody").append('<tr data-targetname="'+targetContent[i]+'"><td>'+targetContent[i]+'</td></tr>')
        })
        $.each(activityName,function(i,val){
            var name = activityName[i].lessonplan_activity_name;
            $("#lessonplanTargetandActivityTable").find("thead tr").append('<th scope="col">'+name+'</th>');
        })

        var tr_length = $("#lessonplanTargetandActivityTable").find("tbody tr").length;
        for(var s=0;s<tr_length;s++){
            var tr_index = $($("#lessonplanTargetandActivityTable").find("tbody tr")[s]).index();
            $.each(activityName,function(i,val){
                var name = activityName[i].lessonplan_activity_name;
                var checkid = name+tr_index;
                $("#lessonplanTargetandActivityTable").find("tbody tr:eq("+tr_index+")").append(
                    '<td class="text-center" width="120">'+
                        '<div class="custom-control custom-checkbox">'+
                            '<input type="checkbox" class="custom-control-input" id="'+checkid+'" name="targetandactivity" value="'+name+'">'+
                            '<label class="custom-control-label" for="'+checkid+'"></label>'+
                        '</div>'+               
                    '</td>');
            })
        }
        buttonDiv('lessonplan_targetandActivity');
        showtwowayTableData();
    }
}

//顯示學習目標與評量對應表，此程式需先跑過setactivity.js的setActivityProces的()，故放在於setactivity.js執行
function setLessonplanTargetandAssessmentTable(){

    if(targetContent == undefined || activityName == "" || targetandAssessmentArray.length == 0){
        $("#cardidlessonplan_targetandAssessment").parent(".row").hide();
    }
    else{

        $("#cardidlessonplan_targetandAssessment").parent(".row").show();
        $("#lessonplan_targetandAssessment").append('<table id="lessonplanTargetanAssessmentTable" class="table table-bordered">'+
                                                        '<thead class="thead-light text-center">'+
                                                        '<tr>'+
                                                            '<th rowspan="2" colspan="1"></th>'+
                                                        '</tr>'+
                                                        '<tr></tr>'+
                                                        '</thead>'+
                                                        '<tbody> </tbody>'+
                                                    '</table>'
                                                    );
        //顯示學習目標
        $.each(targetContent,function(i,val){
            $("#lessonplanTargetanAssessmentTable").find("tbody").append('<tr data-targetname="'+targetContent[i]+'"><td>'+targetContent[i]+'</td></tr>')
            
        })

        var activityCounts = {};
        //計算活動共有幾筆評量
        $.each(targetandAssessmentArray, function(i,val) {
            if (!activityCounts.hasOwnProperty(val.lessonplan_activity_name)) {
                activityCounts[val.lessonplan_activity_name] = 1;
            } else {
                activityCounts[val.lessonplan_activity_name]++;
            }
            //在第二層thead放入評量
            var assessment_content = val.assessment_content;
            $("#lessonplanTargetanAssessmentTable").find("thead tr:eq(1)").append('<th>'+assessment_content+'</th>')
        });

        //每個活動只放一次，並依據活動有幾個評量設定colspan數量，在第一層thead
        Object.entries(activityCounts).map(function(data){
            var activityName = data[0]
            var activityNum = data[1]
            $("#lessonplanTargetanAssessmentTable").find("thead tr:eq(0)").append('<th rowspan="1" colspan="'+activityNum+'">'+activityName+'</th>')
        })

        var tr_length = $("#lessonplanTargetanAssessmentTable").find("tbody tr").length;

        //放置checkbox並直接呈現勾選狀況，為disabled
        for(var s=0;s<tr_length;s++){

            var tr_index = $($("#lessonplanTargetanAssessmentTable").find("tbody tr")[s]).index();
            var targetname = $($("#lessonplanTargetanAssessmentTable").find("tbody tr")[s]).data('targetname')

            targetandAssessmentArray.map(function(data){
                var processtarget = data.processtarget;
                var lessonplan_activity_name = data.lessonplan_activity_name;
                var assessment_content = data.assessment_content;
                var checkboxValue = lessonplan_activity_name+","+assessment_content;
                var checkid = checkboxValue+tr_index;
                $("#lessonplanTargetanAssessmentTable").find("tbody tr:eq("+tr_index+")").append(
                    '<td class="text-center" width="120">'+
                        '<div class="custom-control custom-checkbox">'+
                            '<input type="checkbox" class="custom-control-input" id="'+checkid+'" name="targetandassessment" value="'+checkboxValue+'" disabled>'+
                            '<label class="custom-control-label" for="'+checkid+'"></label>'+
                        '</div>'+               
                    '</td>');
                var targetarray = processtarget.split(',');

                targetarray.map(function(data){
                    if(data == targetname ){
                        $($("#lessonplanTargetanAssessmentTable").find("tbody tr")[s]).find("input[value='"+checkboxValue+"']").prop('checked', true);
                    }
                })
            })
        }
    }
}

var twowayTableData;

//呈現學習目標與活動對應表內容
function showtwowayTableData(){
    twowayTableData = JSON.parse($("#twowayTableData").text());

    if(twowayTableData.length !== 0){
        var results = JSON.parse(twowayTableData[0].lessonplan_twowaytable_content);

        var tr_length = $("#lessonplanTargetandActivityTable").find("tbody tr").length;

        for(var x=0;x<tr_length;x++){
            var data = $($("#lessonplanTargetandActivityTable").find("tbody tr")[x]).data('targetname')
            $.each(results,function(i,val){
              var target = results[i].targetName;
              var activity = results[i].activityName;
              if(target == data){
                $($("#lessonplanTargetandActivityTable").find("tbody tr")[x]).find("input[value='"+activity+"']").prop('checked', true);
              }
            })
        }
    }
}

//儲存活動流程後，重新更新學習目標與評量對應表
function showtrargetandAssessmentTableData(data){
    targetandAssessmentArray = [];

    for(var i=0; i<data.length;i++){
        var processData = data[i];
        var lessonplan_activity_name = processData.lessonplan_activity_name;
        var lessonplan_activity_content = processData.lessonplan_activity_content;
        if(lessonplan_activity_content.length !== 0){
            lessonplan_activity_content = JSON.parse(lessonplan_activity_content);
            for(var s=0;s<lessonplan_activity_content.length;s++){
                var contentData = lessonplan_activity_content[s];
                var processtarget = contentData.lessonplan_activity_learningtarget;
                var assessmentArray = contentData.lessonplan_activity_assessment;
                for(var r=0;r<assessmentArray.length;r++){
                    var assessmentData= assessmentArray[r];
                    var assessment_content = assessmentData.assessment_content;
                    targetandAssessmentArray.push({lessonplan_activity_name:lessonplan_activity_name,processtarget:processtarget,assessment_content:assessment_content})
                }
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
        // console.log($(".basic_body ").find(".card-subtitle"))
    }
    else{
        $(".basic_body *").prop("disabled",false);
        $(".basic_body ").find(".card-subtitle").hide();
    }
}


var isChange = false;
$(function(){
    basicData = JSON.parse($("#basicData").text());
    twowayTableData = JSON.parse($("#twowayTableData").text());

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

    $("#toggle-demo").bootstrapToggle({
        on:"是",
        off:"否"
    });
    $('#toggle-demo').change(function() {
        var state = $(this).prop('checked');
        if(state == false){
            $("#lessonplan_issue").parent().hide();
        }
        else{
            $("#lessonplan_issue").parent().show();
        }
    })

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
                  ['insert', ['link', 'picture', 'video']],
                  ['view', ['codeview']]
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

    // $('.note-statusbar').hide();
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

            var lessonplan_unit_name = $("#"+divId).find(".unitName").val();
            var lessonplan_activity_name = $("#"+divId).find(".activityName").val();
            var baseid = $("#"+divId).find(".activityid").text();

            if(lessonplan_unit_name == "" || lessonplan_activity_name == ""){
                $("#"+divId).find(".alert").show();
            }
            else{
                var targetandActivityArray = []
                $("#"+divId+" input[name='targetandactivity']:checked").each(function(){
                    var targetName = $(this).val();
                    targetandActivityArray.push({targetName:targetName,activityName:lessonplan_activity_name})
                })

                var tableContent = JSON.stringify(targetandActivityArray);

                var data = {
                    stage:divId,
                    baseid:baseid,
                    lessonplan_unit_name:lessonplan_unit_name,
                    lessonplan_activity_name:lessonplan_activity_name,
                    tableContent:tableContent
                };

                isChange = false;
                $("#"+divId).find(".unitName").removeClass("editing");
                var lessonplan_activity_name = $("#"+divId).find(".activityName").removeClass("editing");
                    
                console.log($("#creatActivityModal").find(".editing").get())
                console.log(data)

                var unitResults = saveAjax(data);
                if(unitResults.msg == "ok"){
                    alert("儲存成功");
                    window.location = "/lessonplan/edit/"+community_id;
                }
                else{
                    window.location = "/member/login";
                }

            }
            break;
        case 'lessonplan_target':

            var processChange = localStorage.length;
            var twowayTableChange = $("#lessonplan_targetandActivity").find(".editing").get();

            var array =[];
            for ( var i = 0; i < processChange; ++i ) {
                var activityDivId = localStorage.key( i );
                var activityName = $("#header"+activityDivId).text();
                array.push(activityName)
            }
            var nameString = array.toString();

            if(processChange > 0 && twowayTableChange.length > 0){
                $("#targetalertModal").modal("show");
                $(".targetAlertLabel").text("學習目標與活動對應表以及"+nameString+"的活動流程")
            }
            else if(twowayTableChange.length > 0){
                $("#targetalertModal").modal("show");
                $(".targetAlertLabel").text("學習目標與活動對應表")
            }
            else if(processChange > 0){
                $("#targetalertModal").modal("show");
                $(".targetAlertLabel").text(nameString+"的活動流程")
            }
            else{
                saveLearningTarget();
            }

            break;
        // case 'lessonplan_targetandActivity':
        //     var targetandActivityArray = []

        //     $("input[name='targetandactivity']:checked").each(function(){
        //         var targetName = $(this).parents('tr').data('targetname')
        //         var activityName = $(this).val();
        //         targetandActivityArray.push({targetName:targetName,activityName:activityName})
        //     })
        //     $("input[name='targetandactivity']").removeClass("editing");

        //     var tableContent = JSON.stringify(targetandActivityArray);

        //     isChange = false;

        //     var data = {
        //         stage:'lessonplan_twowaytable',
        //         type:'activity',
        //         content:tableContent
        //     }

        //     var table1Results = saveAjax(data);

        //     if(table1Results.msg == "ok"){
        //         alert("儲存成功");
        //         var tabledata = table1Results.tabledata;
        //         var string = JSON.stringify(tabledata)
        //         $("#twowayTableData").text(string);
        //         showtwowayTableData();
        //     }
        //     else{
        //         window.location = "/member/login";
        //     }

        //     break;
        case 'cirn_form1':
            var coreArray = [];
            var $card = $("#core_competency_body").find('.card');
            var card_length = $card.length;
            var editing = $("#cirn_form1").find(".editing").get().length;
            for(var i=0;i<editing;i++){
                $($("#cirn_form1").find(".editing")[i]).removeClass("editing");
            }
            isChange = false;
            
            for(var i=0;i<card_length;i++){
                var item_text = $($card[i]).find(".itemtext").text();
                var dimesion_description = $($card[i]).find(".dimesion_description").text();
                var field_title = $($card[i]).find(".field_title").text();
                var field_content = $($card[i]).find(".field_content").text();
                coreArray.push({item_text:item_text,dimesion_description:dimesion_description,field_title:field_title,field_content:field_content})
            }

            var coreString = JSON.stringify(coreArray)

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

            var editing = $("#learning_focus").find(".editing").get().length;
            for(var i=0;i<editing;i++){
                $($("#learning_focus").find(".editing")[i]).removeClass("editing");
            }
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

        // targetContent = targetData.split(',');
        // $("#lessonplan_targetandActivity").empty();
        // setLessonplanTargetandActivityTable();
        // $("#lessonplanActivityProcessData").text(activityData);
        // $(".activityTbody tr").remove();
        // lessonplanActivityProcessData = $("#lessonplanActivityProcessData").text();
        // lessonplanActivityProcessData = JSON.parse(lessonplanActivityProcessData);
        // setActivityProcess();
        
    }
    else{
        window.location = "/member/login";
    }
}

function saveActivityProcessData(divId){
    
    var lessonplan_activity_process_id = $("#"+divId).find(".lessonplan_activity_process_id").text();

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
            // var processData = processResults.selectData;
            // showtrargetandAssessmentTableData(processData)
            // $("#lessonplan_targetandAssessment").empty();
            // setLessonplanTargetandAssessmentTable();
        }
        else{
            window.location = "/member/login";
        }

    }
    else{
        alert('目前沒有資料可以儲存');
    }
    
}