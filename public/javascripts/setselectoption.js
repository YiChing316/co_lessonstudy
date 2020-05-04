var ccdimesionData,ccitemData,ccfieldData;
var lfitemData,lfchilditemData,lfcontentData;
var issuenameData,issuethemeData,issuecontentData;

/**append select option***************************************************************************************** */

function dimesion_field(){
    var course_field_info = $("#course_field_info").text();
    var fieldArray = course_field_info.split(',');
    $("#fieldcontent_field_sel").append("<option disabled selected>請選擇領域</option>");
    $.each(fieldArray,function(i){
        $("#fieldcontent_field_sel").append("<option value='"+fieldArray[i]+"'>"+fieldArray[i]+"</option>");
    })
}

//總綱核心素養1
function dimesion_Map(){
    for(var i=0; i<ccdimesionData.length;i++){
        var cc = ccdimesionData[i];
        var ccdimesion = cc.core_competency_dimesion;
        $("#core_competency_dimesion_sel").append("<option value='"+ccdimesion+"'>"+ccdimesion+"</option>");
        item_Map(ccdimesion)
    }
}

//總綱核心素養2
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
                $("#core_competency_item_sel").append("<option disabled selected>請選擇總綱核心項目</option>");
                var array = item_array;
                $.each(array,function(i,val){
                    $("#core_competency_item_sel").append("<option value='"+array[i].ccitemval+"'>"+array[i].ccitemoption+"</option>")
                });
                break;
        }
    })
}


//學習重點1
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

//學習重點2
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
                $("#"+secondselect).append("<option disabled selected>請選擇子項</option>");
                $("#"+thirdselect).append("<option disabled selected>請選擇內容</option>");
                var array = child_array;
                $.each(array,function(i,val){
                    $("#"+secondselect).append("<option value='"+array[i].second_lfchilditem+"'>"+array[i].second_lfchilditem+"</option>")
                    learning_focus_content_Map(array[i].second_lftype,array[i].second_lfitem,array[i].second_lfchilditem,secondselect,array[i].thirdselect)
                });
                break;
        }
    })
}

//學習重點3
function learning_focus_content_Map(lftype,lfitem,lfchild,secondselect,thirdselect){
    var content_array=[];

    for(var i = 0; i<lfcontentData.length;i++){
        var lfcontent = lfcontentData[i];
        var third_lftype = lfcontent.learning_focus_type;
        var third_lfitem = lfcontent.learning_focus_item;
        var third_lfchilditem = lfcontent.learning_focus_childitem;
        var third_lfcontent = lfcontent.learning_focus_content;
        if(third_lftype == lftype && third_lfitem == lfitem && third_lfchilditem == lfchild){
            content_array.push(third_lfcontent);
        }
    }
    
    $("#"+secondselect).change(function(){
        switch($(this).val()){
            case 0:
                $("#"+thirdselect+" option").remove();
                break;
            case lfchild:
                $("#"+thirdselect+" option").remove();
                $("#"+thirdselect).append("<option disabled selected>請選擇內容</option>");
                var array = content_array;
                $.each(array,function(i,val){
                    $("#"+thirdselect).append("<option value='"+array[i]+"'>"+array[i]+"</option>")
                });
                break;
        }
    })  
}


//議題融入1
function issuename_Map(){
    for(var i = 0; i<issuenameData.length;i++){
        var firstissue = issuenameData[i];
        var issue_name = firstissue.issue_name;
        $("#issue_name").append("<option value='"+issue_name+"'>"+issue_name+"</option>");
        issuetheme_Map(issue_name);
    }
}

