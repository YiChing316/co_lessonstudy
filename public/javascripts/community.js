var allCommunityData;
var memberCommunityData;
var applicationCommunityData;

//創建社群
function createCommunity(){
    var community_name = $("#community_name").val();
    var community_key = $("#community_key").val();
    var community_intro = $("#community_intro").val();

    if(community_name == "" || community_key =="" || community_intro ==""){
        $("#errmsg").show();
        $("#errmsg").html('每隔皆為必填');
    }
    else{
        $.ajax({
            url: "/community/create",
            type: "POST",
            data:{
                community_name: community_name,
                community_key:community_key,
                community_intro:community_intro
            },
            success: function(data){
                if(data.msg == 'yes'){
                    alert('新增成功');
                    window.location.href = '/lessonplan/edit/'+data.community_id;
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
};

function closeAddCommunityModal(){
    $("#community_name").val("");
    $("#community_key").val("");
    $("#community_intro").val("");
    $("#errmsg").hide();
}


/****處理現有社群********* */

// 顯示現有社群
function showAllCommunity(){
    $allCommunityTable = $("#allCommunityTable");
    $allCommunityTable.bootstrapTable({
        columns:[
            {title:"社群ID",field:"community_id",visible:false},
            {title:"社群名稱",field:"community_name",detailView:false,width:320},
            {title:"社群簡介",field:"community_intro",detailView:false,width:500},
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
function joinCommunityFormatter(value, row, index) {
    var id = row.community_id;
    return[
        "<input type='button' class='btn btn-primary joinCommunity' id='enterCommunity"+id+"' value='加入社群' onclick='showEntertr("+id+","+index+")'>"
    ].join('');    
}

//加入社群填寫密碼的tr
function detailFormatter(value, row, index) {
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
                '<p>沒有密碼嗎?<a href="javascript: void(0)" style="color: #ED557E;" onclick="applicationCommunity('+id+')">提出申請</a></p>',
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
                {title:"社群名稱",field:"community_name",width:320},
                {title:"社群簡介",field:"community_intro",width:500},
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
      '<a class="btn btn-primary enterCommunity" href="javascript:void(0)" title="enter">進入</a>'
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
        url: "/community/join",
        type: "POST",
        data:{
            community_id: id,
            community_key: community_key
        },
        success: function(data){
            if(data.msg == 'errorKey'){
                alert('密碼錯誤');
            }
            else if(data.msg == 'existed'){
                alert('您已是此社群成員');
            }
            else if(data.msg == 'yes'){
                alert('加入成功');
                window.location.href = '/lessonplan/edit/'+data.community_id;
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


/*****處理申請社群******************************* */
function showApplication(){
    var $applicationTable = $("#applicationCommunityTable");
    if(applicationCommunityData == 0){
        $applicationTable.hide();
        $("#applicationCommunityEmptyMsg").html("您目前尚未申請任何社群");
    }
    else{
        $applicationTable.bootstrapTable({
            columns:[
                {title:"社群ID",field:"community_id",visible:false},
                {title:"社群名稱",field:"community_name"},
                {title:"申請狀況",field:"community_application_status"}
            ],
            theadClasses:'thead-light',
            pageSize: 10,
            pagination:true,
            classes:'table table-bordered'
        })
        $applicationTable.bootstrapTable("load",applicationCommunityData);
    }
}

/****申請加入社群ajax************* */
function applicationCommunity(id){
    $.ajax({
        url: "/community/application",
        type: "POST",
        data:{
            community_id: id
        },
        success: function(data){
            if(data.msg == 'no'){
                window.location = "/member/login";
            }
            else if(data.msg == 'existed'){
                alert('您已是此社群成員');
            }
            else{
                alert("已提出申請");
                window.location.reload();
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
    applicationCommunityData = JSON.parse($("#applicationCommunityData").text());
    $("#allCommunityData").remove();
    $("#memberCommunityData").remove();
    $("#applicationCommunityData").remove();

    showAllCommunity();
    showMemberCommunity();
    showApplication();

    //回到dashboard畫面則清除所有localstorage
    localStorage.clear();
});