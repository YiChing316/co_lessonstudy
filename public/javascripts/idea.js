var nodes = new vis.DataSet();
var edges = new vis.DataSet();

var node = [
    {id: 1, group:'idea', node_content: "Node 1", node_text: '111'},
    {id: 2, group:'idea', node_content: "Node 2", node_text: '111'},
    {id: 3, group:'vote', node_content: "Node 3", node_text: '111'},
    {id: 4, group:'idea', node_content: "Node 4", node_text: '111'},
    {id: 5, group:'vote', node_content: "Node 5", node_text: '111'}
];

var edge = [
    {from: 1, to: 3},
    {from: 1, to: 2},
    {from: 2, to: 4},
    {from: 2, to: 5}
]

// create a network
var container = document.getElementById('ideanetwork');

// provide the data in the vis format
var nodeData = {
    nodes: nodes,
    edges: edges
};

var nodeOptions = {
    nodes:{
        size:16
    },
    groups:{
        idea:{
            shape: 'image',
            image: '/images/discussion.svg'
        },
        rise_above:{

        },
        vote:{
            shape: 'image',
            image: '/images/vote.svg'
        }
    },
    edges:{
        color:{
            color: "rgba(0,0,0,0.2)",
            highlight: "rgba(0,0,0,0.4)"
        },
        arrows:{
            to:{
                enabled: true
            }
        },
        //線的型態，直線或曲線
        smooth:{
            enabled: false
        }
    },
    interaction:{
        //多選
        multiselect: true
    },
    physics:{
        enabled: false
    }
};

var network = new vis.Network(container, nodeData, nodeOptions);

//畫上Node標題跟創建人姓名
function addNodeContent(){
    network.on("beforeDrawing", function (ctx) {
        for(i=0;i<node.length;i++){
            var nodeid = node[i].id;
            var content = node[i].node_content;
            var text = node[i].node_text;
            var nodePosition = network.getPositions([nodeid]);
            //將文字寫入對應的node節點
            ctx.font = "16px Arial";
            ctx.fillText(content, nodePosition[nodeid].x+20, nodePosition[nodeid].y);
            ctx.font = "14px Arial";
            ctx.fillText(text, nodePosition[nodeid].x+20, nodePosition[nodeid].y+20);
        }
    })
}

//畫node被點擊時的背景
function drawClickBackground(nodeId){
    network.on("beforeDrawing", function(ctx) {
  
        var nodePosition = network.getPositions([nodeId]);
        ctx.strokeStyle = "#DCD9CC";
        ctx.fillStyle = "#DCD9CC";

        ctx.beginPath();
        //context.arc(x,y,r(半徑),sAngle(起始角),eAngle(結束角),counterclockwise);
        ctx.arc(nodePosition[nodeId].x,nodePosition[nodeId].y,30,0,2 * Math.PI,false);
        ctx.closePath();

        ctx.fill();
        ctx.stroke();
    });
}

function drawNetwork() {
    // create an array with nodes
    nodes.update(node);
    // create an array with edges
    edges.update(edge);
    addNodeContent();
}

function clickevent(){
    network.on("click", function(params) {
        //nodeid
        var clickid = params.nodes[0];
        network.off("beforeDrawing");
        addNodeContent();
        if(clickid !== undefined){
            drawClickBackground(clickid);
        }
    });
}

$(function(){
    drawNetwork();
    clickevent();
})