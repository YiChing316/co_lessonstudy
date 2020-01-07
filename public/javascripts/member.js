//設定表格資料
var TextComponents = [ {title:'姓名',id:"member_name",name:"member_name",type:"text",show:"all"},
                        {title:'縣市',id:"member_city",name:"member_city",type:"select",show:"all"},
                        {title:'學校',id:"member_school",name:"member_school",type:"text",show:"all"},
                        {title:'帳號',id:"member_account",name:"member_account",type:"text",show:"login"},
                        {title:'密碼',id:"member_password",name:"member_password",type:"password",show:"login"}
                    ];
//設定縣市
var cityName = [{value:'台北市',name: '台北市'}, {value:'新北市',name: '新北市'}];

//將TextComponents放進registerRoot，不會用到show的判斷
function registerMap(){
    //將內容放入class為Root的div
    TextComponents.map(function(data){
        if(data.type == "select"){
            $("#registerRoot").append(  "<div>"+
                                            "<p>"+data.title+"</p>"+
                                            "<"+data.type+" id='"+data.id+"' name='"+data.name+"' class='city'>"+
                                                "<option selected='true' disabled='disabled' value=''>請選擇所在縣市</option>"+
                                            "</"+data.type+">"+
                                        "</div>");
        }
        else{
            $("#registerRoot").append(  "<div>"+
                                            "<p>"+data.title+"</p>"+
                                            "<input type='"+data.type+"' id='"+data.id+"' name='"+data.name+"'>"+
                                        "</div>");
        }
    })

    //將json放入select option
    cityName.map(function(data){
        $("#member_city").append("<option value='"+ data.value +"'>" + data.name + "</option>");
    });
}

//將TextComponents放進loginRoot，只顯示show為login的資料
function loginMap(){
    TextComponents.map(function(data){
        if(data.show == "login"){
            $("#loginRoot").append( "<div>"+
                                        "<p>"+data.title+"</p>"+
                                        "<input type='"+data.type+"' id='"+data.id+"' name='"+data.name+"'>"+
                                    "</div>");
        }
    })
}

function registerPost(){
    var member_name = $("#member_name").val();
    var member_city = $(".city option:selected").val();
    var member_school = $("#member_school").val();
    var member_account = $("#member_account").val();
    var member_password = $("#member_password").val();

    if(member_name == "" || member_city == ""  || member_school=="" || member_account=="" || member_password==""){
        alert('每格皆為必填');
    }
    else{
        //與routes /member/register 的post連結
        $.ajax({
            url: "/member/register",
            type: "POST",
            data:{
                member_name: member_name,
                member_city: member_city,
                member_school: member_school,
                member_account: member_account,
                member_password:member_password
            },
            success: function(){
                alert('註冊成功');
            },
            error: function(){
                alert('失敗');
            }
        })
    }
};

$(function(){
    registerMap();
    loginMap();
});


