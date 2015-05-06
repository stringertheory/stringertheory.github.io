$(document).ready(function() {
  console.log("ready!");

  var canvas = document.getElementById('canvas');

  // Create an empty project and a view for the canvas:
  paper.setup(canvas);

  var colors = [
    '#F3ED00',
    '#00CC66',
    '#FF15AB',
    '#008EF5'
  ];
  var stroke_width = 5;
  var height = 80;
  var n_steps = 20;

  var width = $(canvas).width() * (paper.view.resolution / 72)
  var step_width = width / (n_steps - 1);

  // var radius = 100;
  // for (var i=0; i < colors.length; i++) {
  //   for (var j=0; j < 200; j++) {
  //     var shape = new paper.Shape.Circle(new paper.Point(j * 10, radius + i * 2 * radius), radius);
  //     shape.strokeColor = colors[i];
  //     shape.opacity = 0.05;
  //   }
  // }
  // var radius = 200;
  // for (var j=0; j < 800; j++) {
  //   var shape = new paper.Shape.Circle(new paper.Point(j * 3 - radius, radius), radius);
  //   shape.strokeColor = colors[j % colors.length];
  //   shape.opacity = 0.05;
  // }

  // Create a Paper.js Path to draw a line into it:
  // var paths = [];
  // for (var i=0; i < colors.length; i++) {
  //   var path = new paper.Path();
  //   path.strokeColor = colors[i];
  //   path.strokeWidth = stroke_width;
  //   path.opacity = 0.25;
  //   // start off the page
  //   var start = new paper.Point(-200, 0);
  //   path.moveTo(start);
    
  //   for (var j=0; j < n_steps; j++) {
  //     var x = j * step_width - Math.random() * step_width / 2;
  //     var y = stroke_width + Math.random() * (height - 2 * stroke_width);
  //     var point = start.add([x, y]);
  //     path.lineTo(point);
  //   };
  //   paths.push(path);
  // };

  // uncomment to animate
  // paper.view.onFrame = function(event) {
  //   for (var i=0; i < colors.length; i++) {
  //     var path = paths[i];
  //     for (var j=0; j < n_steps; j++) {
  // 	var segment = path.segments[j];
  // 	var y = stroke_width + 0.5 * (1 + Math.sin(event.time * 5 + j * (i + 1))) * (height - 2 * stroke_width);
  // 	segment.point.y = y;
  //     }
  //   }
  // }
  // paper.view.onFrame = function(event) {
  //   for (var i=0; i < colors.length; i++) {
  //     var path = paths[i];
  //     for (var j=0; j < n_steps; j++) {
  // 	var segment = path.segments[j];
  // 	var y = segment.point.y + 20;
  // 	segment.point.y = y;
  //     }
  //   }
  // }
  paper.view.draw()

});