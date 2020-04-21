var explore_option = ["課前準備","關鍵提問","探究活動","直接觀察","操作觀察","實驗","概念統整與鞏固","課堂結束"];
var common_option = ["引起動機","發展活動","綜合活動","課堂結束"];
var assessment_option = ["紙筆測驗","口頭評量","實作能力評量","作品評量","態度評量","課室教學記錄","學習反思札記","同儕互評","學習歷程檔案評量","評量指標"];

function trElement(parentid,num,processtarget,processcontent,processtime,processremark){
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
}

function assessmentDiv(td_id,assessmentcontent,tmpname,file){

    $("#"+td_id).append('<div class="assessmentDiv">'+
                            '<hr>'+
                            '<div class="assessment_content">'+assessmentcontent+'</div>'+
                            '<div class="assessment_filename text-muted" data-tmpname="'+tmpname+'">'+file+'</div>'+
                            '<div class="btn-group">'+
                                '<input type="button" class="btn btn-sm btn-link assessment_link_edit" value="編輯">'+
                                '<input type="button" class="btn btn-sm btn-link assessment_link_del" value="刪除">'+
                            '</div>'+
                        '</div>');
}

$(function(){
    
    setActivityProcess();

    processselect_Set();
    assessment_Set();
    processscaffold_Add();
    assessmentscaffold_Add();

    deleteActivityTableTr();
    sortActivityTableTbody();

    openActivityandAssessmentBtn();

    editActivityTr();

    // Add the following code if you want the name of the file appear on select
    $(".custom-file-input").on("change", function() {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
    });
    
})

var processArray = [];
var lessonplanActivityProcessData;

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
        trElement(parentid,num,processtarget,processcontent,processtime,processremark);

        $("#processtarget").removeClass("editing");
        $("#processtime").removeClass("editing");
        $("#processremark").removeClass("editing");
        $("#processcontent_sel_1").removeClass("editing");
        $("#processcontent_sel_2").removeClass("editing");
        isChange = false;

        $("#addprocessModal").modal("hide");
        $("#processcontent").summernote("code",'');
        $("#addprocessModal input[type='text']").val("");
        $("#addprocessModal input[type='number']").val("");
        $("#processalert").hide();

        saveLocalStorage(parentid);

    }  
}

//針對要增加評量的tr，新增評量內容
function addassessmentTd(){
    var community_id = $("#community_id").text();
    var td_id = $("#targetid").text();
    var assessmentcontent = $("#assessmentsummernote").val();
    var fileData = $("#assessmentFile").prop("files")[0];

    if(assessmentcontent == ""){
        $("#assessmentalert").show();
        $("#assessmentalert").html("評量內容為必填");
    }
    else{
        //如果沒有附加檔案的話
        if(fileData == undefined){
            assessmentDiv(td_id,assessmentcontent,"","");

            closeassessmentModal(td_id);
        }
        //有附加檔案則會跑multer暫存的ajax
        else{
            var formData = new FormData();
            formData.append('file',fileData);

            $.ajax({
                url: "/lessonplan/edit/"+community_id+"/uploadfile",
                type: "POST",
                async:false,
                data:formData,
                contentType: false,
                processData: false,
                success: function(data){
                    console.log(data)
                    //上傳的原始檔名
                    var uploadoriginalname = data.originalname;
                    //在暫存區的檔名
                    var uploadfilename = data.filename;
                    //要出現在assessmentDiv的
                    var filediv = '<i class="fas fa-paperclip"></i> '+uploadoriginalname;

                    assessmentDiv(td_id,assessmentcontent,uploadfilename,filediv);
                    closeassessmentModal(td_id);
                },
                error: function(){
                    alert('失敗');
                }
            })
        }
    }
}

//編輯流程tr內容，不會影響評量內容
function editActivityTr(){
    $('.activityTbody').on('click','.btnEdit',function(){
        var parentid = $(this).closest('.card-body').attr('id');
        var tbodyid = $(this).closest('tbody').attr('id');

        var row = $(this).closest('tr');
        var lessonplan_activity_learningtarget = row.find("td:eq(0)").text();
        var lessonplan_activity_content = row.find("td:eq(1)").html();
        var lessonplan_activity_time = row.find("td:eq(2)").text();
        var lessonplan_activity_remark = row.find("td:eq(4)").text();

        var rowindex = row[0].rowIndex;

        var $editmodal = $("#editprocessModal");

        $editmodal.find("#editprocesstarget").val(lessonplan_activity_learningtarget);
        $editmodal.find("#editprocesscontent").summernote('code', lessonplan_activity_content);
        $editmodal.find("#editprocesstime").val(lessonplan_activity_time);
        $editmodal.find("#editprocessremark").val(lessonplan_activity_remark);
        $editmodal.find("#dataindex").text(rowindex);
        $editmodal.find("#tbodyid").text(tbodyid);
        $editmodal.find("#editparentid").text(parentid);

        $editmodal.modal("show");

    });
}

