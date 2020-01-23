//設定表格資料
var TextComponents = [ {title:'請輸入姓名',id:"member_name",name:"member_name",type:"text",show:"all"},
                        {title:'請選擇縣市',id:"member_city",name:"member_city",type:"select",show:"all"},
                        {title:'請輸入學校',id:"member_school",name:"member_school",type:"text",show:"all"},
                        {title:'請輸入帳號',id:"member_account",name:"member_account",type:"text",show:"login"},
                        {title:'請輸入密碼',id:"member_password",name:"member_password",type:"password",show:"login"}
                    ];
//設定縣市
var cityName = [{value:'台北市',name: '台北市'}, {value:'新北市',name: '新北市'}];

//將TextComponents放進registerRoot，不會用到show的判斷
function registerMap(){
    //將內容放入class為Root的div
    TextComponents.map(function(data){
        if(data.type == "select"){
            $("#registerRoot").append(  "<div class='form-group'>"+
                                            "<div class='input-group'>"+
                                                "<"+data.type+" id='"+data.id+"' name='"+data.name+"' class='city form-control'>"+
                                                    "<option selected='true' disabled='disabled' value=''>請選擇所在縣市</option>"+
                                                "</"+data.type+">"+
                                            "</div>"+
                                        "</div>");
        }
        else{
            $("#registerRoot").append(  "<div class='form-group'>"+
                                            "<div class='input-group'>"+
                                                "<input type='"+data.type+"' id='"+data.id+"' name='"+data.name+"' placeholder='"+data.title+"' class='form-control' required autofocus>"+
                                            "</div>"+
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
            $("#loginRoot").append( "<div class='form-group'>"+
                                        "<div class='input-group'>"+
                                            "<input type='"+data.type+"' id='"+data.id+"' name='"+data.name+"' placeholder='"+data.title+"' class='form-control' required autofocus>"+
                                        "</div>"+
                                    "</div>");
        }
    })
}

function postData(){
    var member_name = $("#member_name").val();
    var member_city = $(".city option:selected").val();
    var member_school = $("#member_school").val();
    var member_account = $("#member_account").val();
    var member_password = $("#member_password").val();

    if(member_name == "" || member_city == ""  || member_school=="" || member_account=="" || member_password==""){
        $("#errmsg").show();
        $("#errmsg").html('每格皆為必填');
    }
    else{
        var action = $('.postbt').val();

        if(action == '登入'){
            //與routes /member/login 的post連結

            $.ajax({
                url: "/member/login",
                type: "POST",
                data:{
                    member_account: member_account,
                    member_password:member_password
                },
                success: function(data){
                    if(data.msg == 'no'){
                        $("#errmsg").show();
                        $("#errmsg").html('密碼錯誤');
                    }
                    else if(data.msg == 'nodata'){
                        $("#errmsg").show();
                        $("#errmsg").html('此帳號不存在');
                    }
                    else{
                        alert('登入成功');
                        window.location.href = '/dashboard';
                    }     
                },
                error: function(){
                    alert('失敗');
                }
            })
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
                success: function(data){
                if(data.msg == 'no'){
                    $("#errmsg").html('使用者已存在');
                }
                else{
                    alert('註冊成功');
                    window.location.href = '/member/login';
                }     
                },
                error: function(){
                    alert('失敗');
                }
            })
        }
        
    }
};

$(function(){
    registerMap();
    loginMap();
});


