var community_id,basicData,stageData,processData,communityData;

var TrComponent = [
    {name:'教案簡介',id:'lessonplan_introTd'},
    {name:'單元名稱',id:'lessonplan_unit_nameTd'},
    {name:'活動名稱',id:'lessonplan_activity_nameTd'},
    {name:'課程領域',id:'lessonplan_fieldTd'},
    {name:'使用版本',id:'lessonplan_versionTd'},
    {name:'學習階段',id:'lessonplan_gradeTd'},
    {name:'授課時間',id:'lessonplan_timeTd'},
    {name:'核心素養',id:'cirn_form1Td'},
    {name:'學習重點',id:'learning_focusTd'},
    {name:'教學資源及器材',id:'lessonplan_resourceTd'},
    {name:'學生先備概念',id:'lessonplan_studentknowledgeTd'},
    {name:'教學設計理念',id:'learning_designTd'},
    {name:'課程學習目標',id:'lessonplan_targetTd'}
];

function activityTable_Append(id,activity_name){
    var activityDiv =   '<div class="noBreak mb-5">'+
                            '<h5><b>活動'+id+':'+activity_name+'</b></h5>'+
                            '<table class="table table-bordered activitytable mt-3" id="activity_'+id+'Table">'+
                                '<thead class="thead-light">'+
                                    '<tr>'+
                                        '<th scope="col" width="60">#</th>'+
                                        '<th scope="col" width="120">學習目標</th>'+
                                        '<th scope="col">活動流程</th>'+
                                        '<th scope="col" width="50">時間</th>'+
                                        '<th scope="col" width="350">評量方式</th>'+
                                        '<th scope="col" width="60">備註</th>'+
                                    '</tr>'+
                                '</thead>'+
                                '<tbody class="activityTbody" id="activity_'+id+'Tbody"></tbody>'+
                            '</table>'+
                        '</div>';
    $("#activityContent").append(activityDiv);
}

function trElement(parentid,activitynumber,num,processtarget,processcontent,processtime,processremark){
    $("#"+parentid+"Tbody").append('<tr>'+
                                        '<th scope="row">'+activitynumber+'-'+num+'</th>'+
                                        '<td>'+processtarget+'</td>'+
                                        '<td>'+processcontent+'</td>'+
                                        '<td>'+processtime+'</td>'+
                                        '<td id="'+parentid+'_assessmentTd_'+num+'"></td>'+
                                        '<td>'+processremark+'</td>'+
                                    '</tr>');
}

function assessmentDiv(td_id,assessmentcontent,tmpmimetype,tmppath,file){
    $("#"+td_id).append('<div class="assessmentDiv" style="margin-bottom:15px">'+
                            '<div class="assessment_content">'+assessmentcontent+'</div>'+
                            '<div class="assessment_filename" data-mimetype="'+tmpmimetype+'" data-tmppath="'+tmppath+'">'+file+'</div>'+
                        '</div>');
}

$(function(){
    community_id = $("#community_id").text();
    basicData = JSON.parse($("#basicData").text());
    stageData = JSON.parse($("#stageData").text());
    processData = JSON.parse($("#processData").text());
    communityData = JSON.parse($("#communityData").text());

    setCommunityData();
    setTableOneTbody();
    setBasicData();
    setActivityData();
    setStageData();
})

function setCommunityData(){
    if(communityData.length !== 0){
        communityData = communityData[0]
        var community_name = communityData.community_name;
        var community_intro = communityData.community_intro;
        $("#community_name").text(community_name)
        $("#community_intro").text(community_intro)
    }
}

function setTableOneTbody(){
    TrComponent.forEach(function(data){
        var name = data.name;
        var id = data.id;
        if(id == "learning_focusTd"){
            $("#tableOneTbody").append('<tr>'+
                                            '<td width="140" class="text-center" rowspan="2"><b>'+name+'</b></td>'+
                                            '<td class="text-center" width="120"><b>學習表現</b></td>'+
                                            '<td id="performancefocusTd"></td>'+
                                        '</tr>'+
                                        '<tr>'+
                                            '<td class="text-center" width="120"><b>學習內容</b></td>'+
                                            '<td id="contentfocusTd"></td>'+
                                        '</tr>')
        }
        else{
            $("#tableOneTbody").append('<tr>'+
                                        '<td width="140" class="text-center"><b>'+name+'</b></td>'+
                                        '<td id="'+id+'" colspan="2"></td>'+
                                    '</tr>')
        }
    })
}

