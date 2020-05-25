var personalData,communityData;

$(function(){
    personalData = JSON.parse( $("#personalData").text());
    communityData = JSON.parse( $("#communityData").text());
    console.log(personalData)
    console.log(communityData)

    showPersonalResource();
    showCommunityResource();
})

function showPersonalResource(){
    var $personalResourceTable = $("#personalResourseTable");
    $personalResourceTable.bootstrapTable({
        columns:[
            {title:"資源ID",field:"community_file_id",visible:false},
            {title:"資源名稱",field:"community_file_name",sortable:true},
            {title:"類型",field:"community_file_type",sortable:true},
            {title:"上傳時間",field:"file_uploadtime",sortable:true},
        ],
        theadClasses:'thead-light',
        pageSize: 10,
        pagination:true,
        search:true,
        classes:'table table-bordered'
    });
    $personalResourceTable.bootstrapTable("load",personalData);
}

function showCommunityResource(){
    var $communityResourseTable = $("#communityResourseTable");
    $communityResourseTable.bootstrapTable({
        columns:[
            {title:"資源ID",field:"community_file_id",visible:false},
            {title:"資源名稱",field:"community_file_name",sortable:true},
            {title:"類型",field:"community_file_type",sortable:true},
            {title:"上傳者",field:"member_name",sortable:true},
            {title:"上傳時間",field:"file_uploadtime",sortable:true},
        ],
        theadClasses:'thead-light',
        pageSize: 10,
        pagination:true,
        search:true,
        classes:'table table-bordered'
    });
    $communityResourseTable.bootstrapTable("load",communityData);
}