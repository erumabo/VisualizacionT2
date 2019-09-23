let forest,tree,selectedNode
let width = 600, height=600;
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
    forest.sort((a,b)=>b.value-a.value);
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
      if(n.height===0) console.log(n);
      else selectedNode=n;
  });
  grafica();
}

function textMeasure(text){
  let ctx = document.getElementById("textMeasure").getContext("2d");
  ctx.font = "0.6rem Helvetica"
  return ctx.measureText(text).width;
}

function grafica(){
  if(!selectedNode) selectedNode=tree;
  /**estas lineas**/
  let lista = new Set(selectedNode.ancestors());
  selectedNode.ancestors().forEach(n=>{
    if(n.children) n.children.forEach(p=>lista.add(p));
  });
  lista = Array.from(lista).sort((a,b)=>b.height-a.height);
  /**No me gustan ni un pelo**/
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
        .attr('fill',d=>`rgb(${(255/3)*d.depth},0,0)`) //cambiar la escala de colores
        .attr('onclick',(d,i)=>`cambioSelected("${d.data.Subcategoria}")`);
  canvas.selectAll('.titleBack')
    .data(lista)
      .join('rect')
        .classed('titleBack',true)
        .style('cursor','pointer')
        .attr('x',d=>d.x0)
        .attr('y',d=>d.y0)
        .attr('width',d=>(d.x1-d.x0))
        .attr('height',d=>20)
        .attr('fill',d=>`#206`) //cambiar la escala de colores
        .attr('onclick',(d,i)=>`cambioSelected("${d.data.Subcategoria}")`);
  canvas.selectAll('.title')
    .data(lista)
      .join('text')
        .classed('title',true)
        .style('cursor','pointer')
        .attr('x',d=>d.x0+5)
        .attr('y',d=>d.y0+16)
        .attr('textLength',d=>(d.x1-d.x0))
        .attr('fill',d=>`#f0f`) //cambiar la escala de colores
        .text(d=>d.data.Subcategoria)
        .attr('onclick',(d,i)=>`cambioSelected("${d.data.Subcategoria}")`);
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
