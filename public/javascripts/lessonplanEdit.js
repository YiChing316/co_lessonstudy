var pagecontent_Components = [
    {title:'教案基本資料',id:'lessonplan',collapse:'show'},
    {title:'安排課程單元/活動',id:'lessonplan_unit',collapse:'show'},
    {title:'課程學習目標',id:'lessonplan_target',collapse:'none'},
    {title:'學生先備概念',id:'lessonplan_studengknowledge',collapse:'none'},
    {title:'核心素養',id:'lessonplan_cirn',collapse:'none'},
    {title:'議題融入',id:'lessonplan_issue',collapse:'none'},
    {title:'教學資源及器材',id:'lessonplan_resourse',collapse:'none'},
    {title:'教學設計理念',id:'lessonplan_design',collapse:'none'},
    {title:'因材網知識節點',id:'lessonplan_adl',collapse:'none'}
];

function pagecontent_Map(){
    pagecontent_Components.map(function(data){
        var root ="<div class='card' id='cardid"+data.id+"'>"+
                        "<div class='card-header bg-white' id='header"+data.id+"'>"+data.title+
                            "<span class='float-right' data-toggle='collapse' data-target='#"+data.id+"'>"+
                                "<i id='"+data.id+"icon' aria-hidden='true'></i>"+
                            "</span>"+
                        "</div>"+
                        "<div class='card-body collapse' id='"+data.id+"'></div>"+
                    "</div>";
        if(data.collapse == "show"){
            $("#setlesson").append(root);
            $("#"+data.id+"icon").addClass("fa fa-angle-up");
            $("#"+data.id).addClass("show");
        }
        else{
            $("#setlesson").append(root);
            $("#"+data.id+"icon").addClass("fa fa-angle-down");
        }
    })
};

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

var lessonplan_Component = [
    {name:'教案簡介',id:'lessonplan_intro',type:'textarea',parentDiv:'lessonplan'},
    {name:'課程領域',id:'lessonplan_field',type:'select',parentDiv:'lessonplan'},
    {name:'使用版本',id:'lessonplan_version',type:'select',parentDiv:'lessonplan'},
    {name:'學習階段',id:'lessonplan_grade',type:'select',parentDiv:'lessonplan'},
    {name:'授課時間',id:'lessonplan_time',type:'other',parentDiv:'lessonplan'}
];

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

$(function(){
    pagecontent_Map();
    lessonplan_Map();

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

});