//議題融入2
function issuetheme_Map(issuename){
    var theme_array=[];
    issuethemeData = sortByKey(issuethemeData,'issue_id')
    for(var i =0;i<issuethemeData.length;i++){
        var secondissue = issuethemeData[i];
        var secondissue_name = secondissue.issue_name;
        var secondissue_learning_theme = secondissue.issue_learning_theme;
        if(secondissue_name == issuename){
            theme_array.push({secondissue_name:secondissue_name,secondissue_learning_theme:secondissue_learning_theme});
        }
    }

    $("#issue_name").change(function(){
        switch($(this).val()){
            case 0:
                $("#issue_learning_theme option").remove();
                $("#issue_content option").remove();
                break;
            case issuename:
                $("#issue_learning_theme option").remove();
                $("#issue_content option").remove();
                $("#issue_learning_theme").append("<option disabled selected>請選擇學習主題</option>");
                $("#issue_content").append("<option disabled selected>請選擇議題內容</option>");
                var array = theme_array;
                $.each(array,function(i,val){
                    $("#issue_learning_theme").append("<option value='"+array[i].secondissue_learning_theme+"'>"+array[i].secondissue_learning_theme+"</option>");
                    issuecontent_Map(array[i].secondissue_name,array[i].secondissue_learning_theme);
                });
                break;
        }
    })
}

//議題融入3
function issuecontent_Map(issuename,issuetheme){
    var content_array=[];
    for(var i = 0;i<issuecontentData.length;i++){
        var thirdissue= issuecontentData[i];
        var thirdissue_name = thirdissue.issue_name;
        var thirdissue_theme = thirdissue.issue_learning_theme;
        var thirdissue_sn = thirdissue.issue_serial_number;
        var thirdissue_content = thirdissue.issue_content;
        if(thirdissue_name == issuename && thirdissue_theme == issuetheme){
            content_array.push(thirdissue_content);
        }
    }

    $("#issue_learning_theme").change(function(){
        switch($(this).val()){
            case 0:
                $("#issue_content option").remove();
                break;
            case issuetheme:
                $("#issue_content option").remove();
                $("#issue_content").append("<option disabled selected>請選擇議題內容</option>");
                var array = content_array;
                $.each(array,function(i,val){
                    $("#issue_content").append("<option value='"+array[i]+"'>"+array[i]+"</option>")
                });
                break;
        }
    })

}



/**加入內容**********************************************************************/

//新增核心素養card
function addcore_competency(){
    var dimesion_field = $("#fieldcontent_field_sel :selected").val();

    switch(dimesion_field){
        case "自然":
            dimesion_field = "自";
            break;
        case "國語":
            dimesion_field = "國";
            break;
        case "數學":
            dimesion_field = "數"
            break;
        case "英語":
            dimesion_field = "英";
            break;
    }

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

                    if(field_name == dimesion_field){
                        var field_title = field_name+'-'+field_stage+'-'+itemval;
                        coreCardDiv(itemtext,dimesion_description,field_title,field_content);
                    }
                    
                }
            });

        }
    });

    deleteItem();
}

//新增學習表現card
function addlearning_performence(){
    var item = $("#performancefocus_item :selected").val();
    var childitem = $("#performancefocus_childitem :selected").val();
    var content = $("#performancefocus_content :selected").val();

    $.each(lfcontentData,function(i,val){
        if(lfcontentData[i].learning_focus_item == item && lfcontentData[i].learning_focus_childitem == childitem && lfcontentData[i].learning_focus_content == content){
            var learning_focus_coding = lfcontentData[i].learning_focus_coding;
            var learning_focus_stage = lfcontentData[i].learning_focus_stage;
            var learning_focus_serial_number = lfcontentData[i].learning_focus_serial_number;

            var string = learning_focus_coding+"-"+learning_focus_stage+"-"+learning_focus_serial_number;

            addselectbodyDiv('performancefocus_body',string,content);
        }
    })
}

function addlearning_content(){
    var item = $("#contentfocus_item :selected").val();
    var childitem = $("#contentfocus_childitem :selected").val();
    var content = $("#contentfocus_content :selected").val();

    $.each(lfcontentData,function(i,val){
        if(lfcontentData[i].learning_focus_item == item && lfcontentData[i].learning_focus_childitem == childitem && lfcontentData[i].learning_focus_content == content){
            var learning_focus_coding = lfcontentData[i].learning_focus_coding;
            var learning_focus_stage = lfcontentData[i].learning_focus_stage;
            var learning_focus_serial_number = lfcontentData[i].learning_focus_serial_number;

            var string = learning_focus_coding+"-"+learning_focus_stage+"-"+learning_focus_serial_number;

            addselectbodyDiv('contentfocus_body',string,content);
        }
    })
}

