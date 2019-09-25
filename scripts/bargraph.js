let pie = d3.pie().value(d=>d.value);
let arcGen = d3.arc().innerRadius(0).outerRadius(100);

function graficaBarras(data){
  /*data deberia ser una linea del csv*/
  let total = 1.0*(+data.Hombre)+(+data.Mujer)
    , graph = {'Hombre':data.Hombre,'Mujer':data.Mujer,};
  $('#bargraph-container').show();
  $('#bargraph-title').html(data.Subcategoria);
  $('#bargraph').html('');
  let canvas = d3.selectAll('#bargraph').attr('width',600).attr('height',200);
  //canvas.append('rect').attr('width','100%').attr('height','100%').attr('fill','rgb(206,206,206)');

  let datar = pie(d3.entries(graph));
  let piechart = canvas.append('g').attr('transform','translate(500,100)');
  piechart.selectAll('mySlices')
    .data(datar)
    .join('path')
      .attr('d',arcGen)
      .attr('fill',d=>d3.interpolateSpectral(d.value/total))
      .attr('stroke',d=>d3.interpolateViridis(d.value/total));
  piechart.selectAll('mySlices')
    .data(datar)
    .join('text')
      .attr('transform',d=>`translate(${arcGen.centroid(d)})`)
      .style('text-anchor','middle')
      .text(d=>d.data.key);

  let bargraph = canvas.append('g').attr('transform','translate(0,0)');
  bargraph.append('rect').attr('width',380).attr('height',200).attr('fill','red');
}
