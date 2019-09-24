let forest,tree,selectedNode
let width = 1000, height=700;
const treemap = data=>
  d3.treemap()
    .size([width,height])
    .paddingInner(4)
    .paddingOuter(4)
    .paddingTop(20)
    .round(true)(data)

function creaArbol(data){
    /*Crea un arbol con toda la información de cvs*/
    forest = d3.stratify()
      .id(d=>d.Subcategoria)
      .parentId(d=>d.Categoria)
        (data);
    forest.each(n=>n.value=+n.data.Valor);
    forest.sort((a,b)=>a.height-b.height);
    tree = forest.children[0].copy();
    selectedNode = tree;
    treemap(tree);
    selectedNode = tree;
    grafica();
}

function archivo(event){
  let reader = new FileReader();
  reader.onload = ()=>creaArbol(d3.csvParse(reader.result));
  reader.readAsText(event.target.files[0]);
}

function cambioSelected(nodo){
  tree.each(n=>{
    if(n.data.Subcategoria===nodo)
      if(n.height===0) graficaBarras(n.data);
      else selectedNode=n;
  });
  grafica();
}

function wrap(text) {
  /*cc Mike Bostock, November 18, 2018, from https://bl.ocks.org/mbostock/7555321, retrieved September 23, 2019, modified by Mabo*/
  text.each(function() {
    var text = d3.select(this), words = text.text().split(/\s+/).reverse(), word,
      line = [], lineNumber = 0, lineHeight = 1.1 /*ems*/,
      y = text.attr("y"), x = text.attr("x"), dy = 0, width = text.attr('data-width'),
      tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

function grafica(){
  if(!selectedNode) selectedNode=tree;
  /** vv estas lineas vv **/
  let lista = new Set(selectedNode.ancestors());
  selectedNode.ancestors().forEach(n=>{
    if(n.children)
      n.children.forEach(p=>lista.add(p));
  });
  lista = Array.from(lista).sort((a,b)=>b.height-a.height);
  /** ^^ No me gustan ni un pelo ^^ **/
  let canvas = d3.select('#treemap');
  canvas.selectAll('.node')
    .data(lista)
      .join('rect')
        .classed('node',true)
        .style('cursor','pointer')
        .attr('x',d=>d.x0)
        .attr('y',d=>d.y0)
        .attr('width',d=>(d.x1-d.x0))
        .attr('height',d=>(d.y1-d.y0))
        .attr('fill',d=>d3.interpolateCool((d.height*1.)/tree.height))
        .attr('onclick',(d,i)=>`cambioSelected("${d.data.Subcategoria}")`)
  canvas.selectAll('.title')
    .data(lista)
      .join('text')
        .classed('title',true)
        .style('cursor','pointer')
        .attr('x',d=>d.x0+3)
        .attr('y',d=>d.y0+16)
        .attr('fill',d=>`#fff`)
        .attr('data-width',d=>d.x1-d.x0)
        .attr('onclick',(d,i)=>`cambioSelected("${d.data.Subcategoria}")`)
        .text(d=>d.data.Subcategoria);
  canvas.selectAll('.title').call(wrap);
}

$(document).ready(()=>{
  d3.select('#treemap')
      .attr('width',width+'px')
      .attr('height',height+'px')
      .attr('viewbox','0 0 '+width+' '+height)
      .append('rect')
        .classed('back',true)
        .attr('width','100%')
        .attr('height','100%')
        .attr('fill','rgb(206,206,206)'); //rect para ref visual del fondo
  
  d3.csv("https://raw.githubusercontent.com/erumabo/VisualizacionT2/master/data.csv").then(creaArbol); 
  console.log('ready');
});
