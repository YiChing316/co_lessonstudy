
/*將教案實作的內容以模組方式append出來 */
var lessonplan_Component = [
    {name:'教案簡介',id:'lessonplan_intro',type:'textarea',parentDiv:'lessonplan'},
    {name:'課程領域',id:'lessonplan_field',type:'select',parentDiv:'lessonplan'},
    {name:'使用版本',id:'lessonplan_version',type:'select',parentDiv:'lessonplan'},
    {name:'學習階段',id:'lessonplan_grade',type:'select',parentDiv:'lessonplan'},
    {name:'授課時間',id:'lessonplan_time',type:'other',parentDiv:'lessonplan'}
];

//會使用到編輯器的位置
var lessonplanstage_Component = [
    {id:'lessonplan_studentknowledge',createDiv:'studentknowledgeTextarea'},
    {id:'lessonplan_resource',createDiv:'resourceTextarea'},
    {id:'lessonplan_design',createDiv:'designTextarea'}
];

var twoselect_Component = [
    {labelname:'選擇所對應的因材網知識節點',firstselid:'adl_knowledgenode_unit_sel',secondselid:'adl_knowledgenode_node_sel',bodyname:'adl_body',parentDiv:'lessonplan_adl',onclickfunction:''}
];

var threeselect_Component = [
    {labelname:'',firstselid:'fieldcontent_field_sel',secondselid:'core_competency_dimesion_sel',threeselid:'core_competency_item_sel',bodyname:'core_competency_body',parentDiv:'cirn_form1',onclickfunction:'addcore_competency()'},
    {labelname:'學習表現',firstselid:'performancefocus_item',secondselid:'performancefocus_childitem',threeselid:'performancefocus_content',bodyname:'performancefocus_body',parentDiv:'cirn_form2',onclickfunction:'addlearning_performence()'},
    {labelname:'學習內容',firstselid:'contentfocus_item',secondselid:'contentfocus_childitem',threeselid:'contentfocus_content',bodyname:'contentfocus_body',parentDiv:'cirn_form2',onclickfunction:'addlearning_content()'},
    {labelname:'議題融入',firstselid:'issue_name',secondselid:'issue_learning_theme',threeselid:'issue_content',bodyname:'issue_body',parentDiv:'lessonplan_issue',onclickfunction:'addissue()'}
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
                                    '<div class="bt-group float-right mr-1">'+
                                        // '<input type="button" class="btn btn-secondary" value="清除">'+
                                        '<input type="button" class="btn btn-primary mt-2" value="儲存" onclick="saveLessonplanData('+divid+')">'+
                                    '</div>'+
                                '</div>'+
                            '</div>');
};

// function ckeditorDiv(parentDiv){
//     ClassicEditor
//         .create( document.querySelector( '#'+parentDiv ) )
//         .catch( error => {
//             console.error( error );
//     });
// }

function twoselectDiv(labelname,firstselid,secondselid,bodyname,parentDiv,onclickfunction){
    $('#'+parentDiv).append('<div class="form-group">'+
                                '<label class="control-label font-weight-bolder">'+labelname+'</label>'+
                                '<div class="row">'+
                                    '<div class="col-sm-4 nopadding-right">'+
                                        '<select class="form-control" id="'+firstselid+'"></select>'+
                                    '</div>'+
                                    '<div class="col-sm-7 nopadding-right">'+
                                        '<select class="form-control" id="'+secondselid+'"></select>'+
                                    ' </div>'+
                                    '<div class="col nopadding-right">'+
                                        '<input type="button" class="btn btn-outline-info" value="加入" onclick="'+onclickfunction+'">'+
                                    '</div>'+
                                '</div>'+
                                '<hr>'+
                                '<div id="'+bodyname+'"></div>'+
                            '</div>');
}

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
                                '<div class="row mt-2">'+
                                    '<div class="col-sm-11 nopadding-right">'+
                                    '<select class="form-control" id="'+threeselid+'"></select>'+
                                    '</div>'+
                                    '<div class="col nopadding-right">'+
                                    '<input type="button" class="btn btn-outline-info" value="加入" onclick="'+onclickfunction+'">'+
                                    '</div>'+
                                '</div>'+
                                '<hr>'+
                                '<div id="'+bodyname+'"></div>'+
                            '</div>');
}

