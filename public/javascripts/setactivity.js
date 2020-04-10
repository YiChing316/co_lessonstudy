var explore_option = ["課前準備","關鍵提問","探究活動","直接觀察","操作觀察","實驗","概念統整與鞏固","課堂結束"];
var common_option = ["引起動機","發展活動","綜合活動","課堂結束"];
var assessment_option = ["紙筆測驗","口頭評量","實作能力評量","作品評量","態度評量","課室教學記錄","學習反思札記","同儕互評","學習歷程檔案評量","評量指標"];

$(function(){
    
    processselect_Set();
    assessment_Set();
    processscaffold_Add();
    assessmentscaffold_Add();

    openActivityandAssessmentBtn();

    sorttableTbody('.activityTbody');
    deletetableTr('.activitytable tbody');
    editActivityTr();

})

//新增活動流程
function addactivityTr(){
    var parentid = $("#parentid").text();

    var processtarget = $("#processtarget").val();
    var processcontent = $("#processcontent").val();
    var processtime = $("#processtime").val();
    var processremark = $("#processremark").val();
    
    var num = $("#"+parentid+"Tbody tr").length+1;

    if(processcontent == "" || processtime == ""){
        $("#processalert").show();
        $("#processalert").html("活動流程與時間為必填");
    }
    else{
        //活動編號根據所在的位置id
        $("#"+parentid+"Tbody").append('<tr>'+
                                        '<th scope="row">'+num+'</th>'+
                                        '<td>'+processtarget+'</td>'+
                                        '<td>'+processcontent+'</td>'+
                                        '<td>'+processtime+'</td>'+
                                        '<td id="'+parentid+'_assessmentTd_'+num+'">'+
                                            '<a href="" class="assessment_link font-weight-bolder" class="assessment_link font-weight-bolder" data-toggle="modal" data-target="#addassessmentModal" data-targettr="'+parentid+'_assessmentTd_'+num+'">新增評量方式...</a>'+
                                        '</td>'+
                                        '<td>'+processremark+'</td>'+
                                        '<td>'+
                                            '<input type="button" class="btn btn-warning mb-1 btnEdit" data-parentdivid="'+parentid+'" value="編輯">'+
                                            '<input type="button" class="btn btn-danger btnDelete" value="刪除">'+
                                        '</td>'+
                                    '</tr>');

        $("#addprocessModal").modal("hide");
        $("#processcontent").summernote("code",'');
        $("#addprocessModal input[type='text']").val("");
        $("#addprocessModal input[type='number']").val("");
        $("#processalert").hide();

    }  
}

//針對要增加評量的tr，新增評量內容
function addassessmentTd(){
    var td_id = $("#targetid").text();
    var assessmentcontent = $("#assessmentsummernote").val();
    var assessmentDiv = '<div class="assessmentDiv">'+
                            '<hr>'+
                            '<div class="assessment_content">'+assessmentcontent+'</div>'+
                            '<div class="btn-group">'+
                                '<input type="button" class="btn btn-sm btn-link assessment_link" value="編輯">'+
                                '<input type="button" class="btn btn-sm btn-link assessment_link_del" value="刪除">'+
                            '</div>'+
                        '</div>';
    $("#"+td_id).append(assessmentDiv);
    $("#assessmentsummernote").summernote("code",'');
    $("#addassessmentModal").modal("hide");
    deleteassessment();
}

//編輯流程tr內容，不會影響評量內容
function editActivityTr(){
    $('.activityTbody').on('click','.btnEdit',function(){
        var tbodyid = $(this).closest('tbody').attr('id');

        var row = $(this).closest('tr');
        var lessonplan_activity_learningtarget = row.find("td:eq(0)").text();
        var lessonplan_activity_content = row.find("td:eq(1)").html();
        var lessonplan_activity_time = row.find("td:eq(2)").text();
        var lessonplan_activity_remark = row.find("td:eq(4)").text();

        console.log(lessonplan_activity_content)

        var rowindex = row[0].rowIndex;

        var $editmodal = $("#editprocessModal");

        $editmodal.find("#editprocesstarget").val(lessonplan_activity_learningtarget);
        $editmodal.find("#editprocesscontent").summernote('code', lessonplan_activity_content);
        $editmodal.find("#editprocesstime").val(lessonplan_activity_time);
        $editmodal.find("#editprocessremark").val(lessonplan_activity_remark);
        $editmodal.find("#dataindex").text(rowindex);
        $editmodal.find("#tbodyid").text(tbodyid);

        $editmodal.modal("show");

    });
}

