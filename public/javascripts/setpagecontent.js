/*將lessonplan/edit的頁面框架，以及sidebar內容 map出來 */

var pagecontent_Components = [
    {title:'教案基本資料',id:'lessonplan',collapse:'show'},
    {title:'課程學習目標',id:'lessonplan_target',collapse:'show'},
    {title:'安排課程單元/活動',id:'lessonplan_unit',collapse:'show'},
    {title:'學習目標與活動對應表',id:'lessonplan_targetandActivity',collapse:'show'},
    {title:'學生先備概念',id:'lessonplan_studentknowledge',collapse:'none'},
    {title:'總綱核心素養',id:'lessonplan_cirn',collapse:'none'},
    {title:'學習重點',id:'learning_focus',collapse:'none'},
    {title:'議題融入',id:'lessonplan_issue',collapse:'none'},
    {title:'教學資源及器材',id:'lessonplan_resource',collapse:'none'},
    {title:'教學設計理念',id:'lessonplan_design',collapse:'none'},
    {title:'因材網知識節點',id:'lessonplan_adl',collapse:'none'}
];

function pagecontent_Map(){
    pagecontent_Components.map(function(data){
        var root = "<div class='row'>"+
                        "<div class='card col-9 nopadding' id='cardid"+data.id+"'>"+
                            "<h5 class='card-header bg-white font-weight-bolder shadow-sm' id='header"+data.id+"' data-toggle='collapse' data-target='#"+data.id+"'>"+data.title+
                                "<span class='float-right'>"+
                                    "<i id='"+data.id+"icon' aria-hidden='true'></i>"+
                                "</span>"+
                            "</h5>"+
                            "<div class='card-body collapse' id='"+data.id+"'></div>"+
                        "</div>"+
                        "<div class='card col nopadding'>"+
                            "<h5 class='card-header bg-selfgreen font-weight-bolder'>團隊想法</h5>"+
                            "<div class='card-body collapse'></div>"+
                        "</div>"+
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

var activityName;

function sidebar_Map(){
    pagecontent_Components.map(function(data){
        $("#sidebarul").append('<li><a href="#cardid'+data.id+'" class="sidebarlink">'+data.title+'</a></li>');
    })

    if(activityName.length !== 0){
        $.each(activityName,function(i,val){
            var id = i+1;
            $("#activityDesignUl").append('<li><a href="#cardidactivity_'+id+'" class="sidebarlink">'+activityName[i].lessonplan_activity_name+'</a></li>');
        })
    }   
};

function sidebarIcon(){
    $('.siderul').on('hide.bs.collapse', function () {
        $i = $(this).parent().find('i');
        $i.removeClass("fa-chevron-circle-up");
        $i.addClass("fa-chevron-circle-down");
    })
    $('.siderul').on('show.bs.collapse', function () {
        $i = $(this).parent().find('i');
        $i.removeClass("fa-chevron-circle-down");
        $i.addClass("fa-chevron-circle-up");
    })
}

$(function(){
    activityName = JSON.parse($("#lessonplanActivityName").text());

    pagecontent_Map();
    sidebar_Map();

    sidebarIcon();
});