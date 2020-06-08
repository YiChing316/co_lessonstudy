/*將lessonplan/edit的頁面框架，以及sidebar內容 map出來 */
var pagecontent_Components = [
    {title:'教案基本資料',id:'lessonplan_basicdata',collapse:'show'},
    {title:'學生先備概念',id:'lessonplan_studentknowledge',collapse:'none'},
    {title:'教學設計理念',id:'lessonplan_design',collapse:'none'},
    {title:'課程學習目標',id:'lessonplan_target',collapse:'none'}
];

function pagecontent_Map(){
    pagecontent_Components.map(function(data){
        var root = "<div class='row'>"+
                        "<div class='card col nopadding' id='cardid"+data.id+"'>"+
                            "<h5 class='card-header bg-white font-weight-bolder shadow-sm' id='header"+data.id+"' data-toggle='collapse' data-target='#"+data.id+"'>"+data.title+
                                "<span class='float-right'>"+
                                    "<i id='"+data.id+"icon' class='collapseicon' aria-hidden='true'></i>"+
                                "</span>"+
                            "</h5>"+
                            "<div class='card-body collapse' id='"+data.id+"'></div>"+
                        "</div>"+
                        "<div class='card col-3 nopadding'>"+
                            "<h5 class='card-header bg-selfgreen font-weight-bolder'>想法收斂結果</h5>"+
                            "<div class='card-body collapse padding-sm-all ideaConvergenceResult' data-tagtitle='"+data.title+"' id='ideaConvergenceResult"+data.id+"'></div>"+
                        "</div>"+
                    "</div>";
        if(data.collapse == "show"){
            $("#setlesson").append(root);
            $("#"+data.id+"icon").addClass("fa fa-angle-up");
            $("#"+data.id).addClass("show");
            $("#ideaConvergenceResult"+data.id).collapse('show');
        }
        else{
            $("#setlesson").append(root);
            $("#"+data.id+"icon").addClass("fa fa-angle-down");
        }
    })
};

var activityName;

function setSideBar(){
    $("#sidebar .list-unstyled").append('<li class="sidebar-menu">'+
                                            '<a href="javascript:void(0)" aria-expanded="false" class="onpage sidebarTitle" id="targetsidebar">'+
                                                '<img src="/images/one.svg" width="25" height="25" class="d-inline-block mr-1">訂定課程目標'+
                                            '</a>'+
                                            '<ul class="siderul list-unstyled" id="sidebarul"></ul>'+
                                        '</li>'+
                                        '<li class="sidebar-menu">'+
                                            '<a href="javascript:void(0)" aria-expanded="false" class="sidebarTitle" id="activityDesign">'+
                                                '<img src="/images/two.svg" width="25" height="25" class="d-inline-block mr-1">活動與評量設計'+
                                            '</a>'+
                                            '<ul class="siderul list-unstyled" id="activityDesignUl"></ul>'+
                                        '</li>'+
                                        '<li class="sidebar-menu">'+
                                            '<a href="javascript:void(0)" aria-expanded="false" style="pointer-events: none;">'+
                                                '<img src="/images/three.svg" width="25" height="25" class="d-inline-block mr-1">教案檢核與總覽'+
                                            '</a>'+
                                            '<ul class="siderul list-unstyled" id="overviewUl">'+
                                                '<li><a href="javascript:openTwoWayTableModal()" class="sidebarlink">雙向細目檢核</a></li>'+
                                                '<li><a href="/lessonplan/edit/'+$("#community_id").text()+'/overviewLessonplan" target="_blank" class="sidebarlink">預覽教案</a></li>'+
                                            '</ul>'+
                                        '</li>');
}

function sidebar_Map(){
    pagecontent_Components.map(function(data){
        $("#sidebarul").append('<li><a href="#cardid'+data.id+'" class="sidebarlink">'+data.title+'</a></li>');
    })

    if(activityName.length !== 0){
        $.each(activityName,function(i,val){
            var id = i+1;
            $("#activityDesignUl").append('<li><a href="#cardidactivity_'+id+'" class="sidebarlink disabledNav">'+activityName[i].lessonplan_activity_name+'</a></li>');
        })
    }
    
    sidebarClick();
};

//側邊選單的錨點定位
function sidebarClick(){
    $('.sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $('#content').toggleClass('active');
    });

    $(".sidebarlink").on('click', function(event) {
        //若未減去cardheaderHeight會無法蓋到每階段的標題
        //因為原本($(".card-header").height()*2)會被想法實作切換擋住故改為($(".card-header").height()*4)
        var cardheaderHeight = $(".card-header").height()*3;
        if (this.hash !== "") {
          event.preventDefault();//防止連結打開url，preventDefault()為阻止element發生默認行為，例如點擊submit時阻止表單提交
          var hash = this.hash;
          $('html, body').animate({
            scrollTop: $(hash).offset().top - cardheaderHeight
          }, 500);
        }
    });
};

$(function(){
    activityName = JSON.parse($("#lessonplanActivityName").text());
    pagecontent_Map();
    setSideBar();
    sidebar_Map();

    $(".sidebarTitle").click(function(){
        var id = $(this).attr("id");

        if(id == "targetsidebar"){
            $("#setlesson").parent().show();
            $("#setactivity").parent().hide();
            $("#activityDesign").removeClass("onpage");
            $("#activityDesignUl li a").addClass("disabledNav");
            $("#sidebarul li a").removeClass("disabledNav");
            $(this).toggleClass("onpage")
        }
        else if( id == "activityDesign"){
            $("#setlesson").parent().hide();
            $("#setactivity").parent().show();
            $("#targetsidebar").removeClass("onpage");
            $("#sidebarul li a").addClass("disabledNav");
            $("#activityDesignUl li a").removeClass("disabledNav");
            $(this).toggleClass("onpage")
        }
    })
});