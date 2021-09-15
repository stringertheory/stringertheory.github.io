/* license for this code at /license.txt */

var parameters = make_parameters("parameters", [ {
  name: "n_x",
  start: [ 7 ],
  range: {
    min: 1,
    max: 30
  },
  format: format_int()
}, {
  name: "n_y",
  start: [ 7 ],
  range: {
    min: 1,
    max: 30
  },
  format: format_int()
}, {
  name: "stroke_width",
  start: [ .015 ],
  range: {
    min: .001,
    "50%": .01,
    max: .1
  },
  format: format_decimal()
} ]);

function drawGroup(s, x, y, w, color, min, max) {
  var pad = .07;
  var n_squares = _.random(min, max);
  var x_center = .5 + .65 * (Math.random() - .5);
  var y_center = .5 + .65 * (Math.random() - .5);
  var i_size = .1 + .15 * Math.random();
  var x_step = (x_center - i_size / 2) / (n_squares - 1);
  var y_step = (y_center - i_size / 2) / (n_squares - 1);
  _.each(_.range(n_squares), function(z) {
    var size = (1 - pad) * (i_size + (1 - i_size) * (z / (n_squares - 1)));
    var c_x = pad / 2 + x + (n_squares - 1 - z) * x_step;
    var c_y = pad / 2 + y + (n_squares - 1 - z) * y_step;
    s.rect(c_x, c_y, size, size).attr({
      stroke: color,
      strokeWidth: w,
      fill: "none"
    });
  });
}

function regenerate() {
  var N_X = parameters["n_x"].slider.get();
  var N_Y = parameters["n_y"].slider.get();
  var STROKE_WIDTH = parameters["stroke_width"].slider.get();
  var s = makeSVG(N_X, N_Y);
  _.each(_.range(N_X), function(x) {
    _.each(_.range(N_Y), function(y) {
      var color = Snap.rgb(255, 195 + 60 * Math.random(), 0, .5);
      drawGroup(s, x, y, STROKE_WIDTH * 2, color, 7, 14);
      color = Snap.rgb(0, 128 + 127 * Math.random(), 255, .5);
      drawGroup(s, x, y, STROKE_WIDTH * 1, color, 4, 10);
    });
  });
}
