var community_id,member_id;
var personalData,communityData;

$(function(){
    member_id = $("#member_id").text();
    community_id = $("#community_id").text();
    personalData = JSON.parse( $("#personalData").text());
    communityData = JSON.parse( $("#communityData").text());
    console.log(personalData)
    console.log(communityData)

    showPersonalResource();
    showCommunityResource();
    clickUploadBtn();
    uploadEvents();
    deletePersonalResource();
    shareResource();

    $communityResourseTable.bootstrapTable("load",communityData);
    $personalResourceTable.bootstrapTable("load",personalData);

    $(".modal").on("hidden.bs.modal",function(e){
        $(this).find("input[type='file'],input[type='text']").val("");
        $(this).find(".custom-file-label").text("選擇檔案");
    })

})

var $personalResourceTable;
function showPersonalResource(){
    $personalResourceTable = $("#personalResourseTable");
    $personalResourceTable.bootstrapTable({
        columns:[
            {title:"資源ID",field:"community_file_id",visible:false},
            {title:"資源名稱",field:"community_file_name",formatter:"fileNameFormatter",sortable:true},
            {title:"類型",field:"community_file_type",sortable:true,width:40},
            {title:"上傳時間",field:"file_uploadtime",sortable:true,width:120},
            {formatter:"personalOperateFormatter",events:"operateEvents",width:90}
        ],
        theadClasses:'thead-light',
        pageSize: 8,
        pagination:true,
        search:true,
        classes:'table table-bordered'
    });
}

var $communityResourseTable;
function showCommunityResource(){
    $communityResourseTable = $("#communityResourseTable");
    $communityResourseTable.bootstrapTable({
        columns:[
            {formatter:"lessonplanOperateFormatter",events:"operateEvents",width:40},
            {title:"資源ID",field:"community_file_id",visible:false},
            {title:"資源名稱",field:"community_file_name",formatter:"fileNameFormatter",sortable:true},
            {title:"類型",field:"community_file_type",sortable:true,width:40},
            {title:"上傳者",field:"member_name",sortable:true,width:60},
            {title:"上傳時間",field:"file_uploadtime",sortable:true,width:120},
            {formatter:"cancelShareFormatter",events:"operateEvents",width:40},
            {formatter:"communityOperateFormatter",events:"operateEvents",width:40}
        ],
        theadClasses:'thead-light',
        pageSize: 8,
        pagination:true,
        search:true,
        classes:'table table-bordered'
    });
}

function fileNameFormatter(value,row,index){
    if(row.community_file_type == "連結"){
        var linkarray = row.community_file_name.split(",");
        var linkName = linkarray[0];
        return linkName
    }
    else{
        return row.community_file_name
    }
}

function lessonplanOperateFormatter(value,row,index){
    var file_belong = row.node_id_node;
    if(file_belong == -1){
        return '<a class="" href="javascript:void(0)" title="實作檔案"><img src="/images/activitynode.svg" width="20" height="20" class="d-inline-block"></a>'
    }
    else if(file_belong == -2){
        return ''
    }
    else if(file_belong !== -2 && file_belong !== -1){
        return '<a class="" href="javascript:void(0)" title="檢視想法標題"><img src="/images/ideanode.svg" width="20" height="20" class="d-inline-block"></a>'
    }
}

function cancelShareFormatter(value,row,index){
    var cancelShare = '' ;
    var file_belong = row.node_id_node;

    if(row.member_id_member == member_id){
        if(file_belong == -2 ){
            cancelShare = '<a class="cancelShare text-danger mr-1" href="javascript:void(0)" title="取消分享"><i class="fas fa-reply"></i></a>';
        }
    }
    return cancelShare
}

function communityOperateFormatter(value,row,index){
    if(row.community_file_type !== '連結'){
        return '<a class="viewfile" href="javascript:void(0)" title="檢視檔案"><i class="fas fa-file-download"></i></a>'
    }
    else{
        var linkarray = row.community_file_name.split(",");
        var link = linkarray[1];
        return '<a class="viewlink" href="'+link+'" target="_blank" title="檢視連結"><i class="fas fa-link"></i></a>'
    }
}

