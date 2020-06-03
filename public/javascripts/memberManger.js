var community_id;
var communityData,communityMemberData,applicationData;

function memberCard(community_member_id,member_name,member_school,member_identity){
    $("#communityMemberBody").append('<div class="card mb-1">'+
                                        '<div class="card-body">'+
                                            '<h6 class="card-title d-inline">'+member_name+'</h6>'+
                                            '<h6 class="card-title d-inline ml-5">'+member_school+'</h6>'+
                                            '<span class="card-text d-inline float-right" id="memberIdentity'+community_member_id+'">'+member_identity+'</sapn>'+
                                        '</div>'+
                                    '</div>');
    if(member_identity == '管理員'){
        $("#memberIdentity"+community_member_id).addClass("text-danger");
    }
}

function applicationCard(application_id,member_id,member_name,member_school){
    $("#applicationMemberBody").append('<div class="card mb-1 applicationcard">'+
                                            '<div class="card-body">'+
                                                '<p class="application_id" style="display:none;">'+application_id+'</p>'+
                                                '<p class="application_member_id" style="display:none;">'+member_id+'</p>'+
                                                '<h6 class="card-title d-inline application_member_name">'+member_name+'</h6>'+
                                                '<h6 class="card-title d-inline ml-5">'+member_school+'</h6>'+
                                                '<div class="float-right">'+
                                                    '<input type="button" class="btn btn-sm btn-reject mr-1 sendApplication" data-status="申請失敗" value="拒絕申請">'+
                                                    '<input type="button" class="btn btn-sm btn-info sendApplication" data-status="申請成功" value="通過申請">'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>')
}

$(function(){
    community_id = $("#community_id").text();
    communityData = JSON.parse($("#communityData").text());
    communityMemberData = JSON.parse($("#communityMemberData").text());
    applicationData = JSON.parse($("#applicationData").text());
    console.log(communityData)
    console.log(communityMemberData)
    console.log(applicationData)
    setCommunityData(communityData);
    setmemberCard();
    setApplicationCard();

    $('#editCommunityModal').on('show.bs.modal', function (e) {
        $("#editcommunity_name").val(community_name)
        $("#editcommunity_key").val(community_key)
        $("#editcommunity_intro").val(community_intro)
    })

    $('#editCommunityModal').on('hidden.bs.modal', function (e) {
        $(this).find("input[type='text'],textarea").val("")
    })
})

var community_name,community_intro,community_key;
//設定社群資料
function setCommunityData(communityData){
    if(communityData.length !== 0){
        communityData = communityData[0]
        community_name = communityData.community_name;
        community_intro = communityData.community_intro;
        community_key = communityData.community_key;

        $("#community_nameDiv").text(community_name)
        $("#community_introDiv").text(community_intro)
    }
}

//設定成員名單
function setmemberCard(){
    if(communityMemberData.length !== 0){
        for(i in communityMemberData){
            var data = communityMemberData[i];
            var community_member_id = data.community_member_id;
            var member_name = data.member_name;
            var member_school = data.member_school;
            var member_identity = data.community_member_identity;
            switch(member_identity){
                case 'founder':
                    member_identity = '管理員';
                    break;
                case 'teammember':
                    member_identity = '成員';
                    break;
            }
            memberCard(community_member_id,member_name,member_school,member_identity);
        }
    }
}

//設定申請審核名單
function setApplicationCard(){
    if(applicationData.length !== 0){
        for(i in applicationData){
            var data = applicationData[i];
            var community_application_id = data.community_application_id;
            var member_id = data.member_id_member;
            var member_name = data.member_name;
            var member_school = data.member_school;
            applicationCard(community_application_id,member_id,member_name,member_school)
        }
        sendApplicationResult();
    }
}

//送出審核結果
function sendApplicationResult(){
    $(".sendApplication").click(function(){
        var application_id = $(this).parents(".card-body").find(".application_id").text();
        var member_id = $(this).parents(".card-body").find(".application_member_id").text();
        var member_name = $(this).parents(".card-body").find(".application_member_name").text();
        var status = $(this).data("status");

        var data = {
            application_id:application_id,
            member_id:member_id,
            member_name:member_name,
            application_status:status
        }

        var results = ajaxPostData('/memberManager/'+community_id+'/sendApplicationResult',data);

        if(results.msg == "no"){
            window.location = "/member/login";
        }
        else if(results.msg == "ok"){
            window.location.reload()
        }
        
    })
}

//送出編輯社群資料
function editCommunityData(){
    var editName = $("#editcommunity_name").val();
    var editkey = $("#editcommunity_key").val();
    var editintro = $("#editcommunity_intro").val();
    
    var data = {
        community_name:editName,
        community_key:editkey,
        community_intro:editintro
    }

    var results = ajaxPostData('/memberManager/'+community_id+'/updateCommunityData',data)
    if(results.msg == "no"){
        window.location = "/member/login";
    }
    else{
        var selectData = results.selectData;
        setCommunityData(selectData)
    }
}


function ajaxPostData(url,data){
    var results;
    $.ajax({
        url: url,
        type: "POST",
        async:false,
        data:data,
        success: function(data){
            results = data;
        },
        error: function(){
            alert('失敗');
        }
    })
    return results
}