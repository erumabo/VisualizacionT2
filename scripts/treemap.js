let root;
let width = 600, height=600;

function archivo(event){
  /* Todo inicia aqui, cuando se carga un archivo 
   *
   *
   */
  let reader = new FileReader();
  reader.onload = ()=>{
    let text = reader.result;
    root = d3.stratify()
            .id(d=>d.Subcategoria)
            .parentId(d=>d.Categoria)
      (d3.csvParse(text));
    root
      .sum(d=>d.Valor);
    d3.treemap()
        .size([width,height])
        .padding(2)
        .round(true)
      (root);
    setTimeout(grafica,100); /*Makes function call async*/
  };
  reader.readAsText(event.target.files[0]);
}

let level = 0;
function grafica(){
  let canvas = d3.select('#treemap');
  canvas.selectAll('.node')
    .data(root.descendants())
      .join('rect')
        .classed('node',true)
        .style('cursor','pointer')
        .attr('x',d=>d.x0)
        .attr('y',d=>d.y0)
        .attr('width',d=>(d.x1-d.x0))
        .attr('height',d=>(d.y1-d.y0))
        .attr('fill',d=>`rgb(${(255/3)*d.depth},0,0)`)
        .attr('onclick',(d,i)=>`console.log(${d.x0},${d.y0})`);
}

$(document).ready(()=>{
  root = d3.stratify()
    .id(d=>d.Subcategoria)
    .parentId(d=>d.Categoria)
    (d3.cvs())
  d3.select('#treemap')
      .attr('width',width+'px')
      .attr('height',height+'px')
      .attr('viewbox','0 0 '+width+' '+height)
      .append('rect')
        .classed('back',true)
        .attr('width','100%')
        .attr('height','100%')
        .attr('fill','rgb(206,206,206)'); //rect para ref visual del fondo
  console.log('ready');
});
