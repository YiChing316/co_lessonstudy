var explore_option = ["課前準備","關鍵提問","探究活動","直接觀察","操作觀察","實驗","概念統整與鞏固","課堂結束"];
var common_option = ["引起動機","發展活動","綜合活動","課堂結束"];
var assessment_option = ["紙筆測驗","口頭評量","實作能力評量","作品評量","態度評量","課室教學記錄","學習反思札記","同儕互評","學習歷程檔案評量","評量指標"];
var custom_option;

function trElement(parentid,num,processtarget,processcontent,processtime,processremark){
    $("#"+parentid+"Tbody").append('<tr>'+
                                        '<td>'+
                                            '<a href="javascript:void(0)" class="up"><i class="far fa-arrow-alt-circle-up fa-lg my-2"></i></a>'+
                                            '<a href="javascript:void(0)" class="down"><i class="far fa-arrow-alt-circle-down fa-lg my-2"></i></a>'+
                                        '</td>'+
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

function assessmentDiv(td_id,assessmentcontent,tmpmimetype,tmppath,file){

    $("#"+td_id).append('<div class="assessmentDiv">'+
                            '<hr>'+
                            '<div class="assessment_content">'+assessmentcontent+'</div>'+
                            '<div class="assessment_filename text-muted" data-mimetype="'+tmpmimetype+'" data-tmppath="'+tmppath+'">'+file+'</div>'+
                            '<div class="btn-group">'+
                                '<input type="button" class="btn btn-sm btn-link assessment_link_edit" value="編輯">'+
                                '<input type="button" class="btn btn-sm btn-link assessment_link_del" value="刪除">'+
                            '</div>'+
                        '</div>');
}

//活動與評量設計內table顯示
function activityandAssessmentDesign_Append(id,baseid,unit_name,activity_name,title){
    var divId = "'activity_"+id+"'";
    var activityDiv = '<div class="row accordion activityRow">'+
                            '<div class="card col-9 nopadding" id="cardidactivity_'+id+'">'+
                                '<h5 class="card-header bg-white font-weight-bolder shadow-sm" id="headeractivity_'+id+'" data-toggle="collapse" data-target=".activity_'+id+'" data-unitname="'+unit_name+'" data-activityname="'+activity_name+'">'+title+''+
                                    '<a href="javascript:void(0)" class="editActivity ml-2" style="color: #ED557E"><i class="far fa-edit"></i></a>'+
                                    '<span class="float-right"><i class="fa fa-angle-up collapseicon" id="activity_'+id+'icon"></i></span>'+
                                '</h5>'+
                                '<div class="card-body collapse show activity_'+id+'" id="activity_'+id+'">'+
                                    '<p class="lessonplan_activity_process_id" style="display:none">'+baseid+'</p>'+
                                    '<button class="btn btn-outline-info" data-toggle="modal" data-target="#addprocessModal" data-parentdivid="activity_'+id+'"><i class="fas fa-plus"></i> 新增活動流程</button>'+
                                    '<table class="table table-bordered activitytable mt-3" id="activity_'+id+'Table">'+
                                        '<thead class="thead-light">'+
                                            '<tr>'+
                                                '<th scope="col" width="40"></th>'+
                                                '<th scope="col" width="40">#</th>'+
                                                '<th scope="col" width="150">學習目標</th>'+
                                                '<th scope="col" width="450">活動流程</th>'+
                                                '<th scope="col" width="60">時間</th>'+
                                                '<th scope="col" width="200">評量方式</th>'+
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

var lessonplanActivityProcessData;

function setActivityCard(){
    if(lessonplanActivityProcessData.length !== 0){
        lessonplanActivityProcessData = $("#lessonplanActivityProcessData").text();
        lessonplanActivityProcessData = JSON.parse(lessonplanActivityProcessData);
        
        for(i in lessonplanActivityProcessData){
            var processData = lessonplanActivityProcessData[i];
            var baseid = processData.lessonplan_activity_process_id;
            var unit_name = processData.lessonplan_unit_name;
            var activity_name = processData.lessonplan_activity_name;
            
            var listnum = parseInt(i)+1;
            activityandAssessmentDesign_Append(listnum,baseid,unit_name,activity_name,unit_name+"-"+activity_name);
        }
    }
    collapseControl();
}

/***活動內資料處理相關function************************************************* */
var twowayTableData = [];
var targetandAssessmentArray = [];

//放入已經儲存活動流程資料
function setActivityProcess(){
    var community_id = $("#community_id").text();

    if( lessonplanActivityProcessData.length !== 0){

        setActivityandTargetData(lessonplanActivityProcessData)
        targetandAssessmentArray = []

        for(var i=0; i<lessonplanActivityProcessData.length;i++){

            var processData = lessonplanActivityProcessData[i];
            var number = i+1;
            var parentid = "activity_"+number;
            var lessonplan_activity_name = processData.lessonplan_activity_name;
            var lessonplan_activity_content = processData.lessonplan_activity_content;

            if(lessonplan_activity_content.length !== 0){
                setLessonplanActivityContent(parentid,lessonplan_activity_name,lessonplan_activity_content);
                // lessonplan_activity_content = JSON.parse(lessonplan_activity_content);

                /*for(var s=0;s<lessonplan_activity_content.length;s++){
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
                        var assessment_originalname = assessmentData.assessment_originalname;
                        var content = "<p>"+assessment_content+"</p>";
                        var filediv = '<i class="fas fa-paperclip mr-1"></i>'+assessment_originalname;
                        var data = {
                            filepath:'./public/communityfolder/community_'+community_id+'/communityfile/'+assessment_originalname
                        }
                        //要出現在assessmentDiv的
                        if(assessment_originalname !== ""){
                            $.ajax({
                                url: "/lessonplan/edit/"+community_id+"/checkfile",
                                type: "POST",
                                async:false,
                                data:data,
                                success: function(data){
                                    if(data.msg == "ok"){
                                        assessmentDiv(td_id,content,"","",filediv);
                                    }
                                    else if(data.msg == "notexist"){
                                        assessmentDiv(td_id,content,"","","");
                                    }
                                },
                                error: function(){
                                    alert('失敗');
                                }
                            })
                        }
                        else{
                            assessmentDiv(td_id,content,"","","");
                        }
                        
                        targetandAssessmentArray.push({lessonplan_activity_name:lessonplan_activity_name,processtarget:processtarget,assessment_content:assessment_content})
                        deleteassessment();
                        editAssessmentDiv();
                    }
                }*/
            }
        }
    }
}

//編輯活動內容時，重新呈現該table內容，用於儲存編輯活動內容時
function setOneCardActivityProcess(selectdata,baseid,parentid){
    for(i in selectdata){
        var processData = selectdata[i];
        var lessonplan_activity_process_id = processData.lessonplan_activity_process_id;
        var lessonplan_activity_name = processData.lessonplan_activity_name;
        if (lessonplan_activity_process_id == baseid){
            var lessonplan_activity_content = processData.lessonplan_activity_content;

            setLessonplanActivityContent(parentid,lessonplan_activity_name,lessonplan_activity_content)
        }
    }
}

//呈現每個table內資料，獨立出來讓不同function皆可使用
function setLessonplanActivityContent(parentid,lessonplan_activity_name,lessonplan_activity_content){
    if(lessonplan_activity_content !== ""){
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
                var assessment_originalname = assessmentData.assessment_originalname;
                var content = "<p>"+assessment_content+"</p>";
                var filediv = '<i class="fas fa-paperclip mr-1"></i>'+assessment_originalname;
                var data = {
                    filepath:'./public/communityfolder/community_'+community_id+'/communityfile/'+assessment_originalname
                }
                //要出現在assessmentDiv的
                if(assessment_originalname !== ""){
                    $.ajax({
                        url: "/lessonplan/edit/"+community_id+"/checkfile",
                        type: "POST",
                        async:false,
                        data:data,
                        success: function(data){
                            if(data.msg == "ok"){
                                assessmentDiv(td_id,content,"","",filediv);
                            }
                            else if(data.msg == "notexist"){
                                assessmentDiv(td_id,content,"","","");
                            }
                        },
                        error: function(){
                            alert('失敗');
                        }
                    })
                }
                else{
                    assessmentDiv(td_id,content,"","","");
                }
                
                targetandAssessmentArray.push({lessonplan_activity_name:lessonplan_activity_name,processtarget:processtarget,assessment_content:assessment_content})
                deleteassessment();
                editAssessmentDiv();
            }
        }
    }
}

//處理活動與學習目標的array
function setActivityandTargetData(lessonplanActivityProcessData){
    twowayTableData = [];
    for( s in lessonplanActivityProcessData){
        var processData = lessonplanActivityProcessData[s];
        var lessonplan_activity_name = processData.lessonplan_activity_name;
        var lessonplan_activity_target = processData.lessonplan_activity_target;

        if(lessonplan_activity_target !== ""){
            var targetArray = lessonplan_activity_target.split(',');
            $.each(targetArray,function(i,val){
                twowayTableData.push({targetName:val,activityName:lessonplan_activity_name})
            })
        }
    }
}

$(function(){
    lessonplanActivityProcessData = $("#lessonplanActivityProcessData").text();
    
    setActivityCard();
    setActivityProcess();
    editActivityCard();

    openActivityandAssessmentBtn();

    assessment_Set();
    processscaffold_Add();
    assessmentscaffold_Add();
    setCustomFileInput();

    deleteActivityTableTr();
    editActivityTr();
    deleteeditfile();

    moveTrPosition();
    addCustomProcessTag();
    collapseControl();
    
})

function editActivityCard(){
    $(".editActivity").click(function(e){
        e.stopPropagation(); 
        var parnetid = $(this).parents(".card").attr("id");
        var unit_name = $("#"+parnetid).find(".card-header").data("unitname");
        var activity_name = $("#"+parnetid).find(".card-header").data("activityname");
        var lessonplan_activity_process_id = $("#"+parnetid).find(".lessonplan_activity_process_id").text();
        $("#editActivityModal").modal("show");
        $("#parentCardId").text(parnetid);
        $("#editunitName").val(unit_name)
        $("#editactivityName").val(activity_name)
        $("#editactivityid").text(lessonplan_activity_process_id)
        //顯示該活動所選取的學習目標
        if(twowayTableData.length !== 0){
            // var results = JSON.parse(twowayTableData[0].lessonplan_twowaytable_content);
            $.each(twowayTableData,function(i,val){
                var target = twowayTableData[i].targetName;
                var activity = twowayTableData[i].activityName;
                if(activity_name == activity){
                    $("#editActivityModal").find("input[value='"+target+"']").prop('checked', true);
                }
            })
        }
    })
}

//開啟編輯活動後，刪除
function deleteActivityCard(){
    var baseid = $("#editactivityid").text();
    var activitycardid = $("#editactivitycardid").text();
    // $("#editActivityModal").modal("hide");
    $("#alertModal").modal("show");
    $("#alertModal").find("#deleteid").text(baseid);
    $("#alertModal").find("#deletecardid").text(activitycardid);
}

//刪除活動
function deleteActivityData(){
    var community_id = $("#community_id").text();
    var lessonplan_activity_process_id = $("#deleteid").text();
    var deletecardid = $("#deletecardid").text();

    var data = {
        community_id:community_id,
        lessonplan_activity_process_id:lessonplan_activity_process_id
    }

    isChange = true;

    $.ajax({
        url: "/lessonplan/edit/"+community_id+"/deleteActivity",
        type: "POST",
        async:false,
        data:data,
        success: function(data){
            if(data.msg == "ok"){
                // alert("已刪除");
                $("#alertModal").modal('hide');
                var newProcessData = data.processData;
                var newNameData = data.nameData;
                $("#lessonplanActivityProcessData").text(newProcessData);
                $("#lessonplanActivityName").text(newNameData);
                activityName = JSON.parse($("#lessonplanActivityName").text());
                $("#activityDesignUl").empty();
                $("#sidebarul").empty();
                sidebar_Map();
                $("#"+deletecardid).parent().remove();
                // $("#lessonplan_targetandActivity").empty();
                // $("#setactivity").find('div').remove();
                // setActivityCard();
                // setActivityProcess();
                // setLessonplanTargetandActivityTable();
                // showtwowayTableData();
                setActivityProcess();
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

/***活動流程************************************************* */

//新增活動流程
function addactivityTr(){
    var parentid = $("#parentid").text();

    var processtarget = [];
    // var processtarget = $("#processtarget").val();
    $("#addprocessModal").find("input[name='processTarget']:checked").each(function(){
        processtarget.push($(this).val());
    })

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
        $(".targetCheckbox").empty();

        saveLocalStorage(parentid);
        moveTrPosition()

    }  
}

//編輯流程tr內容，打開編輯modal，不會影響評量內容
function editActivityTr(){
    $('.activityTbody').on('click','.btnEdit',function(){
        var parentid = $(this).closest('.card-body').attr('id');
        var tbodyid = $(this).closest('tbody').attr('id');

        var title = $("#header"+parentid).data("activityname");
        activityLearningTarget("editprocessModal",title)
        selectCustomProcessTag();

        var row = $(this).closest('tr');
        var lessonplan_activity_learningtarget = row.find("td:eq(1)").text();
        var lessonplan_activity_content = row.find("td:eq(2)").html();
        var lessonplan_activity_time = row.find("td:eq(3)").text();
        var lessonplan_activity_remark = row.find("td:eq(5)").text();

        var rowindex = row[0].rowIndex;

        var $editmodal = $("#editprocessModal");

        var targetarray = lessonplan_activity_learningtarget.split(',');
        targetarray.map(function(data){
             $editmodal.find("input[value='"+data+"']").prop('checked', true);
        })
        // $editmodal.find("#editprocesstarget").val(lessonplan_activity_learningtarget);
        $editmodal.find("#editprocesscontent").summernote('code', lessonplan_activity_content);
        $editmodal.find("#editprocesstime").val(lessonplan_activity_time);
        $editmodal.find("#editprocessremark").val(lessonplan_activity_remark);
        $editmodal.find("#dataindex").text(rowindex);
        $editmodal.find("#tbodyid").text(tbodyid);
        $editmodal.find("#editparentid").text(parentid);

        $editmodal.modal("show");

    });
}

//刪除該table內tbody的tr
function deleteActivityTableTr(){
    $('.activityTbody').on('click','.btnDelete',function(){
        var community_id = $("#community_id").text();
        var parentid = $(this).closest('.card-body').attr('id');
        var $row = $(this).closest('tr');
        //刪除活動流程的同時，如果有已經儲存的檔案也一併刪除
        $row.find('.assessmentDiv').each(function(){
            var originalname = $(this).find(".assessment_filename").text();
            if(originalname !== ""){
                var data = {
                    filename:originalname,
                    filepath:'./public/communityfolder/community_'+community_id+'/communityfile/'
                }
    
                $.ajax({
                    url: "/lessonplan/edit/"+community_id+"/deletefile",
                    type: "POST",
                    async:false,
                    data:data,
                    success: function(data){
                        if(data.msg == "yes"){
                            console.log("已刪除");
                        }
                        else if(data.msg == "notsave"){
                            console.log("未儲存");
                        }
                        else if(data.msg == "no"){
                            window.location = "/member/login";
                        }
                    },
                    error: function(){
                        alert('失敗');
                    }
                })
            }
        })
        $(this).closest('tr').remove();
        $("#"+parentid+"Tbody tr").each(function(index) {
            $(this).find('th:eq(0)').first().html(index + 1);
        });

        saveLocalStorage(parentid);
    });
}

/***活動流程內評量************************************************* */

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
            assessmentDiv(td_id,assessmentcontent,"","","");

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
                    if(data.msg == "no"){
                        window.location = "/member/login";
                    }
                    else if(data.msg =="yes"){
                        var filedata = data.filedata;
                        //上傳的原始檔名
                        var uploadoriginalname = filedata.originalname;
                        //在暫存區的檔名
                        var uploadfilepath = filedata.path;
                        //檔案類型
                        var tmpmimetype = filedata.mimetype;
                        //要出現在assessmentDiv的
                        var filediv = '<i class="fas fa-paperclip mr-1"></i>'+uploadoriginalname;

                        assessmentDiv(td_id,assessmentcontent,tmpmimetype,uploadfilepath,filediv);
                        closeassessmentModal(td_id);
                    }
                    else if(data.msg == "isexist"){
                        alert("已存在相同檔名檔案，請修改檔名後再上傳")
                    }
                },
                error: function(){
                    alert('失敗');
                }
            })
        }
    }
}

