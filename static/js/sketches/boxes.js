/* license for this code at /license.txt */

/* global _, Snap, makeSVG, make_parameters, format_int, format_decimal */
/* exported regenerate */

var parameters = make_parameters('parameters', [
  {
    name: 'n_x',
    start: [7],
    range: {'min': 1, 'max': 30},
    format: format_int()
  }, {
    name: 'n_y',
    start: [7],
    range: {'min': 1, 'max': 30},
    format: format_int()
  }, {
    name: 'stroke_width',
    start: [0.015],
    range: {
      'min': 0.001,
      '50%': 0.01,
      'max': 0.1
    },
    format: format_decimal()
  }
]);


function drawGroup(s, x, y, w, color, min, max) {
  var pad = 0.07;
  var n_squares = _.random(min, max);
  var x_center = 0.5 + 0.65 * (Math.random() - 0.5);
  var y_center = 0.5 + 0.65 * (Math.random() - 0.5);
  var i_size = 0.1 + 0.15 * Math.random();
  var x_step = (x_center - i_size / 2) / (n_squares - 1);
  var y_step = (y_center - i_size / 2) / (n_squares - 1);
  _.each(_.range(n_squares), function (z) {
    var size = (1 - pad) * (i_size + (1 - i_size) * (z / (n_squares - 1)));
    var c_x = pad / 2 + x + (n_squares - 1 - z) * x_step;
    var c_y = pad / 2 + y + (n_squares - 1 - z) * y_step;
    s.rect(c_x, c_y, size, size).attr({
      stroke: color,
      strokeWidth: w,
      fill: 'none'
    });
  });
}

function regenerate () {

  var N_X = parameters['n_x'].slider.get();
  var N_Y = parameters['n_y'].slider.get();
  var STROKE_WIDTH = parameters['stroke_width'].slider.get();

  // make an svg with a viewbox
  var s = makeSVG(N_X, N_Y);

  _.each(_.range(N_X), function (x) {
    _.each(_.range(N_Y), function (y) {
      var color = Snap.rgb(255, 195 + 60 * Math.random(), 0, 0.5);
      drawGroup(s, x, y, STROKE_WIDTH * 2, color, 7, 14);
      color = Snap.rgb(0, 128 + 127 * Math.random(), 255, 0.5);
      drawGroup(s, x, y, STROKE_WIDTH * 1, color, 4, 10);
    });
  });
}
