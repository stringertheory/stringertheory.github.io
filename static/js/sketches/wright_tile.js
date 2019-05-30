

// https://archinect.com/news/gallery/47637482/11/frank-lloyd-wright-s-lesser-known-contributions-to-graphic-design

function get_tail_length(x, y, max_y, squares) {

  var same_ys = []
  _.each(_.filter(squares, function (s) {return s.x == x}), function (s) {
    same_ys.push(s.y);
  })
  same_ys = same_ys.sort();
  same_ys.push(max_y);
  same_ys = _.filter(same_ys, function (s) {return s > y});
  var next_y = same_ys[0];
  var max_length = Math.max(next_y - y - 2, 0);
  console.log(max_length);
  return _.random(0, max_length);
}

function make_gridpoints(n_x, n_y) {

  var epsilon = 1 / 12;
  
  var xs = [];
  var x = 0;
  while (x < (n_x - epsilon)) {
    xs.push(x);
    x += _.random(1, 6) / 6;
  };
  
  var ys = [];
  var y = 0;
  while (y < (n_y - epsilon)) {
    ys.push(y);
    y += _.random(2, 12) / 6;
  };

  xs.push(n_x);
  ys.push(n_y);
  
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

  xs.shift();
  ys.shift();
  xs.pop();
  ys.pop();
  
  return {
    xs: xs,
    ys: ys,
    gridpoints: gridpoints,
  };
}

Snap.plugin(function(Snap, Element, Paper, global) {

  Paper.prototype.semicircle = function(cx, cy, r) {
    var p = "M" + cx + "," + cy;
    p += "m" + -r + ",0";
    p += "a" + r + "," + r + " 0 1,0 " + (r*2) +",0";
    return this.path(p);
  };

  Paper.prototype.tailpath = function(x1, y1, x2, y2) {
    var r = (x2 - x1) / 2;
    var p = "";
    p += "M" + x1 + "," + y1;
    p += "L" + x1 + "," + y2;
    p += "a" +  r + "," +  r + " 0 1,0 " + (r * 2) +",0";
    p += "L" + x2 + "," + y1;
    return this.path(p);
  };
  
  Paper.prototype.pathcircle = function(cx, cy, r) {
    var p = "M" + cx + "," + cy;
    p += "m" + -r + ",0";
    p += "a" + r + "," + r + " 0 1,0 " + (r * 2) +",0";
    p += "a" + r + "," + r + " 0 1,0 " + -(r * 2) +",0 Z";
    return this.path(p);
  };
  
  Paper.prototype.pathline = function(x1, y1, x2, y2) {
    var p = "M" + x1 + "," + y1;
    p += "L" + x2 + "," + y2;
    return this.path(p);
  };

  Paper.prototype.pathrect = function(x1, y1, width, height) {
    var x2 = x1 + width;
    var y2 = y1 + height;
    var p = "M" + x1 + "," + y1;
    p += "L" + x2 + "," + y1;
    p += "L" + x2 + "," + y2;
    p += "L" + x1 + "," + y2;
    p += "Z";
    return this.path(p);
  };
  
});

