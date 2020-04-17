
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
var lessonplanActivityProcessData;

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

    buttonDiv('lessonplan_unit');

    if(lessonplanActivityProcessData.length !== 0){
        lessonplanActivityProcessData = $("#lessonplanActivityProcessData").text();
        lessonplanActivityProcessData = JSON.parse(lessonplanActivityProcessData);

        for(var i=0;i<lessonplanActivityProcessData.length;i++){
            var processData = lessonplanActivityProcessData[i];
            var baseid = processData.lessonplan_activity_process_id;
            var unit_name = processData.lessonplan_unit_name;
            var activity_name = processData.lessonplan_activity_name;
            
            var listnum = i+1;

            $("#unitActivityTbody").append('<tr class="appendTr">'+
                                                '<th scope="row">'+listnum+'</th>'+
                                                '<td><input type="text" class="form-control activityList" id="lessonplan_unit_activity_'+listnum+'" placeholder="請輸入活動名稱" data-saveaction="update" data-baseid="'+baseid+'" value="'+activity_name+'"></td>'+
                                                '<td class="lasttd"><button class="btn btn-danger btnDelete"><i class="far fa-trash-alt"></i></button></td>'+
                                            '</tr>');
            activityandAssessmentDesign_Append(listnum,baseid,activity_name);
        }

        $("#unitName").val(unit_name);
        deleteUnittableTr();
    }
 
}

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

function activityandAssessmentDesign_Append(id,baseid,activity_name){
    var divId = "'activity_"+id+"'";
    var activityDiv = '<div class="row accordion">'+
                            '<div class="card col-9 nopadding" id="cardidactivity_'+id+'">'+
                                '<h5 class="card-header bg-white font-weight-bolder shadow-sm" id="headeractivity_'+id+'" data-toggle="collapse" data-target=".activity_'+id+'">'+activity_name+''+
                                    '<span class="float-right"><i class="fa fa-angle-up" id="activity_'+id+'icon"></i></span>'+
                                '</h5>'+
                                '<div class="card-body collapse show activity_'+id+'" id="activity_'+id+'">'+
                                    '<p class="lessonplan_activity_process_id" style="display:none">'+baseid+'</p>'+
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

    basicData = JSON.parse($("#basicData").text());
    lessonplanActivityProcessData = $("#lessonplanActivityProcessData").text();

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

//新增活動table列表
function addUnitActivitylist(){
    var listnum = $("#unitActivityTbody").find("tr").last().children("th").text();
    listnum++;
    $("#unitActivityTbody").append('<tr class="appendTr">'+
                                        '<th scope="row">'+listnum+'</th>'+
                                        '<td><input type="text" class="form-control activityList" id="lessonplan_unit_activity_'+listnum+'" placeholder="請輸入活動名稱" data-saveaction="new" data-baseid=""></td>'+
                                        '<td class="lasttd"><button class="btn btn-danger btnDelete"><i class="far fa-trash-alt"></i></button></td>'+
                                    '</tr>');
    deleteUnittableTr();
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

//刪除單元活動tabletr
function deleteUnittableTr(){
    $('#unitActivityTbody').on('click','.btnDelete',function(){
        var inputid = $(this).closest('tr').find('.activityList').attr('id');
        var baseid = $("#"+inputid).data("baseid");
        var saveaction = $("#"+inputid).data("saveaction");
        
        //若為已儲存的tr跳出警示窗，Model內會影響到資料庫
        if(saveaction == "update"){
            $("#alertModal").modal("show");
            $("#alertModal").find("#inputid").text(inputid);
            $("#alertModal").find("#deleteid").text(baseid);
        }
        //若為新增的則直接刪除不影響資料庫
        else if(saveaction =="new"){
            $(this).closest('tr').remove();
            $("#unitActivityTbody tr").each(function(index) {
                $(this).find('th:eq(0)').first().html(index + 1);
            });
        }
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
        async:false,
        data:data,
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
            var community_id = $("#community_id").text();
            var lessonplan_version = $("#course_version_info").text();
            var lessonplan_unit_name = $("#unitName").val();
            var lessonplan_activity_name = [];
            $(".activityList").each(function() {
                var activity_name = $(this).val();
                var saveaction = $(this).data("saveaction");
                var baseid = $(this).data("baseid")
                lessonplan_activity_name.push({name:activity_name,saveaction:saveaction,baseid:baseid});
            });          
            var activityString = JSON.stringify(lessonplan_activity_name);
            var data = {
                        stage:divId,
                        lessonplan_version:lessonplan_version,
                        lessonplan_unit_name:lessonplan_unit_name,
                        lessonplan_activity_name:activityString
                    };

            var editing = $("#lessonplan_unit").find(".editing").get().length;

            for(var i=0;i<editing;i++){
                $($("#lessonplan_unit").find(".editing")[i]).removeClass("editing");
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
            break;
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
        console.log(data)
        saveAjax(data);

    }
    else{
        alert('目前沒有資料可以儲存');
    }
    
}

function deleteActivityData(){
    var community_id = $("#community_id").text();
    var lessonplan_version = $("#course_version_info").text();
    var lessonplan_activity_process_id = $("#deleteid").text();
    var inputid = $("#inputid").text();
    var data = {
        community_id:community_id,
        lessonplan_version:lessonplan_version,
        lessonplan_activity_process_id:lessonplan_activity_process_id
    }

    $.ajax({
        url: "/lessonplan/edit/delete",
        type: "POST",
        async:false,
        data:data,
        success: function(data){
            if(data.msg == "ok"){
                // alert("已刪除");
                $("#alertModal").modal('hide');
                $("#"+inputid).closest('tr').remove();
                var newProcessData = data.selectData;
                $("#lessonplanActivityProcessData").text(newProcessData);
                $("#lessonplan_unit").empty();
                $("#setactivity").find('div').remove();
                lessonplan_unit_Set();
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