function alertStageDiv(parentDiv){
    $('#'+parentDiv).append('<small><b class="text-danger">(請先完成教案基本資料填寫)</b></small>');
}


/*****************append元件 *****************************************************************************/
var basicData,lessonplanUnitActivityData;

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
                // selectDiv(data.name,data.id,data.parentDiv);
                // $('#'+data.id).append('<option value="" disabled selected>請選擇課程領域</option>'+
                //                         '<option value="國語">國語</option>'+
                //                         '<option value="英語">英語</option>'+
                //                         '<option value="自然">自然</option>'+
                //                         '<option value="數學">數學</option>');
                // if(lessonplan_field !== ""){
                //    $("#"+data.id+" option[value="+lessonplan_field+"]").attr("selected","selected"); 
                // }
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

var unitData,activityData;
var course_field_info,course_grade_info;

function lessonplan_unit_Set(){
    var lessonplan_version = $("#lessonplan_version :selected").val();

    $("#lessonplan_unit").append('<div class="form-group row">'+
                                    '<label class="control-label col-sm-2">單元名稱</label>'+
                                    '<div class="col-sm-10">'+
                                        '<input type="text" class="form-control" id="unitName" placeholder="請輸入單元名稱">'+
                                    '</div>'+
                                '</div>'+
                                '<button id="addtargetlist" class="btn btn-outline-info" onclick="addUnitActivitylist()"><i class="fas fa-plus"></i> 新增活動</button>'+
                                '<table class="table table-bordered w-auto mt-3" id="unitActivityTable">'+
                                    '<thead class="thead-light">'+
                                        '<tr>'+
                                        '<th scope="col">#</th>'+
                                        '<th scope="col" class="col-sm-6">活動名稱</th>'+
                                        '<th scope="col" width="10%"></th>'+
                                        '</tr>'+
                                    '</thead>'+
                                    '<tbody id="unitActivityTbody"></tbody>'+
                                '</table>');

    // if(lessonplanUnitActivityData.length !== 0){
        
    //     var lessonplan_unit_name = lessonplanUnitActivityData[0].lessonplan_unit_name;
    //     var lessonplan_unit_activity = lessonplanUnitActivityData[0].lessonplan_unit_activity;

    //     $(".lessonplan_unit_body").append('<p class="card-title"><b>單元：</b><p id="lessonplan_unit_name">'+lessonplan_unit_name+'</p></p>'+
    //                                     '<p class="card-text"><b>活動：</b><p id="lessonplan_unit_activity">'+lessonplan_unit_activity+'</p></p>'
    //                                     );

    //     var activityArray = lessonplan_unit_activity.split(',');
    //     //append sidebar的li
    //     $.each(activityArray,function(i){
    //         var activityName = activityArray[i];
    //         var id = i+1;
    //         $("#activityDesignUl").append('<li><a href="#cardidactivity_'+id+'" class="sidebarlink">'+activityName+'</a></li>');
    //         activityandAssessmentDesign_Append(id,activityName,lessonplan_unit_name,lessonplan_version);
    //     })
    // }

    buttonDiv('lessonplan_unit');

    // unit_Map();  
}

// function unit_Map(){
//     unitData = sortByKey(unitData,'course_id');
//     $('#unit_sel').append("<option disabled selected>請選擇單元</option>");

//     for(var i=0; i<unitData.length;i++){
//         var course = unitData[i];
//         var course_field = course.course_field;
//         var course_version = course.course_version;
//         var course_grade = course.course_grade;
//         var course_unit_name = course.course_unit_name;
//         var course_semester = course.course_semester;
//         activity_Map(course_field,course_version,course_grade,course_unit_name);
//         if(course_semester=='上學期'){
//             $('#unit_sel').append('<option value="'+course_unit_name+'">'+course_field+' '+course_version+' '+course_grade+' '+course_semester+' '+course_unit_name+'</option>');
//         }
//         else{
//             $('#unit_sel').append('<option value="'+course_unit_name+'">'+course_field+' '+course_version+' '+course_grade+' '+course_semester+' '+course_unit_name+'</option>');
//         }
//     }