//編輯評量div內容，根據所在的td以及它是td內第幾個assessmentDiv的物件進行修改
function editAssessmentDiv(){
    $(".assessment_link_edit").on('click',function(){
        $div = $(this).closest(".assessmentDiv");
        var $editmodal = $("#editassessmentModal");
        var assessment_content = $div.find("p").text();
        var filename = $div.find(".assessment_filename").text();

        var divindex = $div.index();

        var targetid = $div.parent('td').attr('id');
        
        // console.log(filename)

        if(filename == ""){
            $("#showfilename").hide();
            $('#editfilediv').show();
        }
        else{
            $editmodal.find("#editfilename").text(filename);
            $("#showfilename").show();
            $('#editfilediv').hide();
        }
        $editmodal.find("#divindex").text(divindex);
        $editmodal.find("#edittargetid").text(targetid);
        $editmodal.find("#editassessmentsummernote").summernote('code', assessment_content);

        $editmodal.modal("show");
    });
}

function deleteassessment(){
    $(".assessment_link_del").on('click',function(){
        var community_id = $("#community_id").text();
        var parentid = $(this).closest('.card-body').attr('id');
        $(this).closest(".assessmentDiv").remove();
        var $div = $(this).closest(".assessmentDiv");
        var filename = $div.find(".assessment_filename").text();
        var data = {
            filename:filename,
            filepath:'./public/communityfolder/community_'+community_id+'/communityfile/'
        }
        $.ajax({
            url: "/lessonplan/edit/"+community_id+"/deletefile",
            type: "POST",
            async:false,
            data:data,
            success: function(data){
                if(data.msg == "yes"){
                    console.log("已刪除");
                }
                else if(data.msg == "notsave"){
                    console.log("未儲存");
                }
                else if(data.msg == "no"){
                    window.location = "/member/login";
                }
            },
            error: function(){
                alert('失敗');
            }
        })
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

//存入localstorage
function saveLocalStorage(divId){

    var activityContentArray = [];

    var tr_length = $("#"+divId+"Tbody tr").length;

    for(var i=0;i<tr_length;i++){

        var lessonplan_activity_learningtarget = $($("#"+divId+"Tbody tr")[i]).find("td:eq(1)").text();
        var lessonplan_activity_content = $($("#"+divId+"Tbody tr")[i]).find("td:eq(2)").html();
        var lessonplan_activity_time = $($("#"+divId+"Tbody tr")[i]).find("td:eq(3)").text();
        var lessonplan_activity_remark = $($("#"+divId+"Tbody tr")[i]).find("td:eq(5)").text();

        var assessmentArray = [];

        $($("#"+divId+"Tbody tr")[i]).find('.assessmentDiv').each(function(){
            var assessment_content = $(this).find(".assessment_content").text();
            var originalname = $(this).find(".assessment_filename").text();
            var tmpmimetype = $(this).find(".assessment_filename").data("mimetype");
            var tmppath = $(this).find(".assessment_filename").data("tmppath");
            assessmentArray.push({assessment_content:assessment_content,assessment_originalname:originalname,assessment_tmp:tmppath,assessment_mimetype:tmpmimetype})
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


/***學習目標與活動、評量對應表************************************************* */
function openTwoWayTableModal(){
    $("#twowaytableModal").modal("show");
    // setLessonplanTargetandActivityTable();
    // setLessonplanTargetandAssessmentTable();
}

//顯示學習目標與活動對應表
// function setLessonplanTargetandActivityTable(){
//     //須要先有學習目標以及活動名稱才會出現
//     if(targetContent == undefined || activityName == ""){

//     }
//     else{
//         $("#lessonplan_targetandActivity").append('<table id="lessonplanTargetandActivityTable" class="table table-bordered">'+
//                                                     '<thead class="thead-light text-center">'+
//                                                         '<tr><th scope="col"></th></tr>'+
//                                                     '</thead>'+
//                                                     '<tbody></tbody>'+
//                                                 '</table>');

//         $.each(targetContent,function(i,val){
//             $("#lessonplanTargetandActivityTable").find("tbody").append('<tr data-targetname="'+targetContent[i]+'"><td>'+targetContent[i]+'</td></tr>')
//         })
//         $.each(activityName,function(i,val){
//             var name = activityName[i].lessonplan_activity_name;
//             $("#lessonplanTargetandActivityTable").find("thead tr").append('<th scope="col">'+name+'</th>');
//         })

//         var tr_length = $("#lessonplanTargetandActivityTable").find("tbody tr").length;
//         for(var s=0;s<tr_length;s++){
//             var tr_index = $($("#lessonplanTargetandActivityTable").find("tbody tr")[s]).index();
//             $.each(activityName,function(i,val){
//                 var name = activityName[i].lessonplan_activity_name;
//                 var checkid = name+tr_index;
//                 $("#lessonplanTargetandActivityTable").find("tbody tr:eq("+tr_index+")").append(
//                     '<td class="text-center" width="120">'+
//                         '<div class="custom-control custom-checkbox">'+
//                             '<input type="checkbox" class="custom-control-input" id="'+checkid+'" name="targetandactivity" value="'+name+'" disabled>'+
//                             '<label class="custom-control-label" for="'+checkid+'"></label>'+
//                         '</div>'+               
//                     '</td>');
//             })
//         }
//         showtwowayTableData();
//     }
// }

//顯示學習目標與評量對應表，此程式需先跑過setactivity.js的setActivityProces的()，故放在於setactivity.js執行
// function setLessonplanTargetandAssessmentTable(){

//     if(targetContent == undefined || activityName == "" || targetandAssessmentArray.length == 0){

//     }
//     else{
//         $("#lessonplan_targetandAssessment").append('<table id="lessonplanTargetanAssessmentTable" class="table table-bordered">'+
//                                                         '<thead class="thead-light text-center">'+
//                                                         '<tr>'+
//                                                             '<th rowspan="2" colspan="1"></th>'+
//                                                         '</tr>'+
//                                                         '<tr></tr>'+
//                                                         '</thead>'+
//                                                         '<tbody> </tbody>'+
//                                                     '</table>'
//                                                     );
//         //顯示學習目標
//         $.each(targetContent,function(i,val){
//             $("#lessonplanTargetanAssessmentTable").find("tbody").append('<tr data-targetname="'+targetContent[i]+'"><td>'+targetContent[i]+'</td></tr>')
            
//         })

//         var activityCounts = {};
//         //計算活動共有幾筆評量
//         $.each(targetandAssessmentArray, function(i,val) {
//             if (!activityCounts.hasOwnProperty(val.lessonplan_activity_name)) {
//                 activityCounts[val.lessonplan_activity_name] = 1;
//             } else {
//                 activityCounts[val.lessonplan_activity_name]++;
//             }
//             //在第二層thead放入評量
//             var assessment_content = val.assessment_content;
//             $("#lessonplanTargetanAssessmentTable").find("thead tr:eq(1)").append('<th>'+assessment_content+'</th>')
//         });

//         //每個活動只放一次，並依據活動有幾個評量設定colspan數量，在第一層thead
//         Object.entries(activityCounts).map(function(data){
//             var activityName = data[0]
//             var activityNum = data[1]
//             $("#lessonplanTargetanAssessmentTable").find("thead tr:eq(0)").append('<th rowspan="1" colspan="'+activityNum+'">'+activityName+'</th>')
//         })

//         var tr_length = $("#lessonplanTargetanAssessmentTable").find("tbody tr").length;

//         //放置checkbox並直接呈現勾選狀況，為disabled
//         for(var s=0;s<tr_length;s++){

//             var tr_index = $($("#lessonplanTargetanAssessmentTable").find("tbody tr")[s]).index();
//             var targetname = $($("#lessonplanTargetanAssessmentTable").find("tbody tr")[s]).data('targetname')

//             targetandAssessmentArray.map(function(data){
//                 var processtarget = data.processtarget;
//                 var lessonplan_activity_name = data.lessonplan_activity_name;
//                 var assessment_content = data.assessment_content;
//                 var checkboxValue = lessonplan_activity_name+","+assessment_content;
//                 var checkid = checkboxValue+tr_index;
//                 $("#lessonplanTargetanAssessmentTable").find("tbody tr:eq("+tr_index+")").append(
//                     '<td class="text-center" width="120">'+
//                         '<div class="custom-control custom-checkbox">'+
//                             '<input type="checkbox" class="custom-control-input" id="'+checkid+'" name="targetandassessment" value="'+checkboxValue+'" disabled>'+
//                             '<label class="custom-control-label" for="'+checkid+'"></label>'+
//                         '</div>'+               
//                     '</td>');
//                 var targetarray = processtarget.split(',');

//                 targetarray.map(function(data){
//                     if(data == targetname ){
//                         $($("#lessonplanTargetanAssessmentTable").find("tbody tr")[s]).find("input[value='"+checkboxValue+"']").prop('checked', true);
//                     }
//                 })
//             })
//         }
//     }
// }

//呈現學習目標與活動對應表內容
// function showtwowayTableData(){
//     twowayTableData = JSON.parse($("#twowayTableData").text());

//     if(twowayTableData.length !== 0){
//         var results = JSON.parse(twowayTableData[0].lessonplan_twowaytable_content);

//         var tr_length = $("#lessonplanTargetandActivityTable").find("tbody tr").length;

//         for(var x=0;x<tr_length;x++){
//             var data = $($("#lessonplanTargetandActivityTable").find("tbody tr")[x]).data('targetname')
//             $.each(results,function(i,val){
//               var target = results[i].targetName;
//               var activity = results[i].activityName;
//               if(target == data){
//                 $($("#lessonplanTargetandActivityTable").find("tbody tr")[x]).find("input[value='"+activity+"']").prop('checked', true);
//               }
//             })
//         }
//     }  
// }

//儲存活動流程後，重新更新學習目標與評量對應表
// function showtrargetandAssessmentTableData(data){
//     targetandAssessmentArray = [];
//     for(var i=0; i<data.length;i++){
//         var processData = data[i];
//         var lessonplan_activity_name = processData.lessonplan_activity_name;
//         var lessonplan_activity_content = processData.lessonplan_activity_content;
//         if(lessonplan_activity_content.length !== 0){
//             lessonplan_activity_content = JSON.parse(lessonplan_activity_content);
//             for(var s=0;s<lessonplan_activity_content.length;s++){
//                 var contentData = lessonplan_activity_content[s];
//                 var processtarget = contentData.lessonplan_activity_learningtarget;
//                 var assessmentArray = contentData.lessonplan_activity_assessment;
//                 for(var r=0;r<assessmentArray.length;r++){
//                     var assessmentData= assessmentArray[r];
//                     var assessment_content = assessmentData.assessment_content;
//                     targetandAssessmentArray.push({lessonplan_activity_name:lessonplan_activity_name,processtarget:processtarget,assessment_content:assessment_content})
//                 }
//             }
//         }
//     }
// }

/*****活動與評量的modal相關js******************************************************* */
//打開新增活動、新增活動流程以及評量modal會發生的事情
function openActivityandAssessmentBtn(){

    $("#creatActivityModal,#editActivityModal").on("show.bs.modal",function(event){
        var id = $(this).attr("id");
        if(targetContent.length !== 0){
            $("#"+id).find(".targetCheckbox").empty();
            targetContent.map(function(data){
                $("#"+id).find(".targetCheckbox").append('<div class="custom-control custom-checkbox mb-1">'+
                                                                            '<input type="checkbox" class="custom-control-input" id="'+data+'" name="targetandactivity" value="'+data+'">'+
                                                                            '<label class="custom-control-label" for="'+data+'">'+data+'</label>'+
                                                                        '</div>')
            })
        }
        else{
            $("#"+id).find(".targetCheckbox").append('<p class="text-danger">您尚未完成課程學習目標的設定</p>');
        }
    });

    $("#addprocessModal").on("show.bs.modal",function(event){
        var button = $(event.relatedTarget);
        //該活動的id
        var parentid = button.data('parentdivid');
        var modal = $(this);
        var modalid = $(this).attr("id");
        modal.find('#parentid').text(parentid);
        var title = $("#header"+parentid).data("activityname");
        activityLearningTarget(modalid,title)
        selectCustomProcessTag();
    })

    $("#addassessmentModal").on("show.bs.modal",function(event){
        var button = $(event.relatedTarget);
        //該活動的階段的tr的id
        var id = button.data('targettr');
        var modal = $(this);
        modal.find('#targetid').text(id);
    })
}

//修改流程modal內的更新按鈕
function editActivityModalBtn(){
    var parentid = $("#editparentid").text();
    var tbodyid = $("#tbodyid").text();
    //eq開始數字為0，但rowIdex是從1開始抓，應該是因為thead內的tr rowinde算0，但這邊是從tbody開始去跑eq故要減1
    var dataindex = $("#dataindex").text()-1;

    var processtarget = [];
    var processcontent = $("#editprocesscontent").val();
    var processtime = $("#editprocesstime").val();
    var processremark = $("#editprocessremark").val();
    
    $("#editprocessModal").find("input[name='processTarget']:checked").each(function(){
        processtarget.push($(this).val());
    })

    if(processcontent == "" || processtime == ""){
        $("#editprocessalert").show();
        $("#editprocessalert").html("活動流程與時間為必填");
    }
    else{
        
        var row = $("#"+tbodyid+" tr:eq("+dataindex+")");

        row.find("td:eq(1)").text(processtarget);
        row.find("td:eq(2)").html(processcontent);
        row.find("td:eq(3)").text(processtime);
        row.find("td:eq(5)").text(processremark);

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
        $(".targetCheckbox").empty();

        saveLocalStorage(parentid);
    }
}

//修改評量modal內的更新按鈕
function editAssessmentModalBtn(){
    var community_id = $("#community_id").text();
    var targetid = $("#edittargetid").text();
    var divindex = $("#divindex").text() -1;
    var fileData = $("#editassessmentFile").prop("files")[0];

    var assessmentcontent = $("#editassessmentsummernote").val();

    if(assessmentcontent == ""){
        $("#editassessmentalert").show();
        $("#editassessmentalert").html("評量內容為必填");
    }
    else{
        if(fileData !== undefined){
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
                    if(data.msg == "no"){
                        window.location = "/member/login";
                    }
                    else if(data.msg =="yes"){
                        var filedata = data.filedata;
                        //上傳的原始檔名
                        var uploadoriginalname = filedata.originalname;
                        //在暫存區的檔名
                        var uploadfilepath = filedata.path;
                        //檔案類型
                        var tmpmimetype = filedata.mimetype;
                        //要出現在assessmentDiv的
                        var filediv = '<i class="fas fa-paperclip mr-1"></i>'+uploadoriginalname;

                        var $div = $("#"+targetid).find(".assessmentDiv:eq("+divindex+")");
                        $div.find("p").html(assessmentcontent);
                        $div.find(".assessment_filename").html(filediv);
                        $div.find(".assessment_filename").attr("data-mimetype",tmpmimetype);
                        $div.find(".assessment_filename").attr("data-tmppath",uploadfilepath);

                        //該活動的id
                        var parentdivid = $("#"+targetid).closest(".card-body").attr('id');

                        $("#editassessment_sel").removeClass("editing");
                        $(".custom-file-input").removeClass("editing");
                        isChange = false;

                        $("#editassessmentsummernote").summernote("code",'');
                        $("#editassessmentFile").val("");
                        $(".custom-file-label").removeClass("selected").html("請選擇檔案");
                        $("#editassessmentModal").modal("hide");
                        $("#editassessmentalert").hide();

                        saveLocalStorage(parentdivid);
                    }
                },
                error: function(){
                    alert('失敗');
                }
            })
        }
        else{
            var $div = $("#"+targetid).find(".assessmentDiv:eq("+divindex+")");
            $div.find("p").html(assessmentcontent);
            $div.find(".assessment_filename").text("");
            $div.find(".assessment_filename").attr("tmppath","")

            //該活動的id
            var parentdivid = $("#"+targetid).closest(".card-body").attr('id');

            $("#editassessment_sel").removeClass("editing");
            $(".custom-file-input").removeClass("editing");
            isChange = false;

            $("#editassessmentsummernote").summernote("code",'');
            $("#editassessmentFile").val("");
            $(".custom-file-label").removeClass("selected").html("請選擇檔案");
            $("#editassessmentModal").modal("hide");
            $("#editassessmentalert").hide();

            saveLocalStorage(parentdivid);
        }
    }
}

function deleteeditfile(){
    $("#deletefile").click(function(){
        var community_id = $("#community_id").text();
        var filename = $("#editfilename").text();
        var data = {
            filename:filename,
            filepath:'./public/communityfolder/community_'+community_id+'/communityfile/'
        }
        $.ajax({
            url: "/lessonplan/edit/"+community_id+"/deletefile",
            type: "POST",
            async:false,
            data:data,
            success: function(data){
                if(data.msg == "yes"){
                    console.log("已刪除");
                    $("#showfilename").hide();
                    $('#editfilediv').show();
                }
                else if(data.msg == "notsave"){
                    console.log("未儲存");
                    $("#showfilename").hide();
                    $('#editfilediv').show();
                }
                else if(data.msg == "no"){
                    window.location = "/member/login";
                }
            },
            error: function(){
                alert('失敗');
            }
        })
    })
}

//活動流程內鷹架放入select option
function processselect_Set(){
    $(".processcontent_sel_1").val("1").change();

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
            case 3:
                $(".processcontent_sel_2 option").remove();
                $.each(custom_option, function(i, val) {
                    $(".processcontent_sel_2").append($("<option value='" + custom_option[i] + "'>" + custom_option[i] + "</option>"));
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

//在活動流程modal放入對應的學習目標
function activityLearningTarget(modalid,title){
    // console.log(title)
    if(twowayTableData.length !== 0){
        console.log(twowayTableData)
        twowayTableData.map(function(data){
            var targetname = data.targetName;
            var activityname = data.activityName;
            if(title == activityname){
                $("#"+modalid).find(".alertP").hide();
                $("#"+modalid).find(".targetCheckbox").append('<div class="custom-control custom-checkbox mb-1">'+
                                                                        '<input type="checkbox" class="custom-control-input" id="'+targetname+'" name="processTarget" value="'+targetname+'">'+
                                                                        '<label class="custom-control-label" for="'+targetname+'">'+targetname+'</label>'+
                                                                    '</div>')
            }
            else{
                $("#"+modalid).find(".alertP").show();
            }
        })
    }
    else{
        alert("尚未設定此活動所需的學習目標")
    }
}

//活動流程modal內放入新增自定義模組
function addCustomProcessTag(){
    $(".customProcessTag").click(function(){
        var modalid = $(this).parents(".modal").attr('id');
        $(".customProcessTag").attr("disabled",true);
        $("#"+modalid).find('.addCustomProcessTag').show();
        $("#"+modalid).find('.addCustomProcessTag').append('<input type="text" class="form-control" name="processTagInput">');
        processTagClass(custom_option);
    })
    
    $(".saveCustomTag").click(function(){
        var modalid = $(this).parents(".modal").attr('id');
        $(".customProcessTag").attr("disabled",false);
        var customContent = $("input[name='processTagInput']").val();
        custom_option = customContent.split(',');
        $("#"+modalid).find('.addCustomProcessTag').hide();
        $("#"+modalid).find("input[name='processTagInput']").remove();
        $("#"+modalid).find(".inputTags-list").remove();
        $(".processcontent_sel_2 option").remove();
        processselect_Set();

        var data = {
            stage:'customTag',
            customContent:customContent
        }
        var results = saveAjax(data);
        if(results.msg == "ok"){
            // alert("儲存成功");
        }
        else{
            window.location = "/member/login";
        }

    })
}

function selectCustomProcessTag(){
    var community_id = $("#community_id").text();
    $.ajax({
        url: "/lessonplan/edit/"+community_id+"/getCustomProcessTag",
        type: "GET",
        async:false, //ajax請求結束後才會執行window function
        data:{community_id:community_id},
        success: function(data){
            if(data.msg == "ok"){
                if(data.selectData.length !== 0){
                    var selectData = data.selectData[0].lessonplanprocess_custom_modal_content;
                    var customContent = selectData.split(',')
                    custom_option = customContent;
                    processselect_Set();
                }
                else{
                    processselect_Set();
                }
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

//彈出視窗closebtn的function，清空所有填寫框
function modalclosebtn(modalid){
    switch (modalid){
        case 'creatActivityModal':
        case 'editActivityModal':
            $("#"+modalid).find(".unitName").val("");
            $("#"+modalid).find(".activityName").val("");
            $("#"+modalid).find(".targetCheckbox").empty();
            $("#"+modalid).find(".alert").hide();
            break;
        case 'twowaytableModal':
            $("#lessonplan_targetandActivity").empty();
            $("#lessonplan_targetandAssessment").empty();
            break;
        case 'editprocessModal':
            $("#editprocesscontent").summernote("code",'');
            $("#editprocessModal input[type='text']").val("");
            $("#editprocessModal input[type='number']").val("");
            $("#editprocessalert").hide();
            $("#editprocesstarget").removeClass("editing");
            $("#editprocesstime").removeClass("editing");
            $("#editprocessremark").removeClass("editing");
            $("#editprocesscontent_sel_1").removeClass("editing");
            $("#processcontent_sel_1").removeClass("editing");
            $("#editprocesscontent_sel_2").removeClass("editing");
            $(".targetCheckbox").empty();
            $("#"+modalid).find('.addCustomProcessTag').hide();
            $("#"+modalid).find("input[name='processTagInput']").remove();
            $("#"+modalid).find(".inputTags-list").remove();
            $(".customProcessTag").attr("disabled",false)
            isChange = false;
            break;
        case 'addprocessModal':
            $("#processcontent").summernote("code",'');
            $("#addprocessModal input[type='text']").val("");
            $("#addprocessModal input[type='number']").val("");
            $("#processalert").hide();
            $("#processtarget").removeClass("editing");
            $("#processtime").removeClass("editing");
            $("#processremark").removeClass("editing");
            $("#processcontent_sel_1").removeClass("editing");
            $("#editprocesscontent_sel_1").removeClass("editing");
            $("#processcontent_sel_2").removeClass("editing");
            $(".targetCheckbox").empty();
            $("#"+modalid).find('.addCustomProcessTag').hide();
            $("#"+modalid).find("input[name='processTagInput']").remove();
            $("#"+modalid).find(".inputTags-list").remove();
            $(".customProcessTag").attr("disabled",false)
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

function setCustomFileInput(){
    // Add the following code if you want the name of the file appear on select
    $(".custom-file-input").on("change", function() {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
    });
}

function resetsummernote(){
    $("#assessmentsummernote").summernote("code",'');
    $("#editassessmentsummernote").summernote("code",'');  
}

function processTagClass(tag){
    $("input[name='processTagInput']").inputTags({
        max: 12,
        tags:tag,
        init: function($elem) {
            console.log('Event called on plugin init', $elem);
        }
    });
}

function moveTrPosition(){
    $(".up,.down").click(function(){
        var row = $(this).parents("tr:first");
        
        if ($(this).is(".up")) {
            row.insertBefore(row.prev());
        } else {
            row.insertAfter(row.next());
        }
        var parentid = $(this).closest('.card-body').attr('id');
        saveLocalStorage(parentid);
    });
}

//摺疊icon變化
function collapseControl(){
    //class摺疊執行完後更改圖形
    $(".card-body .collapse").on('show.bs.collapse', function(){
        var id = $(this).closest('.card').find(".collapseicon").attr('id')
        $('#'+id).removeClass('fa fa-angle-down');
        $('#'+id).addClass("fa fa-angle-up");
    });
    $(".card-body .collapse").on('hide.bs.collapse', function(){
        //$(this)為card-body，需更改同父內三層的i的class
        var id = $(this).closest('.card').find(".collapseicon").attr('id')
        $('#'+id).removeClass('fa fa-angle-up');
        $('#'+id).addClass("fa fa-angle-down");
    });
}