$(function(){
    sortactivitytable();
})

//排序活動流程
function sortactivitytable(){
    $( ".activitytable tbody" ).sortable( {
        update: function(){
            $(this).children().each(function(index) {
                $(this).find('th:eq(0)').first().html(index + 1);
            });
        }
    }); 
}