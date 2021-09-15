/* license for this code at /license.txt */

var parameters = make_parameters("parameters", [ {
  name: "n_x",
  start: [ 11 ],
  range: {
    min: 1,
    max: 30
  },
  format: format_int()
}, {
  name: "n_y",
  start: [ 11 ],
  range: {
    min: 1,
    max: 30
  },
  format: format_int()
}, {
  name: "n_colors",
  start: [ 2 ],
  range: {
    min: 2,
    max: 20
  },
  format: format_int()
}, {
  name: "stroke_width",
  start: [ 0 ],
  range: {
    min: 0,
    max: .2
  }
}, {
  name: "stroke_width_inner",
  start: [ 0 ],
  range: {
    min: 0,
    max: .2
  },
  metric_name: "stroke_width_2"
}, {
  name: "grid_jitter",
  start: [ .5 ],
  range: {
    min: 0,
    max: 1
  }
} ]);

function rando() {
  var h = 360 * Math.random();
  var c = 80 + 20 * Math.random();
  var l = 80 + 20 * Math.random();
  return chroma.hcl(h, c, l);
}

function regenerate() {
  var N_X = parameters["n_x"].slider.get();
  var N_Y = parameters["n_y"].slider.get();
  var N_COLORS = 3;
  var STROKE_WIDTH = parameters["stroke_width"].slider.get();
  var BOX_STROKE_WIDTH = parameters["stroke_width_inner"].slider.get();
  var GRID_JITTER = parameters["grid_jitter"].slider.get();
  var s = makeSVG(N_X, N_Y);
  color1 = chroma.rgb(25, 55, 155);
  var colors = [];
  colors.push(color1);
  colors.push(chroma.rgb(75, 155, 75));
  colors.push(chroma.rgb(205, 75, 35));
  var stroker = colors[0];
  s.rect(0, 0, N_X, N_Y).attr({
    fill: colors[0],
    stroke: "none"
  });
  var grid = [];
  _.each(_.range(N_X + 1), function(x) {
    var row = [];
    _.each(_.range(N_Y + 1), function(y) {
      if (x > 0 && y > 0 && x < N_X && y < N_Y) {
        row.push([ x + jitter(GRID_JITTER), y + jitter(GRID_JITTER) ]);
      } else {
        row.push([ x, y ]);
      }
    });
    grid.push(row);
  });
  _.each(_.range(N_X), function(x) {
    _.each(_.range(N_Y), function(y) {
      colors = _.shuffle(colors);
      var group = s.g();
      _.each(colors, function(color, index) {
        var height = 2 * (colors.length - index) / colors.length;
        group.add(s.rect(x - .5, y - .5, 2, height).attr({
          fill: color,
          stroke: stroker,
          strokeWidth: BOX_STROKE_WIDTH
        }));
      });
      var path = [ grid[x][y], grid[x + 1][y], grid[x + 1][y + 1], grid[x][y + 1] ];
      var clipper = s.polyline(path);
      s.polyline(path).attr({
        fill: "none",
        stroke: stroker,
        strokeWidth: STROKE_WIDTH
      });
      if (Math.random() < 1) {
        var angle = 360 * (Math.random() - .5);
        group.transform(Snap.format("r{angle},{x_center},{y_center}", {
          angle: angle,
          x_center: x + .5,
          y_center: y + .5
        }));
        clipper.transform(Snap.format("r{angle},{x_center},{y_center}", {
          angle: -angle,
          x_center: x + .5,
          y_center: y + .5
        }));
      }
      group.attr({
        clip: clipper
      });
    });
  });
}

window.onload = function() {};