function setBasicData(){
    if(basicData.length !== 0){
        basicData = basicData[0]
        var lessonplan_intro = basicData.lessonplan_intro;
        var lessonplan_unit_name = basicData.lessonplan_unit_name;
        var lessonplan_field = basicData.lessonplan_field;
        var lessonplan_version = basicData.lessonplan_version;
        var lessonplan_grade = basicData.lessonplan_grade;
        var lessonplan_time = basicData.lessonplan_time.split(',');
        var lessonplan_time_class = lessonplan_time[0];
        var lessonplan_time_minutes = lessonplan_time[1];

        $('#lessonplan_introTd').html(lessonplan_intro)
        $('#lessonplan_unit_nameTd').html(lessonplan_unit_name)
        $('#lessonplan_fieldTd').html(lessonplan_field)
        $('#lessonplan_versionTd').html(lessonplan_version)
        $('#lessonplan_gradeTd').html(lessonplan_grade)
        $('#lessonplan_timeTd').html(lessonplan_time_class+"節課，共"+lessonplan_time_minutes+"分鐘")
    }
}

function setStageData(){
    if(stageData.length !== 0){
        for(i in stageData){
            var lessonplan_stage_type = stageData[i].lessonplan_stage_type;
            var lessonplan_stage_content = stageData[i].lessonplan_stage_content;

            switch(lessonplan_stage_type){
                case 'lessonplan_target':
                    var targetContent = lessonplan_stage_content.split(',');
                    $("#lessonplan_targetTd").append('<ol id="targetol"></ol>');
                    targetContent.forEach(function(val){
                        $("#targetol").append('<li>'+val+'</li>')
                    })
                    break;
                case 'core_competency':
                    var core_content = JSON.parse(lessonplan_stage_content);
                    $("#cirn_form1Td").append('<ul id="cirnul"></ul>');
                    for(x in core_content){
                        var field_title = core_content[x].field_title;
                        var field_content = core_content[x].field_content;
                        $("#cirnul").append('<li><b>'+field_title+'</b>：'+field_content+'</li>')
                    }
                    break;
                case 'learning_focus':
                    var learningFocus_content = JSON.parse(lessonplan_stage_content);
                    $("#contentfocusTd").append('<ul id="contentul"></ul>');
                    $("#performancefocusTd").append('<ul id="performanceul"></ul>');
                    for(y in learningFocus_content){
                        var data = learningFocus_content[y];
                        var stage = data.stage;
                        var content = data.content;

                        for(var t=0;t<content.length;t++){
                            var focussavetitle = content[t].title;
                            var focussavecontent = content[t].content;
                            if(stage == 'contentfocus_body'){
                                $("#contentul").append('<li><b>'+focussavetitle+'</b>：'+focussavecontent+'</li>')
                            }
                            else{
                                $("#performanceul").append('<li><b>'+focussavetitle+'</b>：'+focussavecontent+'</li>')
                            }
                        }
                    }
                    break;
                case 'lessonplan_studentknowledge':
                    $("#lessonplan_studentknowledgeTd").html(lessonplan_stage_content);
                    break;
                case 'lessonplan_resource':
                    $("#lessonplan_resourceTd").html(lessonplan_stage_content);
                    break;
                case 'lessonplan_design':
                    $("#learning_designTd").html(lessonplan_stage_content);
                    break;
                
            }
        }
    }
}

function setActivityData(){
    if(processData.length !== 0){
        $("#lessonplan_activity_nameTd").append('<ul id="activityul"></ul>')
        for(i in processData){
            var activity_name = processData[i].lessonplan_activity_name;
            var lessonplan_activity_content = processData[i].lessonplan_activity_content;
            var listnum = parseInt(i)+1;
            var parentid = "activity_"+listnum;
            $("#activityul").append('<li>活動'+listnum+': '+activity_name+'</li>')
            if(lessonplan_activity_content !== ""){
                activityTable_Append(listnum,activity_name)
                setActivityprocess(parentid,listnum,lessonplan_activity_content)
            }
        }
    }
}

function setActivityprocess(parentid,activitynumber,processContentData){
    processContentData = JSON.parse(processContentData);
    for(var s=0;s<processContentData.length;s++){
        var contentData = processContentData[s];
        var num = s+1;
        var processtarget = contentData.lessonplan_activity_learningtarget;
        var processcontent = contentData.lessonplan_activity_content;
        var processtime = contentData.lessonplan_activity_time;
        var processremark = contentData.lessonplan_activity_remark;
        var assessmentArray = contentData.lessonplan_activity_assessment;

        trElement(parentid,activitynumber,num,processtarget,processcontent,processtime,processremark);

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
        }
    }
}