// }

// //根據領域版本年級的單元名稱形成array
// function activity_Map(course_field,course_version,course_grade,course_unit_name){
//     activityData = sortByKey(activityData,'course_id');
//     var activity_array = [];

//     for(var i=0;i<activityData.length;i++){
//         var course_activity = activityData[i];
//         var course_id = course_activity.course_id;
//         var course_activity_field = course_activity.course_field;
//         var course_activity_version = course_activity.course_version;
//         var course_activity_grade = course_activity.course_grade;
//         var course_activity_unit = course_activity.course_unit_name;
//         var course_activity_name = course_activity.course_activity_name;
//         if(course_activity_field == course_field && 
//             course_activity_version == course_version && 
//             course_activity_grade == course_grade && 
//             course_activity_unit == course_unit_name){
//             activity_array.push({course_id:course_id,course_activity_name:course_activity_name});
//         }
//     }

//     $("#unit_sel").change(function(){
//         switch ($(this).val()){
      
//             case 0: 
//                 $("#activity_sel .mycheckbox").remove();
//             break;
//             case course_unit_name: 
//                 $("#activity_sel .mycheckbox").remove();
//                 $('#activity_sel').append('<div class="custom-control custom-checkbox mycheckbox">'+
//                                                 '<input type="checkbox" class="custom-control-input" id="allchecked" onclick="allchecked()">'+
//                                                 '<label class="custom-control-label font-weight-bolder" for="allchecked">全選</label>'+
//                                             '</div>');
//                 var array = activity_array;
//                 //利用each遍歷array中的值並將每個值新增到div中
//                 $.each(array, function(i, val) {
//                     $('#activity_sel').append($('<div class="custom-control custom-checkbox mycheckbox ml-4">'+
//                                                     '<input type="checkbox" class="custom-control-input" id="'+ array[i].course_activity_name +'" name="box" value="'+array[i].course_activity_name+'">'+
//                                                     '<label class="custom-control-label" for="'+ array[i].course_activity_name +'">'+ array[i].course_activity_name +'</label>'+
//                                                 '</div>'
//                                                 ));
//                 });      
//             break;
//         }
//     });
// }

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

//將需要編輯器的stage放入
function lessonplanstage_Map(){
    lessonplanstage_Component.map(function(data){
        $('#'+data.id).append('<div id="'+data.createDiv+'" class="summernote"></div>');
        // ckeditorDiv(data.createDiv);
        buttonDiv(data.id);
        summernoteClass();
    })
}

function twoselect_Map(){
    twoselect_Component.map(function(data){
        //因材網知識節點預設建置中
        if(data.parentDiv == "lessonplan_adl"){
            $('#'+data.parentDiv).append('<div class="alert alert-light" role="alert">資料建置中</div>');
        }
    })
}

//核心素養內第二大標:學習重點
function cirn_Set(){
    $('#lessonplan_cirn').append('<div class="form-group" id="cirn_form1">'+
                                    '<label class="control-label font-weight-bolder">總綱核心素養</label>'+
                                '</div>'+
                                '<div class="form-group" id="cirn_form2">'+
                                    '<label class="control-label font-weight-bolder">學習重點</label>'+
                                '</div>');
}

function threeselect_Map(){
        //三層select中有學習表現,學習內容須包含在核心素養內的學習重點，故將cirn_Set()放於此;議題融入為其餘大標
        cirn_Set();
        threeselect_Component.map(function(data){
            threeselecDiv(data.labelname,data.firstselid,data.secondselid,data.threeselid,data.bodyname,data.parentDiv,data.onclickfunction);
            buttonDiv(data.parentDiv);
        })
}

