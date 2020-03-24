var explore_option = ["課前準備","關鍵提問","探究活動","直接觀察","操作觀察","實驗","概念統整與鞏固","課堂結束"];
var common_option = ["引起動機","發展活動","綜合活動","課堂結束"];

$(function(){
    sorttableTbody('.activityTbody');
    deletetableTr('.activityTbody');
    processselect_Set();
    processscaffold_Add();
})

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

//新增活動流程模組
function processscaffold_Add(){
    $("#processcontent_sel_2").change(function(){
        var value = $("#processcontent_sel_2 :selected").val();
        var string = "<b><font style='background-color: rgb(255, 231, 206);'>"+value+"</font></b>";
        $("#processcontent").summernote('pasteHTML', string);
    })
}

function addactivityTr(){
    var processtarget = $("#processtarget").val();
    var processcontent = $("#processcontent").val();
    var processtime = $("#processtime").val();
    var processremark = $("#processremark").val();

    var num = $("#activity_1Tbody").find("tr").last().children("th").text();
    num++

    if(processcontent == "" || processtime == ""){
        $("#processalert").show();
        $("#processalert").html("活動流程與時間為必填");
    }
    else{
        $("#activity_1Tbody").append('<tr>'+
                                    '<th scope="row">'+num+'</th>'+
                                    '<td>'+processtarget+'</td>'+
                                    '<td>'+processcontent+'</td>'+
                                    '<td>'+processtime+'</td>'+
                                    '<td>'+
                                        '<a href="" class="assessment_link font-weight-bolder" class="assessment_link font-weight-bolder" data-toggle="modal" data-target="#addassessmentModal">新增評量方式...</a>'+
                                    '</td>'+
                                    '<td>'+processremark+'</td>'+
                                    '<td>'+
                                        '<input type="button" class="btn btn-warning mb-1" value="編輯">'+
                                        '<input type="button" class="btn btn-danger btnDelete" value="刪除">'+
                                    '</td>'+
                                '</tr>');
        $("#addprocessModal").modal("hide");
        $("#processcontent").summernote("reset");
        $("#addprocessModal input[type='text']").val("");
    }  
}