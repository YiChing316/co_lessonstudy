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
    
}