/*將lessonplan/edit的頁面框架，以及sidebar內容 map出來 */

var pagecontent_Components = [
    {title:'教案基本資料',id:'lessonplan',collapse:'show'},
    {title:'安排課程單元/活動',id:'lessonplan_unit',collapse:'show'},
    {title:'課程學習目標',id:'lessonplan_target',collapse:'none'},
    {title:'學生先備概念',id:'lessonplan_studentknowledge',collapse:'none'},
    {title:'核心素養',id:'lessonplan_cirn',collapse:'none'},
    {title:'議題融入',id:'lessonplan_issue',collapse:'none'},
    {title:'教學資源及器材',id:'lessonplan_resourse',collapse:'none'},
    {title:'教學設計理念',id:'lessonplan_design',collapse:'none'},
    {title:'因材網知識節點',id:'lessonplan_adl',collapse:'none'}
];

function pagecontent_Map(){
    pagecontent_Components.map(function(data){
        var root ="<div class='card' id='cardid"+data.id+"'>"+
                        "<div class='card-header bg-white' id='header"+data.id+"'>"+data.title+
                            "<span class='float-right' data-toggle='collapse' data-target='#"+data.id+"'>"+
                                "<i id='"+data.id+"icon' aria-hidden='true'></i>"+
                            "</span>"+
                        "</div>"+
                        "<div class='card-body collapse' id='"+data.id+"'></div>"+
                    "</div>";
        if(data.collapse == "show"){
            $("#setlesson").append(root);
            $("#"+data.id+"icon").addClass("fa fa-angle-up");
            $("#"+data.id).addClass("show");
        }
        else{
            $("#setlesson").append(root);
            $("#"+data.id+"icon").addClass("fa fa-angle-down");
        }
    })
};

function sidebar_Map(){
    pagecontent_Components.map(function(data){
        $("#sidebarul").append('<li><a href="#cardid'+data.id+'" class="sidebarlink">'+data.title+'</a></li>');
    })
};

$(function(){
    pagecontent_Map();
    sidebar_Map();

    //class摺疊執行完後更改圖形
    $(".collapse").on('show.bs.collapse', function(){
        $i = $(this).closest('.card').children().children().children();
        var id = $i.attr('id');
        $('#'+id).removeClass('fa fa-angle-down');
        $('#'+id).addClass("fa fa-angle-up");
    });
    $(".collapse").on('hide.bs.collapse', function(){
        //$(this)為card-body，需更改同父內三層的i的class
        $i = $(this).closest('.card').children().children().children();
        var id = $i.attr('id');
        $('#'+id).removeClass('fa fa-angle-up');
        $('#'+id).addClass("fa fa-angle-down");
    });

    $(".sidebarlink").on('click', function(event) {
        //若未*2會只滑到card-header的一半
        var cardheaderHeight = $(".card-header").height()*2
        if (this.hash !== "") {
          event.preventDefault();
          var hash = this.hash;
          $('html, body').animate({
            scrollTop: $(hash).offset().top - cardheaderHeight
          }, 1000);
        }
    });
});