//修改流程modal內的更新按鈕
function editActivityModalBtn(){
    var tbodyid = $("#tbodyid").text();
    //eq開始數字為0，但rowIdex是從1開始抓，應該是因為thead內的tr rowinde算0，但這邊是從tbody開始去跑eq故要減1
    var dataindex = $("#dataindex").text()-1;

    var processtarget = $("#editprocesstarget").val();
    var processcontent = $("#editprocesscontent").val();
    var processtime = $("#editprocesstime").val();
    var processremark = $("#editprocessremark").val();
    

    if(processcontent == "" || processtime == ""){
        $("#editprocessalert").show();
        $("#editprocessalert").html("活動流程與時間為必填");
    }
    else{
        
        var row = $("#"+tbodyid+" tr:eq("+dataindex+")");

        row.find("td:eq(0)").text(processtarget);
        row.find("td:eq(1)").html(processcontent);
        row.find("td:eq(2)").text(processtime);
        row.find("td:eq(4)").text(processremark);


        $("#editprocessModal").modal("hide");
        $("#editprocesscontent").summernote("code",'');
        $("#editprocessModal input[type='text']").val("");
        $("#editprocessModal input[type='number']").val("");
        $("#editprocessalert").hide();
    }
}





/*****活動與評量的modal相關js******************************************************* */
//打開新增活動流程以及評量modal會發生的事情
function openActivityandAssessmentBtn(){

    $("#addprocessModal").on("show.bs.modal",function(event){
        var button = $(event.relatedTarget);
        //該活動的id
        var parentid = button.data('parentdivid');
        var modal = $(this);
        modal.find('#parentid').text(parentid);
    })

    $("#addassessmentModal").on("show.bs.modal",function(event){
        var button = $(event.relatedTarget);
        //該活動的階段的tr的id
        var id = button.data('targettr');
        var modal = $(this);
        modal.find('#targetid').text(id);
    })
}


//活動流程內鷹架放入select option
function processselect_Set(){
    $.each(explore_option, function(i, val) {
        $(".processcontent_sel_2").append($("<option value='" + explore_option[i] + "'>" + explore_option[i] + "</option>"));
    });

    $(".processcontent_sel_1").change(function(){
        switch(parseInt($(this).val())){
            case 0:
                $(".processcontent_sel_2 option").remove();
                break;
            case 1:
                $(".processcontent_sel_2 option").remove();
                $.each(explore_option, function(i, val) {
                    $(".processcontent_sel_2").append($("<option value='" + explore_option[i] + "'>" + explore_option[i] + "</option>"));
                }); 
                break;
            case 2:
                $(".processcontent_sel_2 option").remove();
                $.each(common_option, function(i, val) {
                    $(".processcontent_sel_2").append($("<option value='" + common_option[i] + "'>" + common_option[i] + "</option>"));
                });
                break;
        }
    })
}
//評量鷹架放入select option
function assessment_Set(){
    assessment_option.map(function(data){
        $("#assessment_sel").append('<option value="'+data+'">'+data+'</option>');
    })
}

//在textarea放入選擇的活動流程模組
function processscaffold_Add(){
    $("#processcontent_sel_2").change(function(){
        var value = $("#processcontent_sel_2 :selected").val();
        var string = "<b><font style='background-color: rgb(255, 231, 206);'>"+value+"</font></b>";
        $("#processcontent").summernote('pasteHTML', string);
    })

    $("#editprocesscontent_sel_2").change(function(){
        var value = $("#editprocesscontent_sel_2 :selected").val();
        var string = "<b><font style='background-color: rgb(255, 231, 206);'>"+value+"</font></b>";
        $("#editprocesscontent").summernote('pasteHTML', string);
    })
}
//在textarea放入選擇的評量模組
function assessmentscaffold_Add(){
    $("#assessment_sel").change(function(){
        var value = $("#assessment_sel :selected").val();
        $("#assessmentsummernote").summernote('pasteHTML', value);
    })
}

//彈出視窗closebtn的function，清空所有填寫框
function modalclosebtn(modalid){
    switch (modalid){
        case 'editprocessModal':
            $("#editprocesscontent").summernote("code",'');
            $("#editprocessModal input[type='text']").val("");
            $("#editprocessModal input[type='number']").val("");
            $("#editprocessalert").hide();
            break;
        case 'addprocessModal':
            $("#processcontent").summernote("code",'');
            $("#addprocessModal input[type='text']").val("");
            $("#addprocessModal input[type='number']").val("");
            $("#processalert").hide();
            break;
        case 'addassessmentModal':
            $("#assessmentsummernote").summernote("code",'');
            break;
        case 'customUnitandActivityModal':
            $("#customActivityTbody .appendTr").remove();
            $("#customUnitandActivityModal input[type='text']").val("");
            break;
        case 'versionUnitandActivityModal':
            $("#unit_sel").val($("#unit_sel option:first").val());
            $("#activity_sel .mycheckbox").remove();
            break;
    }
}

function resetsummernote(){
    $("#assessmentsummernote").summernote("code",'');  
}

function deleteassessment(){
    $(".assessment_link_del").on('click',function(){
        $(this).closest(".assessmentDiv").remove();
    });
}