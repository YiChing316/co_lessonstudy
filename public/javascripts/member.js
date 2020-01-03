//設定登入的表格
var loginComponents = [ {title:'姓名',id:"member_name",name:"member_name",type:"text"},
                        {title:'縣市',id:"member_city",name:"member_city",type:"select"},
                        {title:'學校',id:"member_school",name:"member_school",type:"text"},
                        {title:'帳號',id:"member_account",name:"member_account",type:"text"},
                        {title:'密碼',id:"member_password",name:"member_password",type:"text"}
                    ];
//設定縣市
var cityName = [{value:'台北市',name: '台北市'}, {value:'新北市',name: '新北市'}];

$(function(){
    //將form內容放入
    loginComponents.map(function(data){
        if(data.type == "select"){
            $("#loginRoot").append("<div>"+
                                        "<p>"+data.title+"</p>"+
                                        "<"+data.type+" id='"+data.id+"' name='"+data.name+"'></"+data.type+">"+
                                    "</div>");
        }
        else{
            $("#loginRoot").append("<div>"+
                                    "<p>"+data.title+"</p>"+
                                    "<input type='"+data.type+"' id='"+data.id+"' name='"+data.name+"'>"+
                                "</div>");
        }
    })
    //將json放入select option
    cityName.map(function(data){
        $("#member_city").append("<option value='"+ data.value +"'>" + data.name + "</option>");
    });
});
