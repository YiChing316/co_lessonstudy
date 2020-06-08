var community_id,member_id,nodeActionData,ideaScaffoldData,ideaIncreaseData;
var ideaActionMemberList = [];
var ideaScaffoldMemberList = [];
var viewCountList=[], addCountList=[], reviseCountList=[], buildOnCountList=[];
var viewSum = 0, addSum = 0, reviseSum = 0, buildOnSum = 0;
var pieArray = [];
var nodes = [],edges = [];
var $buildonTable,$revisedTable;
var kbScanffold = ["我想知道","我的想法","我的理論","新資訊或參考來源","另一個觀點是","我覺得更好的想法","有發展性的想法"];
$(function(){
    community_id = $("#community_id").text();
    member_id = $("#member_id").text();
    nodeActionData = JSON.parse($("#nodeActionData").text())
    ideaScaffoldData = JSON.parse($("#ideaScaffoldData").text())
    ideaIncreaseData = JSON.parse($("#ideaIncreaseData").text())
    socialmemberData = JSON.parse($("#socialmemberData").text())
    socialEdgeData = JSON.parse($("#socialEdgeData").text())

    $(".showSocialData").hide();

    var addNodeData = nodeActionData.addNodeData;
    var buildonNodeData = nodeActionData.buildonNodeData;
    var reviseNodeData = nodeActionData.reviseNodeData;
    var viewNodeData = nodeActionData.viewNodeData;
    setideaActionMemberList(addNodeData)
    setideaActionCountList(viewNodeData,viewCountList,viewSum)
    setideaActionCountList(addNodeData,addCountList,addSum)
    setideaActionCountList(reviseNodeData,reviseCountList,reviseSum)
    setideaActionCountList(buildonNodeData,buildOnCountList,buildOnSum)
    
    showIdeaAction();
    showIdeaPie();
    showScanffold();
    showideaScaffoldTable();
    showIncreaseGraph();
    setNodeandEgdeData();
    showSocialTable();
    showSocialNetwork();    
})

//整理組內成員名單
function setideaActionMemberList(addNodeData){
    addNodeData.map(function(val,index){
        if(val.member_id == member_id){
            ideaActionMemberList.push(val.member_name)
        }
        //非此人的名字以字母顯示
        else{
            ideaActionMemberList.push(String.fromCharCode(65+index))
        }
    })
}

//處理每個node動作的list
function setideaActionCountList(actionData,actionCountList,actionSum){
    actionData.forEach(function(val){
        var count = val.count;
        if(count.length == 0){
            actionCountList.push(0)
        }
        else{
            count.filter(function(item){
                return item.node_type == 'idea' || item.node_type == 'rise_above' || item.node_type == undefined;
            }).map(function(item){
                actionSum += item.number;
                actionCountList.push(item.number)
            })
        }
    })
    //節點所占比例使用資料
    pieArray.push(actionSum)
}

//呈現個人想法貢獻圖表
function showIdeaAction(){
    var nodeActionCtx = document.getElementById('nodeActionCanvas').getContext('2d');
    var chart = new Chart(nodeActionCtx, {
        type: 'horizontalBar',
        data: {
            labels: ideaActionMemberList,
            datasets: [
                {
                    label: '檢視',
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    data: viewCountList
                },
                {
                    label: '新增',
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    data: addCountList
                },
                {
                    label: '修改',
                    backgroundColor: 'rgba(255, 206, 86, 0.6)',
                    borderColor: 'rgba(255, 206, 86, 1)',
                    data: reviseCountList
                },
                {
                    label: '回覆',
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    data: buildOnCountList
                }
            ]
        },
        options: {
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero: true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: '次數' 
                    }
                }]
            }
        }
    });
}

//呈現社群內節點所占比例
function showIdeaPie(){
    var nodePieCtx = document.getElementById('nodePieCanvas').getContext('2d');
    var pie = new Chart(nodePieCtx, {
        type: 'pie',
        data: {
            labels: ['檢視', '新增', '修改', '回覆'],
            datasets: [{
                data: pieArray,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)'
                ]
            }]
        }
    })
}

