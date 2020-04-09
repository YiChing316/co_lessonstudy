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
                                            '<input type="button" class="btn btn-warning mb-1" value="編輯">'+
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

function addassessmentTd(){
    var td_id = $("#targetid").text();
    var assessmentcontent = $("#assessmentsummernote").val();
    var assessmentDiv = '<div class="assessmentDiv">'+
                            '<hr>'+
                            '<div class="assessment_content">'+assessmentcontent+'</div>'+
                            '<div class="btn-group">'+
                                '<input type="button" class="btn btn-sm btn-link assessment_link" value="編輯">'+
                                '<input type="button" class="btn btn-sm btn-link assessment_link_del" onclick="deleteassessment()" value="刪除">'+
                            '</div>'+
                        '</div>';
    $("#"+td_id).append(assessmentDiv);
    $("#assessmentsummernote").summernote("code",'');
    $("#addassessmentModal").modal("hide");
}





/*****活動與評量的modal相關js******************************************************* */

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
        $("#processcontent_sel_2").append($("<option value='" + explore_option[i] + "'>" + explore_option[i] + "</option>"));
    });

    $("#processcontent_sel_1").change(function(){
        switch(parseInt($(this).val())){
            case 0:
                $("#processcontent_sel_2 option").remove();
                break;
            case 1:
                $("#processcontent_sel_2 option").remove();
                $.each(explore_option, function(i, val) {
                    $("#processcontent_sel_2").append($("<option value='" + explore_option[i] + "'>" + explore_option[i] + "</option>"));
                }); 
                break;
            case 2:
                $("#processcontent_sel_2 option").remove();
                $.each(common_option, function(i, val) {
                    $("#processcontent_sel_2").append($("<option value='" + common_option[i] + "'>" + common_option[i] + "</option>"));
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
    $(this).find('.assessmentDiv').remove();
}