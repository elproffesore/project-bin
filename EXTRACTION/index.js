let blocked = false;
document.addEventListener('mouseup', event => {
    if(window.getSelection().toString().length != 0 && !blocked){
        let ele = document.getElementById('node')
        ele.innerText = window.getSelection().toString()
    }
})
document.addEventListener('keydown',event => {
    if(event.key == "Enter" && !blocked){
        getInformationFromGPT(document.getElementById('node').innerText)
    }
})
function lowerize(obj){
    Object.keys(obj).reduce((acc, k) => {
      acc[k.toLowerCase()] = obj[k];
      return acc;
    }, {});
  }
function getInformationFromGPT(input){
    blocked = true;
    fetch('https://api.openai.com/v1/chat/completions',{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer" //here i need an API KEY
        },
        body: JSON.stringify({
            "model": "gpt-4-1106-preview",
            "response_format": { "type": "json_object" },
            "messages": [
                {
                  "role": "system",
                  "content": "You are a helpful assistant designed to output JSON. Each JSON key is in lowercase. The structure is the following {'keywords':[keywords]}"
                },
                {
                  "role": "user",
                  "content": "Give me keywords connected to the following input: "+ input
                }
              ]
        })
    })
    .then(response => response.json())
    .then(json => {
        let data = JSON.parse(json.choices[0].message.content)
        lowerize(data)
        drawInformation(data,input)
        blocked = false;
    })
}

function drawInformation(data,input){
    console.log(data)
    data = {
        nodes: [{"id":0, "name":input},...data.keywords.map((keyword,i) => {return {"id": i+1, "name":keyword}})],
        links: [...data.keywords.map((keyword,i) => {return {"source": i+1, "target":0}})]
    }
    console.log(data)
// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 40},
  width = 800 - margin.left - margin.right,
  height = 800 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#node")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

  // Initialize the links
  var link = svg
    .selectAll("line")
    .data(data.links)
    .enter()
    .append("line")
      .style("stroke", "#aaa")

  // Initialize the nodes
  var node = svg
    .selectAll("circle")
    .data(data.nodes)
    .enter()
    .append("circle")
      .attr("r", 20)
      .style("fill", "#69b3a2")
var text = svg.selectAll("text")
    .data(data.nodes)
    .enter()
    .append('text')
    .text( d => d.name)

  // Let's list the force we wanna apply on the network
  var simulation = d3.forceSimulation(data.nodes)                 // Force algorithm is applied to data.nodes
      .force("link", d3.forceLink()                               // This force provides links between nodes
            .id(function(d) { return d.id; })                     // This provide  the id of a node
            .links(data.links)                                    // and this the list of links
      )
      .force("charge", d3.forceManyBody().strength(-800))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
      .force("center", d3.forceCenter(width / 2, height / 2))     // This force attracts nodes to the center of the svg area
      .on("end", ticked);

  // This function is run at each iteration of the force algorithm, updating the nodes position.
  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
         .attr("cx", function (d) { return d.x+6; })
         .attr("cy", function(d) { return d.y-6; });

    text
         .attr("dx", function (d) { return d.x+6; })
         .attr("dy", function(d) { return d.y-6; });
  }
}