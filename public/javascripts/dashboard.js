var allCommunityData;

function createCommunity(){
    var community_name = $("#community_name").val();
    var community_key = $("#community_key").val();

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
            } 
        },
        error: function(){
            alert('失敗');
        }
    })
    
};

function showAllCommunity(){
    for(var i = 0; i<allCommunityData.length;i++){
        var community = allCommunityData[i];
        var community_name = community.community_name;
        //sql出來的時間為ISO Date ex:"2015-03-25T12:00:00Z"，new Date後會變成 Wed Mar 25 2015 08:00:00 GMT+0800
        var community_createtime = new Date(community.community_createtime);
        var year = community_createtime.getFullYear();
        var month = community_createtime.getMonth()+1;//月份是由(0-11)故要+1
        var date = community_createtime.getDate();

        var allCommunity_div = ["<tr>"+
                                    "<td>"+ community_name +"</td>"+
                                    "<td>"+ year+"/"+month+"/"+date +"</td>"+
                                    "<td><input type='button' value='加入社群'></td>"+
                                "</tr>"];

        $("#allCommunityTable tbody").append(allCommunity_div);
    }
}


$(function(){
    allCommunityData = JSON.parse($("#allCommunityData").text());
    $("#allCommunityData").remove();

    showAllCommunity();

});