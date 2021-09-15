/* license for this code at /license.txt */

var parameters = make_parameters("parameters", [ {
  name: "n_x",
  start: [ 47 ],
  range: {
    min: 7,
    max: 70
  },
  format: format_int()
}, {
  name: "n_y",
  start: [ 47 ],
  range: {
    min: 7,
    max: 70
  },
  format: format_int()
}, {
  name: "stroke_width",
  start: [ .07 ],
  range: {
    min: .005,
    "50%": .07,
    max: .42
  },
  format: format_decimal()
}, {
  name: "n_holes",
  start: [ 9 ],
  range: {
    min: 0,
    max: 42
  },
  format: format_int(),
  metric_name: "n_objects"
} ]);

function calculateHoleP(holes, x, y) {
  var result = 0;
  _.each(holes, function(hole) {
    var x_hole = hole[0];
    var y_hole = hole[1];
    var r_hole = hole[2];
    var r_squared = Math.pow(x - x_hole, 2) + Math.pow(y - y_hole, 2);
    result += r_hole / r_squared;
  });
  return result;
}

function regenerate() {
  var N_X = parameters["n_x"].slider.get();
  var N_Y = parameters["n_y"].slider.get();
  var STROKE_WIDTH = parameters["stroke_width"].slider.get();
  var N_HOLES = parameters["n_holes"].slider.get();
  var MIN_R = 1;
  var MAX_R = 6;
  var BACKGROUND_COLOR = chroma.hcl(90, 1, 99);
  var SHOW_POTENTIAL = false;
  var SHOW_NUMBERS = false;
  var BORDER = 2;
  var s = makeSVG(N_X, N_Y, BORDER);
  s.rect(-BORDER, -BORDER, N_X + 2 * BORDER, N_Y + 2 * BORDER).attr({
    fill: BACKGROUND_COLOR,
    stroke: "none"
  });
  var holes = [];
  _.each(_.range(N_HOLES), function(dummy) {
    holes.push([ Math.random() * N_X, Math.random() * N_Y, MIN_R + (MAX_R - MIN_R) * Math.random() ]);
  });
  if (SHOW_NUMBERS) {
    var colors = [ Snap.rgb(255, 100, 0), Snap.rgb(0, 100, 255) ];
    var textAttributes = {
      fill: Snap.rgb(125, 125, 125),
      "font-size": .6,
      "font-family": "Helvetica Neue",
      "text-anchor": "middle",
      "alignment-baseline": "middle"
    };
    _.each(_.range(N_Y), function(y) {
      s.line(0, y + .5, N_X, y + .5).attr({
        stroke: colors[y % 2],
        strokeWidth: .01
      });
      s.text(-.5, y + .5, "" + y).attr(textAttributes).attr({
        fill: colors[y % 2]
      });
      s.text(N_X + .5, y + .5, "" + y).attr(textAttributes).attr({
        fill: colors[y % 2]
      });
    });
    _.each(_.range(N_X), function(x) {
      s.line(x + .5, 0, x + .5, N_Y).attr({
        stroke: colors[x % 2],
        strokeWidth: .01
      });
      s.text(x + .5, -.5, "" + x).attr(textAttributes).attr({
        fill: colors[x % 2]
      });
      s.text(x + .5, N_Y + .5, "" + x).attr(textAttributes).attr({
        fill: colors[x % 2]
      });
    });
  }
  var rect_group = s.g();
  _.each(_.range(N_X), function(x) {
    _.each(_.range(N_Y), function(y) {
      var p = calculateHoleP(holes, x, y);
      if (SHOW_POTENTIAL) {
        var color = 255 - Math.min(255, 255 * p);
        rect_group.add(s.rect(x, y, 1, 1).attr({
          stroke: "none",
          fill: Snap.rgb(color, 255, 255),
          strokeWidth: .01
        }));
      }
      if (Math.random() > p) {
        s.circle(x + .5, y + .5, .15).attr({
          stroke: "none",
          fill: "none"
        });
        var line = s.line(x - .5, y + .5, x + 1.5, y + .5).attr({
          stroke: Snap.rgb(0, 0, 0),
          strokeWidth: STROKE_WIDTH
        });
        line.transform(Snap.format("r{angle},{x_center},{y_center}", {
          angle: 90 + (Math.random() - .5) * 135,
          x_center: x + .5,
          y_center: y + .5
        }));
      }
    });
  });
}