//階段鎖定，須先完成教案基本資料填寫才開放安排單元、核心素養、議題融入
function stageControl(){
    course_field_info = $("#course_field_info").text();
    course_grade_info = $("#course_grade_info").text();
    if(course_field_info == "" || course_grade_info == ""){
        alertStageDiv("headerlessonplan_unit");
        alertStageDiv("headerlessonplan_cirn");
        alertStageDiv("headerlessonplan_issue");
        $("#cardidlessonplan_unit *").prop("disabled",true);
        $("#cardidlessonplan_cirn *").prop("disabled",true);
        $("#cardidlessonplan_issue *").prop("disabled",true);
    }
    else{
        $("#cardidlessonplan_unit *").prop("disabled",false);
        $("#cardidlessonplan_cirn *").prop("disabled",false);
        $("#cardidlessonplan_issue *").prop("disabled",false);
    }
}

function activityandAssessmentDesign_Append(id,title,unit,version){
    var divId = "'activity_"+id+"'";
    var activityDiv = '<div class="row accordion">'+
                            '<div class="card col-9 nopadding" id="cardidactivity_'+id+'">'+
                                '<h5 class="card-header bg-white font-weight-bolder shadow-sm" id="headeractivity_'+id+'" data-toggle="collapse" data-target=".activity_'+id+'">'+title+''+
                                    '<span class="float-right"><i class="fa fa-angle-up" id="activity_'+id+'icon"></i></span>'+
                                '</h5>'+
                                '<div class="card-body collapse show activity_'+id+'" id="activity_'+id+'">'+
                                    '<p class="activity_lessonplan_unit_name" style="display:none">'+unit+'</p>'+
                                    '<p class="activity_lessonplan_activity_name" style="display:none">'+title+'</p>'+
                                    '<p class="activity_lessonplan_version" style="display:none">'+version+'</p>'+
                                    '<button class="btn btn-outline-info" data-toggle="modal" data-target="#addprocessModal" data-parentdivid="activity_'+id+'"><i class="fas fa-plus"></i> 新增活動流程</button>'+
                                    '<table class="table table-bordered activitytable mt-3" id="activity_'+id+'Table">'+
                                        '<thead class="thead-light">'+
                                            '<tr>'+
                                            '<th scope="col">#</th>'+
                                            '<th scope="col" width="90">學習目標</th>'+
                                            '<th scope="col" width="350">活動流程</th>'+
                                            '<th scope="col" width="60">時間</th>'+
                                            '<th scope="col" width="150">評量方式</th>'+
                                            '<th scope="col">備註</th>'+
                                            '<th scope="col" width="50"></th>'+
                                            '</tr>'+
                                        '</thead>'+
                                        '<tbody class="activityTbody" id="activity_'+id+'Tbody"></tbody>'+
                                    '</table>'+
                                '</div>'+
                                '<div class="card-footer collapse show text-right activity_'+id+'">'+
                                    '<input type="button" class="btn btn-primary" value="儲存" onclick="saveActivityProcessData('+divId+')">'+
                                '</div>'+
                            '</div>'+
                            '<div class="card col nopadding">'+
                                '<h5 class="card-header bg-selfgreen font-weight-bolder">團隊想法</h5>'+
                                '<div class="card-body collapse"></div>'+
                            '</div>'+
                        '</div>';
    $("#setactivity").append(activityDiv);
}

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
                    var targetContent = lessonplan_stage_content.split(',');
                    
                    for(var s=0;s<targetContent.length;s++){
                        var listnum = s+1;
                        var value = targetContent[s];

                        $("#lessonplantargetTbody").append('<tr>'+
                                                                '<th scope="row" title="可上下移動排序">'+listnum+'</th>'+
                                                                '<td><input type="text" class="form-control" name="lessonplantargercontent" placeholder="請輸入學習目標" value="'+value+'"></td>'+
                                                                '<td class="lasttd"><button class="btn btn-danger btnDelete"><i class="far fa-trash-alt"></i></button></td>'+
                                                            '</tr>');
                    }
                    deletetableTr('#lessonplantargetTbody');
                    sorttableTbody('#lessonplantargetTbody');

                    break;
            }
        }
    }
}


