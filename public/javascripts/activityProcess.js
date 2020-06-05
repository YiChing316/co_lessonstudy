var community_id,member_id,nodeActionData,ideaScaffoldData,ideaIncreaseData;
var ideaActionMemberList = [];
var ideaScaffoldMemberList = [];
var viewCountList=[], addCountList=[], reviseCountList=[], buildOnCountList=[];
var kbScanffold = ["我想知道","我的想法","我的理論","新資訊或參考來源","另一個觀點是","我覺得更好的想法","有發展性的想法"];
$(function(){
    community_id = $("#community_id").text();
    member_id = $("#member_id").text();
    nodeActionData = JSON.parse($("#nodeActionData").text())
    ideaScaffoldData = JSON.parse($("#ideaScaffoldData").text())
    ideaIncreaseData = JSON.parse($("#ideaIncreaseData").text())
    console.log(nodeActionData)
    console.log(ideaScaffoldData)
    console.log(ideaIncreaseData)

    var addNodeData = nodeActionData.addNodeData;
    var buildonNodeData = nodeActionData.buildonNodeData;
    var reviseNodeData = nodeActionData.reviseNodeData;
    var viewNodeData = nodeActionData.viewNodeData;
    setideaActionMemberList(addNodeData)
    setideaActionCountList(addNodeData,addCountList)
    setideaActionCountList(buildonNodeData,buildOnCountList)
    setideaActionCountList(reviseNodeData,reviseCountList)
    setideaActionCountList(viewNodeData,viewCountList)
    showIdeaAction();
    showScanffold();
    showIncreaseGraph();
    
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
function setideaActionCountList(actionData,actionCountList){
    actionData.forEach(function(val){
        var count = val.count;
        if(count.length == 0){
            actionCountList.push(0)
        }
        else{
            count.filter(function(item){
                return item.node_type == 'idea' || item.node_type == 'rise_above' || item.node_type == undefined;
            }).map(function(item){
                actionCountList.push(item.number)
            })
        }
    })
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