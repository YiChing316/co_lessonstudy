
/*將教案實作的內容以模組方式append出來 */

var lessonplan_Component = [
    {name:'教案簡介',id:'lessonplan_intro',type:'textarea',parentDiv:'lessonplan'},
    {name:'課程領域',id:'lessonplan_field',type:'select',parentDiv:'lessonplan'},
    {name:'使用版本',id:'lessonplan_version',type:'select',parentDiv:'lessonplan'},
    {name:'學習階段',id:'lessonplan_grade',type:'select',parentDiv:'lessonplan'},
    {name:'授課時間',id:'lessonplan_time',type:'other',parentDiv:'lessonplan'}
];

//會使用到ckeditor的位置
var lessonplanstage_Component = [
    {id:'lessonplan_target',createDiv:'targetTextarea'},
    {id:'lessonplan_studentknowledge',createDiv:'studentknowledgeTextarea'},
    {id:'lessonplan_resource',createDiv:'resourceTextarea'},
    {id:'lessonplan_design',createDiv:'designTextarea'}
];

var twoselect_Component = [
    {labelname:'核心素養',firstselid:'core_competency_dimesion_sel',secondselid:'core_competency_item_sel',bodyname:'core_competency_body',parentDiv:'lessonplan_cirn'},
    {labelname:'選擇所對應的因材網知識節點',firstselid:'adl_knowledgenode_unit_sel',secondselid:'adl_knowledgenode_node_sel',bodyname:'adl_body',parentDiv:'lessonplan_adl'}
];

var threeselect_Component = [
    {labelname:'學習表現',firstselid:'performancefocus_item',secondselid:'performancefocus_childitem',threeselid:'performancefocus_content',bodyname:'performancefocus_body',parentDiv:'cirn-form2'},
    {labelname:'學習內容',firstselid:'contentfocus_item',secondselid:'contentfocus_childitem',threeselid:'contentfocus_content',bodyname:'contentfocus_body',parentDiv:'cirn-form2'},
    {labelname:'議題融入',firstselid:'issue_name',secondselid:'issue_learning_theme',threeselid:'issue_content',bodyname:'issue_body',parentDiv:'lessonplan_issue'}
];


