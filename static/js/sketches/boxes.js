/* license for this code at /license.txt */

/* global _, Snap, makeSVG */
/* exported regenerate */

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

  var N_X = 5;
  var N_Y = 5;
  var STROKE_WIDTH = 0.01;

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