//呈現想法鷹架使用
function showScanffold(){
    var  ideaScaffoldCTX=document.getElementById('ideaScaffoldCanvas').getContext('2d');
    var  ideaScaffoldChart= new Chart(ideaScaffoldCTX, {
        type: 'radar',
        data: {
            labels: kbScanffold,
            datasets: []
        },
        options: {
            scale: {
                ticks:{
                    beginAtZero: true,
                    stepSize: 1
                }
            }
        }
    });

    ideaScaffoldData.forEach(function(value,index){
        var scaffoldCountList = [0,0,0,0,0,0,0];
        ideaScaffoldMemberList.push(value.member_name);
        var ideaScaffold = JSON.parse(value.count);
        kbScanffold.forEach(function(value, index){
            if(ideaScaffold[value]){
                scaffoldCountList[index]+=ideaScaffold[value];
            }
        });
        var randomColor = randomRgba(0.7);
        ideaScaffoldChart.data.datasets.push({
            label: value.member_id == member_id?value.member_name:String.fromCharCode(65+index),
            data:scaffoldCountList,
            backgroundColor: randomColor[1],
            borderColor: randomColor[0],
            borderWidth: 1
        })
        ideaScaffoldChart.update();
    })
}

//呈現想法鷹架table
var $ideaScaffoldTable;
function showideaScaffoldTable(){
    $ideaScaffoldTable = $("#ideaScaffoldTable");
    $ideaScaffoldTable.bootstrapTable({
        columns:[
            {title:"id",field:"member_id",visible:false},
            {title:"名字",field:"member_name",align:"center"},
            {title:"我想知道",field:"我想知道",align:"center"},
            {title:"我的想法",field:"我的想法",align:"center"},
            {title:"我的理論",field:"我的理論",align:"center"},
            {title:"新資訊或參考來源",field:"新資訊或參考來源",align:"center"},
            {title:"另一個觀點是",field:"另一個觀點是",align:"center"},
            {title:"我覺得更好的想法",field:"我覺得更好的想法",align:"center"},
            {title:"有發展性的想法",field:"有發展性的想法",align:"center"},
        ],
        theadClasses:'thead-light',
        classes:'table table-bordered'
    })

    var tableArray = [];
    ideaScaffoldData.forEach(function(value,index){
        var member_name;
        if(value.member_id == member_id){
            member_name = value.member_name
        }
        else{
            member_name = String.fromCharCode(65+index)
        }
        var scaffoldCountList = {
            member_id:value.member_id,
            member_name:member_name,
            "我想知道":0,
            "我的想法":0,
            "我的理論":0,
            "新資訊或參考來源":0,
            "另一個觀點是":0,
            "我覺得更好的想法":0,
            "有發展性的想法":0
        };
        ideaScaffoldMemberList.push(value.member_name);
        var ideaScaffold = JSON.parse(value.count);
        kbScanffold.forEach(function(value, index){
            if(ideaScaffold[value]){
                scaffoldCountList[value] = ideaScaffold[value];
            }
        });
        tableArray.push(scaffoldCountList)
    })
    $ideaScaffoldTable.bootstrapTable('load',tableArray)
}

//呈現節點數量變化
function showIncreaseGraph(){
    var container = document.getElementById("ideaIncreaseGraph");
    var names = {};
    var groups = new vis.DataSet();
    ideaScaffoldData.forEach(function(value,index){
        var dataId;
        if(value.member_id == member_id){
            dataId = value.member_name
        }
        else{
            dataId = String.fromCharCode(65+index)
        }
        names[value.member_id] = dataId;
        groups.add({
            id:dataId,
            content: dataId,
            options:{
                drawPoints: {
                    style: "square", // square, circle
                },
                shaded: {
                    orientation: "bottom", // top, bottom
                },
            }
        })
    })
    var items = [];
    var sum = {};
    ideaIncreaseData.forEach(function(value,index){
        var dataId = names[value.member_id];
        if(sum.hasOwnProperty(value.member_id)){
            sum[value.member_id]+= value.node_count;
        }else{
            sum[value.member_id]= value.node_count;
        }        
        items.push({ 
            x: value.day,
            y: sum[value.member_id], 
            group: dataId, 
            label: {
                content: sum[value.member_id],
                xyOffset: 5
            }});
    })
    var  startDate= getOldestDate(ideaIncreaseData).day;
    // console.log(startDate);
    var  endtDate= getLatestDate(ideaIncreaseData).day;
    // console.log(endtDate);
    var dataset = new vis.DataSet(items);
    var options = {
        defaultGroup: "ungrouped",
        legend: true,
        start: startDate,
        end: endtDate,
        timeAxis: {
            scale: 'day'
        }
    };
    var graph2d = new vis.Graph2d(container, dataset, groups, options);
}