/*****************內容元件 *****************************************************************************/
function textareaDiv(componentname,componentid,parentDiv){
    $('#'+parentDiv).append('<div class="form-group row">'+
                                '<label class="control-label col-sm-2">'+componentname+'</label>'+
                                '<div class="col-sm-10">'+
                                '<textarea id="'+componentid+'" class="form-control" rows="5"></textarea>'+
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
    $('#'+parentDiv).append('<div class="bt-group float-right pt-2">'+
                                '<input type="button" class="btn btn-secondary" value="清除">'+
                                '<input type="button" class="btn btn-primary ml-1" value="儲存">'+
                            '</div>');
};

function ckeditorDiv(parentDiv){
    ClassicEditor
        .create( document.querySelector( '#'+parentDiv ) )
        .catch( error => {
            console.error( error );
    });
}

function twoselectDiv(labelname,firstselid,secondselid,bodyname,parentDiv){
    $('#'+parentDiv).append('<div class="form-group">'+
                                '<label class="control-label font-weight-bolder">'+labelname+'</label>'+
                                '<div class="row">'+
                                '<div class="col-sm-4">'+
                                    '<select class="form-control" id="'+firstselid+'"></select>'+
                                '</div>'+
                                '<div class="col-sm-7">'+
                                    '<select class="form-control" id="'+secondselid+'"></select>'+
                                ' </div>'+
                                '<div class="col">'+
                                    '<input type="button" class="btn btn-outline-info" value="加入">'+
                                '</div>'+
                                '</div>'+
                                '<hr>'+
                                '<div id="'+bodyname+'"></div>'+
                            '</div>');
}

function threeselecDiv(labelname,firstselid,secondselid,threeselid,bodyname,parentDiv){
    $('#'+parentDiv).append('<div class="form-group">'+
                                '<label class="control-label">'+labelname+'</label>'+
                                '<div class="row">'+
                                    '<div class="col-sm-4">'+
                                    '<select class="form-control" id="'+firstselid+'"></select>'+
                                    '</div>'+
                                    '<div class="col-sm-7">'+
                                    '<select class="form-control" id="'+secondselid+'"></select>'+
                                    '</div>'+
                                '</div>'+
                                '<div class="row mt-2">'+
                                    '<div class="col-sm-11">'+
                                    '<select class="form-control" id="'+threeselid+'"></select>'+
                                    '</div>'+
                                    '<div class="col">'+
                                    '<input type="button" class="btn btn-outline-info" value="加入">'+
                                    '</div>'+
                                '</div>'+
                                '<hr>'+
                                '<div id="'+bodyname+'"></div>'+
                            '</div>');
}



/*****************append元件 *****************************************************************************/
function lessonplan_Map(){
    lessonplan_Component.map(function(data){
        if(data.type == 'textarea'){
            textareaDiv(data.name,data.id,data.parentDiv);
        }
        else if(data.type == 'select'){
            if(data.id == 'lessonplan_field'){
                selectDiv(data.name,data.id,data.parentDiv);
                $('#'+data.id).append('<option value="國">國語</option>'+
                                        '<option value="英">英語</option>'+
                                        '<option value="自">自然</option>'+
                                        '<option value="數">數學</option>');
            }
            else if(data.id == 'lessonplan_version'){
                selectDiv(data.name,data.id,data.parentDiv);
                $('#'+data.id).append('<option value="康軒">康軒</option>'+
                                        '<option value="南一">南一</option>'+
                                        '<option value="翰林">翰林</option>'+
                                        '<option value="自編">自編</option>');
            }
            else if(data.id == 'lessonplan_grade'){
                selectDiv(data.name,data.id,data.parentDiv);
                $('#'+data.id).append('<option value="3年級">3年級</option>'+
                                        '<option value="4年級">4年級</option>'+
                                        '<option value="5年級">5年級</option>'+
                                        '<option value="6年級">6年級</option>'+
                                        '<option value="國中">第四學習階段(國中)</option>'+
                                        '<option value="高中">第五學習階段(高中)</option>');
            }
        }
        else{
            $('#lessonplan').append('<div class="form-group row">'+
                                        '<label class="control-label col-sm-2">'+data.name+'</label>'+
                                        '<div class="col-sm"><input type="text" id="'+data.name+'_class" class="form-control"></div>'+
                                        '<div class="col-sm-1"><label>節課，共</label></div>'+
                                        '<div class="col-sm"><input type="text" id="'+data.name+'_minutes" class="form-control"></div>'+
                                        '<div class="col-sm-1"><label>分鐘</label></div>'+ 
                                    '</div>');
        }
    })
    buttonDiv('lessonplan');
};

var unitData,activityData;

function lessonplan_unit_Set(){
    $("#lessonplan_unit").append('<div class="row">'+
                                    '<div class="card col">'+
                                    '<div class="card-header bg-selfgreen">單元</div>'+
                                    '<div class="card-body">'+
                                        '<select class="form-control col" id="unit_sel" size="10"></select>'+
                                    '</div>'+
                                    '</div>'+
                                    '<div class="card col">'+
                                    '<div class="card-header bg-selfgreen">活動</div>'+
                                    '<div class="card-body">'+
                                        '<select class="form-control col" id="activity_sel" size="10"></select>'+
                                    '</div>'+
                                    '</div>'+
                                '</div>');
    buttonDiv('lessonplan_unit');
    unit_Map();
}

function unit_Map(){
    unitData = sortByKey(unitData,'course_id');

    for(var i=0; i<unitData.length;i++){
        var course = unitData[i];
        var course_id = course.course_id;
        var course_field = course.course_field;
        var course_version = course.course_version;
        var course_grade = course.course_grade;
        var course_unit_name = course.course_unit_name;
        var course_semester = course.course_semester;
        activity_Map(course_field,course_version,course_grade,course_unit_name);
        if(course_semester=='上學期'){
            $('#unit_sel').append('<option value="'+course_unit_name+'">'+course_id+' '+course_field+' '+course_version+' '+course_grade+' '+course_semester+' '+course_unit_name+'</option>');
        }
        else{
            $('#unit_sel').append('<option value="'+course_unit_name+'">'+course_id+' '+course_field+' '+course_version+' '+course_grade+' '+course_semester+' '+course_unit_name+'</option>');
        }
    }

}

//根據領域版本年級的單元名稱形成array
function activity_Map(course_field,course_version,course_grade,course_unit_name){
    activityData = sortByKey(activityData,'course_id');
    var activity_array = [];

    for(var i=0;i<activityData.length;i++){
        var course_activity = activityData[i];
        var course_id = course_activity.course_id;
        var course_activity_field = course_activity.course_field;
        var course_activity_version = course_activity.course_version;
        var course_activity_grade = course_activity.course_grade;
        var course_activity_unit = course_activity.course_unit_name;
        var course_activity_name = course_activity.course_activity_name;
        if(course_activity_field == course_field && 
            course_activity_version == course_version && 
            course_activity_grade == course_grade && 
            course_activity_unit == course_unit_name){
            activity_array.push(course_id+' '+course_activity_name);
        }
    }

    $("#unit_sel").change(function(){
        switch ($(this).val()){
      
            case 0: 
                $("#activity_sel option").remove();
            break;
            case course_unit_name: 
                $("#activity_sel option").remove();
                var array = activity_array;
                //利用each遍歷array中的值並將每個值新增到Select中
                $.each(array, function(i, val) {
                    $("#activity_sel").append($("<option value='" + array[i] + "'>" + array[i] + "</option>"));
                });      
            break;
        }
    });
}

//將需要ckeditor的stage放入
function lessonplanstage_Map(){
    lessonplanstage_Component.map(function(data){
        $('#'+data.id).append('<div id="'+data.createDiv+'"></div>');
        ckeditorDiv(data.createDiv);
        buttonDiv(data.id);
    })
}

function twoselect_Map(){
    twoselect_Component.map(function(data){
        twoselectDiv(data.labelname,data.firstselid,data.secondselid,data.bodyname,data.parentDiv);
    })
}

function cirn_Set(){
    $('#lessonplan_cirn').append('<div class="form-group" id="cirn-form2">'+
                                    '<label class="control-label font-weight-bolder">學習重點</label>'+
                                '</div>');
}

function threeselect_Map(){
    threeselect_Component.map(function(data){
        threeselecDiv(data.labelname,data.firstselid,data.secondselid,data.threeselid,data.bodyname,data.parentDiv);
    })
}






/******************************************************************************** */

$(function(){
    unitData = JSON.parse($("#unitData").text());
    activityData = JSON.parse($("#activityData").text());
    $("#unitData").remove();
    $("#activityData").remove();

    lessonplan_Map();
    lessonplan_unit_Set();
    lessonplanstage_Map();
    twoselect_Map();
    cirn_Set();
    threeselect_Map();

})

//array排序
function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}