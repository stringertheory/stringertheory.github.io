$(document).ready(function() {

  // create svg drawing
  var filename = $('#drawing').attr('src');
  var draw = SVG('drawing').size(600, 400);

  // create image
  var image = draw.image(filename);
  image.size(600, 400).y(-50);

  // create text
  var text = draw.text('coffee').move(300, 0)
  text.font({
    family: 'Tiempos Headline',
    weight: 900,
    size: 200,
    anchor: 'middle',
    leading: 1
  })

  // clip image with text
  image.clipWith(text)

  /* create text */
  var text = draw.text(function(add) {
    add.tspan('Brown ').fill('#62361b')
    add.tspan('line')
  })
  text.font({
    size: 30,
    family: 'Helvetica',
    weight: 900
  })

  /* add path to text */
  text.path('M 20 400 C 200 300 300 200 600 300')

  /* visualise track */
  draw.use(text.track).attr({
    fill: 'none',
    'stroke-width': 1,
    stroke: '#000'
  });

  /* move text to the end of the path */
  function up() {
    text.textPath.animate(1000).attr('startOffset', '0%').after(down)
  }

  /* move text to the beginning of the path */
  function down() {
    text.textPath.animate(2000).attr('startOffset', '72%').after(up)  
  }

  /* start animation */
  up()

});
