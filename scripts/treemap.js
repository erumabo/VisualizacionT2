let root,selectedNode;
let width = 600, height=600;

function creaArbol(data){
    root = d3.stratify()
      .id(d=>d.Subcategoria)
      .parentId(d=>d.Categoria)
        (data);
    root.each(n=>n.value=+n.data.Valor);
    root.sort((a,b)=>b.value-a.value);
    d3.treemap()
      .size([width,height])
      .paddingInner(4)
      .paddingOuter(4)
      .round(true)
        (root);
    selectedNode=root;
    grafica();
}

function archivo(event){
  let reader = new FileReader();
  reader.onload = ()=>creaArbol(d3.csvParse(reader.result));
  reader.readAsText(event.target.files[0]);
}

function cambioSelected(nodo){
  root.each(n=>{
    if(n.id===nodo)
      if(n.height===0) console.log(n);
      else selectedNode=n;
  });
  grafica();
}

function grafica(){
  if(!selectedNode) selectedNode=root;
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
        .attr('title',d=>d.data.Subcategoria)
        .attr('onclick',(d,i)=>`cambioSelected("${d.id}")`);
  $('.node').tooltip({'container':'body'});
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