//修改流程modal內的更新按鈕
function editActivityModalBtn(){
    var parentid = $("#editparentid").text();
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

        $("#editprocesstarget").removeClass("editing");
        $("#editprocesstime").removeClass("editing");
        $("#editprocessremark").removeClass("editing");
        $("#editprocesscontent_sel_1").removeClass("editing");
        $("#editprocesscontent_sel_2").removeClass("editing");
        isChange = false;

        $("#editprocessModal").modal("hide");
        $("#editprocesscontent").summernote("code",'');
        $("#editprocessModal input[type='text']").val("");
        $("#editprocessModal input[type='number']").val("");
        $("#editprocessalert").hide();

        saveLocalStorage(parentid);
    }
}

//編輯評量div內容，根據所在的td以及它是td內第幾個assessmentDiv的物件進行修改
function editAssessmentDiv(){
    $(".assessment_link_edit").on('click',function(){
        $div = $(this).closest(".assessmentDiv");
        var $editmodal = $("#editassessmentModal");
        var assessment_content = $div.find("p").text();

        var divindex = $div.index();
        var targetid = $div.parent('td').attr('id');

        $editmodal.find("#divindex").text(divindex);
        $editmodal.find("#edittargetid").text(targetid);
        $editmodal.find("#editassessmentsummernote").summernote('code', assessment_content);

        $editmodal.modal("show");
    });
}

//修改評量modal內的更新按鈕
function editAssessmentModalBtn(){
    var targetid = $("#edittargetid").text();
    var divindex = $("divindex").text();

    var assessmentcontent = $("#editassessmentsummernote").val();

    if(assessmentcontent == ""){
        $("#editassessmentalert").show();
        $("#editassessmentalert").html("評量內容為必填");
    }
    else{
        var div = $("#"+targetid).find(".assessmentDiv:eq("+divindex+")");
        div.find("p").html(assessmentcontent);

        //該活動的id
        var parentdivid = $("#"+targetid).closest(".card-body").attr('id');

        $("#editassessment_sel").removeClass("editing");
        isChange = false;

        $("#editassessmentsummernote").summernote("code",'');
        $("#editassessmentModal").modal("hide");
        $("#editassessmentalert").hide();

        saveLocalStorage(parentdivid);
    }
}

function deleteassessment(){
    $(".assessment_link_del").on('click',function(){
        var parentid = $(this).closest('.card-body').attr('id');
        $(this).closest(".assessmentDiv").remove();
        saveLocalStorage(parentid);
    });
}

function saveLocalStorage(divId){

    var activityContentArray = [];

    var tr_length = $("#"+divId+"Tbody tr").length;

    for(var i=0;i<tr_length;i++){

        var lessonplan_activity_learningtarget = $($("#"+divId+"Tbody tr")[i]).find("td:eq(0)").text();
        var lessonplan_activity_content = $($("#"+divId+"Tbody tr")[i]).find("td:eq(1)").html();
        var lessonplan_activity_time = $($("#"+divId+"Tbody tr")[i]).find("td:eq(2)").text();
        var lessonplan_activity_remark = $($("#"+divId+"Tbody tr")[i]).find("td:eq(4)").text();

        var assessmentArray = [];

        $($("#"+divId+"Tbody tr")[i]).find('.assessmentDiv').each(function(){
            var assessment_content = $(this).find(".assessment_content").text();
            var originalname = $(this).find(".assessment_filename").text();
            var tmpdata = $(this).find(".assessment_filename").data("tmpname");
            assessmentArray.push({assessment_content:assessment_content,assessment_originname:originalname,assessment_tmp:tmpdata})
        })


        activityContentArray.push({lessonplan_activity_learningtarget:lessonplan_activity_learningtarget,
                                    lessonplan_activity_content:lessonplan_activity_content,
                                    lessonplan_activity_time:lessonplan_activity_time,
                                    lessonplan_activity_assessment:assessmentArray,
                                    lessonplan_activity_remark:lessonplan_activity_remark
                                });
        
    }

    var activityContentString = JSON.stringify(activityContentArray);
    
    localStorage.setItem(divId,activityContentString);

}

