/* license for this code at /license.txt */

var parameters = make_parameters("parameters", [ {
  name: "n",
  start: [ 42 ],
  range: {
    min: 1,
    max: 100
  },
  format: format_int(),
  metric_name: "n_x"
}, {
  name: "stroke_width",
  start: [ .4 ],
  range: {
    min: .01,
    "50%": .3,
    max: .9
  },
  format: format_decimal()
}, {
  name: "p_vertical",
  start: [ .3 ],
  range: {
    min: 0,
    max: 1
  },
  format: format_decimal(),
  metric_name: "p"
}, {
  name: "p_draw",
  start: [ .2 ],
  range: {
    min: 0,
    max: 1
  },
  format: format_decimal(),
  metric_name: "p_2"
}, {
  name: "grid_jitter",
  start: [ .5 ],
  range: {
    min: 0,
    max: 1
  }
} ]);

function regenerate() {
  var BORDER = 0;
  var N_X = parameters["n"].slider.get();
  var N_Y = parameters["n"].slider.get();
  var STROKE_WIDTH = new Number(parameters["stroke_width"].slider.get());
  var P_VERTICAL = new Number(parameters["p_vertical"].slider.get());
  var P_DRAW = new Number(parameters["p_draw"].slider.get());
  var GRID_JITTER = new Number(parameters["grid_jitter"].slider.get());
  var BACKGROUND_COLOR = "white";
  var s = makeSVG(N_X, N_Y, BORDER);
  s.rect(-BORDER, -BORDER, N_X + 2 * BORDER, N_Y + 2 * BORDER).attr({
    fill: BACKGROUND_COLOR,
    stroke: "none"
  });
  _.each(_.range(N_X), function(x) {
    _.each(_.range(N_Y), function(y) {
      var r_squared = Math.pow(N_X / 2 - x, 2) + Math.pow(N_Y / 2 - y, 2);
      if (Math.sqrt(r_squared) <= N_X / 2 && Math.random() < P_DRAW) {
        var length = 2 * Math.random();
        var l = s.line(x - .5 - length / 2, y, x + .5 + length / 2, y).attr({
          stroke: "black",
          strokeWidth: STROKE_WIDTH
        });
        l.transform(Snap.format("t{x},{y}", {
          x: GRID_JITTER * (Math.random() - .5),
          y: GRID_JITTER * (Math.random() - .5)
        }));
        if (Math.random() < P_VERTICAL) {
          l.transform(Snap.format("r{angle},{x_center},{y_center}", {
            angle: 90,
            x_center: x,
            y_center: y
          }));
        }
      }
    });
  });
}
