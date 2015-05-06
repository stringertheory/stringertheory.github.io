$(document).ready(function() {
  console.log("ready!");

  var colors = [
    '#F3ED00',
    '#00CC66',
    '#FF15AB',
    '#008EF5'
  ];

  var stroke_width = 5;
  var height = 80;
  var n_steps = 20;
  var width = 620;
  var step_width = width / (n_steps - 1);
  var radius = 200;
  for (var j=0; j < 800; j++) {
    var shape = new Shape.Circle(new Point(j * 3 - radius, radius), radius);
    shape.strokeColor = colors[j % colors.length];
    shape.opacity = 0.75;
  }

  // uncomment to animate
  // view.onFrame = function(event) {
  // }  
});
