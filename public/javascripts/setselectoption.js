var ccdimesionData,ccitemData,ccfieldData;
var lfitemData,lfchilditemData,lfcontentData;

function dimesion_Map(){
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

function learning_focus_item_Map(){
    for(var i = 0 ;i<lfitemData.length;i++){
        var lfitem = lfitemData[i];
        var first_lftype = lfitem.learning_focus_type;
        var first_lfitem = lfitem.learning_focus_item;
        if(first_lftype == "學習表現"){
            $("#performancefocus_item").append("<option value='"+first_lfitem+"'>"+first_lfitem+"</option>");
            learning_focus_childitem_Map(first_lftype,first_lfitem,'performancefocus_item','performancefocus_childitem','performancefocus_content');
        }
        else if( first_lftype == "學習內容"){
            $("#contentfocus_item").append("<option value='"+first_lfitem+"'>"+first_lfitem+"</option>");
            learning_focus_childitem_Map(first_lftype,first_lfitem,'contentfocus_item','contentfocus_childitem','contentfocus_content');
        }
    }
}

function learning_focus_childitem_Map(lftype,lfitem,firstselect,secondselect,thirdselect){
    var child_array = [];
    for(var i = 0 ; i<lfchilditemData.length;i++){
        var lfchild = lfchilditemData[i];
        var second_lftype = lfchild.learning_focus_type;
        var second_lfitem = lfchild.learning_focus_item;
        var second_lfchilditem = lfchild.learning_focus_childitem;
        if( second_lftype == lftype && second_lfitem == lfitem){
            child_array.push({second_lftype:second_lftype,second_lfitem:second_lfitem,second_lfchilditem:second_lfchilditem,thirdselect:thirdselect});
        }
    }

    $("#"+firstselect).change(function(){
        switch($(this).val()){
            case 0:
                $("#"+secondselect+" option").remove();
                $("#"+thirdselect+" option").remove();
                break;
            case lfitem:
                $("#"+secondselect+" option").remove();
                $("#"+thirdselect+" option").remove();
                var array = child_array;
                $.each(array,function(i,val){
                    $("#"+secondselect).append("<option value='"+array[i].second_lfchilditem+"'>"+array[i].second_lfchilditem+"</option>")
                    learning_focus_content_Map(array[i].second_lftype,array[i].second_lfitem,array[i].second_lfchilditem,secondselect,array[i].thirdselect)
                });
                break;
        }
    })
}

function learning_focus_content_Map(lftype,lfitem,lfchild,secondselect,thirdselect){
    var content_array=[];

    for(var i = 0; i<lfcontentData.length;i++){
        var lfcontent = lfcontentData[i];
        var third_lftype = lfcontent.learning_focus_type;
        var third_lfitem = lfcontent.learning_focus_item;
        var third_lfchilditem = lfcontent.learning_focus_childitem;
        var third_sn = lfcontent.learning_focus_serial_number;
        var third_lfcontent = lfcontent.learning_focus_content;
        if(third_lftype == lftype && third_lfitem == lfitem && third_lfchilditem == lfchild){
            content_array.push(third_sn+third_lfcontent);
        }
    }
    
    $("#"+secondselect).change(function(){
        switch($(this).val()){
            case 0:
                $("#"+thirdselect+" option").remove();
                break;
            case lfchild:
                $("#"+thirdselect+" option").remove();
                var array = content_array;
                $.each(array,function(i,val){
                    $("#"+thirdselect).append("<option value='"+array[i]+"'>"+array[i]+"</option>")
                });
                break;
        }
    })  
}

//刪除內容
function deleteItem(){
    $(".deleteItem").click(function(){
        $(this).closest(".card").remove();
    })
}

function selectDefault(){
    $("#core_competency_dimesion_sel").append("<option disabled selected>請選擇總綱核心面向</option>");
    $("#core_competency_item_sel").append("<option disabled selected>請選擇總綱核心項目</option>");

    $("#performancefocus_item").append("<option disabled selected>請選擇</option>");
    $("#performancefocus_childitem").append("<option disabled selected>請選擇</option>");
    $("#performancefocus_content").append("<option disabled selected>請選擇內容</option>");

    $("#contentfocus_item").append("<option disabled selected>請選擇</option>");
    $("#contentfocus_childitem").append("<option disabled selected>請選擇</option>");
    $("#contentfocus_content").append("<option disabled selected>請選擇內容</option>");

    $("#issue_name").append("<option disabled selected>請選擇議題</option>");
    $("#issue_learning_theme").append("<option disabled selected>請選擇學習主題</option>");
    $("#issue_content").append("<option disabled selected>請選擇議題內容</option>");
}



$(function(){
    ccdimesionData = JSON.parse($("#ccdimesionData").text());
    ccitemData = JSON.parse($("#ccitemData").text());
    ccfieldData = JSON.parse($("#ccfieldData").text());
    lfitemData = JSON.parse($("#lfitemData").text());
    lfchilditemData = JSON.parse($("#lfchilditemData").text());
    lfcontentData = JSON.parse($("#lfcontentData").text());

    selectDefault();
    dimesion_Map();
    learning_focus_item_Map();

})