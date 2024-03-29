/* license for this code at /license.txt */

var parameters = make_parameters("parameters", [ {
  name: "n_x",
  start: [ 16 ],
  range: {
    min: 1,
    max: 30
  },
  format: format_int()
}, {
  name: "n_y",
  start: [ 9 ],
  range: {
    min: 1,
    max: 30
  },
  format: format_int()
}, {
  name: "n_feathers",
  start: [ 16 + 9 ],
  range: {
    min: 0,
    max: 100
  },
  format: format_int(),
  metric_name: "n_objects"
}, {
  name: "n_texture",
  start: [ 0 ],
  range: {
    min: 0,
    max: 5e3
  },
  format: format_int()
} ]);

function make_gridpoints(n_x, n_y) {
  var epsilon = 1 / 12;
  var xs = [];
  var x = 0;
  while (x < n_x - epsilon) {
    xs.push(x);
    x += _.random(1, 6) / 6;
  }
  var ys = [];
  var y = 0;
  while (y < n_y - epsilon) {
    ys.push(y);
    y += _.random(2, 12) / 6;
  }
  var gridpoints = [];
  _.each(xs, function(x, x_i) {
    _.each(ys, function(y, y_i) {
      var next_x = xs[x_i + 1];
      var next_y = ys[y_i + 1];
      if (next_x === undefined) {
        next_x = n_x;
      }
      if (next_y === undefined) {
        next_y = n_y;
      }
      gridpoints.push({
        x0: x,
        y0: y,
        x1: next_x,
        y1: next_y,
        width: next_x - x,
        height: next_y - y
      });
    });
  });
  xs.push(n_x);
  ys.push(n_y);
  return {
    xs: xs,
    ys: ys,
    gridpoints: gridpoints
  };
}

Snap.plugin(function(Snap, Element, Paper) {
  Paper.prototype.semicircle = function(cx, cy, r) {
    var p = "M" + cx + "," + cy;
    p += "m" + -r + ",0";
    p += "a" + r + "," + r + " 0 1,0 " + r * 2 + ",0 Z";
    return this.path(p, cx, cy);
  };
});

