var allCommunityData;
var memberCommunityData;

//創建社群
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


/****處理現有社群********* */

// 顯示現有社群
function showAllCommunity(){
    $allCommunityTable = $("#allCommunityTable");
    $allCommunityTable.bootstrapTable({
        columns:[
            {field:"tr_index",visible:false},
            {title:"社群ID",field:"community_id",visible:false},
            {title:"社群名稱",field:"community_name",detailView:false},
            {title:"創立時間",field:"community_createtime",detailView:false},
            {formatter:"joinCommunityFormatter"}
        ],
        theadClasses:'thead-light',
        pageSize: 10,
        pagination:true,
        detailView:true,
        detailFormatter:"detailFormatter",
        detailViewIcon:false,
        search:true,
        customSearch:"searchCommunity",
        formatSearch: function () {
            return '搜尋您想找的社群...'
        },
        classes:'table table-bordered'
    });
    $allCommunityTable.bootstrapTable("load",allCommunityData);
}

//加入社群btn
function joinCommunityFormatter(index, row) {
    var id = row.community_id;
    var tr_index = row.tr_index;
    return[
        "<input type='button' class='btn btn-primary joinCommunity' id='enterCommunity"+id+"' value='加入社群' onclick='showEntertr("+id+","+tr_index+")'>"
    ].join('');    
}

//加入社群填寫密碼的tr
function detailFormatter(index, row) {
    var id = row.community_id;
    return[
        '<div class="row">',
            '<div class="col-5">',
                '<input type="text" class="form-control" id="community_key_'+id+'" placeholder="請輸入社群密碼">',
            '</div>',
            '<div class="col">',
                '<input class="btn btn-outline-primary" type="button" value="送出" onclick="joinCommunity('+id+')">',
            '</div>',
            '<div class="col-3">',
                '<p>沒有密碼嗎?<a style="color: #ED557E;">提出申請</a></p>',
            '</div>',
        '</div>'
    ].join('')
}

//根據點選'加入社群'按鈕所對應的id去顯示該id的'entertr'
function showEntertr(id,index){
    $("#enterCommunity"+id).val('取消加入');
    $("#enterCommunity"+id).removeClass( "btn-primary" ).addClass( "btn-secondary" );
    $("#enterCommunity"+id).attr("onclick","hideEntertr("+id+","+index+")");
    $allCommunityTable.bootstrapTable('expandRow',index);
}
//上方程式變成隱藏
function hideEntertr(id,index){
    $("#enterCommunity"+id).val('加入社群');
    $("#enterCommunity"+id).removeClass( "btn-secondary" ).addClass( "btn-primary" );
    $("#enterCommunity"+id).attr("onclick","showEntertr("+id+","+index+")");
    $allCommunityTable.bootstrapTable('collapseRow', index);
}

//搜尋現有社群名稱
function searchCommunity(data, text){
    return data.filter(function (row) {
        return row.community_name.indexOf(text) > -1
    })
}



/*****處理已加入社群******************************* */
//顯示會員已加入的社群
function showMemberCommunity(){
    var $memberCommunityTable = $("#memberCommunityTable");
    if(memberCommunityData == 0){
        $memberCommunityTable.hide();
        $("#memberCommunityEmptyMsg").html("您目前尚未加入社群");
    }
    else{
        $memberCommunityTable.bootstrapTable({
            columns:[
                {title:"社群ID",field:"community_id",visible:false},
                {title:"社群名稱",field:"community_name"},
                {title:"創立時間",field:"community_createtime",sortable:true},
                {formatter:"enterCommunityFormatter",events:"operateEvents"}
            ],
            theadClasses:'thead-light',
            pageSize: 10,
            pagination:true,
            classes:'table table-bordered'
        });
        $memberCommunityTable.bootstrapTable("load",memberCommunityData);
    }
}

//進入以加入社群btn
function enterCommunityFormatter(value, row, index) {
    return [
      '<a class="btn btn-primary enterCommunity" href="javascript:void(0)" title="Remove">進入</a>'
    ].join('')
}

window.operateEvents = {
    //進入已加入的社群function
    'click .enterCommunity': function (e, value, row, index) {
        window.location.href = '/lessonplan/edit/'+row.community_id;
    }  
}



/****加入社群ajax************* */
//根據社群id、密碼，加入社群
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
                $("#errmsgAll").show();
                $("#errmsgAll").html('密碼錯誤');
            }
            else if(data.msg == 'existed'){
                $("#errmsgAll").show();
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