var allCommunityData;
var memberCommunityData;

function createCommunity(){
    var community_name = $("#community_name").val();
    var community_key = $("#community_key").val();

    if(community_name == "" || community_key ==""){
        $("#errmsg").show();
        $("#errmsg").html('每隔皆為必填');
    }
    else{
        $.ajax({
            url: "/dashboard/create",
            type: "POST",
            data:{
                community_name: community_name,
                community_key:community_key
            },
            success: function(data){
                if(data.msg == 'no'){
                    alert('新增失敗');
                }
                else{
                    alert('新增成功');
                    window.location.reload();
                } 
            },
            error: function(){
                alert('失敗');
            }
        })
    }    
};

//顯示現有社群
function showAllCommunity(){
    for(var i = 0; i<allCommunityData.length;i++){
        var community = allCommunityData[i];
        var community_id = community.community_id;
        var community_name = community.community_name;
        //sql出來的時間為ISO Date ex:"2015-03-25T12:00:00Z"，new Date後會變成 Wed Mar 25 2015 08:00:00 GMT+0800
        var community_createtime = new Date(community.community_createtime);
        var year = community_createtime.getFullYear();
        var month = community_createtime.getMonth()+1;//月份是由(0-11)故要+1
        var date = community_createtime.getDate();

        var allCommunity_div = ["<tr>"+
                                    "<td>"+ community_name +"</td>"+
                                    "<td>"+ year+"/"+month+"/"+date +"</td>"+
                                    "<td><input type='button' id='enterCommunity"+community_id+"' value='加入社群' onclick='showEntertr("+community_id+")'></td>"+
                                "</tr>"+
                                "<tr id='entertr"+community_id+"' style='display:none'>"+
                                    "<td>密碼:<input type='text' id='community_key_"+community_id+"'></td>"+
                                    "<td><input type='button' value='送出' onclick='joinCommunity("+community_id+")'>"+
                                    "<input type='button' value='取消加入' onclick='hideEntertr("+community_id+")'></td>"+
                                    "<td><p>沒有密碼嗎?</p><a>提出申請</a></td>"+
                                "</tr>"
                                ];

        $("#allCommunityTable tbody").append(allCommunity_div);
    }
}

//根據點選'加入社群'按鈕所對應的id去顯示該id的'entertr'
function showEntertr(id){
    $("#entertr"+id).show();//這邊tr的style會移除dispaly:none的屬性
    //同時此按鈕消失
    $("#enterCommunity"+id).hide();
}
//上方程式變成隱藏
function hideEntertr(id){
    $("#entertr"+id).hide();
    //'加入社群'的按鈕會顯示
    $("#enterCommunity"+id).show();
}

//顯示會員已加入的社群
function showMemberCommunity(){
    for(var i = 0; i<memberCommunityData.length;i++){
        var memberCommunity = memberCommunityData[i];
        var community_id = memberCommunity.community_id;
        var community_name = memberCommunity.community_name;
        var community_createtime = new Date(memberCommunity.community_createtime);
        var year = community_createtime.getFullYear();
        var month = community_createtime.getMonth()+1;//月份是由(0-11)故要+1
        var date = community_createtime.getDate();

        var memberCommunity_div = ["<tr>"+
                                    "<td>"+ community_name +"</td>"+
                                    "<td>"+ year+"/"+month+"/"+date +"</td>"+
                                    "<td><input type='button' id='enterCommunity"+community_id+"' value='進入' onclick='enterCommunity("+community_id+")'></td>"+
                                "</tr>"
                                ];
        
        $("#memberCommunityTable tbody").append(memberCommunity_div);
                                
    }
}

function enterCommunity(id){
    window.location.href = '/lessonplan/edit/'+id;
}

function joinCommunity(id){
    var community_key =  $("#community_key_"+id).val();

    $.ajax({
        url: "/dashboard/join",
        type: "POST",
        data:{
            community_id: id,
            community_key: community_key
        },
        success: function(data){
            if(data.msg == 'no'){
                $("#errmsgAll").html('密碼錯誤');
            }
            else if(data.msg == 'existed'){
                $("#errmsgAll").html('您已加入此社群');
            }
            else{
                alert('加入成功');
                window.location.href = '/lessonplan/edit/'+data.community_id;
            }     
        },
        error: function(){
            alert('失敗');
        }
    })

}


$(function(){
    allCommunityData = JSON.parse($("#allCommunityData").text());
    memberCommunityData = JSON.parse($("#memberCommunityData").text());
    $("#allCommunityData").remove();
    $("#memberCommunityData").remove();

    showAllCommunity();
    showMemberCommunity();

});