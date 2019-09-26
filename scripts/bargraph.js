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
  //Un gráfico de Pie
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

  //Un gráfico de barras.
  let bargraph = canvas.append('g').attr('transform','translate(0,0)');

  //Un escalador para colocar el mayor como punto máximo, y dejar al menor más abajo.
  let yScale = d3.scaleLinear()
    .domain([0, Math.max(data.Hombre, data.Mujer)])
    .range([200, 0]);

  //Tengo que agregar dos barras.
  bargraph.append('rect').attr('width',180).attr('height',200-yScale(data.Hombre)).attr('fill','red')
    .attr('transform', 'translate(0, ' + yScale(data.Hombre) + ')');

  bargraph.append('rect').attr('width',180).attr('height',200-yScale(data.Mujer)).attr('fill','green')
    .attr('transform', 'translate(200, ' + yScale(data.Mujer) + ')');
}
