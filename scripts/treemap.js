let forest,tree,selectedNode
let width = 800, height=600;
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
    forest.value = 1.0;
    forest.sort((a,b)=>a.height-b.height);
    $('#menu-filtro').html();
    forest.children.forEach((chl,i)=>{
      $("#menu-filtro").append(`<a class="dropdown-item" onclick="cambioArbol(${i})">${chl.data.Subcategoria}</a>`)
    });
    cambioArbol(0);
}

function archivo(event){
  let reader = new FileReader();
  reader.onload = ()=>creaArbol(d3.csvParse(reader.result));
  reader.readAsText(event.target.files[0]);
}

function clamp(x,y,z){
  if(x<y)x=y;return x;
}
function cambioArbol(index){
    tree = forest.children[index].copy();
    if(!tree.value){
      /*esto ajusta los nodos hoja tal que ninguno de ellos mide menos del 10%
       *del tamaño total de la visualizacios
       */
      let s=0;
      tree.sum(n=>0.0);
      tree.leaves().forEach(n=>s+=(+n.data.Valor));
      let d = s/10.0;
      s=0;
      tree.leaves().forEach(n=>s+=(n.value=(+n.data.Valor)>d?+n.data.Valor:d));
      tree.leaves().forEach(n=>n.value/=s);
      tree.eachAfter(n=>{
        if(n.children)
          n.children.forEach(d=>n.value+=d.value);
      });
    }
    treemap(tree);
    selectedNode = tree;
    grafica();
}

function cambioSelected(nodo){
  tree.each(n=>{
    if(n.data.Subcategoria===nodo)
      if(n.height===0){ let data = n.data; data['value']=n.value; graficaBarras(data);}
      else selectedNode=n;
  });
  grafica();
}

function wrap(text) {
  /*Mike Bostock, November 18, 2018, from https://bl.ocks.org/mbostock/7555321, retrieved September 23, 2019, modified by Mabo*/
  text.each(function() {
    var text = d3.select(this), words = text.text().split(/\s+/).reverse(), word,
      line = [], lineNumber = 0, lineHeight = 1.1 /*ems*/,
      y = text.attr("y"),x = text.attr('x'), dy = parseFloat(text.attr('dy')),
      width = text.attr('data-width'),
      tspan = text.text(null).append("tspan").attr('x',x).attr('y',y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr('x',x).attr('y',y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
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
  canvas.selectAll('.node').data([]).exit().remove();
  let nodos = canvas.selectAll('.node')
    .data(lista)
      .join('g')
        .classed('node',true)
        .classed('pointer',true)
        .attr('transform',d=>`translate(${d.x0},${d.y0})`);
  nodos.append('rect')
    .classed('pointer',true)
    .attr('width',d=>d.x1-d.x0)
    .attr('height',d=>d.y1-d.y0)
    .attr('rx',14)
    .attr('ry',14)
    .attr('fill',d=>d3.interpolateCool((d.height*1.)/tree.height))
    .attr('onclick',d=>`cambioSelected("${d.data.Subcategoria}")`)
  nodos.append('text')
    .classed('title',true)
    .attr('x',5)
    .attr('y',18)
    .attr('dy',0)
    .attr('fill','#fff')
    .attr('data-width',d=>d.x1-d.x0)
    .attr('onclick',d=>`cambioSelected("${d.data.Subcategoria}")`)
    .text(d=>d.data.Subcategoria);
  canvas.selectAll('.title').call(wrap);
}

$(document).ready(()=>{
  d3.select('#treemap')
      .attr('width',width+'px')
      .attr('height',height+'px')
      .attr('viewbox','0 0 '+width+' '+height)
  
  d3.csv("https://raw.githubusercontent.com/erumabo/VisualizacionT2/master/data.csv").then(creaArbol); 
  console.log('ready');
});
