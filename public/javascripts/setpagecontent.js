/*將lessonplan/edit的頁面框架，以及sidebar內容 map出來 */
var pagecontent_Components = [
    {title:'教案基本資料',id:'lessonplan_basicdata',collapse:'none'},
    {title:'學生先備概念',id:'lessonplan_studentknowledge',collapse:'none'},
    {title:'教學設計理念',id:'lessonplan_design',collapse:'none'},
    {title:'課程學習目標',id:'lessonplan_target',collapse:'none'}
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

//側邊選單的錨點定位
function sidebarClick(){
    $('.sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $('#content').toggleClass('active');
    });

    $(".sidebarlink").on('click', function(event) {
        //若未減去cardheaderHeight會無法蓋到每階段的標題
        //因為原本($(".card-header").height()*2)會被想法實作切換擋住故改為($(".card-header").height()*4)
        var cardheaderHeight = $(".card-header").height()*4.5;
        if (this.hash !== "") {
          event.preventDefault();//防止連結打開url，preventDefault()為阻止element發生默認行為，例如點擊submit時阻止表單提交
          var hash = this.hash;
          $('html, body').animate({
            scrollTop: $(hash).offset().top - cardheaderHeight
          }, 1000);
        }
    });
};

$(function(){
    activityName = JSON.parse($("#lessonplanActivityName").text());

    pagecontent_Map();
    sidebar_Map();
    sidebarClick();
});