function personalOperateFormatter(value,row,index){
    var commonBtn = '<a class="delete text-danger mr-2" href="javascript:void(0)" title="刪除"><i class="far fa-trash-alt"></i></a>'+
                    '<a class="share text-info mr-2" href="javascript:void(0)" title="分享"><i class="far fa-share-square"></i></a>';
    if(row.community_file_type !== '連結'){
        commonBtn += '<a class="viewfile" href="javascript:void(0)" title="檢視檔案"><i class="fas fa-file-download"></i></a>'
    }
    else{
        var linkarray = row.community_file_name.split(",");
        var link = linkarray[1];
        commonBtn += '<a class="viewlink" href="'+link+'" target="_blank" title="檢視連結"><i class="fas fa-link"></i></a>'
    }
    return commonBtn;
}

window.operateEvents = {
    'click .viewfile': function (e, value, row, index) {
        var file_name = row.community_file_name;
        $("#viewFileModal .modal-header .modal-title").text(file_name)
        $("#viewFileModal .modal-body").html(setViewModal(row))
        $("#viewFileModal").modal("show")
    },

    'click .delete': function (e, value, row, index) {
        var file_id = row.community_file_id;
        var alertDiv;
        if(row.community_file_type == "連結"){
            alertDiv = '<p id="deleteFileId" style="display:none">'+file_id+'</p><h5>是否要刪除此連結(<span id="deleteFileName" data-filetype="link">'+row.community_file_name.split(",")[0]+'</span>)？</h5>'
        }
        else{
            alertDiv = '<p id="deleteFileId" style="display:none">'+file_id+'</p><h5>是否要刪除此檔案(<span id="deleteFileName" data-filetype="file">'+row.community_file_name+'</span>)？</h5>'
        }
        $("#deleteWarningModal .modal-body .alertBody").html(alertDiv);
        $("#deleteWarningModal").modal("show");
    },

    'click .share': function(e, value, row, index){
        var file_id = row.community_file_id;
        var file_name = row.community_file_name;
        if( row.community_file_type == "連結"){
            file_name = row.community_file_name.split(",")[0]
        }
        var alertDiv = '<p id="shareFileId" style="display:none">'+file_id+'</p><h5>是否要分享此資源(<span id="shareFileName" data-filetype="'+row.community_file_type+'">'+file_name+'</span>)？</h5>';
        $("#shareWarningModal .modal-body .alertBody").html(alertDiv);
        $("#shareWarningModal").modal("show");
    }
}

//設定檢視檔案modal內容
function setViewModal(fileData){
    var file_name = fileData.community_file_name;
    var file_share = fileData.community_file_share;
    var path;
    if(file_share == 1){
        path = '/communityfolder/community_'+fileData.community_id_community+'/member_'+fileData.member_id_member+'/'+file_name;
    }
    else{
        path = '/communityfolder/community_'+fileData.community_id_community+'/communityfile/'+file_name;
    }
    var downloadLink = '<a class="btn btn-outline-info mb-2" href="'+path+'" download='+file_name+'><i class="fas fa-file-download"></i>下載</a><br>';
    var fileNameArray = file_name.split('.');
    var file_format = fileNameArray[fileNameArray.length -1];

    if(file_format == "png" || file_format =="jpg" || file_format =="jpeg"){
        downloadLink += '<img class="img-fluid" height="100%" src="'+path+'" alt='+file_name+'>';
    }else if(file_format == "pdf"){
        downloadLink += '<iframe src="'+ path +'" height="500px" width="100%"></iframe>';
    }
    return downloadLink;
}

//點擊上傳檔案以及連結btn
function clickUploadBtn(){
    $(".uploadFileBtn").click(function(){
        var character = $(this).data("character")
        var title;
        if(character == "personal"){
            title = "個人"
        }
        else{
            title = "社群"
        }
        $("#uploadFileModal .modal-header .modal-title").text("上傳"+title+"檔案");
        $("#uploadFileModal .modal-body .characterDiv").html(character);
        $("#uploadFileModal").modal("show");
    })

    $(".uploadLinkBtn").click(function(){
        var character = $(this).data("character")
        if(character == "personal"){
            title = "個人"
        }
        else{
            title = "社群"
        }
        $("#uploadLinkModal .modal-header .modal-title").text("上傳"+title+"連結");
        $("#uploadLinkModal .modal-body .characterDiv").html(character);
        $("#uploadLinkModal").modal("show");
    })

    // Add the following code if you want the name of the file appear on select
    $(".custom-file-input").on("change", function() {
        var files = [];
        for (var i = 0; i < $(this)[0].files.length; i++) {
            files.push($(this)[0].files[i].name);
        }
        $(this).siblings(".custom-file-label").addClass("selected").html(files.join(', '));
    });
}

