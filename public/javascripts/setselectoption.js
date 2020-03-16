var ccdimesionData,ccitemData,ccfieldData;

function dimesion_Map(){
    $("#core_competency_dimesion_sel").append("<option disabled selected>請選擇總綱核心面向</option>");
    $("#core_competency_item_sel").append("<option disabled selected>請選擇總綱核心項目</option>");
    for(var i=0; i<ccdimesionData.length;i++){
        var cc = ccdimesionData[i];
        var ccdimesion = cc.core_competency_dimesion;
        $("#core_competency_dimesion_sel").append("<option value='"+ccdimesion+"'>"+ccdimesion+"</option>");
        item_Map(ccdimesion)
    }
}

function item_Map(ccdimesion){
    var item_array =[];
    for(var i =0;i<ccitemData.length;i++){
        var ccitem = ccitemData[i];
        var core_competency_dimesion = ccitem.core_competency_dimesion;
        var core_competency_item = ccitem.core_competency_item;
        var core_competency_itemvalue = ccitem.core_competency_itemvalue;
        if(core_competency_dimesion == ccdimesion){
            item_array.push({ccitemval: core_competency_itemvalue,ccitemoption:core_competency_item});
        }  
    }

    $("#core_competency_dimesion_sel").change(function(){
        switch($(this).val()){
            case 0 :
                $("#core_competency_item_sel option").remove();
                break;
            case ccdimesion:
                $("#core_competency_item_sel option").remove();
                var array = item_array;
                $.each(array,function(i,val){
                    $("#core_competency_item_sel").append("<option value='"+array[i].ccitemval+"'>"+array[i].ccitemoption+"</option>")
                });
                break;
        }
    })
}

function addcore_competency(){
    $selected = $("#core_competency_item_sel :selected");
    var itemtext = $selected.text();
    var itemval = $selected.val();

    //使用現有的itemval到ccitemdata進行搜尋，找到**總綱核心素養**的項目說明
    $.each(ccitemData,function(i,val){
        if(ccitemData[i].core_competency_itemvalue == itemval){

            var dimesion_description = ccitemData[i].core_competency_item_description;
            //使用現有的itemval到ccfielddata進行搜尋，找出所需資料
            //**總綱核心素養**的核心素養項目值 與 **領域核心素養**的核心項目值為相對應的，故要根據itemval搜尋出與總綱項目值相同的資料
            $.each(ccfieldData,function(i,val){

                if(ccfieldData[i].fieldcontent_coreitem == itemval){

                    //**領域核心素養**內容
                    var field_name = ccfieldData[i].fieldcontent_field;
                    var field_stage = ccfieldData[i].fieldcontent_stage;
                    var field_content = ccfieldData[i].fieldcontent_content;
                    
                    $("#core_competency_body").append('<div class="card">'+
                                                        '<div class="card-header">'+
                                                            '<b class="card-title">'+itemtext+'</b>'+
                                                            '<p class="card-text">'+dimesion_description+'</p>'+                        
                                                        '</div>'+
                                                        '<div class="card-body">'+
                                                            '<b class="card-title">'+field_name+'-'+field_stage+'-'+itemval+'</b>'+
                                                            '<p class="card-text">'+field_content+'</p>'+
                                                            '<input type="button" class="btn btn-danger float-right deleteItem" value="刪除" >'+
                                                        '</div>'+
                                                    '</div>');
                }
            });

        }
    });

    deleteItem();

}

//刪除內容
function deleteItem(){
    $(".deleteItem").click(function(){
        $(this).closest(".card").remove();
    })
}



$(function(){
    ccdimesionData = JSON.parse($("#ccdimesionData").text());
    ccitemData = JSON.parse($("#ccitemData").text());
    ccfieldData = JSON.parse($("#ccfieldData").text());

    dimesion_Map();

})