//處理社群網路node以及egde資料
function setNodeandEgdeData(){
    if(socialmemberData.length !== 0){
        socialmemberData.forEach(function(value,index){
            var member_name;
            if(value.member_id_member == member_id){
                member_name =value.member_name
            }
            //非此人的名字以字母顯示
            else{
                member_name = String.fromCharCode(65+index);
            }
            nodes.push({id:value.member_id_member,label:member_name,group:index,value:value.nodecount})
        })
    }
    
    if(socialEdgeData.length !== 0){
        socialEdgeData.forEach(function(value){
            edges.push({from:value.from_member_id,to:value.to_member_id,value:value.nodecount})
        })
    }
}

//呈現社群網路圖表格
function showSocialTable(){
    //回覆別人，自己為to,顯示from
    $buildonTable = $("#buildonTable");
    $buildonTable.bootstrapTable({
        columns:[
            {title:"來源",field:"from",align:"center"},
            {title:"數量",field:"num",align:"center"},
        ],
        theadClasses:'thead-light',
        classes:'table table-bordered table-sm'
    })

    //別人回覆自己，自己為from，顯示to
    $revisedTable = $("#revisedTable");
    $revisedTable.bootstrapTable({
        columns:[
            {title:"來源",field:"to",align:"center"},
            {title:"數量",field:"num",align:"center"},
        ],
        theadClasses:'thead-light',
        classes:'table table-bordered table-sm'
    })
}

//呈現社群網路圖
function showSocialNetwork(){
    var container = document.getElementById("socialnetwork");
    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = {
        nodes: {
          shape: "dot",
          font: {
            size: 32,
            color: "#555"
          },
          borderWidth: 2
        },
        edges: {
          width: 2,
          arrows: "to",
          color: {
            color: "#aaa",
            highlight: "#888"
          }
        },
        physics:{
          enabled: true,
          barnesHut: {
            theta: 0.5,
            gravitationalConstant: -10000,
            centralGravity: 0.98,
            springLength: 95,
            springConstant: 0.04,
            damping: 0.09,
            avoidOverlap: 0
          }    
        }
      };
    network = new vis.Network(container, data, options);

    network.on("click", function(params) {
        params.event = "[click]";
        var clickid = params.nodes[0];
        var fromArray = [],toArray = [];
        var fromSum = 0,toSum = 0;

        if(clickid !== undefined){
            nodes.forEach(function(val,index){
                if(clickid == val.id){
                    $(".showSocialData").show();
                    $("#social_name").text(val.label)
                    $("#social_sum").text(val.value)
                }
            })
    
            edges.forEach(function(val){
                //自己為to，算from
                if(clickid == val.to){
                    fromSum += val.value;
                    nodes.forEach(function(value){
                        var id = value.id;
                        var label = value.label;
                        if(val.from == id){
                            fromArray.push({from:label,num:val.value})
                        }
                    })
                }
    
                //自己為from，算to
                if(clickid == val.from){
                    toSum += val.value;
                    nodes.forEach(function(value){
                        var id = value.id;
                        var label = value.label;
                        if(val.to == id){
                            toArray.push({to:label,num:val.value})
                        }
                    })
                }
            })
            
            $("#social_buildonsum").text(fromSum)
            $("#social_revisedsum").text(toSum)
            $buildonTable.bootstrapTable('load',fromArray)
            $revisedTable.bootstrapTable('load',toArray)
        }
        else{
            $(".showSocialData").hide();
        }
        
    })
}

//隨機顏色
function randomRgba(transparency) {
    let o = Math.round, r = Math.random, s = 255;
    let color_r=o(r()*s), color_g=o(r()*s), color_b=o(r()*s);
    return ['rgb('+color_r+','+color_g+','+color_b+')', 'rgba('+color_r+','+color_g+','+color_b+','+transparency+')'];
}

//最晚時間
function getOldestDate(data){
    return data.reduce(function(prev, curr){
        return (prev.day< curr.day)?prev:curr;
    });
}

//最新時間
function getLatestDate(data){
    return data.reduce(function(prev, curr){
        return (prev.day> curr.day)?prev:curr;
    });
}