function ajaxPostFormData(url,formdata){
    var results;
    $.ajax({
        url: url,
        type: "POST",
        async:false,
        data:formdata,
        contentType: false,
        processData: false,
        success: function(data){
            results = data;
        },
        error: function(){
            alert('失敗');
        }
    })
    return results
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

//上傳檔案以及連結事件
function uploadEvents(){
    $(".uploadBtn").click(function(){
        var type = $(this).data("uploadtype");
        var modalid = $(this).parents(".modal").attr("id");
        var character = $("#"+modalid).find(".characterDiv").text();
        var community_file_share;

        if(character == "personal"){
            community_file_share = 1;
        }
        else{
            community_file_share = 0;
        }

        switch(type){
            case 'file':
                var fileData = $("#resourceFile").prop("files");
                var file_length = fileData.length;
    
                if(file_length > 0){
                    var formData = new FormData();
                    formData.append("community_file_share",community_file_share)
                    for(var i=0;i<file_length;i++){
                        formData.append("resourcefile",fileData[i])
                    }

                    var fileResults = ajaxPostFormData("/resourceManager/"+community_id+"/uploadFile",formData);
    
                    if(fileResults.msg == "no"){
                        window.location = "/member/login";
                    }
                    else if(fileResults.msg =="ok"){
                        var selectData = fileResults.selectData;
                        console.log(selectData)
                        
                        if(community_file_share == 1){
                            selectData.forEach(function(data){
                                $personalResourceTable.bootstrapTable('append',data);
                            })
                        }
                        else{
                            selectData.forEach(function(data){
                                $communityResourseTable.bootstrapTable('append',data);
                            })
                        }
                        $("#"+modalid).modal("hide");
                    }
                    else if(fileResults.msg == "isexist"){
                        alert(fileResults.checkResults+"\n已存在相同檔名檔案，請修改檔名後再上傳");
                    }
                }
                else{
                    alert("請選擇檔案")
                }
                break;
            case 'link':
                var resourceLinkName = $("#resourceLinkName").val();
                var resourceLink = $("#resourceLink").val();

                var linkArray = [resourceLinkName,resourceLink];
                var community_file_name = linkArray.toString();

                var data = {
                    community_file_share:community_file_share,
                    community_file_name:community_file_name
                };

                var linkResults = ajaxPostData("/resourceManager/"+community_id+"/uploadLink",data);
                if(linkResults.msg == "no"){
                    window.location = "/member/login";
                }
                else{
                    var selectData = linkResults.selectData;
                        
                    if(community_file_share == 1){
                        $personalResourceTable.bootstrapTable('append',selectData[0]);
                    }
                    else{
                        selectData.forEach(function(data){
                            $communityResourseTable.bootstrapTable('append',selectData[0]);
                        })
                    }
                    $("#"+modalid).modal("hide");
                }
                break;
        }
    })
}

//刪除個人資源
function deletePersonalResource(){
    $(".deleteFile").click(function(){
        var community_file_id = $("#deleteFileId").text();
        var community_file_name = $("#deleteFileName").text();
        var type = $("#deleteFileName").data("filetype");
        var id = parseInt(community_file_id);

        var data = {
            community_file_id:community_file_id,
            community_file_name:community_file_name,
            type:type
        }

        var deleteResults = ajaxPostData("/resourceManager/"+community_id+"/deleteResource",data);
        if(deleteResults.msg == "no"){
            window.location = "/member/login";
        }
        else if(deleteResults.msg == "ok"){
            $personalResourceTable.bootstrapTable('remove',{field:'community_file_id',values:[id]});
        }
    })
}

//分享檔案
function shareResource(){
    //分享提醒Modal確定分享按鈕事件
    $(".shareFile").click(function(){
        var community_file_id = $("#shareFileId").text();
        var community_file_name = $("#shareFileName").text();
        var type = $("#shareFileName").data("filetype");

        if(type == "連結"){
            type == "link"
        }
        else{
            type == "file"
        }

        var data = {
            community_file_id:community_file_id,
            community_file_name:community_file_name,
            type:type
        }

        var id = parseInt(community_file_id);

        var shareResults = ajaxPostData("/resourceManager/"+community_id+"/shareResource",data);

        if(shareResults.msg == "no"){
            window.location = "/member/login";
        }
        else if(shareResults.msg == "ok"){
            var selectData = shareResults.selectData[0];
            $personalResourceTable.bootstrapTable('remove',{field:'community_file_id',values:[id]});
            $communityResourseTable.bootstrapTable('append',selectData);
        }

    })
}