/******************************************************************************** */
var isChange = false;
$(function(){
    // unitData = JSON.parse($("#unitData").text());
    // activityData = JSON.parse($("#activityData").text());

    basicData = JSON.parse($("#basicData").text());
    lessonplanUnitActivityData = JSON.parse($("#lessonplanUnitActivityData").text());
    
    // $("#unitData").remove();
    // $("#activityData").remove();

    lessonplan_Map();
    lessonplan_unit_Set();
    lessonplantarget_Append();
    lessonplanstage_Map();
    twoselect_Map();
    threeselect_Map();
    stageControl();

    showLessonplanStageSaveData();

    collapseControl();
    sidebarClick();

    // modalOpen();

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

})

//活動選擇全選以及取消全選
function allchecked(){
    if($("#allchecked").prop("checked")) {
        $("input[name='box']").each(function() {
            $(this).prop("checked", true);
        });
    } 
    else {
        $("input[name='box']").each(function() {
            $(this).prop("checked", false);
        });           
    }
}

//新增學習目標列表
function addlessonplantargetlist(){
    //尋找最後一個tr的標題th數字為多少
    var listnum = $("#lessonplantargetTbody").find("tr").last().children("th").text();
    listnum++;
    $("#lessonplantargetTbody").append('<tr>'+
                                            '<th scope="row" title="可上下移動排序">'+listnum+'</th>'+
                                            '<td><input type="text" class="form-control" name="lessonplantargercontent" placeholder="請輸入學習目標"></td>'+
                                            '<td class="lasttd"><button class="btn btn-danger btnDelete"><i class="far fa-trash-alt"></i></button></td>'+
                                        '</tr>');
    deletetableTr('#lessonplantargetTbody');
    sorttableTbody('#lessonplantargetTbody');
}

//自定義單元/活動modal內的活動table列表
function addUnitActivitylist(){
    var listnum = $("#unitActivityTbody").find("tr").last().children("th").text();
    listnum++;
    $("#unitActivityTbody").append('<tr class="appendTr">'+
                                        '<th scope="row">'+listnum+'</th>'+
                                        '<td><input type="text" class="form-control activityList" id="lessonplan_unit_activity_'+listnum+'" placeholder="請輸入活動名稱"></td>'+
                                        '<td class="lasttd"><button class="btn btn-danger btnDelete"><i class="far fa-trash-alt"></i></button></td>'+
                                    '</tr>');
    deletetableTr('#unitActivityTbody');
}

//判斷此教案是否已經有安排過安排跟活動
// function openUnitandActivityBtn(targetModal){
//     var nowLessonplan_unit = $("#lessonplan_unit_name").text();

//     //如果還沒安排，直接開啟設定modal
//     if(nowLessonplan_unit == ""){

//         switch(targetModal){
//             case 'customUnitandActivityModal':
//                 $("#customUnitandActivityModal").modal('toggle')
//                 break;
//             case 'versionUnitandActivityModal':
//                 $("#versionUnitandActivityModal").modal('toggle')
//                 break
//         }  
//     }
//     //如果已經安排，跳出警告語
//     else{
//         $("#alertModal").modal('toggle')
//         $("#alertModal").find('#targetModal').text(targetModal);
//     }
     
// }

//alertModal確定修改btn
// function openRevisedUnitandActivityBtn(){
//     $("#alertModal").modal('hide');

//     var targetModal = $("#targetModal").text();

//     switch(targetModal){
//         case 'customUnitandActivityModal':
//             $("#customUnitandActivityModal").modal('toggle')
//             break;
//         case 'versionUnitandActivityModal':
//             $("#versionUnitandActivityModal").modal('toggle')
//             break
//     }
// }

//安排單元活動modal打開時要做的動作
// function modalOpen(){
//     var lessonplan_field = $("#lessonplan_field :selected").val();
//     var lessonplan_version = $("#lessonplan_version :selected").val();
//     var lessonplan_grade = $("#lessonplan_grade :selected").val();

//     $('#customUnitandActivityModal').on('show.bs.modal', function (event) {
//         var modal = $(this)
//         modal.find('#customField').text(lessonplan_field);
//         modal.find('#customVersion').text(lessonplan_version);
//         modal.find('#customGrade').text(lessonplan_grade);
//     });

