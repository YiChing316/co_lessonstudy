
/*將教案實作的內容以模組方式append出來 */

var lessonplan_Component = [
    {name:'教案簡介',id:'lessonplan_intro',type:'textarea',parentDiv:'lessonplan'},
    {name:'課程領域',id:'lessonplan_field',type:'select',parentDiv:'lessonplan'},
    {name:'使用版本',id:'lessonplan_version',type:'select',parentDiv:'lessonplan'},
    {name:'學習階段',id:'lessonplan_grade',type:'select',parentDiv:'lessonplan'},
    {name:'授課時間',id:'lessonplan_time',type:'other',parentDiv:'lessonplan'}
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
    $('#'+parentDiv).append('<div class="bt-group float-right">'+
                                '<input type="button" class="btn btn-secondary" value="清除">'+
                                '<input type="button" class="btn btn-primary" value="儲存">'+
                            '</div>');
};



/*****************append元件 *****************************************************************************/
function lessonplan_Map(){
    lessonplan_Component.map(function(data){
        if(data.type == 'textarea'){
            textareaDiv(data.name,data.id,data.parentDiv);
        }
        else if(data.type == 'select'){
            if(data.id == 'lessonplan_field'){
                selectDiv(data.name,data.id,data.parentDiv);
                $('#'+data.id).append('<option>國語</option>'+
                                        '<option>英語</option>'+
                                        '<option>自然</option>'+
                                        '<option>數學</option>');
            }
            else if(data.id == 'lessonplan_version'){
                selectDiv(data.name,data.id,data.parentDiv);
                $('#'+data.id).append('<option>康軒</option>'+
                                        '<option>南一</option>'+
                                        '<option>翰林</option>'+
                                        '<option>自編</option>');
            }
            else if(data.id == 'lessonplan_grade'){
                selectDiv(data.name,data.id,data.parentDiv);
                $('#'+data.id).append('<option>第一學習階段(國小低年級-1.2年級)</option>'+
                                        '<option>第二學習階段(國小中年級-3.4年級)</option>'+
                                        '<option>第三學習階段(國小高年級-5.6年級)</option>'+
                                        '<option>第四學習階段(國中)</option>'+
                                        '<option>第五學習階段(高中)</option>');
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
                                        '<select class="form-control col" id="sel" size="10"></select>'+
                                    '</div>'+
                                    '</div>'+
                                    '<div class="card col">'+
                                    '<div class="card-header bg-selfgreen">活動</div>'+
                                    '<div class="card-body">'+
                                        '<select class="form-control col" id="sel2" size="10"></select>'+
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
        var course_unit_name = course.course_unit_name;
        var course_semester = course.course_semester;
        if(course_semester=='上學期'){
            $('#sel').append('<option value="1">'+course_id+' '+course_semester+' '+course_unit_name+'</option>');
        }
        else{
            $('#sel').append('<option value="2">'+course_id+' '+course_semester+' '+course_unit_name+'</option>');
        }
    }
}

function activity_Map(){
    activityData = sortByKey(activityData,'course_id');
}

//array排序
function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}



/******************************************************************************** */

$(function(){
    unitData = JSON.parse($("#unitData").text());
    activityData = JSON.parse($("#activityData").text());
    // $("#unitData").remove();
    // $("#activityData").remove();

    lessonplan_Map();
    lessonplan_unit_Set();
    

    $("#sel").change(function(){
        switch (parseInt($(this).val())){
      
            case 0: 
                $("#sel2 option").remove();
            break;
            case 1: 
                $("#sel2 option").remove();
                var array = [ "美國", "台灣", "中國", "英國", "法國" ];
                //利用each遍歷array中的值並將每個值新增到Select中
                $.each(array, function(i, val) {
                    $("#sel2").append($("<option value='" + array[i] + "'>" + array[i] + "</option>"));
                });      
            break;
            case 2: 
                $("#sel2 option").remove();
                var array = [ "歐洲", "亞洲", "非洲", "大洋洲", "南美洲", "北美洲", "南極洲" ];
                //利用each遍歷array中的值並將每個值新增到Select中
                $.each(array, function(i, val) {
                    $("#sel2").append($("<option value='" + array[i] + "'>" + array[i] + "</option>"));
                });      
            break;
          }
      });
})