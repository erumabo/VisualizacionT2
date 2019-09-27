let pie = d3.pie().value(d=>d.value);
let arcGen = d3.arc().innerRadius(0).outerRadius(100);

function graficaBarras(data){
  /*data deberia ser una linea del csv*/
  let total = 1.0*(+data.Hombre)+(+data.Mujer)
    , graph = {'Hombre':data.Hombre,'Mujer':data.Mujer,};
  $('#bargraph-container').show();
  $('#bargraph-title').html(data.Subcategoria);
  $('#bargraph').html('');
  let canvas = d3.selectAll('#bargraph').attr('width',500).attr('height',300);
  //canvas.append('rect').attr('width','100%').attr('height','100%').attr('fill','rgb(206,206,206)');

  let datar = pie(d3.entries(graph));
  //Un gráfico de Pie
  let piechart = canvas.append('g').attr('transform','translate(400,150)');
  piechart.selectAll('mySlices')
    .data(datar)
    .join('path')
      .attr('d',arcGen)
      .attr('fill',d=>{if(d.data.key=="Hombre")return'maroon';else return'mediumspringgreen';});
  piechart.selectAll('mySlices')
    .data(datar)
    .join('text')
      .attr('transform',d=>`translate(${arcGen.centroid(d)})`)
      .style('text-anchor','middle')
      .attr('fill',d=>{if(d.data.key=="Hombre")return'white';else return'black'})
      .attr('font-weight','bold')
      .text(d=>d.data.key);

  //Un gráfico de barras.
  let bargraph = canvas.append('g').attr('transform','translate(0,0)');

  //Valores para las barras
  let barWidth = 100;
  let barMaxHeight = 260;

  //Un escalador para colocar el mayor como punto máximo, y dejar al menor más abajo.
  let yScale = d3.scaleLinear()
    .domain([0, Math.max(data.Hombre, data.Mujer)])
    .range([barMaxHeight, 0]);

  //Tengo que agregar dos barras.
  bargraph.append('rect').attr('width',barWidth).attr('height',barMaxHeight-yScale(data.Hombre)).attr('fill','maroon')
    .attr('transform', 'translate(0, ' + yScale(data.Hombre) + ')');

  bargraph.append('rect').attr('width',barWidth).attr('height',barMaxHeight-yScale(data.Mujer)).attr('fill','mediumspringgreen')
    .attr('transform', 'translate(' + (barWidth + 20) + ',' + yScale(data.Mujer) + ')');

  bargraph.append('text').attr('x', barWidth/4).attr('y', barMaxHeight).attr('dy','.15em').text('Hombre: '+ data.Hombre).call(wrap);
  bargraph.append('text').attr('x', barWidth/4 + barWidth + 20).attr('y', barMaxHeight).attr('dy','.15em').text('Mujer: '+ data.Mujer).call(wrap);
}