//     $('#versionUnitandActivityModal').on('show.bs.modal', function (event) {
//         var modal = $(this)
//         modal.find('#versionUnitandActivityModalLabel').text(lessonplan_version+"單元/活動");
//     });

// }

//側邊選單的錨點定位

function sidebarClick(){
    $(".sidebarlink").on('click', function(event) {
        //若未減去cardheaderHeight會無法蓋到每階段的標題
        //因為原本($(".card-header").height()*2)會被想法實作切換擋住故改為($(".card-header").height()*4)
        var cardheaderHeight = $(".card-header").height()*4;
        if (this.hash !== "") {
          event.preventDefault();//防止連結打開url，preventDefault()為阻止element發生默認行為，例如點擊submit時阻止表單提交
          var hash = this.hash;
          $('html, body').animate({
            scrollTop: $(hash).offset().top - cardheaderHeight
          }, 1000);
        }
    });
};



/***功能function*********************************** */

//array排序
function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

//刪除該table內tbody的tr
function deletetableTr(tbody){
    $(tbody).on('click','.btnDelete',function(){
        $(this).closest('tr').remove();
        $(tbody+" tr").each(function(index) {
            $(this).find('th:eq(0)').first().html(index + 1);
        });
    });
}

//重新排序該table內tbody的順序編號
function sorttableTbody(tbody){
    $(tbody).sortable( {
        update: function(){
            $(this).children().each(function(index) {
                $(this).find('th:eq(0)').first().html(index + 1);
            });
        }
    });
}

//摺疊icon變化
function collapseControl(){
    //class摺疊執行完後更改圖形
    $(".collapse").on('show.bs.collapse', function(){
        $i = $(this).closest('.card').children().children().children();
        var id = $i.attr('id');
        $('#'+id).removeClass('fa fa-angle-down');
        $('#'+id).addClass("fa fa-angle-up");
    });
    $(".collapse").on('hide.bs.collapse', function(){
        //$(this)為card-body，需更改同父內三層的i的class
        $i = $(this).closest('.card').children().children().children();
        var id = $i.attr('id');
        $('#'+id).removeClass('fa fa-angle-up');
        $('#'+id).addClass("fa fa-angle-down");
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
                  ['insert', ['link', 'picture', 'video']],
                  ['view', ['codeview']]
        ],
        minHeight: 250,
        maxHeight: 250,
        disableDragAndDrop: true
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
        minHeight: 180,
        maxHeight: 180,
        disableDragAndDrop: true,
        dialogsInBody: true,
        placeholder: "請輸入活動流程(必填)"
    });

    $('.notoolbarsummernote').summernote({
        toolbar:false,
        disableDragAndDrop: true,
        dialogsInBody: true,
        minHeight: 180,
        maxHeight: 180
    });

    $('.note-statusbar').hide();
}

//儲存的ajaxfunction
function saveAjax(data){
    var community_id = $("#community_id").text();

    $.ajax({
        url: "/lessonplan/edit/"+community_id+"/save",
        type: "POST",
        data:data,
        async:false,
        success: function(data){
            console.log(data.msg);
            alert("儲存成功");
            // window.location = "/lessonplan/edit/"+community_id;
        },
        error: function(){
            alert('失敗');
        }
    })
}