function regenerate () {
  var SVG_ID = '#canvas'
  var N_X = 13;
  var N_Y = 13;
  var N_SQUARES = Math.ceil((N_X + N_Y) / 2);
  var N_JUMP = Math.floor(Math.sqrt(N_SQUARES));

  var BASE_COLOR = chroma.rgb(223,188,130);
  var RED = chroma.rgb(166,90,42);
  var PURPLE = chroma.rgb(160,117,111);
  var BLUE = chroma.rgb(114,117,130);
  var ORANGE = chroma.rgb(119,121,68);
  var YELLOW = chroma.rgb(201,100,50);
  var GREEN = chroma.rgb(113,129,163);

  // // datascopey
  // BASE_COLOR = chroma('#DDDDDD');
  // BLUE = chroma.rgb(0, 142, 245);
  // PURPLE = chroma.rgb(255, 21, 171);
  // RED = chroma.rgb(0, 204, 102)//chroma.rgb(255, 96, 0);
  // ORANGE = chroma.rgb(255, 96, 0);
  // YELLOW = chroma.rgb(243, 237, 0);
  // GREEN = chroma.rgb(0, 204, 102);

  // stainey
  BASE_COLOR = chroma('white');
  BLUE = chroma('white');
  PURPLE = chroma('white');
  RED = chroma('white');
  ORANGE = chroma('white');
  YELLOW = chroma('white');
  GREEN = chroma('white');
  
  var STROKE_DARKEN = 2;
  var STROKE_COLOR = BASE_COLOR.darken(STROKE_DARKEN);
  var STROKE_WIDTH = 0.03;
  // var GRID_OPACITY = 5/6;
  var GRID_OPACITY = 0;
  // var EYE_OPACITY = 3/6;
  var EYE_OPACITY = 0;
  // var CIRCLE_OPACITY = 5/6;
  var CIRCLE_OPACITY = 0;
  var CIRCLE_PROBABILITY = 0.1;
  // var TAIL_OPACITY = 5/6;
  var TAIL_OPACITY = 0;
  var GRID_FILL = chroma('gold').brighten(4);
  var EYE_FILL = chroma('gold').darken(2.5);
  var CIRCLE_FILL = chroma('gold').darken(0.5);
  var TAIL_FILL = chroma('gold').darken(1);

  var N_TEXTURE = 0;//3000;//00;
  var TEXTURE_COLOR = BASE_COLOR.brighten(2);
  var TEXTURE_WIDTH = 0.04;
  var TEXTURE_HEIGHT = 0.9;
  var TEXTURE_OPACITY = 0.05;

  // make an svg with a viewbox
  var s = makeSVG(N_X, N_Y)

  // Sets Math.random to a PRNG initialized using the given explicit seed.
  // var seed = 1;
  // Math.seedrandom(seed);

  var grid = make_gridpoints(N_X, N_Y);

  var x_lines = [];
  _.each(grid.xs, function(x) {
    var line = s.pathline(x, 0, x, N_Y).attr({
      stroke: STROKE_COLOR,
      strokeWidth: STROKE_WIDTH,
      class: 'x-line'
    })
    x_lines.push(line);
  });

  var y_lines = [];
  _.each(grid.ys, function(y) {
    var line = s.pathline(0, y, N_X, y).attr({
      stroke: STROKE_COLOR,
      strokeWidth: STROKE_WIDTH,
      class: 'y-line'
    });
    y_lines.push(line);
  });
  
  var circle_list = [];
  _.each(grid.gridpoints, function(p) {
    if (Math.random() < CIRCLE_PROBABILITY) {
      circle_list.push(s.pathcircle(p.x0, p.y0, p.width).attr({
        // fill: 'none',
        fill: 'white',
        stroke: STROKE_COLOR,
        strokeWidth: STROKE_WIDTH,
        class: 'back-circle'
      }));
    }
  });

  
  
  var n_concentric = 3;
  var squares = [];
  var x = _.random(0, N_X - 1);
  var y = _.random(0, N_Y - 1);
  _.each(_.range(N_SQUARES), function (i) {
    squares.push({x: x, y: y});
    x += _.random(-N_JUMP, N_JUMP);
    y += _.random(-N_JUMP, N_JUMP);
    x = (x + N_X) % N_X;
    y = (y + N_Y) % N_Y;
  })

  var unique_squares = _.unique(squares, function (s) {return s.x+','+s.y;});
  console.log(unique_squares);
  
  var n_x = 6;
  _.each(unique_squares, function (square) {
    var length = get_tail_length(square.x, square.y, N_Y, unique_squares);
    // console.log(square, length)
    if ((square.y + length) < (N_Y - 1) && (length > 0)) {
      _.each(_.range(n_concentric), function (j) {
        s.tailpath(
          square.x + (j / n_concentric) / 2,
          square.y + 1,
          square.x + 1 - (j / n_concentric) / 2,
          square.y + length + 1
        ).attr({
          // fill: 'none',
          fill: 'white',
          stroke: STROKE_COLOR,
          strokeWidth: STROKE_WIDTH,
          class: 'tail tail-semicircle',
        });
      });
    }
    s.pathline(
      square.x + 1/2,
      square.y + 1,
      square.x + 1/2,
      square.y + length + 1
    ).attr({
      fill: 'none',
      stroke: STROKE_COLOR,
      strokeWidth: STROKE_WIDTH,
      class: 'tail tail-semicircle tail-centerline',
    });
    // var n_y = _.random(1, 3);
    // if (length > 0) {
    //   _.each(_.range(n_x), function (i) {
    //     var n_tall = n_y * length + (i % 2);
    //     var skip = _.random(1, 2);
    //     _.each(_.range(n_tall), function(j) {
    //       var width = 1 / n_x;
    //       var height = 1 / n_y;
    //       var x = square.x + i * width;
    //       var y = square.y + 1 + j * height;
    //       if (i % 2) {
    //         y -= height / 2;
    //       }
    //       if (y < (square.y + 1)) {
    //         y = square.y + 1;
    //         height /= 2;
    //       }
    //       if ((y + height) > (square.y + 1 + length)) {
    //         height /= 2;
    //       }
    //       s.rect(x, y, width, height).attr({
    //         fill: 'none',
    //         stroke: STROKE_COLOR,
    //         strokeWidth: STROKE_WIDTH,
    //         class: 'tail tail-rect',
    //       });
    //     });
    //   });
    // }

    _.each(_.range(n_concentric, 0, -1), function (j) {
      s.pathrect(
        square.x + 1/2 - (j / n_concentric) / 2,
        square.y + 1/2 - (j / n_concentric) / 2,
        j / n_concentric,
        j / n_concentric
      ).attr({
        fill: 'none',
        // fill: 'white',
        stroke: STROKE_COLOR,
        strokeWidth: STROKE_WIDTH,
        class: 'tail tail-square',
      })
    });
    
    
  });

  s.rect(0, 0, N_X, N_Y).attr({
    fill: 'none',
    stroke: STROKE_COLOR,
    strokeWidth: STROKE_WIDTH,
    class: 'frame',
  });

  
}