function addissue(){
    var issue_name = $("#issue_name :selected").val();
    var issue_theme = $("#issue_learning_theme :selected").val();
    var issue_content = $("#issue_content :selected").val();

    $.each(issuecontentData,function(i,val){
        if(issuecontentData[i].issue_name == issue_name && issuecontentData[i].issue_learning_theme == issue_theme && issuecontentData[i].issue_content == issue_content){
            var issue_sn = issuecontentData[i].issue_serial_number;

            var string = issue_name+"-"+issue_sn;
            addselectbodyDiv('issue_body',string,issue_content);
        }
    })
}

//學習重點以及議題融入新增出來的元件
function addselectbodyDiv(parentDiv,title,content){
    $("#"+parentDiv).append('<div class="card">'+
                                '<div class="card-body">'+
                                    '<b class="card-title">'+title+'</b>'+
                                    '<p class="card-text">'+content+'</p>'+
                                    '<input type="button" class="btn btn-danger float-right deleteItem" value="刪除" >'+
                                '</div>'+
                            '</div>');
    deleteItem();
}


/************************************************************************** */

//刪除內容
function deleteItem(){
    $(".deleteItem").click(function(){
        $(this).closest(".card").remove();
        isChange = true;
    })
}

function selectDefault(){
    $("#core_competency_dimesion_sel").append("<option disabled selected>請選擇總綱核心面向</option>");
    $("#core_competency_item_sel").append("<option disabled selected>請選擇總綱核心項目</option>");

    $("#performancefocus_item").append("<option disabled selected>請選擇項目</option>");
    $("#performancefocus_childitem").append("<option disabled selected>請選擇子項</option>");
    $("#performancefocus_content").append("<option disabled selected>請選擇內容</option>");

    $("#contentfocus_item").append("<option disabled selected>請選擇課題</option>");
    $("#contentfocus_childitem").append("<option disabled selected>請選擇子項</option>");
    $("#contentfocus_content").append("<option disabled selected>請選擇內容</option>");

    $("#issue_name").append("<option disabled selected>請選擇議題</option>");
    $("#issue_learning_theme").append("<option disabled selected>請選擇學習主題</option>");
    $("#issue_content").append("<option disabled selected>請選擇議題內容</option>");
}

function coreCardDiv(itemtext,dimesion_description,field_title,field_content){
    $("#core_competency_body").append('<div class="card">'+
                                            '<div class="card-header">'+
                                                '<b class="card-title itemtext">'+itemtext+'</b>'+
                                                '<p class="card-text dimesion_description">'+dimesion_description+'</p>'+                        
                                            '</div>'+
                                            '<div class="card-body">'+
                                                '<b class="card-title field_title">'+field_title+'</b>'+
                                                '<p class="card-text field_content">'+field_content+'</p>'+
                                                '<input type="button" class="btn btn-danger float-right deleteItem" value="刪除" >'+
                                            '</div>'+
                                        '</div>');
}


$(function(){
    ccdimesionData = JSON.parse($("#ccdimesionData").text());
    ccitemData = JSON.parse($("#ccitemData").text());
    ccfieldData = JSON.parse($("#ccfieldData").text());
    lfitemData = JSON.parse($("#lfitemData").text());
    lfchilditemData = JSON.parse($("#lfchilditemData").text());
    lfcontentData = JSON.parse($("#lfcontentData").text());
    issuenameData = JSON.parse($("#issuenameData").text()); 
    issuethemeData = JSON.parse($("#issuethemeData").text());
    issuecontentData = JSON.parse($("#issuecontentData").text());
    
    if(ccdimesionData !== ""){
        selectDefault();
        dimesion_field();
        dimesion_Map();
        learning_focus_item_Map();
        issuename_Map();
    }
})