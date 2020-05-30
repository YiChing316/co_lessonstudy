var community_id;

var socket = io();

$(function(){
    community_id = $("#community_id").text();

    convergencesummernoteClass();
    setcommunicateTable();

    $("#sidebar .list-unstyled").append('<li class="sidebar-menu">'+
                                            '<a href="/lessonplan/idea/'+community_id+'/divergence" aria-expanded="false">'+
                                                '<img src="/images/one.svg" width="25" height="25" class="d-inline-block mr-1">想法發散'+
                                            '</a>'+
                                        '</li>'+
                                        '<li class="sidebar-menu">'+
                                            '<a href="javascript:void(0)" class="onpage disabledNav" aria-expanded="false">'+
                                                '<img src="/images/two.svg" width="25" height="25" class="d-inline-block mr-1">想法收斂'+
                                            '</a>'+
                                        '</li>');

    $('html, body').css('overflowY', 'hidden'); 
})

var $convergenceMessageTable;
function setcommunicateTable(){
    $convergenceMessageTable = $("#convergenceMessageTable");
    $convergenceMessageTable.bootstrapTable({
        columns:[
            {title:"留言id",field:"id",visible:false,sortable:true},
            {title:"留言內容",field:"message_content"},
            {title:"留言者",field:"member_id_member",width:40},
            {title:"留言時間",field:"message_time",width:120}
        ],
        theadClasses:'thead-light',
        pageSize: 5,
        pagination:true,
        sortName:"id",
        sortOrder:"desc",
        classes:'table table-bordered table-sm'
    })
}

//想法summernote設定
function convergencesummernoteClass(){
    $('.convergencesummernote').summernote({
        tabsize: 2,
        toolbar: [
                  // [groupName, [list of button]]
                  ['style', ['style']],
                  ['font', ['bold', 'underline', 'clear']],
                  ['color', ['color']],
                  ['para', ['ul', 'ol', 'paragraph']],
                  ['table', ['table']],
                  ['insert', ['link', 'picture', 'video']],
                  ['view', ['codeview']]
        ],
        minHeight: 180,
        disableDragAndDrop: true,
        dialogsInBody: true,
        callbacks:{
            onImageUpload : function(files){
                var formData = new FormData();
                var file_length = files.length;

                for(var i=0;i<file_length;i++){
                    formData.append("imageFile",files[i])
                }
                var id = $(this).attr("id");

                $.ajax({
                    url: "/lessonplan/edit/"+community_id+"/uploadsummernotefile",
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
                            var filepath = data.filepath;
                            $.each(filepath,function(i){
                                $("#"+id).summernote('insertImage', filepath[i].url);
                            })
                        }
                    },
                    error: function(){
                        alert('失敗');
                    }
                })
            }
        }
    });
    $(".note-resizebar").hide();
}