//放入已經儲存活動流程資料
function setActivityProcess(){
    
    if( lessonplanActivityProcessData.length !== 0){
        // lessonplanActivityProcessData = JSON.parse(lessonplanActivityProcessData);

        for(var i=0; i<lessonplanActivityProcessData.length;i++){

            var processData = lessonplanActivityProcessData[i];
            var number = i+1;
            var parentid = "activity_"+number;

            var lessonplan_activity_content = processData.lessonplan_activity_content;

            if(lessonplan_activity_content.length !== 0){
                lessonplan_activity_content = JSON.parse(lessonplan_activity_content);

                for(var s=0;s<lessonplan_activity_content.length;s++){
                    var contentData = lessonplan_activity_content[s];
                    var num = s+1;
                    var processtarget = contentData.lessonplan_activity_learningtarget;
                    var processcontent = contentData.lessonplan_activity_content;
                    var processtime = contentData.lessonplan_activity_time;
                    var processremark = contentData.lessonplan_activity_remark;
                    var assessmentArray = contentData.lessonplan_activity_assessment;
    
                    trElement(parentid,num,processtarget,processcontent,processtime,processremark);
    
                    for(var r=0;r<assessmentArray.length;r++){
                        var assessmentData= assessmentArray[r];
                        var td_id = parentid+"_assessmentTd_"+num;
                        var assessment_content = assessmentData.assessment_content;
                        var content = "<p>"+assessment_content+"</p>";
                        assessmentDiv(td_id,content);
                        deleteassessment();
                        editAssessmentDiv();
                    }
    
                }
            }

        }  
    }
}

//刪除該table內tbody的tr
function deleteActivityTableTr(){
    $('.activityTbody').on('click','.btnDelete',function(){
        var parentid = $(this).closest('.card-body').attr('id');
        $(this).closest('tr').remove();
        $(".activityTbody tr").each(function(index) {
            $(this).find('th:eq(0)').first().html(index + 1);
        });

        saveLocalStorage(parentid);
    });
}

//重新排序該table內tbody的順序編號
function sortActivityTableTbody(){
    $('.activityTbody').sortable( {
        update: function(){
            $(this).children().each(function(index) {
                $(this).find('th:eq(0)').first().html(index + 1);
            });
            var parentid = $(this).closest('.card-body').attr('id');

            saveLocalStorage(parentid);
        }
    });
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
        $(".assessment_sel").append('<option value="'+data+'">'+data+'</option>');
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

    $("#editassessment_sel").change(function(){
        var value = $("#editassessment_sel :selected").val();
        $("#editassessmentsummernote").summernote('pasteHTML', value);
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
            $("#processtarget").removeClass("editing");
            $("#processtime").removeClass("editing");
            $("#processremark").removeClass("editing");
            $("#processcontent_sel_1").removeClass("editing");
            $("#processcontent_sel_2").removeClass("editing");
            isChange = false;
            break;
        case 'addprocessModal':
            $("#processcontent").summernote("code",'');
            $("#addprocessModal input[type='text']").val("");
            $("#addprocessModal input[type='number']").val("");
            $("#processalert").hide();
            $("#editprocesstarget").removeClass("editing");
            $("#editprocesstime").removeClass("editing");
            $("#editprocessremark").removeClass("editing");
            $("#editprocesscontent_sel_1").removeClass("editing");
            $("#editprocesscontent_sel_2").removeClass("editing");
            isChange = false;
            break;
        case 'addassessmentModal':
            $("#assessmentsummernote").summernote("code",'');
            $("#assessment_sel").removeClass("editing");
            $(".custom-file-input").removeClass("editing");
            $("#assessmentFile").val("");
            $(".custom-file-label").removeClass("selected").html("請選擇檔案");
            $("#assessmentalert").hide();
            isChange = false;
            break;
        case 'editassessmentModal':
            $("#editassessmentsummernote").summernote("code",'');
            $("#editassessment_sel").removeClass("editing");
            $("#editassessmentalert").hide();
            isChange = false;
            break;
        case 'customUnitandActivityModal':
            $("#customActivityTbody .appendTr").remove();
            $("#customUnitandActivityModal input[type='text']").val("");
            $("#customSemester_sel").removeClass("editing");
            $("#unitName").removeClass("editing");
            $(".activityList").removeClass("editing");
            isChange = false;
            break;
        case 'versionUnitandActivityModal':
            $("#unit_sel").val($("#unit_sel option:first").val());
            $("#activity_sel .mycheckbox").remove();
            $("#unit_sel").removeClass("editing");
            isChange = false;
            break;
    }
}

//新增評量的modal點選加入按鈕時一定會做的動作，因一直重複故拉出為一個function
function closeassessmentModal(td_id){
    $("#assessment_sel").removeClass("editing");
    $(".custom-file-input").removeClass("editing");
    isChange = false;

    $("#assessmentsummernote").summernote("code",'');
    $("#assessmentFile").val("");
    $(".custom-file-label").removeClass("selected").html("請選擇檔案");
    $("#addassessmentModal").modal("hide");
    $("#assessmentalert").hide();
    deleteassessment();
    editAssessmentDiv();

    //該活動的id
    var parentdivid = $("#"+td_id).closest(".card-body").attr('id');

    saveLocalStorage(parentdivid);
}

function resetsummernote(){
    $("#assessmentsummernote").summernote("code",'');
    $("#editassessmentsummernote").summernote("code",'');  
}

