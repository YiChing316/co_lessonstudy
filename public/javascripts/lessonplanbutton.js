function addlessonplantargetlist(){
    //尋找最後一個tr的標題th數字為多少
    var listnum = $("#lessonplantargetTbody").find("tr").last().children("th").text();
    listnum++;
    $("#lessonplantargetTbody").append('<tr>'+
                                            '<th scope="row" title="可上下移動排序">'+listnum+'</th>'+
                                            '<td><input type="text" class="form-control" name="lessonplantargercontent" placeholder="請輸入學習目標"></td>'+
                                            '<td class="lasttd"><button class="btn btn-danger btnDelete"><i class="far fa-trash-alt"></i></button></td>'+
                                        '</tr>')
}


$(function(){

    //刪除學習目標
    $("#lessonplantargetTbody").on('click','.btnDelete',function(){
        $(this).closest('tr').remove();
        $("#lessonplantargetTbody tr").each(function(index) {
            $(this).find('th:eq(0)').first().html(index + 1);
        });
    });

    //排序學習列表
    $( "#lessonplantargetTable tbody" ).sortable( {
        update: function(){
            $(this).children().each(function(index) {
                $(this).find('th:eq(0)').first().html(index + 1);
            });
        }
    }); 


});

