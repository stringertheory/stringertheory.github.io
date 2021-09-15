/* license for this code at /license.txt */

function make_key(x, y, z) {
  return [ x, y, z ].join(".");
}

function is_visited(x, y, z, lookup, max_x, max_y) {
  if (x >= max_x || x < 0) {
    return true;
  } else if (y >= max_y || y < 0) {
    return true;
  } else if (lookup.hasOwnProperty(make_key(x, y, z))) {
    return true;
  }
  return false;
}

function mark(x, y, z, lookup) {
  lookup[make_key(x, y, z)] = true;
}

function regenerate() {
  console.log("START tree");
  var SVG_ID = "#canvas";
  var N_X = 13;
  var N_Y = 13;
  var N_Z = 13;
  var N_BRANCHES = 5;
  var STROKE_WIDTH = 2;
  var colors = [ chroma.rgb(224, 27, 23), chroma.rgb(224, 200, 50), chroma.rgb(224, 116, 45) ];
  var colors = [ chroma.rgb(238, 203, 225), chroma.rgb(155, 39, 61), chroma.rgb(220, 136, 168) ];
  var s = makeSVG(N_X, N_Y);
  var visited = {};
  var n_branches = 0;
  while (n_branches < N_BRANCHES) {
    var points = [];
    var x = ~~(N_X / 2);
    var y = ~~(N_Y / 2);
    var z = 0;
    while (z <= N_Z) {
      var amount = 1;
      points.push([ x + .5 + jitter(amount), y + .5 + jitter(amount), z + .5 + jitter(amount) ]);
      mark(x, y, z, visited);
      var new_x = x + _.sample([ -1, 0, 1 ]);
      var new_y = y + _.sample([ -1, 0, 1 ]);
      if (Math.random() < .9) {
        var new_z = z + 1;
      } else {
        var new_z = z;
      }
      while (is_visited(new_x, new_y, new_z, visited, N_X - 1, N_Y - 1)) {
        new_x = x + _.sample([ -1, 0, 1 ]);
        new_y = y + _.sample([ -1, 0, 1 ]);
        if (Math.random() < .9) {
          new_z = z + 1;
        } else {
          new_z = z;
        }
      }
      x = new_x;
      y = new_y;
      z = new_z;
    }
    points.reverse();
    _.each(_.range(points.length - 1), function(i) {
      var a = points[i];
      var b = points[i + 1];
      var depth = .5 * (a[2] + b[2]);
      var color = chroma.mix("black", "white", depth / N_Z).hex();
      console.log(a, b, depth, color);
      var l = s.line(a[0], a[1], b[0], b[1]);
      l.attr({
        stroke: color,
        strokeWidth: i * (1 / points.length),
        strokeLinecap: "round"
      });
    });
    n_branches += 1;
  }
  var n_dots = 0;
  var N_DOTS = 1e3;
  while (n_dots < N_DOTS) {
    s.circle(N_X * Math.random(), N_Y * Math.random(), .3 * Math.random()).attr({
      stroke: "none",
      fill: _.sample(colors)
    });
    n_dots += 1;
  }
}