function saveLessonplanData(divId){
    
    switch(divId){
        case 'lessonplan':
            var community_id = $("#community_id").text();
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
                isChange = false;
                $.ajax({
                    url: "/lessonplan/edit/"+community_id+"/save",
                    type: "POST",
                    data:data,
                    async:false,//ajax請求結束後才會執行window function
                    success: function(data){
                        console.log(data.msg);
                        alert("儲存成功");
                        window.location = "/lessonplan/edit/"+community_id;
                    },
                    error: function(){
                        alert('失敗');
                    }
                })
            }
            break;
        case 'lessonplan_unit':
            var lessonplan_version = $("#lessonplan_version :selected").val();
            var lessonplan_unit_name = $("#unitName").val();
            var lessonplan_activity_name = [];
            $(".activityList").each(function() {
                var activity_name = $(this).val();
                lessonplan_activity_name.push(activity_name);
            });          
            var activityString = lessonplan_activity_name.toString();
            var data = {
                        stage:divId,
                        lessonplan_version:lessonplan_version,
                        lessonplan_unit_name:lessonplan_unit_name,
                        lessonplan_activity_name:activityString
                    };

            saveAjax(data);
            break;
        // case 'lessonplan_unit'://版本單元/活動
        //     var community_id = $("#community_id").text();
        //     var lessonplan_version = $("#lessonplan_version :selected").val();
        //     var lessonplan_unit_name = $("#unit_sel :selected").val();
        //     var lessonplan_activity_name = [];
        //     $("input[name='box']:checked").each(function(){
        //         lessonplan_activity_name.push($(this).val());
        //     })           
        //     var activityString = lessonplan_activity_name.toString();
        //     var data = {
        //         stage:divId,
        //         lessonplan_version:lessonplan_version,
        //         lessonplan_unit_name:lessonplan_unit_name,
        //         lessonplan_unit_activity:activityString
        //     };

        //     $("#unit_sel").removeClass("editing");
        //     isChange = false;
        //     saveAjax(data);
        //     window.location = "/lessonplan/edit/"+community_id;

        //     break;
        // case 'customlessonplan_unit'://自定義單元/活動
        //     var community_id = $("#community_id").text();
        //     var lessonplan_version = $("#customVersion").text();
        //     var lessonplan_unit_name = $("#unitName").val();
        //     var lessonplan_activity_name = [];
        //     $(".activityList").each(function() {
        //         var activity_name = $(this).val();
        //         lessonplan_activity_name.push(activity_name);
        //     });          
        //     var activityString = lessonplan_activity_name.toString();
        //     var data = {
        //         stage:'lessonplan_unit',
        //         lessonplan_version:lessonplan_version,
        //         lessonplan_unit_name:lessonplan_unit_name,
        //         lessonplan_unit_activity:activityString
        //     };

        //     $("#customSemester_sel").removeClass("editing");
        //     $("#unitName").removeClass("editing");
        //     $(".activityList").removeClass("editing");

        //     isChange = false;
        //     saveAjax(data);
        //     window.location = "/lessonplan/edit/"+community_id;
        //     break;
        case 'lessonplan_target':
            var tr_length = $("#lessonplantargetTbody tr").length;
            var targetArray = [];

            var editing = $("#lessonplan_target").find(".editing").get().length;
            if(editing == 0){
                alert('此區沒有資料變動喔!!')
            }
            else{
                for(var i=0;i<tr_length;i++){
                    var lessonplantargetcontent = $($("#lessonplantargetTbody tr")[i]).find("input[name='lessonplantargercontent']").val();
                    $($("#lessonplantargetTbody tr")[i]).find("input[name='lessonplantargercontent']").removeClass('editing');
                    targetArray.push(lessonplantargetcontent);
                }
                isChange = false;

                var targetString = targetArray.toString();
                var data= {
                    stage:divId,
                    lessonplan_stage_type:divId,
                    lessonplan_stage_content:targetString
                }
                saveAjax(data);
            }
            break;
    }
}

function saveActivityProcessData(divId){
    
    var lessonplan_version = $("#"+divId).find(".activity_lessonplan_version").text();
    var lessonplan_unit_name = $("#"+divId).find(".activity_lessonplan_unit_name").text();
    var lessonplan_activity_name = $("#"+divId).find(".activity_lessonplan_activity_name").text();

    var activityContentString = localStorage.getItem(divId);

    if(activityContentString !== null){
        var data = {
            stage:'activiy_process',
            lessonplan_version:lessonplan_version,
            lessonplan_unit_name:lessonplan_unit_name,
            lessonplan_activity_name:lessonplan_activity_name,
            lessonplan_activity_content:activityContentString
        };

        localStorage.removeItem(divId);

        isChange = false;
        
        saveAjax(data);

    }
    else{
        alert('目前沒有資料可以儲存');
    }
    
}