function regenerate() {
  var N_X = parameters["n_x"].slider.get();
  var N_Y = parameters["n_y"].slider.get();
  var N_SQUARES = parameters["n_feathers"].slider.get();
  var BASE_COLOR = chroma.rgb(223, 188, 130);
  var RED = chroma.rgb(166, 90, 42);
  var PURPLE = chroma.rgb(160, 117, 111);
  var BLUE = chroma.rgb(114, 117, 130);
  var ORANGE = chroma.rgb(119, 121, 68);
  var YELLOW = chroma.rgb(201, 100, 50);
  var GREEN = chroma.rgb(113, 129, 163);
  var STROKE_DARKEN = 2;
  var STROKE_COLOR = BASE_COLOR.darken(STROKE_DARKEN);
  var STROKE_WIDTH = .03;
  var GRID_OPACITY = 5 / 6;
  var EYE_OPACITY = 3 / 6;
  var CIRCLE_OPACITY = 5 / 6;
  var CIRCLE_PROBABILITY = .1;
  var TAIL_OPACITY = 5 / 6;
  var N_TEXTURE = parameters["n_texture"].slider.get();
  var TEXTURE_COLOR = BASE_COLOR.brighten(2);
  var TEXTURE_WIDTH = .05;
  var TEXTURE_HEIGHT = .9;
  var TEXTURE_OPACITY = .05;
  var s = makeSVG(N_X, N_Y);
  var grid = make_gridpoints(N_X, N_Y);
  var square_colors = [ BASE_COLOR, BASE_COLOR, BASE_COLOR, BASE_COLOR, BASE_COLOR, BASE_COLOR, RED, PURPLE, BLUE ];
  _.each(grid.gridpoints, function(p) {
    s.rect(p.x0, p.y0, p.width, p.height).attr({
      fill: _.sample(square_colors),
      fillOpacity: GRID_OPACITY,
      stroke: STROKE_COLOR,
      strokeWidth: STROKE_WIDTH
    });
  });
  _.each(grid.xs, function(x) {
    s.line(x, 0, x, N_Y).attr({
      stroke: "black",
      strokeWidth: STROKE_WIDTH
    });
  });
  _.each(grid.ys, function(y) {
    s.line(0, y, N_X, y).attr({
      stroke: "black",
      strokeWidth: STROKE_WIDTH
    });
  });
  var circle_colors = [ RED, BLUE, PURPLE ];
  var clipper = s.rect(0, 0, N_X, N_Y);
  var circle_group = s.g();
  var circle_list = [];
  _.each(grid.gridpoints, function(p) {
    if (Math.random() < CIRCLE_PROBABILITY) {
      var radius = p.width;
      var x = p.x0;
      var y = p.y0;
      if (Math.random() < .5) {
        x = p.x1;
      }
      if (Math.random() < .5) {
        y = p.y1;
      }
      var circle = s.circle(x, y, radius).attr({
        fill: _.sample(circle_colors),
        fillOpacity: CIRCLE_OPACITY,
        stroke: STROKE_COLOR,
        strokeWidth: STROKE_WIDTH,
        class: "background-circle"
      });
      circle_group.add(circle);
      circle_list.push(circle);
    }
  });
  _.each(circle_list, function(circle) {
    circle_group.add(s.circle(circle.attr("cx"), circle.attr("cy"), circle.attr("r")).attr({
      fill: "none",
      stroke: STROKE_COLOR,
      strokeWidth: STROKE_WIDTH
    }));
  });
  circle_group.attr({
    clip: clipper
  });
  var colors = [ ORANGE, YELLOW, GREEN ];
  var n_concentric = 3;
  var squares = [];
  var x = _.random(0, N_X - 1);
  var y = _.random(0, N_Y - 1);
  _.each(_.range(N_SQUARES), function(dummy) {
    var base_color = _.sample(colors);
    var scale = chroma.scale([ BASE_COLOR, base_color ]).colors(n_concentric);
    squares.push({
      x: x,
      y: y,
      scale: scale
    });
    x += _.random(-2, 2);
    y += _.random(-2, 2);
    x = (x + N_X) % N_X;
    y = (y + N_Y) % N_Y;
  });
  var n_x = 6;
  _.each(squares, function(square) {
    var n_y = _.random(1, 3);
    var length = _.random(0, N_Y - square.y - 1);
    if (square.y + length < N_Y - 1 && length > 0) {
      _.each(_.range(n_concentric, 0, -1), function(j) {
        s.semicircle(square.x + 1 / 2, square.y + length + 1, j / 2 / n_concentric).attr({
          fill: square.scale[j - 1],
          fillOpacity: TAIL_OPACITY,
          stroke: STROKE_COLOR,
          strokeWidth: STROKE_WIDTH,
          class: "tail"
        });
      });
    }
    if (length > 0) {
      _.each(_.range(n_x), function(i) {
        var n_tall = n_y * length + i % 2;
        var skip = _.random(1, 2);
        _.each(_.range(n_tall), function(j) {
          var width = 1 / n_x;
          var height = 1 / n_y;
          var x = square.x + i * width;
          var y = square.y + 1 + j * height;
          if (i % 2) {
            y -= height / 2;
          }
          if (y < square.y + 1) {
            y = square.y + 1;
            height /= 2;
          }
          if (y + height > square.y + 1 + length) {
            height /= 2;
          }
          s.rect(x, y, width, height).attr({
            fill: square.scale[1 + j % skip],
            fillOpacity: TAIL_OPACITY,
            stroke: STROKE_COLOR,
            strokeWidth: STROKE_WIDTH,
            class: "tail"
          });
        });
      });
    }
    _.each(_.range(n_concentric, 0, -1), function(j) {
      s.rect(square.x + 1 / 2 - j / n_concentric / 2, square.y + 1 / 2 - j / n_concentric / 2, j / n_concentric, j / n_concentric).attr({
        fill: square.scale[j - 1],
        fillOpacity: EYE_OPACITY,
        stroke: STROKE_COLOR,
        strokeWidth: STROKE_WIDTH,
        class: "tail"
      });
    });
  });
  _.each(_.range(N_TEXTURE), function(dummy) {
    var x = N_X * Math.random();
    var y = N_Y * Math.random();
    s.ellipse(x, y, TEXTURE_WIDTH * Math.random(), TEXTURE_HEIGHT * Math.random()).attr({
      fill: TEXTURE_COLOR,
      opacity: TEXTURE_OPACITY
    });
  });
}
